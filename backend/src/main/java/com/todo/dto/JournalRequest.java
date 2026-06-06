package com.todo.dto;

import com.todo.enums.JournalType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record JournalRequest(
    @NotBlank(message = "Title is required")
    String title,

    String content,

    String mood,

    @NotNull(message = "Entry type is required")
    JournalType entryType
) {}
