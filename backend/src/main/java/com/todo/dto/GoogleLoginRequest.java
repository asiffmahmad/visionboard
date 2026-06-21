package com.todo.dto;

import jakarta.validation.constraints.NotBlank;

public record GoogleLoginRequest(
    String credential,
    String accessToken
) {}
