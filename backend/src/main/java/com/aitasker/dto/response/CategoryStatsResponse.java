package com.aitasker.dto.response;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class CategoryStatsResponse {
    private long totalCategories;
    private long activeCategories;
    private long totalServices;
    private long totalJobs;
}
