package com.aitasker.repository;

import com.aitasker.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, String> {

    @Query("""
        SELECT DISTINCT c FROM Conversation c
        JOIN FETCH c.participants p
        JOIN FETCH p.user
        WHERE c.id IN (
            SELECT p2.conversation.id FROM ConversationParticipant p2 WHERE p2.user.id = :userId
        )
        """)
    List<Conversation> findByParticipantUserId(@Param("userId") String userId);

    @Query("""
        SELECT c FROM Conversation c
        WHERE (SELECT COUNT(p) FROM ConversationParticipant p WHERE p.conversation = c AND p.user.id IN (:id1, :id2)) = 2
        AND (SELECT COUNT(p) FROM ConversationParticipant p WHERE p.conversation = c) = 2
        """)
    Optional<Conversation> findDirectBetween(@Param("id1") String id1, @Param("id2") String id2);
}
