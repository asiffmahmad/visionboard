package com.todo.dto;

import com.todo.enums.Priority;
import com.todo.enums.TaskStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record TaskDto(
    Long id,
    String title,
    String description,
    TaskStatus status,
    Priority priority,
    LocalDate dueDate,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    Long goalId,
    String tags,
    double progress
) {}
