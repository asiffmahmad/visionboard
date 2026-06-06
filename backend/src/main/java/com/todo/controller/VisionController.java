package com.todo.controller;

import com.todo.dto.VisionDto;
import com.todo.dto.VisionRequest;
import com.todo.service.VisionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/visions")
@RequiredArgsConstructor
public class VisionController {

    private final VisionService visionService;

    @PostMapping
    public ResponseEntity<VisionDto> createVision(
            @Valid @RequestBody VisionRequest request,
            Authentication authentication) {
        return new ResponseEntity<>(visionService.createVision(request, authentication.getName()), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<VisionDto>> getAllVisions(Authentication authentication) {
        return ResponseEntity.ok(visionService.getAllVisions(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VisionDto> getVision(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(visionService.getVision(id, authentication.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VisionDto> updateVision(
            @PathVariable Long id,
            @Valid @RequestBody VisionRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(visionService.updateVision(id, request, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVision(
            @PathVariable Long id,
            Authentication authentication) {
        visionService.deleteVision(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
