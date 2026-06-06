package com.todo.service;

import com.todo.dto.JournalDto;
import com.todo.dto.JournalRequest;

import java.util.List;

public interface JournalService {
    JournalDto createEntry(JournalRequest request, String username);
    JournalDto updateEntry(Long id, JournalRequest request, String username);
    void deleteEntry(Long id, String username);
    JournalDto getEntry(Long id, String username);
    List<JournalDto> getAllEntries(String username);
}
