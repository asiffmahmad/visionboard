package com.todo.service.impl;

import com.todo.dto.JournalDto;
import com.todo.dto.JournalRequest;
import com.todo.entity.JournalEntry;
import com.todo.entity.User;
import com.todo.exception.ResourceNotFoundException;
import com.todo.mapper.JournalMapper;
import com.todo.repository.JournalRepository;
import com.todo.repository.UserRepository;
import com.todo.service.JournalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JournalServiceImpl implements JournalService {

    private final JournalRepository journalRepository;
    private final UserRepository userRepository;
    private final JournalMapper journalMapper;

    @Override
    @Transactional
    public JournalDto createEntry(JournalRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        JournalEntry entry = new JournalEntry();
        entry.setUser(user);
        entry.setTitle(request.title());
        entry.setContent(request.content());
        entry.setMood(request.mood());
        entry.setEntryType(request.entryType());

        return journalMapper.toDto(journalRepository.save(entry));
    }

    @Override
    @Transactional
    public JournalDto updateEntry(Long id, JournalRequest request, String username) {
        JournalEntry entry = journalRepository.findByIdAndUserUsername(id, username)
                .orElseThrow(() -> new ResourceNotFoundException("Journal entry not found"));

        entry.setTitle(request.title());
        entry.setContent(request.content());
        entry.setMood(request.mood());
        entry.setEntryType(request.entryType());
        entry.setUpdatedAt(LocalDateTime.now());

        return journalMapper.toDto(journalRepository.save(entry));
    }

    @Override
    @Transactional
    public void deleteEntry(Long id, String username) {
        JournalEntry entry = journalRepository.findByIdAndUserUsername(id, username)
                .orElseThrow(() -> new ResourceNotFoundException("Journal entry not found"));
        journalRepository.delete(entry);
    }

    @Override
    public JournalDto getEntry(Long id, String username) {
        JournalEntry entry = journalRepository.findByIdAndUserUsername(id, username)
                .orElseThrow(() -> new ResourceNotFoundException("Journal entry not found"));
        return journalMapper.toDto(entry);
    }

    @Override
    public List<JournalDto> getAllEntries(String username) {
        return journalRepository.findByUserUsernameOrderByCreatedAtDesc(username).stream()
                .map(journalMapper::toDto)
                .collect(Collectors.toList());
    }
}
