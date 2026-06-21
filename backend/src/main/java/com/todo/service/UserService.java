package com.todo.service;

import com.todo.dto.UserDto;
import com.todo.dto.UserActivityDto;
import com.todo.dto.UserProfileUpdateRequest;
import com.todo.dto.GoogleLoginRequest;
import com.todo.enums.Role;
import java.util.List;

public interface UserService {
    UserDto getProfile(Long userId);
    UserDto updateProfile(Long userId, UserProfileUpdateRequest request);
    UserDto syncWithGoogle(Long userId, GoogleLoginRequest request);
    List<UserActivityDto> getAllUsersWithActivities();
    UserActivityDto updateUserRole(Long userId, Role newRole);
}
