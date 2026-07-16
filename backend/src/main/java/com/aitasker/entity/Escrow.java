package com.aitasker.entity;

import com.aitasker.enums.EscrowStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "escrows")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Escrow {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false, unique = true)
    private Project project;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    // Not DB-level NOT NULL: ddl-auto=update can't add a NOT NULL column with no
    // default to a table that already has rows (fails with "contains null values").
    // The Java-side @Builder.Default still guarantees new entities start at ZERO.
    @Column(precision = 19, scale = 2)
    @Builder.Default
    private BigDecimal releasedAmount = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private EscrowStatus status = EscrowStatus.HOLDING;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
