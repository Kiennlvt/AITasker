package com.aitasker.controller;

import com.aitasker.dto.response.ApiResponse;
import com.aitasker.dto.response.GeneratePrdResponse;
import com.aitasker.dto.response.ProposalInsightsResponse;
import com.aitasker.dto.response.SuggestExpertsResponse;
import com.aitasker.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    public record AiJobRequest(
            String title,
            String category,
            String timelineAmount,
            String timelineUnit,
            String description,
            String selectedPackage
    ) {}

    @PostMapping("/generate-prd")
    @PreAuthorize("hasRole('CLIENT')")
    public ApiResponse<GeneratePrdResponse> generatePrd(@RequestBody AiJobRequest req) {
        return ApiResponse.ok(aiService.generatePRD(
                req.title(), req.category(), req.timelineAmount(),
                req.timelineUnit(), req.description(), req.selectedPackage()
        ));
    }

    @PostMapping("/suggest-experts")
    @PreAuthorize("hasRole('CLIENT')")
    public ApiResponse<SuggestExpertsResponse> suggestExperts(@RequestBody AiJobRequest req) {
        return ApiResponse.ok(aiService.suggestExperts(req.title(), req.category(), req.description()));
    }

    @GetMapping("/proposal-insights/{jobId}")
    @PreAuthorize("hasRole('CLIENT')")
    public ApiResponse<ProposalInsightsResponse> proposalInsights(@AuthenticationPrincipal UserDetails user,
                                                                    @PathVariable String jobId) {
        return ApiResponse.ok(aiService.analyzeProposals(user.getUsername(), jobId));
    }
}
