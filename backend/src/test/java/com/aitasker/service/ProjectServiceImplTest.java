package com.aitasker.service;

import com.aitasker.entity.*;
import com.aitasker.enums.*;
import com.aitasker.repository.*;
import com.aitasker.service.impl.ProjectServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ProjectServiceImplTest {

    private ProjectRepository projectRepo;
    private MilestoneRepository milestoneRepo;
    private UserRepository userRepo;
    private EscrowRepository escrowRepo;
    private AuditLogRepository auditLogRepo;
    private JobPostRepository jobPostRepo;
    private WalletService walletService;
    private FileUploadService fileUploadService;
    private NotificationService notificationService;
    private ProjectServiceImpl projectService;

    private User client;
    private User expert;
    private JobPost job;
    private Project project;
    private Escrow escrow;

    @BeforeEach
    void setUp() {
        projectRepo = mock(ProjectRepository.class);
        milestoneRepo = mock(MilestoneRepository.class);
        userRepo = mock(UserRepository.class);
        escrowRepo = mock(EscrowRepository.class);
        auditLogRepo = mock(AuditLogRepository.class);
        jobPostRepo = mock(JobPostRepository.class);
        walletService = mock(WalletService.class);
        fileUploadService = mock(FileUploadService.class);
        notificationService = mock(NotificationService.class);
        projectService = new ProjectServiceImpl(projectRepo, milestoneRepo, userRepo, escrowRepo, auditLogRepo,
                jobPostRepo, walletService, fileUploadService, notificationService);

        client = User.builder().id("client-1").fullName("Client").build();
        expert = User.builder().id("expert-1").fullName("Expert").build();
        job = JobPost.builder().id("job-1").title("Build a website").client(client).budget(500.0).build();
        project = Project.builder()
                .id("project-1").job(job).client(client).expert(expert)
                .status(ProjectStatus.ACTIVE)
                .cancellationRequestedAt(LocalDateTime.now().minusHours(49))
                .milestones(List.of())
                .createdAt(LocalDateTime.now().minusDays(10))
                .build();
        escrow = Escrow.builder().id("escrow-1").project(project).amount(BigDecimal.valueOf(500))
                .status(EscrowStatus.HOLDING).build();

        when(projectRepo.save(any(Project.class))).thenAnswer(inv -> inv.getArgument(0));
        when(escrowRepo.save(any(Escrow.class))).thenAnswer(inv -> inv.getArgument(0));
        when(escrowRepo.findByProjectId("project-1")).thenReturn(Optional.of(escrow));
    }

    @Test
    void processExpiredCancellationRequests_refunds_whenExpertStayedInactive() {
        expert.setLastActiveAt(null);
        when(projectRepo.findByCancellationRequestedAtIsNotNullAndStatus(ProjectStatus.ACTIVE))
                .thenReturn(List.of(project));

        projectService.processExpiredCancellationRequests();

        verify(walletService).creditFromEscrowRefund(eq("client-1"), eq(BigDecimal.valueOf(500)), any());
        assertEquals(EscrowStatus.REFUNDED, escrow.getStatus());
        assertEquals(ProjectStatus.CANCELLED, project.getStatus());
    }

    @Test
    void processExpiredCancellationRequests_withdraws_whenExpertBecameActiveAfterRequest() {
        expert.setLastActiveAt(LocalDateTime.now().minusHours(1)); // after the 49h-old request
        when(projectRepo.findByCancellationRequestedAtIsNotNullAndStatus(ProjectStatus.ACTIVE))
                .thenReturn(List.of(project));

        projectService.processExpiredCancellationRequests();

        verify(walletService, never()).creditFromEscrowRefund(any(), any(), any());
        assertNull(project.getCancellationRequestedAt());
        assertEquals(ProjectStatus.ACTIVE, project.getStatus());
    }

    @Test
    void processExpiredCancellationRequests_withdraws_whenMilestoneProgressed() {
        expert.setLastActiveAt(null);
        Milestone submitted = Milestone.builder().id("m-1").project(project).status(MilestoneStatus.SUBMITTED).build();
        project.setMilestones(List.of(submitted));
        when(projectRepo.findByCancellationRequestedAtIsNotNullAndStatus(ProjectStatus.ACTIVE))
                .thenReturn(List.of(project));

        projectService.processExpiredCancellationRequests();

        verify(walletService, never()).creditFromEscrowRefund(any(), any(), any());
        assertNull(project.getCancellationRequestedAt());
        assertEquals(ProjectStatus.ACTIVE, project.getStatus());
    }

    @Test
    void processExpiredCancellationRequests_skips_whenStillWithinWindow() {
        project.setCancellationRequestedAt(LocalDateTime.now().minusHours(10));
        when(projectRepo.findByCancellationRequestedAtIsNotNullAndStatus(ProjectStatus.ACTIVE))
                .thenReturn(List.of(project));

        projectService.processExpiredCancellationRequests();

        verify(walletService, never()).creditFromEscrowRefund(any(), any(), any());
        verify(projectRepo, never()).save(any());
        assertNotNull(project.getCancellationRequestedAt());
        assertEquals(ProjectStatus.ACTIVE, project.getStatus());
    }

    // ---- Client Inactive Auto Milestone Release ----

    @Test
    void approveDeliverable_releasesPaymentImmediately_whenClientApprovesBeforeTimeout() {
        Milestone ms = Milestone.builder().id("m-1").project(project).status(MilestoneStatus.SUBMITTED)
                .amount(200.0).title("Design").submittedAt(LocalDateTime.now().minusHours(2)).build();
        when(milestoneRepo.findById("m-1")).thenReturn(Optional.of(ms));

        projectService.approveDeliverable("client-1", "m-1");

        assertEquals(MilestoneStatus.APPROVED, ms.getStatus());
        assertNotNull(ms.getPaidAt());
        verify(walletService).creditFromEscrowRelease(eq("expert-1"), eq(BigDecimal.valueOf(200.0)), any());
        assertEquals(BigDecimal.valueOf(200.0), escrow.getReleasedAmount());
        assertEquals(EscrowStatus.PARTIALLY_RELEASED, escrow.getStatus());
        verify(auditLogRepo).save(any(AuditLog.class));
    }

    @Test
    void approveDeliverable_flipsEscrowToReleased_whenFullAmountReleased() {
        escrow.setReleasedAmount(BigDecimal.valueOf(300));
        Milestone ms = Milestone.builder().id("m-1").project(project).status(MilestoneStatus.SUBMITTED)
                .amount(200.0).title("Final delivery").build();
        when(milestoneRepo.findById("m-1")).thenReturn(Optional.of(ms));

        projectService.approveDeliverable("client-1", "m-1");

        assertEquals(BigDecimal.valueOf(500.0), escrow.getReleasedAmount());
        assertEquals(EscrowStatus.RELEASED, escrow.getStatus());
    }

    @Test
    void requestRevision_doesNotReleasePayment_existingDisputeFlowUnaffected() {
        Milestone ms = Milestone.builder().id("m-1").project(project).status(MilestoneStatus.SUBMITTED)
                .amount(200.0).title("Design").submittedAt(LocalDateTime.now()).build();
        when(milestoneRepo.findById("m-1")).thenReturn(Optional.of(ms));

        projectService.requestRevision("client-1", "m-1", "please redo the header", LocalDate.now().plusDays(3));

        assertEquals(MilestoneStatus.REVISION_REQUESTED, ms.getStatus());
        assertNull(ms.getPaidAt());
        assertEquals(BigDecimal.ZERO, escrow.getReleasedAmount());
        verify(walletService, never()).creditFromEscrowRelease(any(), any(), any());
        verify(auditLogRepo, never()).save(any());
    }

    @Test
    void processAutoReleaseMilestones_releasesPayment_whenClientInactiveFiveDays() {
        LocalDateTime submittedAt = LocalDateTime.now().minusDays(6);
        Milestone ms = Milestone.builder().id("m-1").project(project).status(MilestoneStatus.SUBMITTED)
                .amount(150.0).title("Backend API").submittedAt(submittedAt).build();
        client.setLastActiveAt(submittedAt.minusHours(1)); // no activity since submission
        when(milestoneRepo.findByStatusAndSubmittedAtIsNotNullAndPaidAtIsNull(MilestoneStatus.SUBMITTED))
                .thenReturn(List.of(ms));

        projectService.processAutoReleaseMilestones();

        assertEquals(MilestoneStatus.PAID, ms.getStatus());
        assertNotNull(ms.getPaidAt());
        verify(walletService).creditFromEscrowRelease(eq("expert-1"), eq(BigDecimal.valueOf(150.0)), any());
        assertEquals(BigDecimal.valueOf(150.0), escrow.getReleasedAmount());
        assertEquals(EscrowStatus.PARTIALLY_RELEASED, escrow.getStatus());
        verify(notificationService).createNotification(eq(expert), any(), any(), eq("MILESTONE"), eq("project-1"));
        verify(notificationService).createNotification(eq(client), any(), any(), eq("MILESTONE"), eq("project-1"));
    }

    @Test
    void processAutoReleaseMilestones_skips_whenReviewDeadlineNotExpired() {
        Milestone ms = Milestone.builder().id("m-1").project(project).status(MilestoneStatus.SUBMITTED)
                .amount(150.0).submittedAt(LocalDateTime.now().minusDays(2)).build();
        when(milestoneRepo.findByStatusAndSubmittedAtIsNotNullAndPaidAtIsNull(MilestoneStatus.SUBMITTED))
                .thenReturn(List.of(ms));

        projectService.processAutoReleaseMilestones();

        assertEquals(MilestoneStatus.SUBMITTED, ms.getStatus());
        verify(walletService, never()).creditFromEscrowRelease(any(), any(), any());
    }

    @Test
    void processAutoReleaseMilestones_skips_whenClientBecameActiveSinceSubmission() {
        LocalDateTime submittedAt = LocalDateTime.now().minusDays(6);
        Milestone ms = Milestone.builder().id("m-1").project(project).status(MilestoneStatus.SUBMITTED)
                .amount(150.0).submittedAt(submittedAt).build();
        client.setLastActiveAt(submittedAt.plusHours(1)); // client interacted after submission

        when(milestoneRepo.findByStatusAndSubmittedAtIsNotNullAndPaidAtIsNull(MilestoneStatus.SUBMITTED))
                .thenReturn(List.of(ms));

        projectService.processAutoReleaseMilestones();

        assertEquals(MilestoneStatus.SUBMITTED, ms.getStatus());
        verify(walletService, never()).creditFromEscrowRelease(any(), any(), any());
    }

    @Test
    void processAutoReleaseMilestones_skips_whenProjectNotActive() {
        project.setStatus(ProjectStatus.COMPLETED);
        client.setLastActiveAt(null);
        Milestone ms = Milestone.builder().id("m-1").project(project).status(MilestoneStatus.SUBMITTED)
                .amount(150.0).submittedAt(LocalDateTime.now().minusDays(6)).build();
        when(milestoneRepo.findByStatusAndSubmittedAtIsNotNullAndPaidAtIsNull(MilestoneStatus.SUBMITTED))
                .thenReturn(List.of(ms));

        projectService.processAutoReleaseMilestones();

        verify(walletService, never()).creditFromEscrowRelease(any(), any(), any());
    }

    @Test
    void processAutoReleaseMilestones_skips_whenEscrowNotHoldingOrPartiallyReleased() {
        escrow.setStatus(EscrowStatus.REFUNDED);
        client.setLastActiveAt(null);
        Milestone ms = Milestone.builder().id("m-1").project(project).status(MilestoneStatus.SUBMITTED)
                .amount(150.0).submittedAt(LocalDateTime.now().minusDays(6)).build();
        when(milestoneRepo.findByStatusAndSubmittedAtIsNotNullAndPaidAtIsNull(MilestoneStatus.SUBMITTED))
                .thenReturn(List.of(ms));

        projectService.processAutoReleaseMilestones();

        verify(walletService, never()).creditFromEscrowRelease(any(), any(), any());
    }

    @Test
    void processAutoReleaseMilestones_handlesMultipleMilestonesInSameProjectIndependently() {
        client.setLastActiveAt(null);
        Milestone eligible = Milestone.builder().id("m-1").project(project).status(MilestoneStatus.SUBMITTED)
                .amount(100.0).submittedAt(LocalDateTime.now().minusDays(6)).build();
        Milestone notYetDue = Milestone.builder().id("m-2").project(project).status(MilestoneStatus.SUBMITTED)
                .amount(50.0).submittedAt(LocalDateTime.now().minusDays(1)).build();
        when(milestoneRepo.findByStatusAndSubmittedAtIsNotNullAndPaidAtIsNull(MilestoneStatus.SUBMITTED))
                .thenReturn(List.of(eligible, notYetDue));

        projectService.processAutoReleaseMilestones();

        assertEquals(MilestoneStatus.PAID, eligible.getStatus());
        assertEquals(MilestoneStatus.SUBMITTED, notYetDue.getStatus());
        verify(walletService).creditFromEscrowRelease(eq("expert-1"), eq(BigDecimal.valueOf(100.0)), any());
        verify(walletService, never()).creditFromEscrowRelease(eq("expert-1"), eq(BigDecimal.valueOf(50.0)), any());
        assertEquals(BigDecimal.valueOf(100.0), escrow.getReleasedAmount());
    }

    @Test
    void escrowReleasedAmount_accumulatesCorrectly_acrossAutoReleaseThenManualApproval() {
        client.setLastActiveAt(null);
        Milestone m1 = Milestone.builder().id("m-1").project(project).status(MilestoneStatus.SUBMITTED)
                .amount(200.0).submittedAt(LocalDateTime.now().minusDays(6)).build();
        when(milestoneRepo.findByStatusAndSubmittedAtIsNotNullAndPaidAtIsNull(MilestoneStatus.SUBMITTED))
                .thenReturn(List.of(m1));

        projectService.processAutoReleaseMilestones();

        assertEquals(BigDecimal.valueOf(200.0), escrow.getReleasedAmount());
        assertEquals(EscrowStatus.PARTIALLY_RELEASED, escrow.getStatus());

        Milestone m2 = Milestone.builder().id("m-2").project(project).status(MilestoneStatus.SUBMITTED)
                .amount(300.0).build();
        when(milestoneRepo.findById("m-2")).thenReturn(Optional.of(m2));

        projectService.approveDeliverable("client-1", "m-2");

        assertEquals(BigDecimal.valueOf(500.0), escrow.getReleasedAmount());
        assertEquals(EscrowStatus.RELEASED, escrow.getStatus());
    }

    // ---- Dispute Resolution ----

    @Test
    void resolveMilestoneDispute_splitsPaymentBetweenBothParties() {
        project.setStatus(ProjectStatus.DISPUTED);
        Milestone ms = Milestone.builder().id("m-1").project(project).status(MilestoneStatus.DISPUTED)
                .amount(200.0).title("Design").build();
        when(milestoneRepo.findById("m-1")).thenReturn(Optional.of(ms));

        projectService.resolveMilestoneDispute("m-1", BigDecimal.valueOf(80), BigDecimal.valueOf(120), "60/40 split", "admin-1");

        verify(walletService).creditFromEscrowRelease(eq("expert-1"), eq(BigDecimal.valueOf(120)), any());
        verify(walletService).creditFromEscrowRefund(eq("client-1"), eq(BigDecimal.valueOf(80)), any());
        assertEquals(MilestoneStatus.PAID, ms.getStatus());
        assertNotNull(ms.getPaidAt());
        assertEquals(ProjectStatus.ACTIVE, project.getStatus());
        assertEquals(BigDecimal.valueOf(120), escrow.getReleasedAmount());
    }

    @Test
    void resolveMilestoneDispute_skipsWalletCalls_whenOnePartyGetsNothing() {
        project.setStatus(ProjectStatus.DISPUTED);
        Milestone ms = Milestone.builder().id("m-1").project(project).status(MilestoneStatus.DISPUTED)
                .amount(200.0).title("Design").build();
        when(milestoneRepo.findById("m-1")).thenReturn(Optional.of(ms));

        projectService.resolveMilestoneDispute("m-1", BigDecimal.valueOf(200), BigDecimal.ZERO, "full refund", "admin-1");

        verify(walletService, never()).creditFromEscrowRelease(any(), any(), any());
        verify(walletService).creditFromEscrowRefund(eq("client-1"), eq(BigDecimal.valueOf(200)), any());
        assertEquals(MilestoneStatus.PAID, ms.getStatus());
    }

    @Test
    void resolveMilestoneDispute_rejectsMilestoneNotUnderDispute() {
        Milestone ms = Milestone.builder().id("m-1").project(project).status(MilestoneStatus.SUBMITTED)
                .amount(200.0).title("Design").build();
        when(milestoneRepo.findById("m-1")).thenReturn(Optional.of(ms));

        assertThrows(RuntimeException.class, () ->
                projectService.resolveMilestoneDispute("m-1", BigDecimal.valueOf(100), BigDecimal.valueOf(100), null, "admin-1"));
        verify(walletService, never()).creditFromEscrowRelease(any(), any(), any());
    }

    @Test
    void resolveMilestoneDispute_completesProject_whenLastMilestoneSettled() {
        project.setStatus(ProjectStatus.DISPUTED);
        Milestone ms = Milestone.builder().id("m-1").project(project).status(MilestoneStatus.DISPUTED)
                .amount(200.0).title("Design").build();
        project.setMilestones(List.of(ms));
        when(milestoneRepo.findById("m-1")).thenReturn(Optional.of(ms));

        projectService.resolveMilestoneDispute("m-1", BigDecimal.ZERO, BigDecimal.valueOf(200), "pay expert in full", "admin-1");

        assertEquals(ProjectStatus.COMPLETED, project.getStatus());
    }
}
