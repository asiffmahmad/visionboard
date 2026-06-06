package com.todo.dto;

import com.todo.enums.VisionType;
import com.todo.enums.TaskStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record VisionDto(
    Long id,
    String title,
    String description,
    VisionType visionType,
    LocalDate targetDate,
    TaskStatus status,
    boolean achieved,
    double progress,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
