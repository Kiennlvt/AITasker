package com.aitasker.service.impl;

import com.aitasker.dto.response.AdminStatsResponse;
import com.aitasker.dto.response.CategoryStatResponse;
import com.aitasker.dto.response.JobResponse;
import com.aitasker.dto.response.MonthlyRevenueResponse;
import com.aitasker.dto.response.UserResponse;
import com.aitasker.entity.AuditLog;
import com.aitasker.entity.JobPost;
import com.aitasker.entity.User;
import com.aitasker.enums.JobStatus;
import com.aitasker.enums.UserRole;
import com.aitasker.exception.AppException;
import com.aitasker.repository.AuditLogRepository;
import com.aitasker.repository.JobPostRepository;
import com.aitasker.repository.ProposalRepository;
import com.aitasker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import com.aitasker.service.AdminRepository;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminRepository {

    private final UserRepository userRepo;
    private final JobPostRepository jobRepo;
    private final ProposalRepository proposalRepo;
    private final AuditLogRepository auditLogRepo;

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
        long totalJobs = jobRepo.count();
        long totalProposals = proposalRepo.count();

        return AdminStatsResponse.builder()
                .totalUsers(userRepo.count())
                .expertCount(userRepo.countByRole(UserRole.EXPERT))
                .clientCount(userRepo.countByRole(UserRole.CLIENT))
                .activeUsers(userRepo.countByIsActiveTrue())
                .bannedUsers(userRepo.countByIsActiveFalse())
                .totalJobs(totalJobs)
                .activeJobs(jobRepo.countByStatus(JobStatus.IN_PROGRESS))
                .completedJobs(jobRepo.countByStatus(JobStatus.COMPLETED))
                .avgProposals(totalJobs > 0 ? Math.round((totalProposals / (double) totalJobs) * 10) / 10.0 : 0)
                .totalBudget(jobRepo.sumAllBudget())
                .totalEarnings(auditLogRepo.sumAllReleasedAmount().doubleValue())
                .categoryData(buildCategoryData(totalJobs))
                .revenueData(buildRevenueData())
                .build();
    }

    private List<CategoryStatResponse> buildCategoryData(long totalJobs) {
        if (totalJobs == 0) {
            return List.of();
        }
        List<CategoryStatResponse> result = new ArrayList<>();
        for (Object[] row : jobRepo.countJobsGroupedByCategory()) {
            String category = (String) row[0];
            long count = (long) row[1];
            result.add(new CategoryStatResponse(category, Math.round(count * 100.0 / totalJobs)));
        }
        return result;
    }

    private List<MonthlyRevenueResponse> buildRevenueData() {
        int monthsBack = 5;
        YearMonth startMonth = YearMonth.now().minusMonths(monthsBack);
        LocalDateTime after = startMonth.atDay(1).atStartOfDay();

        Map<YearMonth, MonthlyRevenueResponse> byMonth = new LinkedHashMap<>();
        for (int i = 0; i <= monthsBack; i++) {
            YearMonth ym = startMonth.plusMonths(i);
            String label = ym.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            byMonth.put(ym, new MonthlyRevenueResponse(label, 0, 0));
        }

        for (JobPost job : jobRepo.findByCreatedAtAfterOrderByCreatedAtAsc(after)) {
            YearMonth ym = YearMonth.from(job.getCreatedAt());
            MonthlyRevenueResponse bucket = byMonth.get(ym);
            if (bucket != null) {
                bucket.setSpend(bucket.getSpend() + job.getBudget());
            }
        }

        for (AuditLog log : auditLogRepo.findByCreatedAtAfterOrderByCreatedAtAsc(after)) {
            YearMonth ym = YearMonth.from(log.getCreatedAt());
            MonthlyRevenueResponse bucket = byMonth.get(ym);
            if (bucket != null) {
                bucket.setEarnings(bucket.getEarnings() + log.getReleasedAmount().doubleValue());
            }
        }

        return new ArrayList<>(byMonth.values());
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
