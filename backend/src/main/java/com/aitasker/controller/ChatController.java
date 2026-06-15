package com.aitasker.controller;

import com.aitasker.dto.request.SendMessageRequest;
import com.aitasker.dto.response.MessageResponse;
import com.aitasker.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.send")
    public void handleMessage(@Payload SendMessageRequest request, Principal principal) {
        MessageResponse msg = messageService.sendMessage(principal.getName(), request);
        if (request.getProjectId() != null) {
            messagingTemplate.convertAndSend("/topic/project." + request.getProjectId(), msg);
        } else {
            messagingTemplate.convertAndSend("/topic/conversation." + request.getConversationId(), msg);
        }
    }
}
