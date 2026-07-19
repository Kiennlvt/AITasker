package com.aitasker.repository;

import com.aitasker.entity.JobPost;
import com.aitasker.enums.JobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface JobPostRepository extends JpaRepository<JobPost, String> {
    Page<JobPost> findByStatus(JobStatus status, Pageable pageable);
    List<JobPost> findByClientIdOrderByCreatedAtDesc(String clientId);
    long countByClientIdAndStatus(String clientId, JobStatus status);
    long countByStatus(JobStatus status);
    List<JobPost> findByClientIdAndStatusOrderByCreatedAtDesc(String clientId, JobStatus status);
    long countByCategoryIgnoreCase(String category);
    List<JobPost> findByCreatedAtAfterOrderByCreatedAtAsc(LocalDateTime after);

    @Query("SELECT COALESCE(SUM(j.budget), 0) FROM JobPost j")
    double sumAllBudget();

    @Query("SELECT COALESCE(j.category, 'Other'), COUNT(j) FROM JobPost j GROUP BY j.category")
    List<Object[]> countJobsGroupedByCategory();
}
