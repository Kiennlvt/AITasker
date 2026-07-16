package com.aitasker.dto.response;

import com.aitasker.enums.ProjectStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data @Builder
public class ProjectResponse {
    private String id;
    private String jobTitle;
    private String jobDescription;
    private String clientId;
    private String clientName;
    private String expertId;
    private String expertName;
    private String expertAvatarUrl;
    private ProjectStatus status;
    private Double totalBudget;
    private int progress; // 0-100 %
    private List<MilestoneResponse> milestones;
    private LocalDateTime createdAt;
    private String escrowStatus;
    private LocalDateTime cancellationRequestedAt;
    private LocalDateTime cancellationDeadline;
    private boolean cancellationEligible;
}
