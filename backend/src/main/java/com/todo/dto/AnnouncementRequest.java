package com.todo.dto;

import jakarta.validation.constraints.NotBlank;

public record AnnouncementRequest(
    @NotBlank(message = "Title is required")
    String title,

    @NotBlank(message = "Content is required")
    String content,

    boolean active
) {}
