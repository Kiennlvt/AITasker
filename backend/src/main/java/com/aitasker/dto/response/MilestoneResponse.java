package com.aitasker.dto.response;

import com.aitasker.enums.MilestoneStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data @Builder
public class MilestoneResponse {
    private String id;
    private String title;
    private String description;
    private Double amount;
    private LocalDate dueDate;
    private String deliverableNote;
    private MilestoneStatus status;
}
