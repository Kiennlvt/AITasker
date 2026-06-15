package com.aitasker.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminStatsResponse {
    private long totalUsers;
    private long totalJobs;
    private long activeJobs;
    private long completedJobs;
}
