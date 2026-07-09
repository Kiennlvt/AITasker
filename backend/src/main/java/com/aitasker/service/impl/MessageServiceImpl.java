package com.aitasker.service.impl;

import com.aitasker.dto.request.SendMessageRequest;
import com.aitasker.dto.response.MessageResponse;
import com.aitasker.entity.*;
import com.aitasker.exception.AppException;
import com.aitasker.repository.*;
import com.aitasker.service.MessageService;
import com.aitasker.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private static final int NOTIFICATION_PREVIEW_LENGTH = 80;

    private final MessageRepository messageRepo;
    private final ProjectRepository projectRepo;
    private final UserRepository userRepo;
    private final ConversationRepository conversationRepo;
    private final ConversationParticipantRepository participantRepo;
    private final NotificationService notificationService;

    @Override
    public List<MessageResponse> getMessages(String userId, String projectId) {
        Project project = projectRepo.findById(projectId)
                .orElseThrow(() -> AppException.notFound("Project not found"));
        if (!project.getClient().getId().equals(userId) && !project.getExpert().getId().equals(userId))
            throw AppException.forbidden("Access denied");
        return getConversationMessages(userId, project.getConversation().getId());
    }

    @Override
    public List<MessageResponse> getConversationMessages(String userId, String conversationId) {
        if (!participantRepo.existsByConversationIdAndUserId(conversationId, userId))
            throw AppException.forbidden("Access denied");
        return messageRepo.findByConversationIdOrderByCreatedAtAsc(conversationId)
                .stream().map(this::toResponse).toList();
    }

    @Override
    public MessageResponse sendMessage(String senderId, SendMessageRequest request) {
        User sender = userRepo.findById(senderId)
                .orElseThrow(() -> AppException.notFound("User not found"));

        if (request.getProjectId() != null) {
            Project project = projectRepo.findById(request.getProjectId())
                    .orElseThrow(() -> AppException.notFound("Project not found"));
            if (!project.getClient().getId().equals(senderId) && !project.getExpert().getId().equals(senderId))
                throw AppException.forbidden("You are not part of this project");
            Message message = Message.builder()
                    .conversation(project.getConversation())
                    .sender(sender)
                    .content(request.getContent())
                    .build();
            Message saved = messageRepo.save(message);
            notifyOtherParticipants(saved, sender);
            return toResponse(saved);
        }

        if (request.getConversationId() != null) {
            Conversation conversation = conversationRepo.findById(request.getConversationId())
                    .orElseThrow(() -> AppException.notFound("Conversation not found"));
            if (!participantRepo.existsByConversationIdAndUserId(conversation.getId(), senderId))
                throw AppException.forbidden("You are not a participant of this conversation");
            Message message = Message.builder()
                    .conversation(conversation)
                    .sender(sender)
                    .content(request.getContent())
                    .build();
            Message saved = messageRepo.save(message);
            notifyOtherParticipants(saved, sender);
            return toResponse(saved);
        }

        throw AppException.badRequest("Either projectId or conversationId is required");
    }

    private void notifyOtherParticipants(Message message, User sender) {
        String preview = message.getContent().length() > NOTIFICATION_PREVIEW_LENGTH
                ? message.getContent().substring(0, NOTIFICATION_PREVIEW_LENGTH) + "..."
                : message.getContent();
        participantRepo.findByConversationId(message.getConversation().getId()).stream()
                .map(ConversationParticipant::getUser)
                .filter(user -> !user.getId().equals(sender.getId()))
                .forEach(user -> notificationService.createNotification(
                        user,
                        "New message from " + sender.getFullName(),
                        preview,
                        "MESSAGE",
                        message.getConversation().getId()
                ));
    }

    private MessageResponse toResponse(Message m) {
        return MessageResponse.builder()
                .id(m.getId())
                .projectId(m.getProject() != null ? m.getProject().getId() : null)
                .conversationId(m.getConversation() != null ? m.getConversation().getId() : null)
                .senderId(m.getSender().getId())
                .senderName(m.getSender().getFullName())
                .senderAvatarUrl(m.getSender().getAvatarUrl())
                .content(m.getContent())
                .status(m.getStatus().name())
                .createdAt(m.getCreatedAt())
                .build();
    }
}
