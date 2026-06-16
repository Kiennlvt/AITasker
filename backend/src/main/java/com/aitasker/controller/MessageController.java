package com.aitasker.controller;

import com.aitasker.dto.request.SendMessageRequest;
import com.aitasker.dto.response.ApiResponse;
import com.aitasker.dto.response.MessageResponse;
import com.aitasker.entity.*;
import com.aitasker.repository.*;
import com.aitasker.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;
    private final MessageRepository messageRepo;
    private final ConversationRepository conversationRepo;

    @GetMapping("/project/{projectId}")
    @Transactional(readOnly = true)
    public ApiResponse<List<MessageResponse>> getProjectMessages(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable String projectId) {
        return ApiResponse.ok(messageService.getMessages(user.getUsername(), projectId));
    }

    @GetMapping("/conversation/{conversationId}")
    @Transactional(readOnly = true)
    public ApiResponse<List<MessageResponse>> getConversationMessages(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable String conversationId) {
        return ApiResponse.ok(messageService.getConversationMessages(user.getUsername(), conversationId));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<MessageResponse> sendMessage(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody SendMessageRequest request) {
        MessageResponse msg = messageService.sendMessage(user.getUsername(), request);
        messagingTemplate.convertAndSend("/topic/conversation." + msg.getConversationId(), msg);
        return ApiResponse.ok(msg);
    }

    @GetMapping("/inbox")
    @Transactional(readOnly = true)
    public ApiResponse<List<InboxItemDto>> getInbox(@AuthenticationPrincipal UserDetails user) {
        String uid = user.getUsername();
        List<InboxItemDto> inbox = new ArrayList<>();

        // All messaging (direct chats and project chats) lives in a single
        // conversation per pair of users, so each pair shows up only once here
        List<Conversation> conversations = conversationRepo.findByParticipantUserId(uid);
        for (Conversation c : conversations) {
            List<Message> msgs = messageRepo.findTop1ByConversationIdOrderByCreatedAtDesc(c.getId());
            String lastMsg = msgs.isEmpty() ? "" : msgs.get(0).getContent();
            String lastSenderId = msgs.isEmpty() ? null : msgs.get(0).getSender().getId();
            LocalDateTime lastTime = msgs.isEmpty() ? c.getCreatedAt() : msgs.get(0).getCreatedAt();
            User other = c.getParticipants().stream()
                    .map(ConversationParticipant::getUser)
                    .filter(u -> !u.getId().equals(uid))
                    .findFirst().orElse(null);
            if (other == null) continue;
            inbox.add(new InboxItemDto(
                c.getId(),
                other.getFullName(), other.getAvatarUrl(),
                lastMsg, lastTime, lastSenderId
            ));
        }

        inbox.sort(Comparator.comparing(InboxItemDto::lastMessageTime,
                Comparator.nullsLast(Comparator.reverseOrder())));

        return ApiResponse.ok(inbox);
    }

    public record InboxItemDto(
        String conversationId,
        String otherPartyName,
        String otherPartyAvatarUrl,
        String lastMessage,
        LocalDateTime lastMessageTime,
        String lastSenderId
    ) {}
}
