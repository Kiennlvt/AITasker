package com.aitasker.dto.response;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class TopExpertResponse {
    private String id;
    private String name;
    private String avatarUrl;
    private String role;
    private double rating;
    private long tasksCompleted;
}
