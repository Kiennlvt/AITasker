package com.aitasker.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data @Builder
public class NotificationResponse {
    private String id;
    private String title;
    private String content;
    private String type;
    private String relatedId;
    private boolean isRead;
    private LocalDateTime createdAt;
}
