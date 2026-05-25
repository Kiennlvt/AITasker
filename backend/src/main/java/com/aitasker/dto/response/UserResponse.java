package com.aitasker.dto.response;

import com.aitasker.enums.UserRole;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data @Builder
public class UserResponse {
    private String id;
    private String email;
    private String fullName;
    private UserRole role;
    private String avatarUrl;
    private String bio;
    private String location;
    private Double hourlyRate;
    private List<String> skills;
    private boolean isVerified;
    private boolean isActive;
    private java.time.LocalDateTime createdAt;
}
