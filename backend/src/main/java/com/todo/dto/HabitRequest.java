package com.todo.dto;

import com.todo.enums.HabitFrequency;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.FutureOrPresent;

public record HabitRequest(
    @NotBlank(message = "Title is required")
    String title,

    @NotNull(message = "Frequency is required")
    HabitFrequency frequency,

    String purpose,

    @FutureOrPresent(message = "Start date cannot be in the past")
    java.time.LocalDate startDate
) {}
