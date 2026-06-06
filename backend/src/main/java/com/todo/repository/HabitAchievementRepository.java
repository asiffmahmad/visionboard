package com.todo.repository;

import com.todo.entity.HabitAchievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HabitAchievementRepository extends JpaRepository<HabitAchievement, Long> {
    List<HabitAchievement> findByHabitId(Long habitId);
    boolean existsByHabitIdAndAchievementType(Long habitId, String achievementType);
}
