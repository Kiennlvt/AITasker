package com.aitasker.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data @Builder
public class CategoryResponse {
    private String id;
    private String name;
    private String description;
    @JsonProperty("isActive")
    private boolean isActive;
    private LocalDateTime createdAt;
    private long serviceCount;
    private long jobCount;
}
