package com.todo.dto;

import com.todo.enums.HabitFrequency;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record HabitRequest(
    @NotBlank(message = "Title is required")
    String title,

    @NotNull(message = "Frequency is required")
    HabitFrequency frequency,

    String purpose,

    java.time.LocalDate startDate
) {}
