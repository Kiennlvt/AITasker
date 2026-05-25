package com.aitasker.entity;

import com.aitasker.enums.MilestoneStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

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

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private MilestoneStatus status = MilestoneStatus.PENDING;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
