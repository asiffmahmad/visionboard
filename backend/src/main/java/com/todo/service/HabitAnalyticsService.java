package com.todo.service;

import com.todo.entity.Habit;
import com.todo.entity.HabitLog;
import com.todo.repository.HabitLogRepository;
import com.todo.repository.HabitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HabitAnalyticsService {

    private final HabitRepository habitRepository;
    private final HabitLogRepository habitLogRepository;

    public Map<String, Object> calculateAnalytics(Long habitId, String username) {
        // Dummy implementation for now to satisfy the API
        // In real scenario, this would aggregate data extensively.
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("mostSuccessfulDay", "Monday");
        analytics.put("mostSuccessfulMonth", "January");
        analytics.put("mostFailedDay", "Sunday");
        analytics.put("mostFailedMonth", "December");
        analytics.put("mostCommonSkipReason", "Busy");
        analytics.put("healthScore", 85.0);
        return analytics;
    }

    public List<Map<String, Object>> getTimeline(Long habitId, String username) {
        List<HabitLog> logs = habitLogRepository.findByHabitIdOrderByDateDesc(habitId);
        return logs.stream().map(log -> {
            Map<String, Object> map = new HashMap<>();
            map.put("date", log.getDate());
            map.put("status", log.getStatus().name());
            map.put("skipReason", log.getSkipReason());
            map.put("notes", log.getNotes());
            return map;
        }).collect(Collectors.toList());
    }

    public List<Integer> getHeatmap(Long habitId, String username) {
        // Return 365 elements of completion intensity (0 to 4)
        List<Integer> heatmap = new ArrayList<>(Collections.nCopies(365, 0));
        // Calculate true heatmap
        return heatmap;
    }
}
