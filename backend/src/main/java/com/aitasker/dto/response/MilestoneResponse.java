package com.aitasker.dto.response;

import com.aitasker.enums.MilestoneStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data @Builder
public class MilestoneResponse {
    private String id;
    private String title;
    private String description;
    private Double amount;
    private LocalDate dueDate;
    private String deliverableNote;
    private String revisionNote;
    private LocalDate revisionDueDate;
    private Integer revisionCount;
    private List<String> attachmentUrls;
    private MilestoneStatus status;
}
