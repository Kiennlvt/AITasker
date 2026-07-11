package com.aitasker.entity;

import com.aitasker.enums.JobStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "job_posts")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class JobPost {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(nullable = false)
    private Double budget;

    private LocalDate deadline;

    private String category;

    @ElementCollection
    @CollectionTable(name = "job_skills", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "skill")
    private List<String> skills;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private JobStatus status = JobStatus.OPEN;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
