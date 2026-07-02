package com.aitasker.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicStatsResponse {
    private long completedProjectsCount;
    private long jobsPostedCount;
    private Double averageRating;
    private long reviewCount;
    private List<ReviewItemResponse> recentReviews;
}
