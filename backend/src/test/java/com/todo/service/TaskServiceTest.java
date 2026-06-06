package com.todo.service;

import com.todo.dto.TaskCreateRequest;
import com.todo.dto.TaskDto;
import com.todo.entity.Task;
import com.todo.entity.User;
import com.todo.enums.Priority;
import com.todo.enums.Role;
import com.todo.enums.TaskStatus;
import com.todo.exception.ResourceNotFoundException;
import com.todo.mapper.TaskMapper;
import com.todo.repository.TaskRepository;
import com.todo.repository.UserRepository;
import com.todo.service.impl.TaskServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    private TaskMapper taskMapper = new TaskMapper();

    private TaskServiceImpl taskService;

    private User user;
    private Task task;
    private TaskDto taskDto;

    @BeforeEach
    public void setUp() {
        user = new User(1L, "username", "user@example.com", "password", Role.USER, true);
        task = new Task(1L, "Test Title", "Test Desc", TaskStatus.PENDING, Priority.MEDIUM, LocalDate.now(), user);
        taskDto = new TaskDto(1L, "Test Title", "Test Desc", TaskStatus.PENDING, Priority.MEDIUM, LocalDate.now(), LocalDateTime.now(), LocalDateTime.now(), null, null, 0.0);
        taskService = new TaskServiceImpl(taskRepository, userRepository, null, taskMapper);
    }

    @Test
    public void testGetTaskById_Success() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        TaskDto result = taskService.getTaskById(1L, 1L);

        assertNotNull(result);
        assertEquals("Test Title", result.title());
        verify(taskRepository, times(1)).findById(1L);
    }

    @Test
    public void testGetTaskById_NotFound() {
        when(taskRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> taskService.getTaskById(1L, 1L));
    }

    @Test
    public void testGetTaskById_UnownedTaskThrowsException() {
        User otherUser = new User(2L, "other", "other@example.com", "pass", Role.USER, true);
        task.setUser(otherUser);

        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        assertThrows(ResourceNotFoundException.class, () -> taskService.getTaskById(1L, 1L));
    }

    @Test
    public void testCreateTask() {
        TaskCreateRequest request = new TaskCreateRequest("New Task", "New Desc", TaskStatus.PENDING, Priority.MEDIUM, LocalDate.now(), null, null, 0.0);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        TaskDto result = taskService.createTask(1L, request);

        assertNotNull(result);
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    public void testDeleteTask() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        doNothing().when(taskRepository).delete(task);

        taskService.deleteTask(1L, 1L);

        verify(taskRepository, times(1)).delete(task);
    }
}
