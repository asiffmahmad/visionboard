package com.todo.dto;

import com.todo.enums.Priority;
import com.todo.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record TaskCreateRequest(
    @NotBlank(message = "Title is required")
    String title,

    String description,

    @NotNull(message = "Task status is required")
    TaskStatus status,

    @NotNull(message = "Priority is required")
    Priority priority,

    LocalDate dueDate,
    Long goalId,
    String tags,
    Double progress
) {}
