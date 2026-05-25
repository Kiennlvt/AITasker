package com.aitasker.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SendMessageRequest {
    @NotBlank private String projectId;
    @NotBlank private String content;
}
