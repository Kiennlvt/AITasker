package com.aitasker.dto.response;

import com.aitasker.enums.UserRole;
import lombok.Builder;
import lombok.Data;

@Data @Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private String id;
    private String email;
    private String fullName;
    private UserRole role;
    private String avatarUrl;
}
