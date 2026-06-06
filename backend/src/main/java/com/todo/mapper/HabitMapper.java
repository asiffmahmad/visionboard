package com.todo.mapper;

import com.todo.dto.HabitDto;
import com.todo.entity.Habit;
import com.todo.entity.HabitLog;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class HabitMapper {

    public HabitDto toDto(Habit habit) {
        if (habit == null) {
            return null;
        }

        List<LocalDate> completedDates = null;
        if (habit.getLogs() != null) {
            completedDates = habit.getLogs().stream()
                .filter(log -> log.getStatus() == com.todo.enums.HabitLogStatus.COMPLETED)
                .map(HabitLog::getDate)
                .collect(Collectors.toList());
        }

        return new HabitDto(
            habit.getId(),
            habit.getTitle(),
            habit.getFrequency(),
            habit.getPurpose(),
            habit.getStartDate(),
            habit.getStreak(),
            habit.getBestStreak(),
            habit.getCompletionRate(),
            habit.getHealthScore(),
            habit.getDaysActive(),
            completedDates,
            habit.getCreatedAt(),
            habit.getUpdatedAt()
        );
    }
}
