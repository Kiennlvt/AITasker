package com.aitasker.entity;

import com.aitasker.enums.MilestoneStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "milestones")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Milestone {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Double amount;
    private LocalDate dueDate;

    @Column(columnDefinition = "TEXT")
    private String deliverableNote;

    @Column(columnDefinition = "TEXT")
    private String revisionNote;

    private LocalDate revisionDueDate;

    @Builder.Default
    private Integer revisionCount = 0;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private MilestoneStatus status = MilestoneStatus.PENDING;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "milestone_attachments", joinColumns = @JoinColumn(name = "milestone_id"))
    @Column(name = "url")
    @Builder.Default
    private List<String> attachmentUrls = new ArrayList<>();

    private LocalDateTime submittedAt;

    private LocalDateTime paidAt;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
