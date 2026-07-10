package com.aitasker.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class CreateJobRequest {
    @NotBlank private String title;
    private String description;
    private Double budget;
    private LocalDate deadline;
    private String category;
    private List<String> skills;
    private boolean draft;
}
