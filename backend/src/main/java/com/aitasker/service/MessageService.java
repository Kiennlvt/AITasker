package com.aitasker.service;

import com.aitasker.dto.request.SendMessageRequest;
import com.aitasker.dto.response.MessageResponse;
import java.util.List;

public interface MessageService {
    List<MessageResponse> getMessages(String userId, String projectId);
    List<MessageResponse> getConversationMessages(String userId, String conversationId);
    MessageResponse sendMessage(String senderId, SendMessageRequest request);
}
