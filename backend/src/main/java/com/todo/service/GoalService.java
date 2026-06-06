package com.todo.service;

import com.todo.dto.GoalDto;
import com.todo.dto.GoalRequest;

import java.util.List;

public interface GoalService {
    GoalDto createGoal(GoalRequest request, String username);
    GoalDto updateGoal(Long id, GoalRequest request, String username);
    void deleteGoal(Long id, String username);
    GoalDto getGoal(Long id, String username);
    List<GoalDto> getAllGoals(String username);
    List<GoalDto> getGoalsByVision(Long visionId, String username);
}
