package com.todo.controller;

import com.todo.dto.DashboardStatsDto;
import com.todo.dto.GoogleDashboardDataDto;
import com.todo.security.UserPrincipal;
import com.todo.service.DashboardStatsService;
import com.todo.service.GoogleDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardStatsService dashboardStatsService;
    private final GoogleDataService googleDataService;

    public DashboardController(DashboardStatsService dashboardStatsService, GoogleDataService googleDataService) {
        this.dashboardStatsService = dashboardStatsService;
        this.googleDataService = googleDataService;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getStats(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(dashboardStatsService.getStats(userPrincipal.getId()));
    }

    @GetMapping("/google-data")
    public ResponseEntity<GoogleDashboardDataDto> getGoogleData(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(googleDataService.getDashboardData(userPrincipal.getId()));
    }
}
