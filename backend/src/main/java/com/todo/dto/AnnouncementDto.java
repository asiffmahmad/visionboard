package com.todo.dto;

import java.time.LocalDateTime;

public record AnnouncementDto(
    Long id,
    String title,
    String content,
    boolean active,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
