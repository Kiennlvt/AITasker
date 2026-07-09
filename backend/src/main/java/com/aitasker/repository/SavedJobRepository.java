package com.aitasker.repository;

import com.aitasker.entity.SavedJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, String> {
    boolean existsByUserIdAndJobId(String userId, String jobId);
    Optional<SavedJob> findByUserIdAndJobId(String userId, String jobId);
    List<SavedJob> findByUserIdOrderBySavedAtDesc(String userId);
    void deleteByJobId(String jobId);
}
