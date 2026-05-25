package com.aitasker.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SubmitProposalRequest {
    @NotBlank private String jobId;
    @NotBlank private String coverLetter;
    @NotNull @Min(1) private Double bidAmount;
    @NotNull @Min(1) private Integer deliveryTime;
}
