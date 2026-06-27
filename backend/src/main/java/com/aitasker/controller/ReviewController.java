package com.aitasker.controller;

import com.aitasker.dto.request.CreateReviewRequest;
import com.aitasker.dto.response.ApiResponse;
import com.aitasker.dto.response.ReviewResponse;
import com.aitasker.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ReviewResponse> createReview(@AuthenticationPrincipal UserDetails user,
                                                     @Valid @RequestBody CreateReviewRequest request) {
        return ApiResponse.ok(reviewService.createReview(user.getUsername(), request));
    }

    @GetMapping("/project/{projectId}/mine")
    public ApiResponse<Boolean> hasReviewed(@AuthenticationPrincipal UserDetails user,
                                             @PathVariable String projectId) {
        return ApiResponse.ok(reviewService.hasReviewed(user.getUsername(), projectId));
    }
}
