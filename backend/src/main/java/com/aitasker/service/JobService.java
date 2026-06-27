package com.aitasker.service;

import com.aitasker.dto.request.CreateJobRequest;
import com.aitasker.dto.response.JobResponse;
import com.aitasker.dto.response.JobSuggestionDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface JobService {
    Page<JobResponse> getAllOpenJobs(Pageable pageable);
    JobResponse getJobById(String id);
    JobResponse createJob(String clientId, CreateJobRequest request);
    JobResponse updateJob(String clientId, String jobId, CreateJobRequest request);
    void deleteJob(String clientId, String jobId);
    List<JobResponse> getMyJobs(String clientId);
    JobResponse closeJob(String clientId, String jobId);
    JobSuggestionDto suggestJobImprovement(String title, String description);
    List<JobResponse> getMyDrafts(String clientId);
    JobResponse publishDraft(String clientId, String jobId);
}
