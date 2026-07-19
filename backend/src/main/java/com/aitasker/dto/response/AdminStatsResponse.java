package com.aitasker.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AdminStatsResponse {
    private long totalUsers;
    private long expertCount;
    private long clientCount;
    private long activeUsers;
    private long bannedUsers;

    private long totalJobs;
    private long activeJobs;
    private long completedJobs;
    private double avgProposals;

    private double totalBudget;
    private double totalEarnings;

    private List<CategoryStatResponse> categoryData;
    private List<MonthlyRevenueResponse> revenueData;
}
