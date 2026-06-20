package com.todo.controller;

import com.todo.dto.HabitDto;
import com.todo.dto.HabitRequest;
import com.todo.service.HabitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/habits")
@RequiredArgsConstructor
public class HabitController {

    private final HabitService habitService;
    private final com.todo.service.HabitAnalyticsService habitAnalyticsService;

    @PostMapping
    public ResponseEntity<HabitDto> createHabit(
            @Valid @RequestBody HabitRequest request,
            Authentication authentication) {
        return new ResponseEntity<>(habitService.createHabit(request, authentication.getName()), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<HabitDto>> getAllHabits(Authentication authentication) {
        return ResponseEntity.ok(habitService.getAllHabits(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HabitDto> getHabit(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(habitService.getHabit(id, authentication.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HabitDto> updateHabit(
            @PathVariable Long id,
            @Valid @RequestBody HabitRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(habitService.updateHabit(id, request, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHabit(
            @PathVariable Long id,
            Authentication authentication) {
        habitService.deleteHabit(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/log")
    public ResponseEntity<HabitDto> logHabit(
            @PathVariable Long id,
            @RequestParam LocalDate date,
            @RequestParam String status,
            Authentication authentication) {
        return ResponseEntity.ok(habitService.logHabit(id, date, status, authentication.getName()));
    }

    @GetMapping("/{id}/analytics")
    public ResponseEntity<java.util.Map<String, Object>> getAnalytics(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(habitAnalyticsService.calculateAnalytics(id, authentication.getName()));
    }

    @GetMapping("/{id}/timeline")
    public ResponseEntity<List<java.util.Map<String, Object>>> getTimeline(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(habitAnalyticsService.getTimeline(id, authentication.getName()));
    }

    @GetMapping("/{id}/heatmap")
    public ResponseEntity<List<Integer>> getHeatmap(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(habitAnalyticsService.getHeatmap(id, authentication.getName()));
    }

    @GetMapping("/{id}/achievements")
    public ResponseEntity<List<com.todo.entity.HabitAchievement>> getAchievements(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(java.util.Collections.emptyList()); // Dummy for now
    }

    @PostMapping("/{id}/skip")
    public ResponseEntity<HabitDto> skipHabit(
            @PathVariable Long id,
            @RequestParam LocalDate date,
            @RequestParam String reason,
            @RequestParam(required = false) String notes,
            Authentication authentication) {
        HabitDto habit = habitService.skipHabit(id, date, reason, notes, authentication.getName());
        return ResponseEntity.ok(habit);
    }
}
