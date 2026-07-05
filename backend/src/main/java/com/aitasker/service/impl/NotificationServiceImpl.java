package com.aitasker.service.impl;

import com.aitasker.dto.response.NotificationResponse;
import com.aitasker.entity.Notification;
import com.aitasker.entity.User;
import com.aitasker.exception.AppException;
import com.aitasker.repository.NotificationRepository;
import com.aitasker.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepo;

    @Override
    public List<NotificationResponse> getMyNotifications(String userId) {
        return notificationRepo.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public long countUnread(String userId) {
        return notificationRepo.countByUserIdAndIsReadFalse(userId);
    }

    @Override
    public void markAsRead(String userId, String notificationId) {
        Notification notification = notificationRepo.findById(notificationId)
                .orElseThrow(() -> AppException.notFound("Notification not found"));
        if (!notification.getUser().getId().equals(userId)) {
            throw AppException.forbidden("Not your notification");
        }
        notification.setRead(true);
        notificationRepo.save(notification);
    }

    @Override
    public void markAllAsRead(String userId) {
        List<Notification> unread = notificationRepo.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .filter(n -> !n.isRead())
                .toList();
        unread.forEach(n -> n.setRead(true));
        notificationRepo.saveAll(unread);
    }

    @Override
    public void createNotification(User user, String title, String content, String type, String relatedId) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .content(content)
                .type(type)
                .relatedId(relatedId)
                .isRead(false)
                .build();
        notificationRepo.save(notification);
    }

    private NotificationResponse toResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .title(n.getTitle())
                .content(n.getContent())
                .type(n.getType())
                .relatedId(n.getRelatedId())
                .isRead(n.isRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
