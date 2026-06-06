package com.todo.service;

import com.todo.dto.HabitDto;
import com.todo.dto.HabitRequest;

import java.time.LocalDate;
import java.util.List;

public interface HabitService {
    HabitDto createHabit(HabitRequest request, String username);
    HabitDto updateHabit(Long id, HabitRequest request, String username);
    void deleteHabit(Long id, String username);
    HabitDto getHabit(Long id, String username);
    List<HabitDto> getAllHabits(String username);
    HabitDto logHabit(Long id, LocalDate date, boolean completed, String username);
    HabitDto skipHabit(Long id, LocalDate date, String skipReason, String notes, String username);
}
