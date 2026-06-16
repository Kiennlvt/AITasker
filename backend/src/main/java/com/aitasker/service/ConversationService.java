package com.aitasker.service;

import com.aitasker.entity.Conversation;

public interface ConversationService {
    Conversation findOrCreateDirect(String userId1, String userId2);
}