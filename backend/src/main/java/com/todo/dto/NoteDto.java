package com.todo.dto;

import java.time.LocalDateTime;

public record NoteDto(
    Long id,
    String title,
    String content,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
