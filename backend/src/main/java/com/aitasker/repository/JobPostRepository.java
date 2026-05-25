package com.aitasker.repository;

import com.aitasker.entity.JobPost;
import com.aitasker.enums.JobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobPostRepository extends JpaRepository<JobPost, String> {
    Page<JobPost> findByStatus(JobStatus status, Pageable pageable);
    List<JobPost> findByClientIdOrderByCreatedAtDesc(String clientId);
    long countByClientIdAndStatus(String clientId, JobStatus status);
}
