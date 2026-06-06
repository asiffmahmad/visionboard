package com.todo.mapper;

import com.todo.dto.TaskDto;
import com.todo.entity.Task;
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {

    public TaskDto toDto(Task task) {
        if (task == null) {
            return null;
        }
        return new TaskDto(
            task.getId(),
            task.getTitle(),
            task.getDescription(),
            task.getStatus(),
            task.getPriority(),
            task.getDueDate(),
            task.getCreatedAt(),
            task.getUpdatedAt(),
            task.getGoal() != null ? task.getGoal().getId() : null,
            task.getTags(),
            task.getProgress()
        );
    }
}
