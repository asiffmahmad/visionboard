package com.todo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UserDto(
    Long id,
    String username,
    String email,
    String role,
    java.util.Map<String, Boolean> features,
    String avatarUrl,
    @JsonProperty("isGoogleSynced") boolean isGoogleSynced
) {}
