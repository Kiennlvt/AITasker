package com.aitasker.entity;

import com.aitasker.enums.ReleaseReason;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AuditLog {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String projectId;

    @Column(nullable = false)
    private String milestoneId;

    @Column(nullable = false)
    private String escrowId;

    @Column(nullable = false)
    private String clientId;

    @Column(nullable = false)
    private String expertId;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal releasedAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReleaseReason reason;

    @Column(nullable = false)
    private String performedBy;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
