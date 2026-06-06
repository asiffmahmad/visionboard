package com.todo.controller;

import com.todo.dto.JournalDto;
import com.todo.dto.JournalRequest;
import com.todo.service.JournalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/journal")
@RequiredArgsConstructor
public class JournalController {

    private final JournalService journalService;

    @PostMapping
    public ResponseEntity<JournalDto> createEntry(
            @Valid @RequestBody JournalRequest request,
            Authentication authentication) {
        return new ResponseEntity<>(journalService.createEntry(request, authentication.getName()), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<JournalDto>> getAllEntries(Authentication authentication) {
        return ResponseEntity.ok(journalService.getAllEntries(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JournalDto> getEntry(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(journalService.getEntry(id, authentication.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JournalDto> updateEntry(
            @PathVariable Long id,
            @Valid @RequestBody JournalRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(journalService.updateEntry(id, request, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntry(
            @PathVariable Long id,
            Authentication authentication) {
        journalService.deleteEntry(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
