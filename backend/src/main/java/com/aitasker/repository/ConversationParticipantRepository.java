package com.aitasker.repository;

import com.aitasker.entity.ConversationParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConversationParticipantRepository extends JpaRepository<ConversationParticipant, String> {

    List<ConversationParticipant> findByConversationId(String conversationId);

    boolean existsByConversationIdAndUserId(String conversationId, String userId);
}
