package com.aitasker.repository;

import com.aitasker.entity.Milestone;
import com.aitasker.enums.MilestoneStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MilestoneRepository extends JpaRepository<Milestone, String> {
    List<Milestone> findByStatusAndSubmittedAtIsNotNullAndPaidAtIsNull(MilestoneStatus status);
}
