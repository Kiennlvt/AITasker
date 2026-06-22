package com.aitasker.service.impl;

import com.aitasker.dto.response.AdminStatsResponse;
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
import com.aitasker.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepo;
    private final JobPostRepository jobRepo;
    private final ProposalRepository proposalRepo;

    @Override
    public List<UserResponse> getAllUsers(String role) {
        List<User> users = (role != null && !role.equals("ALL"))
                ? userRepo.findByRole(UserRole.valueOf(role))
                : userRepo.findAll();
        return users.stream().map(this::toUserResponse).toList();
    }

    @Override
    public UserResponse toggleUserStatus(String id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> AppException.notFound("User not found"));
        user.setActive(!user.isActive());
        return toUserResponse(userRepo.save(user));
    }

    @Override
    public Page<JobResponse> getAllJobs(String status, Pageable pageable) {
        Page<JobPost> jobs = (status != null && !status.equals("ALL"))
                ? jobRepo.findByStatus(JobStatus.valueOf(status), pageable)
                : jobRepo.findAll(pageable);
        return jobs.map(this::toJobResponse);
    }

    @Override
    public JobResponse approveJob(String id) {
        JobPost job = jobRepo.findById(id)
                .orElseThrow(() -> AppException.notFound("Job not found"));
        job.setStatus(JobStatus.OPEN);
        return toJobResponse(jobRepo.save(job));
    }

    @Override
    public JobResponse rejectJob(String id) {
        JobPost job = jobRepo.findById(id)
                .orElseThrow(() -> AppException.notFound("Job not found"));
        job.setStatus(JobStatus.CANCELLED);
        return toJobResponse(jobRepo.save(job));
    }

    @Override
    public AdminStatsResponse getStats() {
        return AdminStatsResponse.builder()
                .totalUsers(userRepo.count())
                .totalJobs(jobRepo.count())
                .activeJobs(jobRepo.countByStatus(JobStatus.IN_PROGRESS))
                .completedJobs(jobRepo.countByStatus(JobStatus.COMPLETED))
                .build();
    }

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
