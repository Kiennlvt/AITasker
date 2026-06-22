package com.aitasker.service;

import com.aitasker.dto.response.AdminStatsResponse;
import com.aitasker.dto.response.JobResponse;
import com.aitasker.dto.response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AdminRepository {
    List<UserResponse> getAllUsers(String role);
    UserResponse toggleUserStatus(String id);
    Page<JobResponse> getAllJobs(String status, Pageable pageable);
    JobResponse approveJob(String id);
    JobResponse rejectJob(String id);
    AdminStatsResponse getStats();
}
