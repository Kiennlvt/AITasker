package com.aitasker.service;

import com.aitasker.dto.request.CreateReviewRequest;
import com.aitasker.dto.response.ReviewResponse;

public interface ReviewService {
    ReviewResponse createReview(String giverId, CreateReviewRequest request);
    boolean hasReviewed(String giverId, String projectId);
}
