package com.todo.dto;

import java.util.List;

public record GoogleDashboardDataDto(
    List<GoogleCalendarEventDto> events,
    GoogleYouTubeStatsDto youtubeStats,
    List<GoogleMailDto> unreadEmails
) {}
