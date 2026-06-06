package com.todo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.todo.dto.TaskCreateRequest;
import com.todo.dto.TaskDto;
import com.todo.enums.Priority;
import com.todo.enums.TaskStatus;
import com.todo.security.CustomUserDetailsService;
import com.todo.security.JwtAuthenticationEntryPoint;
import com.todo.security.JwtAuthenticationFilter;
import com.todo.security.JwtTokenProvider;
import com.todo.service.TaskService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;

import com.todo.security.UserPrincipal;
import java.util.ArrayList;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;

@WebMvcTest(TaskController.class)
@AutoConfigureMockMvc(addFilters = false)
public class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TaskService taskService;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @MockBean
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    private final UserPrincipal principal = new UserPrincipal(1L, "testuser", "testuser@example.com", "password", new ArrayList<>());

    @BeforeEach
    public void setUp() {
        SecurityContextHolder.getContext().setAuthentication(
            new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities())
        );
    }

    @Test
    public void testGetTasks_Success() throws Exception {
        TaskDto taskDto = new TaskDto(1L, "Title", "Desc", TaskStatus.PENDING, Priority.MEDIUM, LocalDate.now(), LocalDateTime.now(), LocalDateTime.now(), null, null, 0.0);
        Page<TaskDto> page = new PageImpl<>(Collections.singletonList(taskDto));

        when(taskService.getTasks(any(), any(), any(), any(), any(), any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/tasks")
                        .param("page", "0")
                        .param("size", "10")
                        .with(user(principal))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title").value("Title"))
                .andExpect(jsonPath("$.totalElements").value(1));
    }

    @Test
    public void testGetTaskById_Success() throws Exception {
        TaskDto taskDto = new TaskDto(1L, "Title", "Desc", TaskStatus.PENDING, Priority.MEDIUM, LocalDate.now(), LocalDateTime.now(), LocalDateTime.now(), null, null, 0.0);

        when(taskService.getTaskById(any(), eq(1L))).thenReturn(taskDto);

        mockMvc.perform(get("/api/tasks/1")
                        .with(user(principal))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Title"));
    }

    @Test
    public void testCreateTask_Success() throws Exception {
        TaskCreateRequest request = new TaskCreateRequest("New Task", "New Desc", TaskStatus.PENDING, Priority.MEDIUM, LocalDate.now(), null, null, 0.0);
        TaskDto taskDto = new TaskDto(1L, "New Task", "New Desc", TaskStatus.PENDING, Priority.MEDIUM, LocalDate.now(), LocalDateTime.now(), LocalDateTime.now(), null, null, 0.0);

        when(taskService.createTask(any(), any(TaskCreateRequest.class))).thenReturn(taskDto);

        mockMvc.perform(post("/api/tasks")
                        .with(user(principal))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("New Task"));
    }

    @Test
    public void testDeleteTask_Success() throws Exception {
        mockMvc.perform(delete("/api/tasks/1")
                        .with(user(principal))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
    }
}
