package com.todo.repository;

import com.todo.entity.JournalEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JournalRepository extends JpaRepository<JournalEntry, Long> {
    long countByUserId(Long userId);
    List<JournalEntry> findByUserUsernameOrderByCreatedAtDesc(String username);
    Optional<JournalEntry> findByIdAndUserUsername(Long id, String username);
}
