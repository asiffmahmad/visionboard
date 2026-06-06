package com.todo.repository;

import com.todo.entity.Habit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HabitRepository extends JpaRepository<Habit, Long> {
    List<Habit> findByUserId(Long userId);
    List<Habit> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Habit> findByUserUsernameOrderByCreatedAtDesc(String username);
    Optional<Habit> findByIdAndUserUsername(Long id, String username);
}
