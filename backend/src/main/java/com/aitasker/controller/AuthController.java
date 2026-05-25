package com.aitasker.controller;

import com.aitasker.dto.request.LoginRequest;
import com.aitasker.dto.request.RegisterRequest;
import com.aitasker.dto.response.ApiResponse;
import com.aitasker.dto.response.AuthResponse;
import com.aitasker.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.ok(authService.login(request));
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.ok("Account created successfully", authService.register(request));
    }

    @PostMapping("/refresh")
    public ApiResponse<AuthResponse> refreshToken(@RequestParam String token) {
        return ApiResponse.ok(authService.refreshToken(token));
    }
}
