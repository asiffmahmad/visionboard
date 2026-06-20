package com.todo.controller;

import com.todo.dto.DataSyncDto;
import com.todo.dto.ImportSummaryDto;
import com.todo.entity.User;
import com.todo.service.DataSyncService;
import com.todo.service.UserService;
import com.todo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.todo.security.UserPrincipal;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/api/v1/sync")
public class DataSyncController {

    @Autowired
    private DataSyncService dataSyncService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/export")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<DataSyncDto> exportData(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId()).orElseThrow();
        return ResponseEntity.ok(dataSyncService.exportData(user));
    }

    @PostMapping("/import")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<ImportSummaryDto> importData(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody DataSyncDto dto) {
        User user = userRepository.findById(userPrincipal.getId()).orElseThrow();
        ImportSummaryDto summary = dataSyncService.importData(user, dto);
        return ResponseEntity.ok(summary);
    }
}
