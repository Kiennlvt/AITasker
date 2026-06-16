package com.aitasker.service.impl;

import com.aitasker.entity.Conversation;
import com.aitasker.entity.ConversationParticipant;
import com.aitasker.entity.User;
import com.aitasker.exception.AppException;
import com.aitasker.repository.ConversationParticipantRepository;
import com.aitasker.repository.ConversationRepository;
import com.aitasker.repository.UserRepository;
import com.aitasker.service.ConversationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class ConversationServiceImpl implements ConversationService {

    private final ConversationRepository conversationRepo;
    private final ConversationParticipantRepository participantRepo;
    private final UserRepository userRepo;

    @Override
    @Transactional
    public Conversation findOrCreateDirect(String userId1, String userId2) {
        return conversationRepo.findDirectBetween(userId1, userId2)
                .orElseGet(() -> createDirect(userId1, userId2));
    }

    private Conversation createDirect(String userId1, String userId2) {
        User user1 = userRepo.findById(userId1)
                .orElseThrow(() -> AppException.notFound("User not found"));
        User user2 = userRepo.findById(userId2)
                .orElseThrow(() -> AppException.notFound("User not found"));

        Conversation conversation = conversationRepo.save(
                Conversation.builder().participants(new ArrayList<>()).build()
        );

        participantRepo.save(ConversationParticipant.builder()
                .conversation(conversation)
                .user(user1)
                .build());
        participantRepo.save(ConversationParticipant.builder()
                .conversation(conversation)
                .user(user2)
                .build());

        return conversation;
    }
}