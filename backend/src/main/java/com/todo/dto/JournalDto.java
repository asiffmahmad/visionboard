package com.todo.dto;

import com.todo.enums.JournalType;
import java.time.LocalDateTime;

public record JournalDto(
    Long id,
    String title,
    String content,
    String mood,
    JournalType entryType,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
