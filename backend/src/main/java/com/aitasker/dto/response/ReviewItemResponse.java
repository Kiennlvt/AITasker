package com.aitasker.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewItemResponse {
    private String giverName;
    private String giverAvatarUrl;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}
