package com.todo.repository;

import com.todo.entity.Goal;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {
    
    @EntityGraph(attributePaths = {"vision"})
    List<Goal> findByUserId(Long userId);
    
    @EntityGraph(attributePaths = {"vision"})
    List<Goal> findByUserUsernameOrderByCreatedAtDesc(String username);
    
    @EntityGraph(attributePaths = {"vision"})
    List<Goal> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    Optional<Goal> findByIdAndUserUsername(Long id, String username);
    
    @EntityGraph(attributePaths = {"vision"})
    List<Goal> findByVisionIdAndUserUsername(Long visionId, String username);
}
