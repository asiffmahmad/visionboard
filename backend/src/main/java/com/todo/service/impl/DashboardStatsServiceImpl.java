package com.todo.service.impl;

import com.todo.dto.DashboardStatsDto;
import com.todo.dto.HabitDto;
import com.todo.dto.TaskDto;
import com.todo.dto.VisionDto;
import com.todo.entity.Goal;
import com.todo.entity.Habit;
import com.todo.entity.User;
import com.todo.entity.Vision;
import com.todo.enums.TaskStatus;
import com.todo.mapper.HabitMapper;
import com.todo.mapper.TaskMapper;
import com.todo.mapper.VisionMapper;
import com.todo.repository.*;
import com.todo.service.DashboardStatsService;
import com.todo.service.FeatureFlagService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardStatsServiceImpl implements DashboardStatsService {

    private final TaskRepository taskRepository;
    private final VisionRepository visionRepository;
    private final GoalRepository goalRepository;
    private final HabitRepository habitRepository;
    private final NoteRepository noteRepository;
    private final JournalRepository journalRepository;
    private final FeatureFlagService featureFlagService;
    private final TaskMapper taskMapper;
    private final VisionMapper visionMapper;
    private final HabitMapper habitMapper;

    @Override
    @Transactional(readOnly = true)
    @org.springframework.cache.annotation.Cacheable(value = "dashboardStats", key = "#userId")
    public DashboardStatsDto getStats(Long userId) {
        long totalTasks = taskRepository.countByUserId(userId);
        long completedTasks = taskRepository.countByUserIdAndStatus(userId, TaskStatus.COMPLETED);
        long pendingTasks = taskRepository.countByUserIdAndStatus(userId, TaskStatus.PENDING);
        long inProgressTasks = taskRepository.countByUserIdAndStatus(userId, TaskStatus.IN_PROGRESS);

        double completionPercentage = 0.0;
        if (totalTasks > 0) {
            completionPercentage = ((double) completedTasks / totalTasks) * 100.0;
        }

        List<TaskDto> recentTasks = taskRepository.findTop5ByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(taskMapper::toDto)
                .collect(Collectors.toList());

        List<Vision> visions = visionRepository.findByUserIdOrderByCreatedAtDesc(userId);
        long totalVisions = visions.size();
        double avgVisionProgress = visions.stream().mapToDouble(Vision::getProgress).average().orElse(0.0);
        List<VisionDto> recentVisions = visions.stream().limit(5).map(visionMapper::toDto).collect(Collectors.toList());

        List<Goal> goals = goalRepository.findByUserId(userId);
        long totalGoals = goals.size();
        long completedGoals = goals.stream().filter(Goal::isAchieved).count();

        List<Habit> habits = habitRepository.findByUserIdOrderByCreatedAtDesc(userId);
        long totalHabits = habits.size();
        int bestStreak = habits.stream().mapToInt(Habit::getStreak).max().orElse(0);
        List<HabitDto> topHabits = habits.stream()
                .sorted((h1, h2) -> Integer.compare(h2.getStreak(), h1.getStreak()))
                .limit(5)
                .map(habitMapper::toDto)
                .collect(Collectors.toList());

        long totalNotes = noteRepository.countByUserId(userId);
        long totalJournalEntries = journalRepository.countByUserId(userId);

        Map<String, Boolean> enabledFeatures = featureFlagService.getEnabledFeaturesForUser(userId);

        return new DashboardStatsDto(
                totalTasks,
                completedTasks,
                pendingTasks,
                inProgressTasks,
                completionPercentage,
                recentTasks,
                totalVisions,
                avgVisionProgress,
                totalGoals,
                completedGoals,
                totalHabits,
                bestStreak,
                totalNotes,
                totalJournalEntries,
                recentVisions,
                topHabits,
                enabledFeatures
        );
    }
}
