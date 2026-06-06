package com.todo.repository;

import com.todo.entity.Vision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VisionRepository extends JpaRepository<Vision, Long> {
    List<Vision> findByUserId(Long userId);
    List<Vision> findByUserUsernameOrderByCreatedAtDesc(String username);
    List<Vision> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Vision> findByIdAndUserUsername(Long id, String username);
}
