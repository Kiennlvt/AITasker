package com.aitasker.service;

import com.aitasker.dto.request.LoginRequest;
import com.aitasker.dto.request.RegisterRequest;
import com.aitasker.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    AuthResponse register(RegisterRequest request);
    AuthResponse refreshToken(String refreshToken);
}
