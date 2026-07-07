package com.aitasker.controller;

import com.aitasker.dto.response.ApiResponse;
import com.aitasker.dto.response.NotificationResponse;
import com.aitasker.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ApiResponse<List<NotificationResponse>> getMyNotifications(@AuthenticationPrincipal UserDetails user) {
        return ApiResponse.ok(notificationService.getMyNotifications(user.getUsername()));
    }

    @GetMapping("/unread/count")
    public ApiResponse<Long> getUnreadCount(@AuthenticationPrincipal UserDetails user) {
        return ApiResponse.ok(notificationService.countUnread(user.getUsername()));
    }

    @PatchMapping("/{id}/read")
    public ApiResponse<Void> markAsRead(@AuthenticationPrincipal UserDetails user, @PathVariable String id) {
        notificationService.markAsRead(user.getUsername(), id);
        return ApiResponse.ok(null);
    }

    @PatchMapping("/read-all")
    public ApiResponse<Void> markAllAsRead(@AuthenticationPrincipal UserDetails user) {
        notificationService.markAllAsRead(user.getUsername());
        return ApiResponse.ok(null);
    }
}
