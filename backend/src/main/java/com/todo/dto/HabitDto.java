package com.todo.dto;

import com.todo.enums.HabitFrequency;
import java.time.LocalDateTime;
import java.util.List;
import java.time.LocalDate;

public record HabitDto(
    Long id,
    String title,
    HabitFrequency frequency,
    String purpose,
    LocalDate startDate,
    int streak,
    int bestStreak,
    double completionRate,
    double healthScore,
    int daysActive,
    List<LocalDate> completedDates,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
