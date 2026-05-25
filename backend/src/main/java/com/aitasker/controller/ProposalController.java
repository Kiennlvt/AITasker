package com.aitasker.controller;

import com.aitasker.dto.request.SubmitProposalRequest;
import com.aitasker.dto.response.ApiResponse;
import com.aitasker.dto.response.ProposalResponse;
import com.aitasker.entity.JobPost;
import com.aitasker.entity.User;
import com.aitasker.enums.UserRole;
import com.aitasker.exception.AppException;
import com.aitasker.repository.JobPostRepository;
import com.aitasker.repository.UserRepository;
import com.aitasker.service.ProposalService;
import jakarta.validation.Valid;
import lombok.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/proposals")
@RequiredArgsConstructor
public class ProposalController {

    private final ProposalService proposalService;
    private final JobPostRepository jobRepo;
    private final UserRepository userRepo;

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('CLIENT')")
    public ApiResponse<List<ProposalResponse>> getProposalsByJob(@AuthenticationPrincipal UserDetails user,
                                                                  @PathVariable String jobId) {
        return ApiResponse.ok(proposalService.getProposalsByJob(user.getUsername(), jobId));
    }

    @GetMapping("/my-proposals")
    @PreAuthorize("hasRole('EXPERT')")
    public ApiResponse<List<ProposalResponse>> getMyProposals(@AuthenticationPrincipal UserDetails user) {
        return ApiResponse.ok(proposalService.getMyProposals(user.getUsername()));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('EXPERT')")
    public ApiResponse<ProposalResponse> submitProposal(@AuthenticationPrincipal UserDetails user,
                                                         @Valid @RequestBody SubmitProposalRequest request) {
        return ApiResponse.ok(proposalService.submitProposal(user.getUsername(), request));
    }

    @PatchMapping("/{id}/accept")
    @PreAuthorize("hasRole('CLIENT')")
    public ApiResponse<ProposalResponse> acceptProposal(@AuthenticationPrincipal UserDetails user,
                                                         @PathVariable String id) {
        return ApiResponse.ok(proposalService.acceptProposal(user.getUsername(), id));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasRole('CLIENT')")
    public ApiResponse<ProposalResponse> rejectProposal(@AuthenticationPrincipal UserDetails user,
                                                         @PathVariable String id) {
        return ApiResponse.ok(proposalService.rejectProposal(user.getUsername(), id));
    }

    @PatchMapping("/{id}/withdraw")
    @PreAuthorize("hasRole('EXPERT')")
    public ApiResponse<ProposalResponse> withdrawProposal(@AuthenticationPrincipal UserDetails user,
                                                           @PathVariable String id) {
        return ApiResponse.ok(proposalService.withdrawProposal(user.getUsername(), id));
    }

    @GetMapping("/{id}")
    public ApiResponse<ProposalResponse> getProposal(@PathVariable String id) {
        return ApiResponse.ok(proposalService.getProposalById(id));
    }

    @GetMapping("/recommend/{jobId}")
    @PreAuthorize("hasRole('CLIENT')")
    public ApiResponse<List<ExpertMatchDto>> recommendExperts(@PathVariable String jobId) {
        JobPost job = jobRepo.findById(jobId)
                .orElseThrow(() -> AppException.notFound("Job not found"));
        List<String> jobSkills = job.getSkills() != null ? job.getSkills() : List.of();
        if (jobSkills.isEmpty()) return ApiResponse.ok(List.of());

        List<User> experts = userRepo.findByRole(UserRole.EXPERT);
        List<ExpertMatchDto> result = new ArrayList<>();
        for (User expert : experts) {
            List<String> expertSkills = expert.getSkills() != null ? expert.getSkills() : List.of();
            List<String> matched = jobSkills.stream()
                    .filter(s -> expertSkills.stream().anyMatch(es -> es.equalsIgnoreCase(s)))
                    .toList();
            if (!matched.isEmpty()) {
                int score = (int) (matched.size() * 100.0 / jobSkills.size());
                result.add(new ExpertMatchDto(expert.getId(), expert.getFullName(), score, matched));
            }
        }
        result.sort((a, b) -> b.matchScore() - a.matchScore());
        return ApiResponse.ok(result);
    }

    public record ExpertMatchDto(String expertId, String expertName, int matchScore, List<String> matchedSkills) {}
}
