package com.aitasker.service.impl;

import com.aitasker.dto.request.CreateReviewRequest;
import com.aitasker.dto.response.ReviewResponse;
import com.aitasker.entity.Project;
import com.aitasker.entity.Review;
import com.aitasker.entity.User;
import com.aitasker.enums.ProjectStatus;
import com.aitasker.exception.AppException;
import com.aitasker.repository.ProjectRepository;
import com.aitasker.repository.ReviewRepository;
import com.aitasker.repository.UserRepository;
import com.aitasker.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepo;
    private final ProjectRepository projectRepo;
    private final UserRepository userRepo;

    @Override
    public ReviewResponse createReview(String giverId, CreateReviewRequest request) {
        Project project = projectRepo.findById(request.getProjectId())
                .orElseThrow(() -> AppException.notFound("Project not found"));

        if (project.getStatus() != ProjectStatus.COMPLETED)
            throw AppException.badRequest("Can only review a completed project");

        if (!project.getClient().getId().equals(giverId))
            throw AppException.forbidden("Only the project client can leave a review");

        if (reviewRepo.existsByGiverIdAndProjectId(giverId, request.getProjectId()))
            throw AppException.badRequest("You have already reviewed this project");

        User receiver = userRepo.findById(request.getReceiverId())
                .orElseThrow(() -> AppException.notFound("Receiver not found"));

        if (!receiver.getId().equals(project.getExpert().getId()))
            throw AppException.badRequest("Receiver must be the project expert");

        User giver = userRepo.findById(giverId)
                .orElseThrow(() -> AppException.notFound("Giver not found"));

        Review review = Review.builder()
                .giver(giver)
                .receiver(receiver)
                .project(project)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        Review saved = reviewRepo.save(review);
        return toResponse(saved);
    }

    @Override
    public boolean hasReviewed(String giverId, String projectId) {
        return reviewRepo.existsByGiverIdAndProjectId(giverId, projectId);
    }

    private ReviewResponse toResponse(Review r) {
        return ReviewResponse.builder()
                .id(r.getId())
                .giverId(r.getGiver().getId())
                .giverName(r.getGiver().getFullName())
                .giverAvatarUrl(r.getGiver().getAvatarUrl())
                .receiverId(r.getReceiver().getId())
                .receiverName(r.getReceiver().getFullName())
                .projectId(r.getProject().getId())
                .rating(r.getRating())
                .comment(r.getComment())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
