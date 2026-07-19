package com.aitasker.service.impl;

import com.aitasker.dto.request.CreateMilestoneRequest;
import com.aitasker.dto.response.MilestoneResponse;
import com.aitasker.dto.response.ProjectResponse;
import com.aitasker.entity.*;
import com.aitasker.enums.*;
import com.aitasker.exception.AppException;
import com.aitasker.repository.*;
import com.aitasker.service.FileUploadService;
import com.aitasker.service.NotificationService;
import com.aitasker.service.ProjectService;
import com.aitasker.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@Transactional
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private static final int CANCELLATION_INACTIVITY_DAYS = 5;
    private static final int CANCELLATION_RESPONSE_HOURS = 48;
    private static final int MILESTONE_REVIEW_DAYS = 5;

    private final ProjectRepository projectRepo;
    private final MilestoneRepository milestoneRepo;
    private final UserRepository userRepo;
    private final EscrowRepository escrowRepo;
    private final AuditLogRepository auditLogRepo;
    private final JobPostRepository jobPostRepo;
    private final WalletService walletService;
    private final FileUploadService fileUploadService;
    private final NotificationService notificationService;

    @Override
    public List<ProjectResponse> getMyProjects(String userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> AppException.notFound("User not found"));
        List<Project> projects = user.getRole() == UserRole.CLIENT
                ? projectRepo.findByClientIdOrderByCreatedAtDesc(userId)
                : projectRepo.findByExpertIdOrderByCreatedAtDesc(userId);
        return projects.stream().map(this::toResponse).toList();
    }

    @Override
    public ProjectResponse getProjectById(String userId, String projectId) {
        Project project = projectRepo.findById(projectId)
                .orElseThrow(() -> AppException.notFound("Project not found"));
        checkAccess(userId, project);
        return toResponse(project);
    }

    @Override
    public ProjectResponse approveDeliverable(String clientId, String milestoneId) {
        Milestone ms = milestoneRepo.findById(milestoneId)
                .orElseThrow(() -> AppException.notFound("Milestone not found"));
        if (!ms.getProject().getClient().getId().equals(clientId))
            throw AppException.forbidden("Not your project");
        if (ms.getStatus() != MilestoneStatus.SUBMITTED)
            throw AppException.badRequest("Milestone is not submitted yet");

        ms.setStatus(MilestoneStatus.APPROVED);
        milestoneRepo.save(ms);

        releaseMilestonePayment(ms, BigDecimal.valueOf(ms.getAmount()), ReleaseReason.CLIENT_APPROVAL, clientId);

        notificationService.createNotification(
                ms.getProject().getExpert(),
                "Milestone Approved! 💰",
                "Your submission for milestone '" + ms.getTitle() + "' has been approved and the payment has been released to your wallet.",
                "MILESTONE",
                ms.getProject().getId()
        );

        Project project = ms.getProject();
        checkProjectCompletion(project);

        return toResponse(project);
    }

    /**
     * If every milestone is APPROVED or PAID, marks the project (and its job) COMPLETED and
     * notifies the expert. Shared by manual approval and dispute-resolution settlement so both
     * paths converge on the same completion check.
     */
    private void checkProjectCompletion(Project project) {
        List<Milestone> allMilestones = project.getMilestones() != null ? project.getMilestones() : List.of();
        boolean allApproved = !allMilestones.isEmpty()
                && allMilestones.stream().allMatch(m -> m.getStatus() == MilestoneStatus.APPROVED || m.getStatus() == MilestoneStatus.PAID);
        if (allApproved && project.getStatus() != ProjectStatus.COMPLETED) {
            project.setStatus(ProjectStatus.COMPLETED);
            projectRepo.save(project);
            syncJobStatus(project, JobStatus.COMPLETED);

            notificationService.createNotification(
                    project.getExpert(),
                    "Project Completed! 🏆",
                    "Project '" + project.getJob().getTitle() + "' has been marked as completed. Thank you for your work!",
                    "PROJECT",
                    project.getId()
            );
        }
    }

    /**
     * Keeps the underlying JobPost's status (surfaced to admins via the job listing) in
     * sync with the Project's status. The two are updated independently elsewhere, and
     * without this the admin view can get stuck showing IN_PROGRESS after a project has
     * actually completed or been cancelled.
     */
    private void syncJobStatus(Project project, JobStatus status) {
        JobPost job = project.getJob();
        job.setStatus(status);
        jobPostRepo.save(job);
    }

    /**
     * Credits the expert's wallet for the given amount, updates the escrow's released
     * balance (flipping status to PARTIALLY_RELEASED/RELEASED as appropriate), stamps the
     * milestone as paid, and writes an audit trail entry. Shared by the manual approval
     * flow, the client-inactivity auto-release job, and dispute-resolution settlement
     * (which passes a partial amount rather than the full milestone amount) so all paths
     * stay consistent.
     */
    private void releaseMilestonePayment(Milestone ms, BigDecimal amount, ReleaseReason reason, String performedBy) {
        Project project = ms.getProject();
        Escrow escrow = escrowRepo.findByProjectId(project.getId())
                .orElseThrow(() -> AppException.badRequest("No escrow found for this project"));

        walletService.creditFromEscrowRelease(project.getExpert().getId(), amount,
                "Milestone payment release: " + ms.getTitle());

        BigDecimal alreadyReleased = escrow.getReleasedAmount() != null ? escrow.getReleasedAmount() : BigDecimal.ZERO;
        escrow.setReleasedAmount(alreadyReleased.add(amount));
        escrow.setStatus(escrow.getReleasedAmount().compareTo(escrow.getAmount()) >= 0
                ? EscrowStatus.RELEASED
                : EscrowStatus.PARTIALLY_RELEASED);
        escrowRepo.save(escrow);

        ms.setPaidAt(LocalDateTime.now());
        milestoneRepo.save(ms);

        auditLogRepo.save(AuditLog.builder()
                .projectId(project.getId())
                .milestoneId(ms.getId())
                .escrowId(escrow.getId())
                .clientId(project.getClient().getId())
                .expertId(project.getExpert().getId())
                .releasedAmount(amount)
                .reason(reason)
                .performedBy(performedBy)
                .build());
    }

    @Override
    public ProjectResponse finishProject(String clientId, String projectId) {
        Project project = projectRepo.findById(projectId)
                .orElseThrow(() -> AppException.notFound("Project not found"));
        if (!project.getClient().getId().equals(clientId))
            throw AppException.forbidden("Not your project");
        if (project.getStatus() == ProjectStatus.COMPLETED)
            throw AppException.badRequest("Project is already completed");

        List<Milestone> ms = project.getMilestones() != null ? project.getMilestones() : List.of();
        if (ms.isEmpty())
            throw AppException.badRequest("Project has no milestones");
        boolean allApproved = ms.stream()
                .allMatch(m -> m.getStatus() == MilestoneStatus.APPROVED || m.getStatus() == MilestoneStatus.PAID);
        if (!allApproved)
            throw AppException.badRequest("All milestones must be approved before finishing");

        project.setStatus(ProjectStatus.COMPLETED);
        projectRepo.save(project);
        syncJobStatus(project, JobStatus.COMPLETED);

        notificationService.createNotification(
                project.getExpert(),
                "Project Completed! 🏆",
                "Project '" + project.getJob().getTitle() + "' has been marked as completed. Thank you for your work!",
                "PROJECT",
                project.getId()
        );

        return toResponse(project);
    }

    @Override
    public ProjectResponse requestRevision(String clientId, String milestoneId, String note, LocalDate revisionDueDate) {
        Milestone ms = milestoneRepo.findById(milestoneId)
                .orElseThrow(() -> AppException.notFound("Milestone not found"));
        if (!ms.getProject().getClient().getId().equals(clientId))
            throw AppException.forbidden("Not your project");
        if (ms.getStatus() != MilestoneStatus.SUBMITTED)
            throw AppException.badRequest("Can only request revision on a submitted milestone");
        if (revisionDueDate == null || !revisionDueDate.isAfter(LocalDate.now()))
            throw AppException.badRequest("Revision due date must be in the future");
        ms.setStatus(MilestoneStatus.REVISION_REQUESTED);
        ms.setRevisionNote(note);
        ms.setRevisionDueDate(revisionDueDate);
        ms.setRevisionCount((ms.getRevisionCount() != null ? ms.getRevisionCount() : 0) + 1);
        milestoneRepo.save(ms);

        notificationService.createNotification(
                ms.getProject().getExpert(),
                "Revision Requested ⚠️",
                "The client requested revision for milestone '" + ms.getTitle() + "'. Note: " + note,
                "MILESTONE",
                ms.getProject().getId()
        );

        return toResponse(ms.getProject());
    }

    @Override
    public ProjectResponse submitDeliverable(String expertId, String milestoneId, String note) {
        Milestone ms = milestoneRepo.findById(milestoneId)
                .orElseThrow(() -> AppException.notFound("Milestone not found"));
        if (!ms.getProject().getExpert().getId().equals(expertId))
            throw AppException.forbidden("Not your project");
        if (ms.getStatus() != MilestoneStatus.PENDING
                && ms.getStatus() != MilestoneStatus.IN_PROGRESS
                && ms.getStatus() != MilestoneStatus.REVISION_REQUESTED)
            throw AppException.badRequest("Milestone cannot be submitted from status " + ms.getStatus());
        ms.setStatus(MilestoneStatus.SUBMITTED);
        ms.setDeliverableNote(note);
        ms.setSubmittedAt(LocalDateTime.now());
        milestoneRepo.save(ms);

        notificationService.createNotification(
                ms.getProject().getClient(),
                "Milestone Submitted for Approval",
                ms.getProject().getExpert().getFullName() + " submitted deliverables for '" + ms.getTitle() + "'.",
                "MILESTONE",
                ms.getProject().getId()
        );

        withdrawCancellationRequest(ms.getProject(), "The expert submitted a milestone deliverable.");

        return toResponse(ms.getProject());
    }

    @Override
    public MilestoneResponse createMilestone(String expertId, String projectId, CreateMilestoneRequest request) {
        Project project = projectRepo.findById(projectId)
                .orElseThrow(() -> AppException.notFound("Project not found"));
        if (!project.getExpert().getId().equals(expertId))
            throw AppException.forbidden("Not your project");

        validateMilestoneRequest(project, request, null);

        Milestone ms = Milestone.builder()
                .project(project)
                .title(request.getTitle())
                .description(request.getDescription())
                .amount(request.getAmount())
                .dueDate(request.getDueDate())
                .build();
        return msToResponse(milestoneRepo.save(ms));
    }

    @Override
    public MilestoneResponse updateMilestone(String expertId, String milestoneId, CreateMilestoneRequest request) {
        Milestone ms = milestoneRepo.findById(milestoneId)
                .orElseThrow(() -> AppException.notFound("Milestone not found"));
        if (!ms.getProject().getExpert().getId().equals(expertId))
            throw AppException.forbidden("Not your project");
        if (ms.getStatus() != MilestoneStatus.PENDING)
            throw AppException.badRequest("Only PENDING milestones can be edited");

        validateMilestoneRequest(ms.getProject(), request, ms.getId());

        ms.setTitle(request.getTitle());
        ms.setDescription(request.getDescription());
        ms.setAmount(request.getAmount());
        ms.setDueDate(request.getDueDate());
        return msToResponse(milestoneRepo.save(ms));
    }

    private void validateMilestoneRequest(Project project, CreateMilestoneRequest request, String excludeMilestoneId) {
        if (request.getDueDate() == null)
            throw AppException.badRequest("Due date is required");
        if (!request.getDueDate().isAfter(LocalDate.now()))
            throw AppException.badRequest("Due date must be in the future");

        List<Milestone> others = (project.getMilestones() != null ? project.getMilestones() : List.<Milestone>of())
                .stream()
                .filter(m -> excludeMilestoneId == null || !m.getId().equals(excludeMilestoneId))
                .toList();

        LocalDate lastDueDate = others.stream()
                .map(Milestone::getDueDate)
                .filter(Objects::nonNull)
                .max(LocalDate::compareTo)
                .orElse(null);
        if (lastDueDate != null && !request.getDueDate().isAfter(lastDueDate))
            throw AppException.badRequest("Due date must be later than the previous milestone's due date");

        double existingTotal = others.stream().mapToDouble(m -> m.getAmount() != null ? m.getAmount() : 0).sum();
        double budget = project.getBudget();
        if (existingTotal + request.getAmount() > budget)
            throw AppException.badRequest("Total milestone amount cannot exceed the project budget");
    }

    @Override
    public List<MilestoneResponse> getMilestones(String userId, String projectId) {
        Project project = projectRepo.findById(projectId)
                .orElseThrow(() -> AppException.notFound("Project not found"));
        checkAccess(userId, project);
        return project.getMilestones() != null
                ? project.getMilestones().stream().map(this::msToResponse).toList()
                : List.of();
    }

    private void checkAccess(String userId, Project project) {
        if (!project.getClient().getId().equals(userId) && !project.getExpert().getId().equals(userId))
            throw AppException.forbidden("Access denied");
    }

    private ProjectResponse toResponse(Project p) {
        List<Milestone> ms = p.getMilestones() != null ? p.getMilestones() : List.of();
        long approved = ms.stream()
                .filter(m -> m.getStatus() == MilestoneStatus.APPROVED || m.getStatus() == MilestoneStatus.PAID)
                .count();
        int progress = ms.isEmpty() ? 0 : (int) (approved * 100 / ms.size());

        Escrow escrow = escrowRepo.findByProjectId(p.getId()).orElse(null);
        LocalDateTime cancellationDeadline = p.getCancellationRequestedAt() != null
                ? p.getCancellationRequestedAt().plusHours(CANCELLATION_RESPONSE_HOURS)
                : null;

        return ProjectResponse.builder()
                .id(p.getId())
                .jobTitle(p.getJob().getTitle())
                .jobDescription(p.getJob().getDescription())
                .clientId(p.getClient().getId())
                .clientName(p.getClient().getFullName())
                .expertId(p.getExpert().getId())
                .expertName(p.getExpert().getFullName())
                .expertAvatarUrl(p.getExpert().getAvatarUrl())
                .status(p.getStatus())
                .totalBudget(p.getBudget())
                .progress(progress)
                .milestones(ms.stream().map(this::msToResponse).toList())
                .createdAt(p.getCreatedAt())
                .escrowStatus(escrow != null ? escrow.getStatus().name() : null)
                .cancellationRequestedAt(p.getCancellationRequestedAt())
                .cancellationDeadline(cancellationDeadline)
                .cancellationEligible(isCancellationEligible(p, escrow))
                .build();
    }

    @Override
    public ProjectResponse requestCancellation(String clientId, String projectId) {
        Project project = projectRepo.findById(projectId)
                .orElseThrow(() -> AppException.notFound("Project not found"));
        if (!project.getClient().getId().equals(clientId))
            throw AppException.forbidden("Not your project");

        Escrow escrow = escrowRepo.findByProjectId(projectId)
                .orElseThrow(() -> AppException.badRequest("No escrow found for this project"));

        if (!isCancellationEligible(project, escrow))
            throw AppException.badRequest("This project is not eligible for cancellation");

        project.setCancellationRequestedAt(LocalDateTime.now());
        projectRepo.save(project);

        notificationService.createNotification(
                project.getExpert(),
                "Cancellation Requested",
                "Your client has requested to cancel project '" + project.getJob().getTitle() +
                        "' due to inactivity. Please respond (e.g. log in or submit a milestone) within " +
                        CANCELLATION_RESPONSE_HOURS + " hours, or the project will be cancelled and the escrow refunded.",
                "PROJECT",
                project.getId()
        );

        return toResponse(project);
    }

    @Override
    public void processExpiredCancellationRequests() {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(CANCELLATION_RESPONSE_HOURS);
        List<Project> pending = projectRepo.findByCancellationRequestedAtIsNotNullAndStatus(ProjectStatus.ACTIVE);

        for (Project project : pending) {
            if (project.getCancellationRequestedAt().isAfter(cutoff))
                continue; // still within the 48h response window

            if (expertHasRespondedSince(project)) {
                withdrawCancellationRequest(project, "The expert became active or made progress before the deadline.");
                continue;
            }

            Escrow escrow = escrowRepo.findByProjectId(project.getId()).orElse(null);
            if (escrow == null || escrow.getStatus() != EscrowStatus.HOLDING)
                continue; // nothing left to refund

            walletService.creditFromEscrowRefund(project.getClient().getId(), escrow.getAmount(),
                    "Escrow refund for cancelled project: " + project.getJob().getTitle());
            escrow.setStatus(EscrowStatus.REFUNDED);
            escrowRepo.save(escrow);

            project.setStatus(ProjectStatus.CANCELLED);
            projectRepo.save(project);
            syncJobStatus(project, JobStatus.CANCELLED);

            notificationService.createNotification(
                    project.getClient(),
                    "Project Cancelled & Refunded",
                    "Project '" + project.getJob().getTitle() + "' was cancelled due to expert inactivity. " +
                            escrow.getAmount() + " has been refunded to your wallet.",
                    "PROJECT",
                    project.getId()
            );
            notificationService.createNotification(
                    project.getExpert(),
                    "Project Cancelled",
                    "Project '" + project.getJob().getTitle() + "' was cancelled by the client due to inactivity.",
                    "PROJECT",
                    project.getId()
            );
        }
    }

    private boolean expertHasRespondedSince(Project project) {
        User expert = project.getExpert();
        boolean activeSinceRequest = expert.getLastActiveAt() != null
                && expert.getLastActiveAt().isAfter(project.getCancellationRequestedAt());
        return activeSinceRequest || hasMilestoneProgressed(project);
    }

    private boolean hasMilestoneProgressed(Project project) {
        List<Milestone> ms = project.getMilestones() != null ? project.getMilestones() : List.of();
        return ms.stream().anyMatch(m -> m.getStatus() != MilestoneStatus.PENDING && m.getStatus() != MilestoneStatus.IN_PROGRESS);
    }

    private void withdrawCancellationRequest(Project project, String reason) {
        if (project.getCancellationRequestedAt() == null) return;
        project.setCancellationRequestedAt(null);
        projectRepo.save(project);
        notificationService.createNotification(
                project.getClient(),
                "Cancellation Request Withdrawn",
                "Your cancellation request for project '" + project.getJob().getTitle() + "' was withdrawn. " + reason,
                "PROJECT",
                project.getId()
        );
    }

    @Override
    public void withdrawStaleCancellationRequestsForExpert(String expertId) {
        List<Project> pending = projectRepo.findByExpertIdAndStatusAndCancellationRequestedAtIsNotNull(
                expertId, ProjectStatus.ACTIVE);
        for (Project project : pending) {
            withdrawCancellationRequest(project, "The expert is active again.");
        }
    }

    @Override
    public void processAutoReleaseMilestones() {
        LocalDateTime now = LocalDateTime.now();
        List<Milestone> candidates = milestoneRepo
                .findByStatusAndSubmittedAtIsNotNullAndPaidAtIsNull(MilestoneStatus.SUBMITTED);

        for (Milestone ms : candidates) {
            if (ms.getSubmittedAt().plusDays(MILESTONE_REVIEW_DAYS).isAfter(now))
                continue; // review deadline hasn't expired yet

            Project project = ms.getProject();
            if (project.getStatus() != ProjectStatus.ACTIVE)
                continue;

            Escrow escrow = escrowRepo.findByProjectId(project.getId()).orElse(null);
            if (escrow == null
                    || (escrow.getStatus() != EscrowStatus.HOLDING && escrow.getStatus() != EscrowStatus.PARTIALLY_RELEASED))
                continue;

            User client = project.getClient();
            boolean clientRespondedSinceSubmission = client.getLastActiveAt() != null
                    && client.getLastActiveAt().isAfter(ms.getSubmittedAt());
            if (clientRespondedSinceSubmission)
                continue; // client is not actually inactive - verified at run time

            BigDecimal amount = BigDecimal.valueOf(ms.getAmount());

            ms.setStatus(MilestoneStatus.PAID);
            milestoneRepo.save(ms);

            releaseMilestonePayment(ms, amount, ReleaseReason.CLIENT_INACTIVE_TIMEOUT, "SYSTEM");

            notificationService.createNotification(
                    project.getExpert(),
                    "Milestone Auto-Approved & Paid 💰",
                    "Your milestone '" + ms.getTitle() + "' was automatically approved and paid because the client " +
                            "did not respond within " + MILESTONE_REVIEW_DAYS + " days of your submission.",
                    "MILESTONE",
                    project.getId()
            );
            notificationService.createNotification(
                    client,
                    "Milestone Payment Auto-Released",
                    "The " + MILESTONE_REVIEW_DAYS + "-day review period for milestone '" + ms.getTitle() +
                            "' expired due to inactivity. " + amount + " has been automatically released to the expert.",
                    "MILESTONE",
                    project.getId()
            );
        }
    }

    /**
     * Settles a disputed milestone per an admin's arbitration verdict: releases clientAmount +
     * expertAmount (which must sum to the milestone's disputed amount) between the two parties,
     * closes out the milestone as PAID, and returns the project to ACTIVE (or COMPLETED if that
     * was the last outstanding milestone). Called by DisputeService once it has validated and
     * recorded the resolution on the Dispute entity itself.
     */
    @Override
    public ProjectResponse resolveMilestoneDispute(String milestoneId, BigDecimal clientAmount, BigDecimal expertAmount,
                                                     String resolutionNote, String adminId) {
        Milestone ms = milestoneRepo.findById(milestoneId)
                .orElseThrow(() -> AppException.notFound("Milestone not found"));
        if (ms.getStatus() != MilestoneStatus.DISPUTED)
            throw AppException.badRequest("Milestone is not under dispute");

        Project project = ms.getProject();

        if (expertAmount.compareTo(BigDecimal.ZERO) > 0) {
            releaseMilestonePayment(ms, expertAmount, ReleaseReason.DISPUTE_RESOLUTION, adminId);
        }
        if (clientAmount.compareTo(BigDecimal.ZERO) > 0) {
            walletService.creditFromEscrowRefund(project.getClient().getId(), clientAmount,
                    "Dispute resolution refund for milestone: " + ms.getTitle());
        }

        ms.setStatus(MilestoneStatus.PAID);
        ms.setPaidAt(LocalDateTime.now());
        milestoneRepo.save(ms);

        project.setStatus(ProjectStatus.ACTIVE);
        projectRepo.save(project);
        checkProjectCompletion(project);

        String verdictSummary = "Client: " + clientAmount + ", Expert: " + expertAmount
                + (resolutionNote != null && !resolutionNote.isBlank() ? ". Note: " + resolutionNote : "");
        notificationService.createNotification(
                project.getClient(),
                "Dispute Resolved ⚖️",
                "The dispute over milestone '" + ms.getTitle() + "' has been resolved. " + verdictSummary,
                "DISPUTE",
                project.getId()
        );
        notificationService.createNotification(
                project.getExpert(),
                "Dispute Resolved ⚖️",
                "The dispute over milestone '" + ms.getTitle() + "' has been resolved. " + verdictSummary,
                "DISPUTE",
                project.getId()
        );

        return toResponse(project);
    }

    private boolean isCancellationEligible(Project project, Escrow escrow) {
        if (project.getStatus() != ProjectStatus.ACTIVE) return false;
        if (project.getCancellationRequestedAt() != null) return false;
        if (escrow == null || escrow.getStatus() != EscrowStatus.HOLDING) return false;
        if (hasMilestoneProgressed(project)) return false;

        User expert = project.getExpert();
        LocalDateTime lastKnownActivity = expert.getLastActiveAt() != null
                ? expert.getLastActiveAt()
                : project.getCreatedAt();
        return lastKnownActivity.isBefore(LocalDateTime.now().minusDays(CANCELLATION_INACTIVITY_DAYS));
    }

    @Override
    public List<String> uploadMilestoneFiles(String expertId, String milestoneId, List<MultipartFile> files) {
        Milestone ms = milestoneRepo.findById(milestoneId)
                .orElseThrow(() -> AppException.notFound("Milestone not found"));
        if (!ms.getProject().getExpert().getId().equals(expertId))
            throw AppException.forbidden("Not your project");
        try {
            List<String> urls = fileUploadService.saveMilestoneFiles(milestoneId, files);
            ms.getAttachmentUrls().addAll(urls);
            milestoneRepo.save(ms);
            return ms.getAttachmentUrls();
        } catch (IOException e) {
            throw new RuntimeException("File upload failed: " + e.getMessage(), e);
        }
    }

    private MilestoneResponse msToResponse(Milestone m) {
        return MilestoneResponse.builder()
                .id(m.getId())
                .title(m.getTitle())
                .description(m.getDescription())
                .amount(m.getAmount())
                .dueDate(m.getDueDate())
                .deliverableNote(m.getDeliverableNote())
                .revisionNote(m.getRevisionNote())
                .revisionDueDate(m.getRevisionDueDate())
                .revisionCount(m.getRevisionCount())
                .attachmentUrls(m.getAttachmentUrls())
                .status(m.getStatus())
                .submittedAt(m.getSubmittedAt())
                .paidAt(m.getPaidAt())
                .reviewDeadline(m.getSubmittedAt() != null ? m.getSubmittedAt().plusDays(MILESTONE_REVIEW_DAYS) : null)
                .build();
    }
}
