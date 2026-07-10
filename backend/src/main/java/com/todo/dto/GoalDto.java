package com.todo.dto;

import com.todo.enums.GoalType;
import com.todo.enums.TaskStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record GoalDto(
    Long id,
    Long visionId,
    String visionTitle,
    String title,
    String description,
    GoalType goalType,
    TaskStatus status,
    boolean achieved,
    double progress,
    int totalTasks,
    int completedTasks,
    LocalDate targetDate,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
