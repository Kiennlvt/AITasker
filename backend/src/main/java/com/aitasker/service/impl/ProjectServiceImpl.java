package com.aitasker.service.impl;

import com.aitasker.dto.request.CreateMilestoneRequest;
import com.aitasker.dto.response.MilestoneResponse;
import com.aitasker.dto.response.ProjectResponse;
import com.aitasker.entity.*;
import com.aitasker.enums.*;
import com.aitasker.exception.AppException;
import com.aitasker.repository.*;
import com.aitasker.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepo;
    private final MilestoneRepository milestoneRepo;
    private final UserRepository userRepo;

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

        // BR-26: if all milestones approved → project completed
        Project project = ms.getProject();
        boolean allApproved = project.getMilestones().stream()
                .allMatch(m -> m.getStatus() == MilestoneStatus.APPROVED);
        if (allApproved) {
            project.setStatus(ProjectStatus.COMPLETED);
            projectRepo.save(project);
        }
        return toResponse(project);
    }

    @Override
    public ProjectResponse requestRevision(String clientId, String milestoneId, String note) {
        Milestone ms = milestoneRepo.findById(milestoneId)
                .orElseThrow(() -> AppException.notFound("Milestone not found"));
        if (!ms.getProject().getClient().getId().equals(clientId))
            throw AppException.forbidden("Not your project");
        ms.setStatus(MilestoneStatus.REJECTED);
        ms.setDeliverableNote(note);
        milestoneRepo.save(ms);
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
        return toResponse(ms.getProject());
    }

    @Override
    public MilestoneResponse createMilestone(String expertId, String projectId, CreateMilestoneRequest request) {
        Project project = projectRepo.findById(projectId)
                .orElseThrow(() -> AppException.notFound("Project not found"));
        if (!project.getExpert().getId().equals(expertId))
            throw AppException.forbidden("Not your project");

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
        ms.setTitle(request.getTitle());
        ms.setDescription(request.getDescription());
        ms.setAmount(request.getAmount());
        ms.setDueDate(request.getDueDate());
        return msToResponse(milestoneRepo.save(ms));
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

    private MilestoneResponse msToResponse(Milestone m) {
        return MilestoneResponse.builder()
                .id(m.getId())
                .title(m.getTitle())
                .description(m.getDescription())
                .amount(m.getAmount())
                .dueDate(m.getDueDate())
                .deliverableNote(m.getDeliverableNote())
                .status(m.getStatus())
                .build();
    }
}
