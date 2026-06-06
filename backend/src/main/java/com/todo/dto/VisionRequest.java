package com.todo.dto;

import com.todo.enums.VisionType;
import com.todo.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record VisionRequest(
    @NotBlank(message = "Title is required")
    String title,

    String description,

    @NotNull(message = "Vision type is required")
    VisionType visionType,

    LocalDate targetDate,

    @NotNull(message = "Status is required")
    TaskStatus status,

    double progress
) {}
