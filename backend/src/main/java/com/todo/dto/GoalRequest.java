package com.todo.dto;

import com.todo.enums.GoalType;
import com.todo.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record GoalRequest(
    @NotNull(message = "Vision ID is required")
    Long visionId,

    @NotBlank(message = "Title is required")
    String title,

    String description,

    @NotNull(message = "Goal type is required")
    GoalType goalType,

    @NotNull(message = "Status is required")
    TaskStatus status,

    double progress,

    LocalDate targetDate
) {}
