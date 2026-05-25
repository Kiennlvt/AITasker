package com.aitasker.entity;

import com.aitasker.enums.ProposalStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "proposals")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Proposal {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private JobPost job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "expert_id", nullable = false)
    private User expert;

    @Column(columnDefinition = "TEXT")
    private String coverLetter;

    private Double bidAmount;
    private Integer deliveryTime; // days

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ProposalStatus status = ProposalStatus.PENDING;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
