package com.todo.service;

import com.todo.dto.NoteDto;
import com.todo.dto.NoteRequest;

import java.util.List;

public interface NoteService {
    NoteDto createNote(NoteRequest request, String username);
    NoteDto updateNote(Long id, NoteRequest request, String username);
    void deleteNote(Long id, String username);
    NoteDto getNote(Long id, String username);
    List<NoteDto> getAllNotes(String username);
}
