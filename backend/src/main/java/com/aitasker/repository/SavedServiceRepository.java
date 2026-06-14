package com.aitasker.repository;

import com.aitasker.entity.SavedService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedServiceRepository extends JpaRepository<SavedService, String> {
    boolean existsByUserIdAndServiceId(String userId, String serviceId);
    Optional<SavedService> findByUserIdAndServiceId(String userId, String serviceId);
    List<SavedService> findByUserIdOrderBySavedAtDesc(String userId);
}
