package com.aitasker.service;

import com.aitasker.dto.response.NotificationResponse;
import com.aitasker.entity.User;
import java.util.List;

public interface NotificationService {
    List<NotificationResponse> getMyNotifications(String userId);
    long countUnread(String userId);
    void markAsRead(String userId, String notificationId);
    void markAllAsRead(String userId);
    void createNotification(User user, String title, String content, String type, String relatedId);
}
