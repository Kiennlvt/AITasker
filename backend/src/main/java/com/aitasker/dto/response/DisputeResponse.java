package com.aitasker.dto.response;

import com.aitasker.enums.DisputeStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder
public class DisputeResponse {
    private String id;
    private String projectId;
    private String jobTitle;
    private String milestoneId;
    private String milestoneTitle;
    private String filedById;
    private String filedByName;
    private String respondentId;
    private String respondentName;
    private String reason;
    private List<String> evidenceUrls;
    private String respondentResponse;
    private List<String> respondentEvidenceUrls;
    private BigDecimal amount;
    private DisputeStatus status;
    private BigDecimal clientAmount;
    private BigDecimal expertAmount;
    private String resolutionNote;
    private LocalDateTime resolvedAt;
    private LocalDateTime createdAt;
}
