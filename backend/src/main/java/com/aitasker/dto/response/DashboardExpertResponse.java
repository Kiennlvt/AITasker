package com.aitasker.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data @Builder
public class DashboardExpertResponse {
    private long activeProjects;
    private long pendingProposals;
    private Double totalEarnings;
    private Double averageRating;
    private long reviewCount;
    private List<ProjectResponse> recentProjects;
}
