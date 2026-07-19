package com.aitasker.controller;

import com.aitasker.dto.request.ResolveDisputeRequest;
import com.aitasker.dto.response.AdminStatsResponse;
import com.aitasker.dto.response.ApiResponse;
import com.aitasker.dto.response.DisputeResponse;
import com.aitasker.dto.response.JobResponse;
import com.aitasker.dto.response.UserResponse;
import com.aitasker.service.DisputeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.aitasker.service.AdminRepository;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminRepository adminService;
    private final DisputeService disputeService;

    @GetMapping("/users")
    public ApiResponse<List<UserResponse>> getAllUsers(
            @RequestParam(required = false) String role) {
        return ApiResponse.ok(adminService.getAllUsers(role));
    }

    @PatchMapping("/users/{id}/toggle-status")
    public ApiResponse<UserResponse> toggleUserStatus(@PathVariable String id) {
        return ApiResponse.ok(adminService.toggleUserStatus(id));
    }

    @GetMapping("/jobs")
    public ApiResponse<Page<JobResponse>> getAllJobs(
            @RequestParam(required = false) String status,
            Pageable pageable) {
        return ApiResponse.ok(adminService.getAllJobs(status, pageable));
    }

    @PatchMapping("/jobs/{id}/approve")
    public ApiResponse<JobResponse> approveJob(@PathVariable String id) {
        return ApiResponse.ok(adminService.approveJob(id));
    }

    @PatchMapping("/jobs/{id}/reject")
    public ApiResponse<JobResponse> rejectJob(@PathVariable String id) {
        return ApiResponse.ok(adminService.rejectJob(id));
    }

    @GetMapping("/stats")
    public ApiResponse<AdminStatsResponse> getStats() {
        return ApiResponse.ok(adminService.getStats());
    }

    @GetMapping("/disputes")
    public ApiResponse<List<DisputeResponse>> getAllDisputes(
            @RequestParam(required = false, defaultValue = "ALL") String status) {
        return ApiResponse.ok(disputeService.getAllDisputes(status));
    }

    @GetMapping("/disputes/{id}")
    public ApiResponse<DisputeResponse> getDispute(@AuthenticationPrincipal UserDetails user,
                                                     @PathVariable String id) {
        return ApiResponse.ok(disputeService.getDispute(user.getUsername(), id));
    }

    @PostMapping("/disputes/{id}/resolve")
    public ApiResponse<DisputeResponse> resolveDispute(@AuthenticationPrincipal UserDetails user,
                                                          @PathVariable String id,
                                                          @Valid @RequestBody ResolveDisputeRequest request) {
        return ApiResponse.ok(disputeService.resolveDispute(user.getUsername(), id,
                request.getClientAmount(), request.getExpertAmount(), request.getResolutionNote()));
    }
}
