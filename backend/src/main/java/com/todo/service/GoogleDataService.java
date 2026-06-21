package com.todo.service;

import com.todo.dto.GoogleDashboardDataDto;

public interface GoogleDataService {
    GoogleDashboardDataDto getDashboardData(Long userId);
}
