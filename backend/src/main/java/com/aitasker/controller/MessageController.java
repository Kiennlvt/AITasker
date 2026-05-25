package com.aitasker.controller;

import com.aitasker.dto.request.SendMessageRequest;
import com.aitasker.dto.response.ApiResponse;
import com.aitasker.dto.response.MessageResponse;
import com.aitasker.entity.Project;
import com.aitasker.repository.MessageRepository;
import com.aitasker.repository.ProjectRepository;
import com.aitasker.service.MessageService;
import jakarta.validation.Valid;
import lombok.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;
    private final ProjectRepository projectRepo;
    private final MessageRepository messageRepo;

    @GetMapping("/project/{projectId}")
    public ApiResponse<List<MessageResponse>> getMessages(@AuthenticationPrincipal UserDetails user,
                                                           @PathVariable String projectId) {
        return ApiResponse.ok(messageService.getMessages(user.getUsername(), projectId));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<MessageResponse> sendMessage(@AuthenticationPrincipal UserDetails user,
                                                     @Valid @RequestBody SendMessageRequest request) {
        MessageResponse msg = messageService.sendMessage(user.getUsername(), request);
        // Broadcast via WebSocket to project room
        messagingTemplate.convertAndSend("/topic/project." + request.getProjectId(), msg);
        return ApiResponse.ok(msg);
    }

    @GetMapping("/inbox")
    public ApiResponse<java.util.List<InboxItemDto>> getInbox(@AuthenticationPrincipal UserDetails user) {
        String uid = user.getUsername();
        java.util.List<Project> projects = projectRepo.findByClientIdOrderByCreatedAtDesc(uid);
        java.util.List<Project> expertProjects = projectRepo.findByExpertIdOrderByCreatedAtDesc(uid);
        java.util.List<Project> allProjects = new java.util.ArrayList<>(projects);
        allProjects.addAll(expertProjects);

        java.util.List<InboxItemDto> inbox = allProjects.stream().map(p -> {
            java.util.List<com.aitasker.entity.Message> msgs = messageRepo.findTop1ByProjectIdOrderByCreatedAtDesc(p.getId());
            String lastMsg = msgs.isEmpty() ? "" : msgs.get(0).getContent();
            LocalDateTime lastTime = msgs.isEmpty() ? p.getCreatedAt() : msgs.get(0).getCreatedAt();
            boolean isClient = p.getClient().getId().equals(uid);
            String otherName = isClient ? p.getExpert().getFullName() : p.getClient().getFullName();
            return new InboxItemDto(p.getId(), otherName, lastMsg, lastTime);
        }).toList();
        return ApiResponse.ok(inbox);
    }

    public record InboxItemDto(String projectId, String otherPartyName, String lastMessage, LocalDateTime lastMessageTime) {}
}
