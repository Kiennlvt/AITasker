package com.aitasker.controller;

import com.aitasker.dto.request.CreateDisputeRequest;
import com.aitasker.dto.request.RespondDisputeRequest;
import com.aitasker.dto.response.ApiResponse;
import com.aitasker.dto.response.DisputeResponse;
import com.aitasker.service.DisputeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/disputes")
@RequiredArgsConstructor
public class DisputeController {

    private final DisputeService disputeService;

    @PostMapping("/milestones/{milestoneId}")
    public ApiResponse<DisputeResponse> fileDispute(@AuthenticationPrincipal UserDetails user,
                                                      @PathVariable String milestoneId,
                                                      @Valid @RequestBody CreateDisputeRequest request) {
        return ApiResponse.ok(disputeService.fileDispute(user.getUsername(), milestoneId, request.getReason()));
    }

    @PostMapping("/{disputeId}/evidence")
    public ApiResponse<DisputeResponse> addEvidence(@AuthenticationPrincipal UserDetails user,
                                                      @PathVariable String disputeId,
                                                      @RequestParam("files") List<MultipartFile> files) {
        return ApiResponse.ok(disputeService.addEvidence(user.getUsername(), disputeId, files));
    }

    @PostMapping("/{disputeId}/respond")
    public ApiResponse<DisputeResponse> respondToDispute(@AuthenticationPrincipal UserDetails user,
                                                           @PathVariable String disputeId,
                                                           @Valid @RequestBody RespondDisputeRequest request) {
        return ApiResponse.ok(disputeService.respondToDispute(user.getUsername(), disputeId, request.getResponse()));
    }

    @GetMapping("/{disputeId}")
    public ApiResponse<DisputeResponse> getDispute(@AuthenticationPrincipal UserDetails user,
                                                     @PathVariable String disputeId) {
        return ApiResponse.ok(disputeService.getDispute(user.getUsername(), disputeId));
    }

    @GetMapping("/project/{projectId}")
    public ApiResponse<List<DisputeResponse>> getDisputesForProject(@AuthenticationPrincipal UserDetails user,
                                                                       @PathVariable String projectId) {
        return ApiResponse.ok(disputeService.getDisputesForProject(user.getUsername(), projectId));
    }
}
