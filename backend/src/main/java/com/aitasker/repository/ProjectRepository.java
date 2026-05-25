package com.aitasker.repository;

import com.aitasker.entity.Project;
import com.aitasker.enums.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, String> {
    List<Project> findByClientIdOrderByCreatedAtDesc(String clientId);
    List<Project> findByExpertIdOrderByCreatedAtDesc(String expertId);
    long countByClientIdAndStatus(String clientId, ProjectStatus status);
    long countByExpertIdAndStatus(String expertId, ProjectStatus status);
}
