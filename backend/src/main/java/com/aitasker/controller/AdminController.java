package com.aitasker.controller;

import com.aitasker.dto.response.AdminStatsResponse;
import com.aitasker.dto.response.ApiResponse;
import com.aitasker.dto.response.JobResponse;
import com.aitasker.dto.response.UserResponse;
import com.aitasker.entity.JobPost;
import com.aitasker.entity.User;
import com.aitasker.enums.JobStatus;
import com.aitasker.enums.UserRole;
import com.aitasker.exception.AppException;
import com.aitasker.repository.JobPostRepository;
import com.aitasker.repository.ProposalRepository;
import com.aitasker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepo;
    private final JobPostRepository jobRepo;
    private final ProposalRepository proposalRepo;

    // ── Users ──────────────────────────────────────────────────────────────

    @GetMapping("/users")
    public ApiResponse<List<UserResponse>> getAllUsers(
            @RequestParam(required = false) String role) {
        List<User> users = (role != null && !role.equals("ALL"))
                ? userRepo.findByRole(UserRole.valueOf(role))
                : userRepo.findAll();
        return ApiResponse.ok(users.stream().map(this::toUserResponse).toList());
    }

    @PatchMapping("/users/{id}/toggle-status")
    public ApiResponse<UserResponse> toggleUserStatus(@PathVariable String id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> AppException.notFound("User not found"));
        user.setActive(!user.isActive());
        return ApiResponse.ok(toUserResponse(userRepo.save(user)));
    }

    // ── Jobs ───────────────────────────────────────────────────────────────

    @GetMapping("/jobs")
    public ApiResponse<Page<JobResponse>> getAllJobs(
            @RequestParam(required = false) String status,
            Pageable pageable) {
        Page<JobPost> jobs = (status != null && !status.equals("ALL"))
                ? jobRepo.findByStatus(JobStatus.valueOf(status), pageable)
                : jobRepo.findAll(pageable);
        return ApiResponse.ok(jobs.map(this::toJobResponse));
    }

    @PatchMapping("/jobs/{id}/approve")
    public ApiResponse<JobResponse> approveJob(@PathVariable String id) {
        JobPost job = jobRepo.findById(id)
                .orElseThrow(() -> AppException.notFound("Job not found"));
        job.setStatus(JobStatus.OPEN);
        return ApiResponse.ok(toJobResponse(jobRepo.save(job)));
    }

    @PatchMapping("/jobs/{id}/reject")
    public ApiResponse<JobResponse> rejectJob(@PathVariable String id) {
        JobPost job = jobRepo.findById(id)
                .orElseThrow(() -> AppException.notFound("Job not found"));
        job.setStatus(JobStatus.CANCELLED);
        return ApiResponse.ok(toJobResponse(jobRepo.save(job)));
    }

    // ── Stats ──────────────────────────────────────────────────────────────

    @GetMapping("/stats")
    public ApiResponse<AdminStatsResponse> getStats() {
        return ApiResponse.ok(AdminStatsResponse.builder()
                .totalUsers(userRepo.count())
                .totalJobs(jobRepo.count())
                .activeJobs(jobRepo.countByStatus(JobStatus.IN_PROGRESS))
                .completedJobs(jobRepo.countByStatus(JobStatus.COMPLETED))
                .build());
    }

    // ── Mappers ────────────────────────────────────────────────────────────

    private UserResponse toUserResponse(User u) {
        return UserResponse.builder()
                .id(u.getId())
                .email(u.getEmail())
                .fullName(u.getFullName())
                .role(u.getRole())
                .avatarUrl(u.getAvatarUrl())
                .bio(u.getBio())
                .location(u.getLocation())
                .hourlyRate(u.getHourlyRate())
                .skills(u.getSkills())
                .isVerified(u.isVerified())
                .isActive(u.isActive())
                .createdAt(u.getCreatedAt())
                .build();
    }

    private JobResponse toJobResponse(JobPost job) {
        return JobResponse.builder()
                .id(job.getId())
                .clientId(job.getClient().getId())
                .clientName(job.getClient().getFullName())
                .clientAvatarUrl(job.getClient().getAvatarUrl())
                .title(job.getTitle())
                .description(job.getDescription())
                .budget(job.getBudget())
                .deadline(job.getDeadline())
                .skills(job.getSkills())
                .status(job.getStatus())
                .proposalCount(proposalRepo.countByJobId(job.getId()))
                .createdAt(job.getCreatedAt())
                .build();
    }
}
