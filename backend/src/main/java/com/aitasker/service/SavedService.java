package com.aitasker.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "saved_services", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "service_id"})
})
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class SavedService {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;

    @CreationTimestamp
    private LocalDateTime savedAt;
}
