package com.aitasker.service;

import com.aitasker.entity.*;
import com.aitasker.enums.*;
import com.aitasker.exception.AppException;
import com.aitasker.repository.DisputeRepository;
import com.aitasker.repository.MilestoneRepository;
import com.aitasker.repository.ProjectRepository;
import com.aitasker.repository.UserRepository;
import com.aitasker.service.impl.DisputeServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class DisputeServiceImplTest {

    private DisputeRepository disputeRepo;
    private MilestoneRepository milestoneRepo;
    private ProjectRepository projectRepo;
    private UserRepository userRepo;
    private FileUploadService fileUploadService;
    private NotificationService notificationService;
    private ProjectService projectService;
    private DisputeServiceImpl disputeService;

    private User client;
    private User expert;
    private Project project;
    private Milestone milestone;

    @BeforeEach
    void setUp() {
        disputeRepo = mock(DisputeRepository.class);
        milestoneRepo = mock(MilestoneRepository.class);
        projectRepo = mock(ProjectRepository.class);
        userRepo = mock(UserRepository.class);
        fileUploadService = mock(FileUploadService.class);
        notificationService = mock(NotificationService.class);
        projectService = mock(ProjectService.class);
        disputeService = new DisputeServiceImpl(disputeRepo, milestoneRepo, projectRepo, userRepo,
                fileUploadService, notificationService, projectService);

        client = User.builder().id("client-1").fullName("Client").role(UserRole.CLIENT).build();
        expert = User.builder().id("expert-1").fullName("Expert").role(UserRole.EXPERT).build();
        JobPost job = JobPost.builder().id("job-1").title("Build a website").build();
        project = Project.builder().id("project-1").job(job).client(client).expert(expert)
                .status(ProjectStatus.ACTIVE).build();
        milestone = Milestone.builder().id("m-1").project(project).status(MilestoneStatus.REVISION_REQUESTED)
                .amount(200.0).title("Design").revisionCount(3).build();

        when(disputeRepo.save(any(Dispute.class))).thenAnswer(inv -> inv.getArgument(0));
        when(userRepo.findByRole(UserRole.ADMIN)).thenReturn(List.of());
    }

    @Test
    void fileDispute_marksMilestoneAndProjectDisputed_andNotifiesRespondent() {
        when(milestoneRepo.findById("m-1")).thenReturn(Optional.of(milestone));

        disputeService.fileDispute("expert-1", "m-1", "Client keeps requesting pointless revisions");

        assertEquals(MilestoneStatus.DISPUTED, milestone.getStatus());
        assertEquals(ProjectStatus.DISPUTED, project.getStatus());
        verify(notificationService).createNotification(eq(client), any(), any(), eq("DISPUTE"), eq("project-1"));
    }

    @Test
    void fileDispute_rejectsWhenAlreadyDisputePending() {
        when(milestoneRepo.findById("m-1")).thenReturn(Optional.of(milestone));
        when(disputeRepo.existsByMilestone_IdAndStatus("m-1", DisputeStatus.PENDING)).thenReturn(true);

        assertThrows(AppException.class, () ->
                disputeService.fileDispute("expert-1", "m-1", "second dispute attempt"));
    }

    @Test
    void fileDispute_rejectsWhenMilestoneNotUnderReview() {
        milestone.setStatus(MilestoneStatus.PENDING);
        when(milestoneRepo.findById("m-1")).thenReturn(Optional.of(milestone));

        assertThrows(AppException.class, () ->
                disputeService.fileDispute("expert-1", "m-1", "too early"));
    }

    @Test
    void fileDispute_allowsClientToFile_whenOverdueAndNeverSubmitted() {
        milestone.setStatus(MilestoneStatus.PENDING);
        milestone.setDueDate(java.time.LocalDate.now().minusDays(2));
        when(milestoneRepo.findById("m-1")).thenReturn(Optional.of(milestone));

        disputeService.fileDispute("client-1", "m-1", "Expert never delivered this milestone");

        assertEquals(MilestoneStatus.DISPUTED, milestone.getStatus());
        assertEquals(ProjectStatus.DISPUTED, project.getStatus());
    }

    @Test
    void fileDispute_rejectsExpertFiling_whenOverdueAndNeverSubmitted() {
        milestone.setStatus(MilestoneStatus.IN_PROGRESS);
        milestone.setDueDate(java.time.LocalDate.now().minusDays(2));
        when(milestoneRepo.findById("m-1")).thenReturn(Optional.of(milestone));

        assertThrows(AppException.class, () ->
                disputeService.fileDispute("expert-1", "m-1", "not my call to make"));
    }

    @Test
    void fileDispute_rejectsClientFiling_whenNotYetOverdue() {
        milestone.setStatus(MilestoneStatus.PENDING);
        milestone.setDueDate(java.time.LocalDate.now().plusDays(3));
        when(milestoneRepo.findById("m-1")).thenReturn(Optional.of(milestone));

        assertThrows(AppException.class, () ->
                disputeService.fileDispute("client-1", "m-1", "too early"));
    }

    @Test
    void fileDispute_rejectsCallerNotPartyToProject() {
        when(milestoneRepo.findById("m-1")).thenReturn(Optional.of(milestone));

        assertThrows(AppException.class, () ->
                disputeService.fileDispute("stranger-1", "m-1", "not my project"));
    }

    @Test
    void resolveDispute_rejectsWhenAmountsDoNotSumToDisputedAmount() {
        Dispute dispute = Dispute.builder().id("d-1").project(project).milestone(milestone)
                .filedBy(expert).respondent(client).reason("r").amount(BigDecimal.valueOf(200))
                .status(DisputeStatus.PENDING).build();
        when(disputeRepo.findById("d-1")).thenReturn(Optional.of(dispute));

        assertThrows(AppException.class, () ->
                disputeService.resolveDispute("admin-1", "d-1", BigDecimal.valueOf(50), BigDecimal.valueOf(100), "note"));
        verify(projectService, never()).resolveMilestoneDispute(any(), any(), any(), any(), any());
    }

    @Test
    void resolveDispute_delegatesToProjectService_whenAmountsAreValid() {
        Dispute dispute = Dispute.builder().id("d-1").project(project).milestone(milestone)
                .filedBy(expert).respondent(client).reason("r").amount(BigDecimal.valueOf(200))
                .status(DisputeStatus.PENDING).build();
        when(disputeRepo.findById("d-1")).thenReturn(Optional.of(dispute));

        disputeService.resolveDispute("admin-1", "d-1", BigDecimal.valueOf(80), BigDecimal.valueOf(120), "60/40 split");

        verify(projectService).resolveMilestoneDispute("m-1", BigDecimal.valueOf(80), BigDecimal.valueOf(120), "60/40 split", "admin-1");
        assertEquals(DisputeStatus.RESOLVED, dispute.getStatus());
        assertEquals("admin-1", dispute.getResolvedBy());
    }
}
