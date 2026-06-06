package com.todo.mapper;

import com.todo.dto.GoalDto;
import com.todo.entity.Goal;
import org.springframework.stereotype.Component;

@Component
public class GoalMapper {

    public GoalDto toDto(Goal goal) {
        if (goal == null) {
            return null;
        }
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
            goal.getTargetDate(),
            goal.getCreatedAt(),
            goal.getUpdatedAt()
        );
    }
}
