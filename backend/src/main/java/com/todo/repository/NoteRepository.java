package com.todo.repository;

import com.todo.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    long countByUserId(Long userId);
    List<Note> findByUserUsernameOrderByCreatedAtDesc(String username);
    Optional<Note> findByIdAndUserUsername(Long id, String username);
}
