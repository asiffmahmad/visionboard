package com.todo.controller;

import com.todo.dto.UserDto;
import com.todo.dto.UserProfileUpdateRequest;
import com.todo.dto.GoogleLoginRequest;
import com.todo.security.UserPrincipal;
import com.todo.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDto> getProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(userService.getProfile(userPrincipal.getId()));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateProfile(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody UserProfileUpdateRequest request) {
        return ResponseEntity.ok(userService.updateProfile(userPrincipal.getId(), request));
    }

    @PostMapping("/sync-google")
    public ResponseEntity<UserDto> syncWithGoogle(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody GoogleLoginRequest request) {
        return ResponseEntity.ok(userService.syncWithGoogle(userPrincipal.getId(), request));
    }
}
