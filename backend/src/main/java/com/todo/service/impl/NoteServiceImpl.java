package com.todo.service.impl;

import com.todo.dto.NoteDto;
import com.todo.dto.NoteRequest;
import com.todo.entity.Note;
import com.todo.entity.User;
import com.todo.exception.ResourceNotFoundException;
import com.todo.mapper.NoteMapper;
import com.todo.repository.NoteRepository;
import com.todo.repository.UserRepository;
import com.todo.service.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoteServiceImpl implements NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    private final NoteMapper noteMapper;

    @Override
    @Transactional
    public NoteDto createNote(NoteRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Note note = new Note();
        note.setUser(user);
        note.setTitle(request.title());
        note.setContent(request.content());

        return noteMapper.toDto(noteRepository.save(note));
    }

    @Override
    @Transactional
    public NoteDto updateNote(Long id, NoteRequest request, String username) {
        Note note = noteRepository.findByIdAndUserUsername(id, username)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));

        note.setTitle(request.title());
        note.setContent(request.content());
        note.setUpdatedAt(LocalDateTime.now());

        return noteMapper.toDto(noteRepository.save(note));
    }

    @Override
    @Transactional
    public void deleteNote(Long id, String username) {
        Note note = noteRepository.findByIdAndUserUsername(id, username)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));
        noteRepository.delete(note);
    }

    @Override
    public NoteDto getNote(Long id, String username) {
        Note note = noteRepository.findByIdAndUserUsername(id, username)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));
        return noteMapper.toDto(note);
    }

    @Override
    public List<NoteDto> getAllNotes(String username) {
        return noteRepository.findByUserUsernameOrderByCreatedAtDesc(username).stream()
                .map(noteMapper::toDto)
                .collect(Collectors.toList());
    }
}
