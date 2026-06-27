package com.aitasker.controller;

import com.aitasker.dto.request.CreateJobRequest;
import com.aitasker.dto.response.ApiResponse;
import com.aitasker.dto.response.JobResponse;
import com.aitasker.dto.response.JobSuggestionDto;
import com.aitasker.service.JobService;
import jakarta.validation.Valid;
import lombok.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @GetMapping
    public ApiResponse<Page<JobResponse>> getAllJobs(Pageable pageable) {
        return ApiResponse.ok(jobService.getAllOpenJobs(pageable));
    }

    @GetMapping("/{id}")
    public ApiResponse<JobResponse> getJob(@PathVariable String id) {
        return ApiResponse.ok(jobService.getJobById(id));
    }

    @GetMapping("/my-jobs")
    @PreAuthorize("hasRole('CLIENT')")
    public ApiResponse<List<JobResponse>> getMyJobs(@AuthenticationPrincipal UserDetails user) {
        return ApiResponse.ok(jobService.getMyJobs(user.getUsername()));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('CLIENT')")
    public ApiResponse<JobResponse> createJob(@AuthenticationPrincipal UserDetails user,
                                              @Valid @RequestBody CreateJobRequest request) {
        return ApiResponse.ok(jobService.createJob(user.getUsername(), request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CLIENT')")
    public ApiResponse<JobResponse> updateJob(@AuthenticationPrincipal UserDetails user,
                                              @PathVariable String id,
                                              @Valid @RequestBody CreateJobRequest request) {
        return ApiResponse.ok(jobService.updateJob(user.getUsername(), id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CLIENT')")
    public ApiResponse<Void> deleteJob(@AuthenticationPrincipal UserDetails user,
                                       @PathVariable String id) {
        jobService.deleteJob(user.getUsername(), id);
        return ApiResponse.ok("Job deleted", null);
    }

    @PatchMapping("/{id}/close")
    @PreAuthorize("hasRole('CLIENT')")
    public ApiResponse<JobResponse> closeJob(@AuthenticationPrincipal UserDetails user,
                                              @PathVariable String id) {
        return ApiResponse.ok(jobService.closeJob(user.getUsername(), id));
    }

    @GetMapping("/my-drafts")
    @PreAuthorize("hasRole('CLIENT')")
    public ApiResponse<List<JobResponse>> getMyDrafts(@AuthenticationPrincipal UserDetails user) {
        return ApiResponse.ok(jobService.getMyDrafts(user.getUsername()));
    }

    @PatchMapping("/{id}/publish")
    @PreAuthorize("hasRole('CLIENT')")
    public ApiResponse<JobResponse> publishDraft(@AuthenticationPrincipal UserDetails user,
                                                  @PathVariable String id) {
        return ApiResponse.ok(jobService.publishDraft(user.getUsername(), id));
    }

    @PostMapping("/ai-suggest")
    @PreAuthorize("hasRole('CLIENT')")
    public ApiResponse<JobSuggestionDto> aiSuggest(@RequestBody AiSuggestRequest request) {
        return ApiResponse.ok(jobService.suggestJobImprovement(request.title(), request.description()));
    }

    public record AiSuggestRequest(String title, String description) {}
}
