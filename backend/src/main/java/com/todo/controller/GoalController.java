package com.todo.controller;

import com.todo.dto.GoalDto;
import com.todo.dto.GoalRequest;
import com.todo.service.GoalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;

    @PostMapping
    public ResponseEntity<GoalDto> createGoal(
            @Valid @RequestBody GoalRequest request,
            Authentication authentication) {
        return new ResponseEntity<>(goalService.createGoal(request, authentication.getName()), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<GoalDto>> getAllGoals(Authentication authentication) {
        return ResponseEntity.ok(goalService.getAllGoals(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GoalDto> getGoal(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(goalService.getGoal(id, authentication.getName()));
    }

    @GetMapping("/vision/{visionId}")
    public ResponseEntity<List<GoalDto>> getGoalsByVision(
            @PathVariable Long visionId,
            Authentication authentication) {
        return ResponseEntity.ok(goalService.getGoalsByVision(visionId, authentication.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GoalDto> updateGoal(
            @PathVariable Long id,
            @Valid @RequestBody GoalRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(goalService.updateGoal(id, request, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(
            @PathVariable Long id,
            Authentication authentication) {
        goalService.deleteGoal(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
