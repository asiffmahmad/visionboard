package com.todo.controller;

import com.todo.dto.NoteDto;
import com.todo.dto.NoteRequest;
import com.todo.service.NoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @PostMapping
    public ResponseEntity<NoteDto> createNote(
            @Valid @RequestBody NoteRequest request,
            Authentication authentication) {
        return new ResponseEntity<>(noteService.createNote(request, authentication.getName()), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<NoteDto>> getAllNotes(Authentication authentication) {
        return ResponseEntity.ok(noteService.getAllNotes(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<NoteDto> getNote(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(noteService.getNote(id, authentication.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NoteDto> updateNote(
            @PathVariable Long id,
            @Valid @RequestBody NoteRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(noteService.updateNote(id, request, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(
            @PathVariable Long id,
            Authentication authentication) {
        noteService.deleteNote(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
