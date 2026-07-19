package com.aitasker.controller;

import com.aitasker.dto.response.*;
import com.aitasker.entity.AuditLog;
import com.aitasker.entity.Review;
import com.aitasker.entity.User;
import com.aitasker.enums.*;
import com.aitasker.repository.*;
import com.aitasker.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final ProjectRepository projectRepo;
    private final JobPostRepository jobRepo;
    private final ProposalRepository proposalRepo;
    private final ProjectService projectService;
    private final ReviewRepository reviewRepo;
    private final AuditLogRepository auditLogRepo;
    private final UserRepository userRepo;

    @GetMapping("/client")
    @PreAuthorize("hasRole('CLIENT')")
    public ApiResponse<DashboardClientResponse> clientDashboard(@AuthenticationPrincipal UserDetails user) {
        String uid = user.getUsername();
        DashboardClientResponse response = DashboardClientResponse.builder()
                .activeJobs(jobRepo.countByClientIdAndStatus(uid, JobStatus.IN_PROGRESS))
                .pendingProposals(proposalRepo.countByJob_Client_IdAndStatus(uid, ProposalStatus.PENDING))
                .totalSpend(auditLogRepo.sumReleasedAmountByClientId(uid).doubleValue())
                .recentProjects(projectService.getMyProjects(uid).stream().limit(5).toList())
                .build();
        return ApiResponse.ok(response);
    }

    @GetMapping("/client/top-experts")
    @PreAuthorize("hasRole('CLIENT')")
    public ApiResponse<List<TopExpertResponse>> topExperts() {
        return ApiResponse.ok(topRatedExperts());
    }

    @GetMapping("/expert")
    @PreAuthorize("hasRole('EXPERT')")
    public ApiResponse<DashboardExpertResponse> expertDashboard(@AuthenticationPrincipal UserDetails user) {
        String uid = user.getUsername();

        List<Review> reviews = reviewRepo.findByReceiverIdOrderByCreatedAtDesc(uid);
        double averageRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        DashboardExpertResponse response = DashboardExpertResponse.builder()
                .activeProjects(projectRepo.countByExpertIdAndStatus(uid, ProjectStatus.ACTIVE))
                .pendingProposals(proposalRepo.countByExpertIdAndStatus(uid, ProposalStatus.PENDING))
                .totalEarnings(auditLogRepo.sumReleasedAmountByExpertId(uid).doubleValue())
                .averageRating(reviews.isEmpty() ? null : averageRating)
                .reviewCount(reviews.size())
                .recentProjects(projectService.getMyProjects(uid).stream().limit(5).toList())
                .monthlyEarnings(monthlyEarnings(uid))
                .build();
        return ApiResponse.ok(response);
    }

    private List<MonthlyEarningResponse> monthlyEarnings(String expertId) {
        YearMonth currentMonth = YearMonth.now();
        YearMonth startMonth = currentMonth.minusMonths(5);

        Map<YearMonth, BigDecimal> totals = new LinkedHashMap<>();
        for (int i = 0; i < 6; i++) totals.put(startMonth.plusMonths(i), BigDecimal.ZERO);

        List<AuditLog> logs = auditLogRepo.findByExpertIdAndCreatedAtAfter(
                expertId, startMonth.atDay(1).atStartOfDay());
        for (AuditLog log : logs) {
            YearMonth month = YearMonth.from(log.getCreatedAt());
            totals.computeIfPresent(month, (m, sum) -> sum.add(log.getReleasedAmount()));
        }

        return totals.entrySet().stream()
                .map(e -> MonthlyEarningResponse.builder()
                        .name(e.getKey().getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH))
                        .earnings(e.getValue().doubleValue())
                        .build())
                .toList();
    }

    private List<TopExpertResponse> topRatedExperts() {
        List<ReviewRepository.ExpertRatingProjection> ratings =
                reviewRepo.findTopRatedExperts(PageRequest.of(0, 5));

        return ratings.stream()
                .map(r -> {
                    User expert = userRepo.findById(r.getExpertId()).orElse(null);
                    if (expert == null) return null;
                    long tasksCompleted = projectRepo.countByExpertIdAndStatus(expert.getId(), ProjectStatus.COMPLETED);
                    return TopExpertResponse.builder()
                            .id(expert.getId())
                            .name(expert.getFullName())
                            .avatarUrl(expert.getAvatarUrl())
                            .role(expertTitle(expert))
                            .rating(Math.round(r.getAvgRating() * 10) / 10.0)
                            .tasksCompleted(tasksCompleted)
                            .build();
                })
                .filter(Objects::nonNull)
                .toList();
    }

    private String expertTitle(User expert) {
        if (expert.getSkills() != null && !expert.getSkills().isEmpty()) {
            return expert.getSkills().get(0);
        }
        return "Expert";
    }
}
