package com.aitasker.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data @Builder
public class DashboardClientResponse {
    private long activeJobs;
    private long pendingProposals;
    private Double totalSpend;
    private List<ProjectResponse> recentProjects;
}
