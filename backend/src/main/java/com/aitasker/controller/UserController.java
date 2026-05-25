package com.aitasker.controller;

import com.aitasker.dto.request.UpdateUserRequest;
import com.aitasker.dto.response.ApiResponse;
import com.aitasker.dto.response.UserResponse;
import com.aitasker.entity.User;
import com.aitasker.exception.AppException;
import com.aitasker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepo;

    @GetMapping("/me")
    public ApiResponse<UserResponse> getMe(@AuthenticationPrincipal UserDetails user) {
        User u = userRepo.findById(user.getUsername())
                .orElseThrow(() -> AppException.notFound("User not found"));
        return ApiResponse.ok(toResponse(u));
    }

    @PutMapping("/me")
    public ApiResponse<UserResponse> updateMe(@AuthenticationPrincipal UserDetails user,
                                               @RequestBody UpdateUserRequest request) {
        User u = userRepo.findById(user.getUsername())
                .orElseThrow(() -> AppException.notFound("User not found"));
        if (request.getFullName() != null) u.setFullName(request.getFullName());
        if (request.getBio() != null) u.setBio(request.getBio());
        if (request.getLocation() != null) u.setLocation(request.getLocation());
        if (request.getHourlyRate() != null) u.setHourlyRate(request.getHourlyRate());
        if (request.getSkills() != null) u.setSkills(request.getSkills());
        if (request.getAvatarUrl() != null) u.setAvatarUrl(request.getAvatarUrl());
        return ApiResponse.ok("Profile updated", toResponse(userRepo.save(u)));
    }

    @GetMapping("/{id}")
    public ApiResponse<UserResponse> getUserById(@PathVariable String id) {
        User u = userRepo.findById(id)
                .orElseThrow(() -> AppException.notFound("User not found"));
        return ApiResponse.ok(toResponse(u));
    }

    private UserResponse toResponse(User u) {
        return UserResponse.builder()
                .id(u.getId())
                .email(u.getEmail())
                .fullName(u.getFullName())
                .role(u.getRole())
                .avatarUrl(u.getAvatarUrl())
                .bio(u.getBio())
                .location(u.getLocation())
                .hourlyRate(u.getHourlyRate())
                .skills(u.getSkills())
                .isVerified(u.isVerified())
                .build();
    }
}
