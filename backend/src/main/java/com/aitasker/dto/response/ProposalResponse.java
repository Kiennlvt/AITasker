package com.aitasker.dto.response;

import com.aitasker.enums.ProposalStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data @Builder
public class ProposalResponse {
    private String id;
    private String jobId;
    private String jobTitle;
    private String expertId;
    private String expertName;
    private String expertAvatarUrl;
    private Double expertRating;
    private String coverLetter;
    private Double bidAmount;
    private Integer deliveryTime;
    private ProposalStatus status;
    private LocalDateTime createdAt;
}
