package com.todo.controller;

import com.todo.dto.AnnouncementDto;
import com.todo.dto.AnnouncementRequest;
import com.todo.dto.FeatureFlagDto;
import com.todo.dto.UserFeatureOverrideDto;
import com.todo.enums.FeatureName;
import com.todo.service.AnnouncementService;
import com.todo.service.FeatureFlagService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AnnouncementService announcementService;
    private final FeatureFlagService featureFlagService;

    // --- Announcements ---

    @PostMapping("/announcements")
    public ResponseEntity<AnnouncementDto> createAnnouncement(
            @Valid @RequestBody AnnouncementRequest request) {
        return new ResponseEntity<>(announcementService.createAnnouncement(request), HttpStatus.CREATED);
    }

    @GetMapping("/announcements")
    public ResponseEntity<List<AnnouncementDto>> getAllAnnouncements() {
        return ResponseEntity.ok(announcementService.getAllAnnouncements());
    }

    @PutMapping("/announcements/{id}")
    public ResponseEntity<AnnouncementDto> updateAnnouncement(
            @PathVariable Long id,
            @Valid @RequestBody AnnouncementRequest request) {
        return ResponseEntity.ok(announcementService.updateAnnouncement(id, request));
    }

    @DeleteMapping("/announcements/{id}")
    public ResponseEntity<Void> deleteAnnouncement(@PathVariable Long id) {
        announcementService.deleteAnnouncement(id);
        return ResponseEntity.noContent().build();
    }

    // --- Feature Flags ---

    @GetMapping("/feature-flags")
    public ResponseEntity<List<FeatureFlagDto>> getAllFeatureFlags() {
        return ResponseEntity.ok(featureFlagService.getAllFeatureFlags());
    }

    @PutMapping("/feature-flags/{featureName}")
    public ResponseEntity<FeatureFlagDto> updateGlobalFlag(
            @PathVariable FeatureName featureName,
            @RequestParam boolean enabled) {
        return ResponseEntity.ok(featureFlagService.updateGlobalFlag(featureName, enabled));
    }

    @PostMapping("/feature-flags/override")
    public ResponseEntity<UserFeatureOverrideDto> overrideUserFeature(
            @RequestParam Long userId,
            @RequestParam FeatureName featureName,
            @RequestParam boolean enabled) {
        return ResponseEntity.ok(featureFlagService.overrideUserFeature(userId, featureName, enabled));
    }

    @DeleteMapping("/feature-flags/override")
    public ResponseEntity<Void> removeUserOverride(
            @RequestParam Long userId,
            @RequestParam FeatureName featureName) {
        featureFlagService.removeUserOverride(userId, featureName);
        return ResponseEntity.noContent().build();
    }
}
