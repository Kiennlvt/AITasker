package com.aitasker.repository;

import com.aitasker.entity.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, String> {
    Page<Service> findByIsActiveTrue(Pageable pageable);
    Page<Service> findByCategoryAndIsActiveTrue(String category, Pageable pageable);
    List<Service> findByExpertIdOrderByCreatedAtDesc(String expertId);
    long countByCategoryIgnoreCase(String category);
}
