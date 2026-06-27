package com.aitasker.controller;

import com.aitasker.dto.response.ApiResponse;
import com.aitasker.dto.response.JobResponse;
import com.aitasker.entity.JobPost;
import com.aitasker.entity.SavedJob;
import com.aitasker.entity.User;
import com.aitasker.exception.AppException;
import com.aitasker.repository.JobPostRepository;
import com.aitasker.repository.SavedJobRepository;
import com.aitasker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/saved-jobs")
@RequiredArgsConstructor
public class SavedJobController {

    private final SavedJobRepository savedJobRepo;
    private final JobPostRepository jobPostRepo;
    private final UserRepository userRepo;

    @GetMapping
    public ApiResponse<List<JobResponse>> getSavedJobs(@AuthenticationPrincipal UserDetails userDetails) {
        return ApiResponse.ok(
                savedJobRepo.findByUserIdOrderBySavedAtDesc(userDetails.getUsername())
                        .stream()
                        .map(sj -> toResponse(sj.getJob()))
                        .toList()
        );
    }

    @GetMapping("/{jobId}/check")
    public ApiResponse<Map<String, Boolean>> checkSaved(@AuthenticationPrincipal UserDetails userDetails,
                                                        @PathVariable String jobId) {
        boolean saved = savedJobRepo.existsByUserIdAndJobId(userDetails.getUsername(), jobId);
        return ApiResponse.ok(Map.of("saved", saved));
    }

    @PostMapping("/{jobId}")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<Map<String, Boolean>> saveJob(@AuthenticationPrincipal UserDetails userDetails,
                                                     @PathVariable String jobId) {
        String userId = userDetails.getUsername();
        if (savedJobRepo.existsByUserIdAndJobId(userId, jobId)) {
            return ApiResponse.ok(Map.of("saved", true));
        }
        User user = userRepo.findById(userId)
                .orElseThrow(() -> AppException.notFound("User not found"));
        JobPost job = jobPostRepo.findById(jobId)
                .orElseThrow(() -> AppException.notFound("Job not found"));

        savedJobRepo.save(SavedJob.builder().user(user).job(job).build());
        return ApiResponse.ok(Map.of("saved", true));
    }

    @DeleteMapping("/{jobId}")
    public ApiResponse<Map<String, Boolean>> unsaveJob(@AuthenticationPrincipal UserDetails userDetails,
                                                       @PathVariable String jobId) {
        String userId = userDetails.getUsername();
        savedJobRepo.findByUserIdAndJobId(userId, jobId)
                .ifPresent(savedJobRepo::delete);
        return ApiResponse.ok(Map.of("saved", false));
    }

    private JobResponse toResponse(JobPost j) {
        return JobResponse.builder()
                .id(j.getId())
                .clientId(j.getClient().getId())
                .clientName(j.getClient().getFullName())
                .clientAvatarUrl(j.getClient().getAvatarUrl())
                .title(j.getTitle())
                .description(j.getDescription())
                .budget(j.getBudget())
                .deadline(j.getDeadline())
                .skills(j.getSkills())
                .status(j.getStatus())
                .createdAt(j.getCreatedAt())
                .build();
    }
}
