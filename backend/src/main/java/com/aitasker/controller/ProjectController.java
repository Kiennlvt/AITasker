package com.aitasker.controller;

import com.aitasker.dto.request.CreateMilestoneRequest;
import com.aitasker.dto.response.ApiResponse;
import com.aitasker.dto.response.MilestoneResponse;
import com.aitasker.dto.response.ProjectResponse;
import com.aitasker.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ApiResponse<List<ProjectResponse>> getMyProjects(@AuthenticationPrincipal UserDetails user) {
        return ApiResponse.ok(projectService.getMyProjects(user.getUsername()));
    }

    @GetMapping("/{id}")
    public ApiResponse<ProjectResponse> getProject(@AuthenticationPrincipal UserDetails user,
                                                    @PathVariable String id) {
        return ApiResponse.ok(projectService.getProjectById(user.getUsername(), id));
    }

    @PatchMapping("/{projectId}/finish")
    @PreAuthorize("hasRole('CLIENT')")
    public ApiResponse<ProjectResponse> finishProject(@AuthenticationPrincipal UserDetails user,
                                                       @PathVariable String projectId) {
        return ApiResponse.ok(projectService.finishProject(user.getUsername(), projectId));
    }

    @PatchMapping("/milestones/{milestoneId}/approve")
    public ApiResponse<ProjectResponse> approveDeliverable(@AuthenticationPrincipal UserDetails user,
                                                            @PathVariable String milestoneId) {
        return ApiResponse.ok(projectService.approveDeliverable(user.getUsername(), milestoneId));
    }

    @PatchMapping("/milestones/{milestoneId}/revision")
    public ApiResponse<ProjectResponse> requestRevision(@AuthenticationPrincipal UserDetails user,
                                                         @PathVariable String milestoneId,
                                                         @RequestParam String note,
                                                         @RequestParam LocalDate revisionDueDate) {
        return ApiResponse.ok(projectService.requestRevision(user.getUsername(), milestoneId, note, revisionDueDate));
    }

    @PatchMapping("/milestones/{milestoneId}/submit")
    public ApiResponse<ProjectResponse> submitDeliverable(@AuthenticationPrincipal UserDetails user,
                                                           @PathVariable String milestoneId,
                                                           @RequestParam String note) {
        return ApiResponse.ok(projectService.submitDeliverable(user.getUsername(), milestoneId, note));
    }

    @PostMapping("/{projectId}/milestones")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('EXPERT')")
    public ApiResponse<MilestoneResponse> createMilestone(@AuthenticationPrincipal UserDetails user,
                                                            @PathVariable String projectId,
                                                            @Valid @RequestBody CreateMilestoneRequest request) {
        return ApiResponse.ok(projectService.createMilestone(user.getUsername(), projectId, request));
    }

    @PutMapping("/{projectId}/milestones/{milestoneId}")
    @PreAuthorize("hasRole('EXPERT')")
    public ApiResponse<MilestoneResponse> updateMilestone(@AuthenticationPrincipal UserDetails user,
                                                           @PathVariable String projectId,
                                                           @PathVariable String milestoneId,
                                                           @Valid @RequestBody CreateMilestoneRequest request) {
        return ApiResponse.ok(projectService.updateMilestone(user.getUsername(), milestoneId, request));
    }

    @GetMapping("/{projectId}/milestones")
    public ApiResponse<List<MilestoneResponse>> getMilestones(@AuthenticationPrincipal UserDetails user,
                                                               @PathVariable String projectId) {
        return ApiResponse.ok(projectService.getMilestones(user.getUsername(), projectId));
    }

    @PostMapping("/milestones/{milestoneId}/files")
    @PreAuthorize("hasRole('EXPERT')")
    public ApiResponse<List<String>> uploadFiles(@AuthenticationPrincipal UserDetails user,
                                                  @PathVariable String milestoneId,
                                                  @RequestParam("files") List<MultipartFile> files) {
        return ApiResponse.ok(projectService.uploadMilestoneFiles(user.getUsername(), milestoneId, files));
    }
}
