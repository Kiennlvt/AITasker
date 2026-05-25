package com.aitasker.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data @Builder
public class ServiceResponse {
    private String id;
    private String expertId;
    private String expertName;
    private String expertAvatarUrl;
    private Double expertRating;
    private String title;
    private String description;
    private Double price;
    private Integer deliveryDays;
    private String category;
    private List<String> tags;
    private String imageUrl;
    private boolean isActive;
    private LocalDateTime createdAt;
}
