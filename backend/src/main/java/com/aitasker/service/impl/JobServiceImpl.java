package com.aitasker.service.impl;

import com.aitasker.dto.request.CreateJobRequest;
import com.aitasker.dto.response.JobResponse;
import com.aitasker.dto.response.JobSuggestionDto;
import com.aitasker.entity.JobPost;
import com.aitasker.entity.User;
import com.aitasker.enums.JobStatus;
import com.aitasker.enums.ProposalStatus;
import com.aitasker.exception.AppException;
import com.aitasker.repository.JobPostRepository;
import com.aitasker.repository.ProposalRepository;
import com.aitasker.repository.SavedJobRepository;
import com.aitasker.repository.UserRepository;
import com.aitasker.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private final JobPostRepository jobRepo;
    private final UserRepository userRepo;
    private final ProposalRepository proposalRepo;
    private final SavedJobRepository savedJobRepo;

    @Override
    public Page<JobResponse> getAllOpenJobs(Pageable pageable) {
        return jobRepo.findByStatus(JobStatus.OPEN, pageable).map(this::toResponse);
    }

    @Override
    public JobResponse getJobById(String id) {
        return toResponse(jobRepo.findById(id)
                .orElseThrow(() -> AppException.notFound("Job not found")));
    }

    @Override
    public JobResponse createJob(String clientId, CreateJobRequest request) {
        User client = userRepo.findById(clientId)
                .orElseThrow(() -> AppException.notFound("User not found"));

        if (!request.isDraft()) {
            if (request.getDescription() == null || request.getDescription().isBlank())
                throw AppException.badRequest("Description is required");
            if (request.getBudget() == null || request.getBudget() < 1)
                throw AppException.badRequest("Budget must be at least 1");
        }

        JobPost job = JobPost.builder()
                .client(client)
                .title(request.getTitle())
                .description(request.getDescription() != null ? request.getDescription() : "")
                .budget(request.getBudget() != null ? request.getBudget() : 0.0)
                .deadline(request.getDeadline())
                .skills(request.getSkills())
                .status(request.isDraft() ? JobStatus.DRAFT : JobStatus.OPEN)
                .build();

        return toResponse(jobRepo.save(job));
    }

    @Override
    public JobResponse updateJob(String clientId, String jobId, CreateJobRequest request) {
        JobPost job = jobRepo.findById(jobId)
                .orElseThrow(() -> AppException.notFound("Job not found"));

        if (!job.getClient().getId().equals(clientId))
            throw AppException.forbidden("Not your job");

        if (proposalRepo.existsByJobIdAndStatus(jobId, ProposalStatus.ACCEPTED))
            throw AppException.badRequest("Cannot edit job with accepted proposal");

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setBudget(request.getBudget());
        job.setDeadline(request.getDeadline());
        job.setSkills(request.getSkills());

        return toResponse(jobRepo.save(job));
    }

    @Override
    @Transactional
    public void deleteJob(String clientId, String jobId) {
        JobPost job = jobRepo.findById(jobId)
                .orElseThrow(() -> AppException.notFound("Job not found"));

        if (!job.getClient().getId().equals(clientId))
            throw AppException.forbidden("Not your job");

        if (proposalRepo.existsByJobIdAndStatus(jobId, ProposalStatus.ACCEPTED))
            throw AppException.badRequest("Cannot delete job with accepted proposal");

        savedJobRepo.deleteByJobId(jobId);
        proposalRepo.deleteByJobId(jobId);
        jobRepo.delete(job);
    }

    @Override
    public List<JobResponse> getMyJobs(String clientId) {
        return jobRepo.findByClientIdOrderByCreatedAtDesc(clientId)
                .stream().map(this::toResponse).toList();
    }

    @Override
    public JobResponse closeJob(String clientId, String jobId) {
        JobPost job = jobRepo.findById(jobId)
                .orElseThrow(() -> AppException.notFound("Job not found"));
        if (!job.getClient().getId().equals(clientId))
            throw AppException.forbidden("Not your job");
        job.setStatus(JobStatus.CANCELLED);
        return toResponse(jobRepo.save(job));
    }

    @Override
    public JobSuggestionDto suggestJobImprovement(String title, String description) {
        return JobSuggestionDto.builder()
                .improvedDescription("Based on your description: " + description + "\n\nWe recommend clearly stating the expected deliverables, timeline, and required technical stack.")
                .suggestedSkills(List.of("Python", "Machine Learning", "TensorFlow", "Data Analysis"))
                .budgetRange(new JobSuggestionDto.BudgetRange(500, 5000))
                .estimatedTimeline("2-4 weeks")
                .build();
    }

    @Override
    public List<JobResponse> getMyDrafts(String clientId) {
        return jobRepo.findByClientIdAndStatusOrderByCreatedAtDesc(clientId, JobStatus.DRAFT)
                .stream().map(this::toResponse).toList();
    }

    @Override
    public JobResponse publishDraft(String clientId, String jobId) {
        JobPost job = jobRepo.findById(jobId)
                .orElseThrow(() -> AppException.notFound("Job not found"));
        if (!job.getClient().getId().equals(clientId))
            throw AppException.forbidden("Not your job");
        if (job.getStatus() != JobStatus.DRAFT)
            throw AppException.badRequest("Only draft jobs can be published");
        if (job.getDescription() == null || job.getDescription().isBlank())
            throw AppException.badRequest("Description is required before publishing");
        if (job.getBudget() == null || job.getBudget() < 1)
            throw AppException.badRequest("Budget must be at least 1 before publishing");

        job.setStatus(JobStatus.OPEN);
        return toResponse(jobRepo.save(job));
    }

    private JobResponse toResponse(JobPost job) {
        return JobResponse.builder()
                .id(job.getId())
                .clientId(job.getClient().getId())
                .clientName(job.getClient().getFullName())
                .clientAvatarUrl(job.getClient().getAvatarUrl())
                .title(job.getTitle())
                .description(job.getDescription())
                .budget(job.getBudget())
                .deadline(job.getDeadline())
                .skills(job.getSkills())
                .status(job.getStatus())
                .proposalCount(proposalRepo.countByJobId(job.getId()))
                .createdAt(job.getCreatedAt())
                .build();
    }
}
