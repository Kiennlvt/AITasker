package com.aitasker.repository;

import com.aitasker.entity.Proposal;
import com.aitasker.enums.ProposalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProposalRepository extends JpaRepository<Proposal, String> {
    List<Proposal> findByJobIdOrderByCreatedAtDesc(String jobId);
    List<Proposal> findByExpertIdOrderByCreatedAtDesc(String expertId);
    Optional<Proposal> findByJobIdAndExpertIdAndStatus(String jobId, String expertId, ProposalStatus status);
    boolean existsByJobIdAndExpertIdAndStatus(String jobId, String expertId, ProposalStatus status);
    long countByExpertIdAndStatus(String expertId, ProposalStatus status);
    int countByJobId(String jobId);
    boolean existsByJobIdAndStatus(String jobId, ProposalStatus status);
}
