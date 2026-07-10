package com.todo.mapper;

import com.todo.dto.GoalDto;
import com.todo.entity.Goal;
import com.todo.repository.TaskRepository;
import com.todo.enums.TaskStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class GoalMapper {

    @Autowired
    private TaskRepository taskRepository;

    public GoalDto toDto(Goal goal) {
        if (goal == null) {
            return null;
        }
        
        int totalTasks = taskRepository.countByGoalId(goal.getId()).intValue();
        int completedTasks = taskRepository.countByGoalIdAndStatus(goal.getId(), TaskStatus.COMPLETED).intValue();

        return new GoalDto(
            goal.getId(),
            goal.getVision() != null ? goal.getVision().getId() : null,
            goal.getVision() != null ? goal.getVision().getTitle() : null,
            goal.getTitle(),
            goal.getDescription(),
            goal.getGoalType(),
            goal.getStatus(),
            goal.isAchieved(),
            goal.getProgress(),
            totalTasks,
            completedTasks,
            goal.getTargetDate(),
            goal.getCreatedAt(),
            goal.getUpdatedAt()
        );
    }
}
