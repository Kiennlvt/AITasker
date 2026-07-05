package com.aitasker.service.impl;

import com.aitasker.dto.request.SubmitProposalRequest;
import com.aitasker.dto.response.ProposalResponse;
import com.aitasker.entity.*;
import com.aitasker.enums.*;
import com.aitasker.exception.AppException;
import com.aitasker.repository.*;
import com.aitasker.service.ConversationService;
import com.aitasker.service.NotificationService;
import com.aitasker.service.ProposalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProposalServiceImpl implements ProposalService {

    private final ProposalRepository proposalRepo;
    private final JobPostRepository jobRepo;
    private final UserRepository userRepo;
    private final ProjectRepository projectRepo;
    private final ConversationService conversationService;
    private final NotificationService notificationService;

    @Override
    public ProposalResponse submitProposal(String expertId, SubmitProposalRequest request) {
        // BR-13: Expert cannot submit multiple active proposals for same job
        if (proposalRepo.existsByJobIdAndExpertIdAndStatus(request.getJobId(), expertId, ProposalStatus.PENDING))
            throw AppException.conflict("You already have a pending proposal for this job");

        JobPost job = jobRepo.findById(request.getJobId())
                .orElseThrow(() -> AppException.notFound("Job not found"));

        if (job.getStatus() != JobStatus.OPEN)
            throw AppException.badRequest("This job is no longer accepting proposals");

        User expert = userRepo.findById(expertId)
                .orElseThrow(() -> AppException.notFound("User not found"));

        Proposal proposal = Proposal.builder()
                .job(job)
                .expert(expert)
                .coverLetter(request.getCoverLetter())
                .bidAmount(request.getBidAmount())
                .deliveryTime(request.getDeliveryTime())
                .build();

        Proposal saved = proposalRepo.save(proposal);
        notificationService.createNotification(
                job.getClient(),
                "New Proposal Received",
                expert.getFullName() + " has submitted a proposal for your job '" + job.getTitle() + "'.",
                "PROPOSAL",
                job.getId()
        );
        return toResponse(saved);
    }

    @Override
    public List<ProposalResponse> getProposalsByJob(String clientId, String jobId) {
        JobPost job = jobRepo.findById(jobId)
                .orElseThrow(() -> AppException.notFound("Job not found"));
        if (!job.getClient().getId().equals(clientId))
            throw AppException.forbidden("Not your job");

        return proposalRepo.findByJobIdOrderByCreatedAtDesc(jobId)
                .stream().map(this::toResponse).toList();
    }

    @Override
    public List<ProposalResponse> getMyProposals(String expertId) {
        return proposalRepo.findByExpertIdOrderByCreatedAtDesc(expertId)
                .stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional
    public ProposalResponse acceptProposal(String clientId, String proposalId) {
        Proposal proposal = getProposalAndCheckClient(clientId, proposalId);

        proposal.setStatus(ProposalStatus.ACCEPTED);
        proposalRepo.save(proposal);

        // BR-16: Job → In Progress, auto-create Project
        JobPost job = proposal.getJob();
        job.setStatus(JobStatus.IN_PROGRESS);
        jobRepo.save(job);

        // BR-21: Project auto-created on proposal acceptance
        // Reuse a single shared conversation per client-expert pair so multiple
        // tasks between the same two people don't fragment into separate threads
        Conversation conversation = conversationService.findOrCreateDirect(
                job.getClient().getId(), proposal.getExpert().getId());

        Project project = Project.builder()
                .job(job)
                .client(job.getClient())
                .expert(proposal.getExpert())
                .status(ProjectStatus.ACTIVE)
                .conversation(conversation)
                .build();
        projectRepo.save(project);

        // Reject other pending proposals for same job
        proposalRepo.findByJobIdOrderByCreatedAtDesc(job.getId()).stream()
                .filter(p -> p.getStatus() == ProposalStatus.PENDING && !p.getId().equals(proposalId))
                .forEach(p -> { p.setStatus(ProposalStatus.REJECTED); proposalRepo.save(p); });

        notificationService.createNotification(
                proposal.getExpert(),
                "Proposal Accepted! 🎉",
                "Your proposal for '" + job.getTitle() + "' has been accepted.",
                "PROPOSAL",
                project.getId()
        );

        return toResponse(proposal);
    }

    @Override
    public ProposalResponse rejectProposal(String clientId, String proposalId) {
        Proposal proposal = getProposalAndCheckClient(clientId, proposalId);
        proposal.setStatus(ProposalStatus.REJECTED);
        Proposal saved = proposalRepo.save(proposal);
        notificationService.createNotification(
                proposal.getExpert(),
                "Proposal Rejected",
                "Your proposal for '" + proposal.getJob().getTitle() + "' was not accepted.",
                "PROPOSAL",
                proposal.getJob().getId()
        );
        return toResponse(saved);
    }

    @Override
    public ProposalResponse withdrawProposal(String expertId, String proposalId) {
        Proposal proposal = proposalRepo.findById(proposalId)
                .orElseThrow(() -> AppException.notFound("Proposal not found"));
        if (!proposal.getExpert().getId().equals(expertId))
            throw AppException.forbidden("Not your proposal");
        if (proposal.getStatus() != ProposalStatus.PENDING)
            throw AppException.badRequest("Only pending proposals can be withdrawn");
        proposal.setStatus(ProposalStatus.WITHDRAWN);
        Proposal saved = proposalRepo.save(proposal);
        notificationService.createNotification(
                proposal.getJob().getClient(),
                "Proposal Withdrawn",
                proposal.getExpert().getFullName() + " has withdrawn their proposal for '" + proposal.getJob().getTitle() + "'.",
                "PROPOSAL",
                proposal.getJob().getId()
        );
        return toResponse(saved);
    }

    @Override
    public ProposalResponse getProposalById(String proposalId) {
        return toResponse(proposalRepo.findById(proposalId)
                .orElseThrow(() -> AppException.notFound("Proposal not found")));
    }

    private Proposal getProposalAndCheckClient(String clientId, String proposalId) {
        Proposal proposal = proposalRepo.findById(proposalId)
                .orElseThrow(() -> AppException.notFound("Proposal not found"));
        if (!proposal.getJob().getClient().getId().equals(clientId))
            throw AppException.forbidden("Not your job");
        return proposal;
    }

    private ProposalResponse toResponse(Proposal p) {
        return ProposalResponse.builder()
                .id(p.getId())
                .jobId(p.getJob().getId())
                .jobTitle(p.getJob().getTitle())
                .expertId(p.getExpert().getId())
                .expertName(p.getExpert().getFullName())
                .expertAvatarUrl(p.getExpert().getAvatarUrl())
                .coverLetter(p.getCoverLetter())
                .bidAmount(p.getBidAmount())
                .deliveryTime(p.getDeliveryTime())
                .status(p.getStatus())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
