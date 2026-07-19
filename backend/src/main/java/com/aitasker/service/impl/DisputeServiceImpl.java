package com.aitasker.service.impl;

import com.aitasker.dto.response.DisputeResponse;
import com.aitasker.entity.Dispute;
import com.aitasker.entity.Milestone;
import com.aitasker.entity.Project;
import com.aitasker.entity.User;
import com.aitasker.enums.DisputeStatus;
import com.aitasker.enums.MilestoneStatus;
import com.aitasker.enums.UserRole;
import com.aitasker.exception.AppException;
import com.aitasker.repository.DisputeRepository;
import com.aitasker.repository.MilestoneRepository;
import com.aitasker.repository.ProjectRepository;
import com.aitasker.repository.UserRepository;
import com.aitasker.service.DisputeService;
import com.aitasker.service.FileUploadService;
import com.aitasker.service.NotificationService;
import com.aitasker.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class DisputeServiceImpl implements DisputeService {

    private final DisputeRepository disputeRepo;
    private final MilestoneRepository milestoneRepo;
    private final ProjectRepository projectRepo;
    private final UserRepository userRepo;
    private final FileUploadService fileUploadService;
    private final NotificationService notificationService;
    private final ProjectService projectService;

    @Override
    public DisputeResponse fileDispute(String userId, String milestoneId, String reason) {
        Milestone ms = milestoneRepo.findById(milestoneId)
                .orElseThrow(() -> AppException.notFound("Milestone not found"));
        Project project = ms.getProject();

        User filer;
        User respondent;
        if (project.getClient().getId().equals(userId)) {
            filer = project.getClient();
            respondent = project.getExpert();
        } else if (project.getExpert().getId().equals(userId)) {
            filer = project.getExpert();
            respondent = project.getClient();
        } else {
            throw AppException.forbidden("Not your project");
        }

        boolean underReview = ms.getStatus() == MilestoneStatus.SUBMITTED || ms.getStatus() == MilestoneStatus.REVISION_REQUESTED;
        boolean overdueAndUndelivered = (ms.getStatus() == MilestoneStatus.PENDING || ms.getStatus() == MilestoneStatus.IN_PROGRESS)
                && ms.getDueDate() != null && ms.getDueDate().isBefore(LocalDate.now());

        if (!underReview && !(overdueAndUndelivered && filer.getId().equals(project.getClient().getId())))
            throw AppException.badRequest("A dispute can only be filed while the milestone is under review, " +
                    "or by the client once its due date has passed without a submission");

        if (disputeRepo.existsByMilestone_IdAndStatus(milestoneId, DisputeStatus.PENDING))
            throw AppException.conflict("This milestone already has a pending dispute");

        Dispute dispute = Dispute.builder()
                .project(project)
                .milestone(ms)
                .filedBy(filer)
                .respondent(respondent)
                .reason(reason)
                .amount(BigDecimal.valueOf(ms.getAmount()))
                .build();
        dispute = disputeRepo.save(dispute);

        ms.setStatus(MilestoneStatus.DISPUTED);
        milestoneRepo.save(ms);

        project.setStatus(com.aitasker.enums.ProjectStatus.DISPUTED);
        projectRepo.save(project);

        notificationService.createNotification(
                respondent,
                "Dispute Filed Against a Milestone ⚖️",
                filer.getFullName() + " filed a dispute for milestone '" + ms.getTitle() +
                        "'. Please submit your evidence and response as soon as possible.",
                "DISPUTE",
                project.getId()
        );

        for (User admin : userRepo.findByRole(UserRole.ADMIN)) {
            notificationService.createNotification(
                    admin,
                    "New Dispute Filed",
                    filer.getFullName() + " filed a dispute against " + respondent.getFullName() +
                            " over milestone '" + ms.getTitle() + "' ($" + dispute.getAmount() + ").",
                    "DISPUTE",
                    project.getId()
            );
        }

        return toResponse(dispute);
    }

    @Override
    public DisputeResponse addEvidence(String userId, String disputeId, List<MultipartFile> files) {
        Dispute dispute = disputeRepo.findById(disputeId)
                .orElseThrow(() -> AppException.notFound("Dispute not found"));
        if (dispute.getStatus() != DisputeStatus.PENDING)
            throw AppException.badRequest("This dispute has already been resolved");

        boolean isFiler = dispute.getFiledBy().getId().equals(userId);
        boolean isRespondent = dispute.getRespondent().getId().equals(userId);
        if (!isFiler && !isRespondent)
            throw AppException.forbidden("Not a party to this dispute");

        try {
            List<String> urls = fileUploadService.saveDisputeFiles(disputeId, files);
            if (isFiler) {
                dispute.getEvidenceUrls().addAll(urls);
            } else {
                dispute.getRespondentEvidenceUrls().addAll(urls);
            }
            return toResponse(disputeRepo.save(dispute));
        } catch (IOException e) {
            throw new RuntimeException("File upload failed: " + e.getMessage(), e);
        }
    }

    @Override
    public DisputeResponse respondToDispute(String userId, String disputeId, String response) {
        Dispute dispute = disputeRepo.findById(disputeId)
                .orElseThrow(() -> AppException.notFound("Dispute not found"));
        if (!dispute.getRespondent().getId().equals(userId))
            throw AppException.forbidden("Only the respondent can submit a response");
        if (dispute.getStatus() != DisputeStatus.PENDING)
            throw AppException.badRequest("This dispute has already been resolved");

        dispute.setRespondentResponse(response);
        return toResponse(disputeRepo.save(dispute));
    }

    @Override
    public DisputeResponse getDispute(String userId, String disputeId) {
        Dispute dispute = disputeRepo.findById(disputeId)
                .orElseThrow(() -> AppException.notFound("Dispute not found"));
        checkPartyOrAdminAccess(userId, dispute);
        return toResponse(dispute);
    }

    @Override
    public List<DisputeResponse> getDisputesForProject(String userId, String projectId) {
        Project project = projectRepo.findById(projectId)
                .orElseThrow(() -> AppException.notFound("Project not found"));
        if (!project.getClient().getId().equals(userId) && !project.getExpert().getId().equals(userId))
            throw AppException.forbidden("Access denied");
        return disputeRepo.findByProject_IdOrderByCreatedAtDesc(projectId).stream().map(this::toResponse).toList();
    }

    @Override
    public List<DisputeResponse> getAllDisputes(String status) {
        List<Dispute> disputes = (status != null && !status.equals("ALL"))
                ? disputeRepo.findByStatusOrderByCreatedAtDesc(DisputeStatus.valueOf(status))
                : disputeRepo.findAllByOrderByCreatedAtDesc();
        return disputes.stream().map(this::toResponse).toList();
    }

    @Override
    public DisputeResponse resolveDispute(String adminId, String disputeId, BigDecimal clientAmount,
                                           BigDecimal expertAmount, String resolutionNote) {
        Dispute dispute = disputeRepo.findById(disputeId)
                .orElseThrow(() -> AppException.notFound("Dispute not found"));
        if (dispute.getStatus() != DisputeStatus.PENDING)
            throw AppException.badRequest("This dispute has already been resolved");
        if (clientAmount.add(expertAmount).compareTo(dispute.getAmount()) != 0)
            throw AppException.badRequest("Client amount + expert amount must equal the disputed amount ($" + dispute.getAmount() + ")");

        projectService.resolveMilestoneDispute(dispute.getMilestone().getId(), clientAmount, expertAmount, resolutionNote, adminId);

        dispute.setStatus(DisputeStatus.RESOLVED);
        dispute.setClientAmount(clientAmount);
        dispute.setExpertAmount(expertAmount);
        dispute.setResolutionNote(resolutionNote);
        dispute.setResolvedBy(adminId);
        dispute.setResolvedAt(LocalDateTime.now());
        return toResponse(disputeRepo.save(dispute));
    }

    private void checkPartyOrAdminAccess(String userId, Dispute dispute) {
        if (dispute.getFiledBy().getId().equals(userId) || dispute.getRespondent().getId().equals(userId))
            return;
        User user = userRepo.findById(userId).orElseThrow(() -> AppException.notFound("User not found"));
        if (user.getRole() != UserRole.ADMIN)
            throw AppException.forbidden("Access denied");
    }

    private DisputeResponse toResponse(Dispute d) {
        return DisputeResponse.builder()
                .id(d.getId())
                .projectId(d.getProject().getId())
                .jobTitle(d.getProject().getJob().getTitle())
                .milestoneId(d.getMilestone().getId())
                .milestoneTitle(d.getMilestone().getTitle())
                .filedById(d.getFiledBy().getId())
                .filedByName(d.getFiledBy().getFullName())
                .respondentId(d.getRespondent().getId())
                .respondentName(d.getRespondent().getFullName())
                .reason(d.getReason())
                .evidenceUrls(d.getEvidenceUrls())
                .respondentResponse(d.getRespondentResponse())
                .respondentEvidenceUrls(d.getRespondentEvidenceUrls())
                .amount(d.getAmount())
                .status(d.getStatus())
                .clientAmount(d.getClientAmount())
                .expertAmount(d.getExpertAmount())
                .resolutionNote(d.getResolutionNote())
                .resolvedAt(d.getResolvedAt())
                .createdAt(d.getCreatedAt())
                .build();
    }
}
