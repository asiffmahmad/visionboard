package com.todo.dto;

public record UserDto(
    Long id,
    String username,
    String email,
    String role,
    java.util.Map<String, Boolean> features
) {}
