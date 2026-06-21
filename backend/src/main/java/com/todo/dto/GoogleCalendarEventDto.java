package com.todo.dto;

public record GoogleCalendarEventDto(
    String id,
    String summary,
    String startTime,
    String endTime,
    String htmlLink
) {}
