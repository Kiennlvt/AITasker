package com.aitasker.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SendMessageRequest {
    private String projectId;
    private String conversationId;
    @NotBlank private String content;
}
