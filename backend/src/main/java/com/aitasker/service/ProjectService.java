package com.aitasker.service;

import com.aitasker.dto.request.CreateMilestoneRequest;
import com.aitasker.dto.response.MilestoneResponse;
import com.aitasker.dto.response.ProjectResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProjectService {
    List<ProjectResponse> getMyProjects(String userId);
    ProjectResponse getProjectById(String userId, String projectId);
    ProjectResponse approveDeliverable(String clientId, String milestoneId);
    ProjectResponse requestRevision(String clientId, String milestoneId, String note);
    ProjectResponse submitDeliverable(String expertId, String milestoneId, String note);
    ProjectResponse finishProject(String clientId, String projectId);
    MilestoneResponse createMilestone(String expertId, String projectId, CreateMilestoneRequest request);
    MilestoneResponse updateMilestone(String expertId, String milestoneId, CreateMilestoneRequest request);
    List<MilestoneResponse> getMilestones(String userId, String projectId);
    List<String> uploadMilestoneFiles(String expertId, String milestoneId, List<MultipartFile> files);
}
