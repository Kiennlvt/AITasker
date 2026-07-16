package com.aitasker.repository;

import com.aitasker.entity.Escrow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EscrowRepository extends JpaRepository<Escrow, String> {
    Optional<Escrow> findByProjectId(String projectId);
}
