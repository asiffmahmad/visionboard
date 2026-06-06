package com.todo.service.impl;

import com.todo.dto.GoalDto;
import com.todo.dto.GoalRequest;
import com.todo.entity.Goal;
import com.todo.entity.User;
import com.todo.entity.Vision;
import com.todo.exception.ResourceNotFoundException;
import com.todo.mapper.GoalMapper;
import com.todo.repository.GoalRepository;
import com.todo.repository.UserRepository;
import com.todo.repository.VisionRepository;
import com.todo.service.GoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoalServiceImpl implements GoalService {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;
    private final VisionRepository visionRepository;
    private final GoalMapper goalMapper;

    @Override
    @Transactional
    public GoalDto createGoal(GoalRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Vision vision = null;
        if (request.visionId() != null) {
            vision = visionRepository.findByIdAndUserUsername(request.visionId(), username)
                    .orElseThrow(() -> new ResourceNotFoundException("Vision not found"));
        }

        Goal goal = new Goal();
        goal.setUser(user);
        goal.setTitle(request.title());
        goal.setDescription(request.description());
        goal.setGoalType(request.goalType());
        goal.setTargetDate(request.targetDate());
        goal.setVision(vision);
        goal.setAchieved(false);
        goal.setProgress(0.0);

        return goalMapper.toDto(goalRepository.save(goal));
    }

    @Override
    @Transactional
    public GoalDto updateGoal(Long id, GoalRequest request, String username) {
        Goal goal = goalRepository.findByIdAndUserUsername(id, username)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found"));

        Vision vision = null;
        if (request.visionId() != null) {
            vision = visionRepository.findByIdAndUserUsername(request.visionId(), username)
                    .orElseThrow(() -> new ResourceNotFoundException("Vision not found"));
        }

        goal.setTitle(request.title());
        goal.setDescription(request.description());
        goal.setGoalType(request.goalType());
        goal.setTargetDate(request.targetDate());
        goal.setVision(vision);
        goal.setUpdatedAt(LocalDateTime.now());

        return goalMapper.toDto(goalRepository.save(goal));
    }

    @Override
    @Transactional
    public void deleteGoal(Long id, String username) {
        Goal goal = goalRepository.findByIdAndUserUsername(id, username)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found"));
        goalRepository.delete(goal);
    }

    @Override
    public GoalDto getGoal(Long id, String username) {
        Goal goal = goalRepository.findByIdAndUserUsername(id, username)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found"));
        return goalMapper.toDto(goal);
    }

    @Override
    public List<GoalDto> getAllGoals(String username) {
        return goalRepository.findByUserUsernameOrderByCreatedAtDesc(username).stream()
                .map(goalMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<GoalDto> getGoalsByVision(Long visionId, String username) {
        return goalRepository.findByVisionIdAndUserUsername(visionId, username).stream()
                .map(goalMapper::toDto)
                .collect(Collectors.toList());
    }
}
