package com.todo.service;

import com.todo.dto.AuthResponse;
import com.todo.dto.LoginRequest;
import com.todo.dto.RegisterRequest;
import com.todo.dto.TokenRefreshRequest;
import com.todo.dto.GoogleLoginRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse googleLogin(GoogleLoginRequest request);
    AuthResponse refresh(TokenRefreshRequest request);
    void logout(String refreshTokenValue);
}
