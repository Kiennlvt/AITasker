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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
@Transactional
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepo;
    private final MilestoneRepository milestoneRepo;
    private final UserRepository userRepo;
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

        notificationService.createNotification(
                ms.getProject().getExpert(),
                "Milestone Approved! 💰",
                "Your submission for milestone '" + ms.getTitle() + "' has been approved.",
                "MILESTONE",
                ms.getProject().getId()
        );

        return toResponse(ms.getProject());
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
        boolean allApproved = ms.stream().allMatch(m -> m.getStatus() == MilestoneStatus.APPROVED);
        if (!allApproved)
            throw AppException.badRequest("All milestones must be approved before finishing");

        project.setStatus(ProjectStatus.COMPLETED);
        projectRepo.save(project);

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
    public ProjectResponse requestRevision(String clientId, String milestoneId, String note) {
        Milestone ms = milestoneRepo.findById(milestoneId)
                .orElseThrow(() -> AppException.notFound("Milestone not found"));
        if (!ms.getProject().getClient().getId().equals(clientId))
            throw AppException.forbidden("Not your project");
        if (ms.getStatus() != MilestoneStatus.SUBMITTED)
            throw AppException.badRequest("Can only request revision on a submitted milestone");
        ms.setStatus(MilestoneStatus.REVISION_REQUESTED);
        ms.setRevisionNote(note);
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
        ms.setStatus(MilestoneStatus.SUBMITTED);
        ms.setDeliverableNote(note);
        milestoneRepo.save(ms);

        notificationService.createNotification(
                ms.getProject().getClient(),
                "Milestone Submitted for Approval",
                ms.getProject().getExpert().getFullName() + " submitted deliverables for '" + ms.getTitle() + "'.",
                "MILESTONE",
                ms.getProject().getId()
        );

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
        double budget = project.getJob().getBudget();
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
        long approved = ms.stream().filter(m -> m.getStatus() == MilestoneStatus.APPROVED).count();
        int progress = ms.isEmpty() ? 0 : (int) (approved * 100 / ms.size());

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
                .totalBudget(p.getJob().getBudget())
                .progress(progress)
                .milestones(ms.stream().map(this::msToResponse).toList())
                .createdAt(p.getCreatedAt())
                .build();
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
                .attachmentUrls(m.getAttachmentUrls())
                .status(m.getStatus())
                .build();
    }
}
