package com.aitasker.controller;

import com.aitasker.dto.response.*;
import com.aitasker.enums.*;
import com.aitasker.repository.*;
import com.aitasker.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final ProjectRepository projectRepo;
    private final JobPostRepository jobRepo;
    private final ProposalRepository proposalRepo;
    private final ProjectService projectService;

    @GetMapping("/client")
    @PreAuthorize("hasRole('CLIENT')")
    public ApiResponse<DashboardClientResponse> clientDashboard(@AuthenticationPrincipal UserDetails user) {
        String uid = user.getUsername();
        DashboardClientResponse response = DashboardClientResponse.builder()
                .activeJobs(jobRepo.countByClientIdAndStatus(uid, JobStatus.IN_PROGRESS))
                .pendingProposals(projectRepo.countByClientIdAndStatus(uid, ProjectStatus.PENDING))
                .totalSpend(0.0) // TODO: sum from payments
                .recentProjects(projectService.getMyProjects(uid).stream().limit(5).toList())
                .build();
        return ApiResponse.ok(response);
    }

    @GetMapping("/expert")
    @PreAuthorize("hasRole('EXPERT')")
    public ApiResponse<DashboardExpertResponse> expertDashboard(@AuthenticationPrincipal UserDetails user) {
        String uid = user.getUsername();
        DashboardExpertResponse response = DashboardExpertResponse.builder()
                .activeProjects(projectRepo.countByExpertIdAndStatus(uid, ProjectStatus.ACTIVE))
                .pendingProposals(proposalRepo.countByExpertIdAndStatus(uid, ProposalStatus.PENDING))
                .totalEarnings(0.0) // TODO: sum from payments
                .recentProjects(projectService.getMyProjects(uid).stream().limit(5).toList())
                .build();
        return ApiResponse.ok(response);
    }
}
