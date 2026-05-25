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
    @NotBlank private String description;
    @NotNull @Min(1) private Double budget;
    private LocalDate deadline;
    private List<String> skills;
}
