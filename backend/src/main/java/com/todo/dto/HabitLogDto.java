package com.todo.dto;

import com.todo.enums.HabitLogStatus;
import java.time.LocalDate;

public record HabitLogDto(
    Long id,
    LocalDate date,
    HabitLogStatus status,
    String skipReason,
    String notes
) {}
