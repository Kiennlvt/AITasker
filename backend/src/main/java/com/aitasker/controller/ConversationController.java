package com.aitasker.controller;

import com.aitasker.dto.response.ApiResponse;
import com.aitasker.entity.Conversation;
import com.aitasker.entity.ConversationParticipant;
import com.aitasker.entity.User;
import com.aitasker.exception.AppException;
import com.aitasker.repository.ConversationParticipantRepository;
import com.aitasker.repository.ConversationRepository;
import com.aitasker.repository.UserRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Optional;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationRepository conversationRepo;
    private final ConversationParticipantRepository participantRepo;
    private final UserRepository userRepo;

    @PostMapping("/direct")
    @Transactional
    public ApiResponse<DirectConversationResponse> findOrCreateDirect(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String recipientId) {

        String currentUserId = userDetails.getUsername();

        if (currentUserId.equals(recipientId))
            throw AppException.badRequest("Cannot start a conversation with yourself");

        User recipient = userRepo.findById(recipientId)
                .orElseThrow(() -> AppException.notFound("User not found"));

        Optional<Conversation> existing = conversationRepo.findDirectBetween(currentUserId, recipientId);
        if (existing.isPresent()) {
            return ApiResponse.ok(new DirectConversationResponse(existing.get().getId(), false));
        }

        User currentUser = userRepo.findById(currentUserId)
                .orElseThrow(() -> AppException.notFound("Current user not found"));

        Conversation conversation = conversationRepo.save(
                Conversation.builder().participants(new ArrayList<>()).build()
        );

        participantRepo.save(ConversationParticipant.builder()
                .conversation(conversation)
                .user(currentUser)
                .build());
        participantRepo.save(ConversationParticipant.builder()
                .conversation(conversation)
                .user(recipient)
                .build());

        return ApiResponse.ok(new DirectConversationResponse(conversation.getId(), true));
    }

    @Data
    @Builder
    public static class DirectConversationResponse {
        private String conversationId;
        private boolean isNew;

        public DirectConversationResponse(String conversationId, boolean isNew) {
            this.conversationId = conversationId;
            this.isNew = isNew;
        }
    }
}
