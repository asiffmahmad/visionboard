package com.todo.service.impl;

import com.todo.dto.TaskCreateRequest;
import com.todo.dto.TaskDto;
import com.todo.entity.Task;
import com.todo.entity.User;
import com.todo.enums.Priority;
import com.todo.enums.TaskStatus;
import com.todo.exception.ResourceNotFoundException;
import com.todo.mapper.TaskMapper;
import com.todo.repository.TaskRepository;
import com.todo.repository.UserRepository;
import com.todo.service.TaskService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final com.todo.repository.GoalRepository goalRepository;
    private final TaskMapper taskMapper;

    public TaskServiceImpl(TaskRepository taskRepository, UserRepository userRepository, com.todo.repository.GoalRepository goalRepository, TaskMapper taskMapper) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.goalRepository = goalRepository;
        this.taskMapper = taskMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TaskDto> getTasks(Long userId, TaskStatus status, Priority priority, LocalDate dueDate, String search, Pageable pageable) {
        Page<Task> tasks = taskRepository.findByUserIdAndFilters(userId, status, priority, dueDate, search, pageable);
        return tasks.map(taskMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public TaskDto getTaskById(Long userId, Long taskId) {
        Task task = getTaskAndVerifyOwnership(userId, taskId);
        return taskMapper.toDto(task);
    }

    @Override
    @Transactional
    public TaskDto createTask(Long userId, TaskCreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        com.todo.entity.Goal goal = null;
        if (request.goalId() != null) {
            goal = goalRepository.findByIdAndUserUsername(request.goalId(), user.getUsername())
                    .orElseThrow(() -> new ResourceNotFoundException("Goal not found"));
        }

        Task task = new Task();
        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setStatus(request.status());
        task.setPriority(request.priority());
        task.setDueDate(request.dueDate());
        task.setTags(request.tags());
        task.setProgress(request.progress() != null ? request.progress() : 0.0);
        task.setGoal(goal);
        task.setUser(user);

        Task savedTask = taskRepository.save(task);
        return taskMapper.toDto(savedTask);
    }

    @Override
    @Transactional
    public TaskDto updateTask(Long userId, Long taskId, TaskCreateRequest request) {
        Task task = getTaskAndVerifyOwnership(userId, taskId);
        
        com.todo.entity.Goal goal = null;
        if (request.goalId() != null) {
            goal = goalRepository.findByIdAndUserUsername(request.goalId(), task.getUser().getUsername())
                    .orElseThrow(() -> new ResourceNotFoundException("Goal not found"));
        }

        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setStatus(request.status());
        task.setPriority(request.priority());
        task.setDueDate(request.dueDate());
        task.setTags(request.tags());
        task.setProgress(request.progress() != null ? request.progress() : task.getProgress());
        task.setGoal(goal);

        Task updatedTask = taskRepository.save(task);
        return taskMapper.toDto(updatedTask);
    }

    @Override
    @Transactional
    public void deleteTask(Long userId, Long taskId) {
        Task task = getTaskAndVerifyOwnership(userId, taskId);
        taskRepository.delete(task);
    }

    @Override
    @Transactional
    public TaskDto updateTaskStatus(Long userId, Long taskId, TaskStatus status) {
        Task task = getTaskAndVerifyOwnership(userId, taskId);
        task.setStatus(status);
        if (status == TaskStatus.COMPLETED) {
            task.setProgress(100.0);
        }
        Task updatedTask = taskRepository.save(task);
        return taskMapper.toDto(updatedTask);
    }

    private Task getTaskAndVerifyOwnership(Long userId, Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        if (!task.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Task not found with id: " + taskId);
        }
        return task;
    }
}
