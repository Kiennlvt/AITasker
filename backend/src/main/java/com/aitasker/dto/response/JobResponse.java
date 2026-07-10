package com.aitasker.dto.response;

import com.aitasker.enums.JobStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder
public class JobResponse {
    private String id;
    private String clientId;
    private String clientName;
    private String clientAvatarUrl;
    private String title;
    private String description;
    private Double budget;
    private LocalDate deadline;
    private String category;
    private List<String> skills;
    private JobStatus status;
    private int proposalCount;
    private LocalDateTime createdAt;
}
