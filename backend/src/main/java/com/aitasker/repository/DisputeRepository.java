package com.aitasker.repository;

import com.aitasker.entity.Dispute;
import com.aitasker.enums.DisputeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisputeRepository extends JpaRepository<Dispute, String> {
    List<Dispute> findByStatusOrderByCreatedAtDesc(DisputeStatus status);
    List<Dispute> findAllByOrderByCreatedAtDesc();
    List<Dispute> findByProject_IdOrderByCreatedAtDesc(String projectId);
    boolean existsByMilestone_IdAndStatus(String milestoneId, DisputeStatus status);
}
