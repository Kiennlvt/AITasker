package com.aitasker.service.impl;

import com.aitasker.dto.request.LoginRequest;
import com.aitasker.dto.request.RegisterRequest;
import com.aitasker.dto.response.AuthResponse;
import com.aitasker.entity.User;
import com.aitasker.exception.AppException;
import com.aitasker.repository.UserRepository;
import com.aitasker.security.JwtUtil;
import com.aitasker.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> AppException.badRequest("Invalid email or password"));

        if (!user.isActive())
            throw AppException.forbidden("Account is suspended");

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword()))
            throw AppException.badRequest("Invalid email or password");

        return buildAuthResponse(user);
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail()))
            throw AppException.conflict("Email already registered");

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(request.getRole())
                .build();

        userRepository.save(user);
        return buildAuthResponse(user);
    }

    @Override
    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtUtil.validateToken(refreshToken))
            throw AppException.badRequest("Invalid or expired refresh token");

        String userId = jwtUtil.extractUserId(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> AppException.notFound("User not found"));

        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        return AuthResponse.builder()
                .accessToken(jwtUtil.generateAccessToken(user.getId(), user.getRole().name()))
                .refreshToken(jwtUtil.generateRefreshToken(user.getId()))
                .tokenType("Bearer")
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }
}
