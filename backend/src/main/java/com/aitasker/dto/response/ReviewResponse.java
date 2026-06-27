package com.aitasker.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data @Builder
public class ReviewResponse {
    private String id;
    private String giverId;
    private String giverName;
    private String giverAvatarUrl;
    private String receiverId;
    private String receiverName;
    private String projectId;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}
