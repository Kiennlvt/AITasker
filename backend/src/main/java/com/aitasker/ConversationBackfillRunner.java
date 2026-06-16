package com.aitasker;

import com.aitasker.entity.Conversation;
import com.aitasker.entity.Message;
import com.aitasker.entity.Project;
import com.aitasker.repository.MessageRepository;
import com.aitasker.repository.ProjectRepository;
import com.aitasker.service.ConversationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * One-time backfill: links every pre-existing Project (and its Messages) to a
 * shared client-expert Conversation, so older data merges into the same
 * inbox thread as newly created projects. Safe to run on every startup —
 * only touches rows that are still missing a conversation.
 */
@Component
@Order(1)
@RequiredArgsConstructor
@Slf4j
public class ConversationBackfillRunner implements CommandLineRunner {

    private final ProjectRepository projectRepo;
    private final MessageRepository messageRepo;
    private final ConversationService conversationService;

    @Override
    @Transactional
    public void run(String... args) {
        List<Project> orphanProjects = projectRepo.findByConversationIsNull();
        if (!orphanProjects.isEmpty()) {
            log.info("Backfilling conversations for {} project(s)...", orphanProjects.size());
            for (Project project : orphanProjects) {
                Conversation conversation = conversationService.findOrCreateDirect(
                        project.getClient().getId(), project.getExpert().getId());
                project.setConversation(conversation);
                projectRepo.save(project);
            }
        }

        List<Message> orphanMessages = messageRepo.findByConversationIsNullAndProjectIsNotNull();
        if (!orphanMessages.isEmpty()) {
            log.info("Backfilling conversations for {} message(s)...", orphanMessages.size());
            for (Message message : orphanMessages) {
                message.setConversation(message.getProject().getConversation());
                messageRepo.save(message);
            }
        }
    }
}