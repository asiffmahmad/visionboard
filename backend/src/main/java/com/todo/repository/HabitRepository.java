package com.todo.repository;

import com.todo.entity.Habit;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HabitRepository extends JpaRepository<Habit, Long> {
    
    @EntityGraph(attributePaths = {"logs"})
    List<Habit> findByUserId(Long userId);
    
    @EntityGraph(attributePaths = {"logs"})
    List<Habit> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    @EntityGraph(attributePaths = {"logs"})
    List<Habit> findByUserUsernameOrderByCreatedAtDesc(String username);
    
    Optional<Habit> findByIdAndUserUsername(Long id, String username);
}
