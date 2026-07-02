package com.aitasker.controller;

import com.aitasker.dto.request.UpdateUserRequest;
import com.aitasker.dto.response.ApiResponse;
import com.aitasker.dto.response.PublicStatsResponse;
import com.aitasker.dto.response.ReviewItemResponse;
import com.aitasker.dto.response.UserResponse;
import com.aitasker.entity.Review;
import com.aitasker.entity.User;
import com.aitasker.enums.JobStatus;
import com.aitasker.enums.ProjectStatus;
import com.aitasker.enums.UserRole;
import com.aitasker.exception.AppException;
import com.aitasker.repository.JobPostRepository;
import com.aitasker.repository.ProjectRepository;
import com.aitasker.repository.ReviewRepository;
import com.aitasker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepo;
    private final ProjectRepository projectRepo;
    private final JobPostRepository jobPostRepo;
    private final ReviewRepository reviewRepo;

    @GetMapping("/me")
    public ApiResponse<UserResponse> getMe(@AuthenticationPrincipal UserDetails user) {
        User u = userRepo.findById(user.getUsername())
                .orElseThrow(() -> AppException.notFound("User not found"));
        return ApiResponse.ok(toResponse(u));
    }

    @PutMapping("/me")
    public ApiResponse<UserResponse> updateMe(@AuthenticationPrincipal UserDetails user,
                                               @RequestBody UpdateUserRequest request) {
        User u = userRepo.findById(user.getUsername())
                .orElseThrow(() -> AppException.notFound("User not found"));
        if (request.getFullName() != null) u.setFullName(request.getFullName());
        if (request.getBio() != null) u.setBio(request.getBio());
        if (request.getLocation() != null) u.setLocation(request.getLocation());
        if (request.getHourlyRate() != null) u.setHourlyRate(request.getHourlyRate());
        if (request.getSkills() != null) u.setSkills(request.getSkills());
        if (request.getAvatarUrl() != null) u.setAvatarUrl(request.getAvatarUrl());
        return ApiResponse.ok("Profile updated", toResponse(userRepo.save(u)));
    }

    @GetMapping("/{id}")
    public ApiResponse<UserResponse> getUserById(@PathVariable String id) {
        User u = userRepo.findById(id)
                .orElseThrow(() -> AppException.notFound("User not found"));
        return ApiResponse.ok(toResponse(u));
    }

    @GetMapping("/{id}/stats")
    public ApiResponse<PublicStatsResponse> getPublicStats(@PathVariable String id) {
        User u = userRepo.findById(id)
                .orElseThrow(() -> AppException.notFound("User not found"));

        long completedProjectsCount = u.getRole() == UserRole.EXPERT
                ? projectRepo.countByExpertIdAndStatus(id, ProjectStatus.COMPLETED)
                : projectRepo.countByClientIdAndStatus(id, ProjectStatus.COMPLETED);

        long jobsPostedCount = u.getRole() == UserRole.CLIENT
                ? jobPostRepo.countByClientIdAndStatus(id, JobStatus.OPEN)
                  + jobPostRepo.countByClientIdAndStatus(id, JobStatus.IN_PROGRESS)
                  + jobPostRepo.countByClientIdAndStatus(id, JobStatus.COMPLETED)
                : 0;

        List<Review> reviews = reviewRepo.findByReceiverIdOrderByCreatedAtDesc(id);
        double averageRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        List<ReviewItemResponse> recentReviews = reviews.stream()
                .limit(5)
                .map(r -> ReviewItemResponse.builder()
                        .giverName(r.getGiver().getFullName())
                        .giverAvatarUrl(r.getGiver().getAvatarUrl())
                        .rating(r.getRating())
                        .comment(r.getComment())
                        .createdAt(r.getCreatedAt())
                        .build())
                .toList();

        return ApiResponse.ok(PublicStatsResponse.builder()
                .completedProjectsCount(completedProjectsCount)
                .jobsPostedCount(jobsPostedCount)
                .averageRating(reviews.isEmpty() ? null : averageRating)
                .reviewCount(reviews.size())
                .recentReviews(recentReviews)
                .build());
    }

    private UserResponse toResponse(User u) {
        return UserResponse.builder()
                .id(u.getId())
                .email(u.getEmail())
                .fullName(u.getFullName())
                .role(u.getRole())
                .avatarUrl(u.getAvatarUrl())
                .bio(u.getBio())
                .location(u.getLocation())
                .hourlyRate(u.getHourlyRate())
                .skills(u.getSkills())
                .isVerified(u.isVerified())
                .createdAt(u.getCreatedAt())
                .build();
    }
}
