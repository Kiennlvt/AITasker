package com.aitasker.repository;

import com.aitasker.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, String> {
    List<Message> findByProjectIdOrderByCreatedAtAsc(String projectId);

    // Latest message per project (for inbox preview)
    List<Message> findTop1ByProjectIdOrderByCreatedAtDesc(String projectId);
}
