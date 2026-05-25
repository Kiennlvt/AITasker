package com.aitasker.service.impl;

import com.aitasker.dto.request.SendMessageRequest;
import com.aitasker.dto.response.MessageResponse;
import com.aitasker.entity.*;
import com.aitasker.exception.AppException;
import com.aitasker.repository.*;
import com.aitasker.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepo;
    private final ProjectRepository projectRepo;
    private final UserRepository userRepo;

    @Override
    public List<MessageResponse> getMessages(String userId, String projectId) {
        Project project = projectRepo.findById(projectId)
                .orElseThrow(() -> AppException.notFound("Project not found"));
        if (!project.getClient().getId().equals(userId) && !project.getExpert().getId().equals(userId))
            throw AppException.forbidden("Access denied");
        return messageRepo.findByProjectIdOrderByCreatedAtAsc(projectId)
                .stream().map(this::toResponse).toList();
    }

    @Override
    public MessageResponse sendMessage(String senderId, SendMessageRequest request) {
        Project project = projectRepo.findById(request.getProjectId())
                .orElseThrow(() -> AppException.notFound("Project not found"));
        if (!project.getClient().getId().equals(senderId) && !project.getExpert().getId().equals(senderId))
            throw AppException.forbidden("You are not part of this project");

        User sender = userRepo.findById(senderId)
                .orElseThrow(() -> AppException.notFound("User not found"));

        Message message = Message.builder()
                .project(project)
                .sender(sender)
                .content(request.getContent())
                .build();

        return toResponse(messageRepo.save(message));
    }

    private MessageResponse toResponse(Message m) {
        return MessageResponse.builder()
                .id(m.getId())
                .projectId(m.getProject().getId())
                .senderId(m.getSender().getId())
                .senderName(m.getSender().getFullName())
                .senderAvatarUrl(m.getSender().getAvatarUrl())
                .content(m.getContent())
                .status(m.getStatus().name())
                .createdAt(m.getCreatedAt())
                .build();
    }
}
