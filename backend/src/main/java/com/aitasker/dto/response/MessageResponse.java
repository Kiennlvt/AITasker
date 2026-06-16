package com.aitasker.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data @Builder
public class MessageResponse {
    private String id;
    private String projectId;
    private String conversationId;
    private String senderId;
    private String senderName;
    private String senderAvatarUrl;
    private String content;
    private String status;
    private LocalDateTime createdAt;
}
