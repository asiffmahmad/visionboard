package com.todo.dto;

import java.util.List;
import java.util.Map;

public record DashboardStatsDto(
    long totalTasks,
    long completedTasks,
    long pendingTasks,
    long inProgressTasks,
    double completionPercentage,
    List<TaskDto> recentTasks,
    long totalVisions,
    double avgVisionProgress,
    long totalGoals,
    long completedGoals,
    long totalHabits,
    int bestStreak,
    long totalNotes,
    long totalJournalEntries,
    List<VisionDto> recentVisions,
    List<HabitDto> topHabits,
    Map<String, Boolean> enabledFeatures
) {}
