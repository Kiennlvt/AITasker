package com.aitasker.repository;

import com.aitasker.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, String> {
    List<AuditLog> findByProjectIdOrderByCreatedAtDesc(String projectId);

    @Query("SELECT COALESCE(SUM(a.releasedAmount), 0) FROM AuditLog a WHERE a.clientId = :clientId")
    BigDecimal sumReleasedAmountByClientId(@Param("clientId") String clientId);

    @Query("SELECT COALESCE(SUM(a.releasedAmount), 0) FROM AuditLog a WHERE a.expertId = :expertId")
    BigDecimal sumReleasedAmountByExpertId(@Param("expertId") String expertId);

    List<AuditLog> findByExpertIdAndCreatedAtAfter(String expertId, java.time.LocalDateTime after);

    @Query("SELECT COALESCE(SUM(a.releasedAmount), 0) FROM AuditLog a")
    BigDecimal sumAllReleasedAmount();

    List<AuditLog> findByCreatedAtAfterOrderByCreatedAtAsc(LocalDateTime after);
}
