package com.aitasker.entity;

import com.aitasker.enums.DisputeStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "disputes")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Dispute {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "milestone_id", nullable = false)
    private Milestone milestone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "filed_by", nullable = false)
    private User filedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "respondent", nullable = false)
    private User respondent;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String reason;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "dispute_evidence", joinColumns = @JoinColumn(name = "dispute_id"))
    @Column(name = "url")
    @Builder.Default
    private List<String> evidenceUrls = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String respondentResponse;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "dispute_respondent_evidence", joinColumns = @JoinColumn(name = "dispute_id"))
    @Column(name = "url")
    @Builder.Default
    private List<String> respondentEvidenceUrls = new ArrayList<>();

    /** Snapshot of the milestone's amount at filing time, so later edits can't change what's being arbitrated. */
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private DisputeStatus status = DisputeStatus.PENDING;

    @Column(precision = 19, scale = 2)
    private BigDecimal clientAmount;

    @Column(precision = 19, scale = 2)
    private BigDecimal expertAmount;

    @Column(columnDefinition = "TEXT")
    private String resolutionNote;

    private String resolvedBy;

    private LocalDateTime resolvedAt;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
