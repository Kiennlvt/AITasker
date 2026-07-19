package com.aitasker.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RespondDisputeRequest {
    @NotBlank
    private String response;
}
