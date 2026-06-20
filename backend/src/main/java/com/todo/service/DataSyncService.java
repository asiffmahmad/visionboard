package com.todo.service;

import com.todo.dto.DataSyncDto;
import com.todo.entity.*;
import com.todo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DataSyncService {

    @Autowired private VisionRepository visionRepository;
    @Autowired private GoalRepository goalRepository;
    @Autowired private TaskRepository taskRepository;
    @Autowired private HabitRepository habitRepository;
    @Autowired private NoteRepository noteRepository;
    @Autowired private JournalEntryRepository journalEntryRepository;

    public DataSyncDto exportData(User user) {
        DataSyncDto dto = new DataSyncDto();
        dto.setVisions(visionRepository.findByUserIdOrderByCreatedAtDesc(user.getId()));
        dto.setGoals(goalRepository.findByUserIdOrderByCreatedAtDesc(user.getId()));
        // For Tasks we don't have findByUserIdOrderByCreatedAtDesc. Let's just use findByUserIdAndFilters but it requires pageable.
        // Actually, TaskService has a method to get all tasks. Let's check TaskRepository.
        dto.setHabits(habitRepository.findByUserIdOrderByCreatedAtDesc(user.getId()));
        dto.setNotes(noteRepository.findByUserUsernameOrderByCreatedAtDesc(user.getUsername()));
        dto.setJournalEntries(journalEntryRepository.findByUserIdOrderByCreatedAtDesc(user.getId()));
        return dto;
    }

    @Transactional
    public void importData(User user, DataSyncDto dto) {
        if (dto.getVisions() != null) {
            for (Vision v : dto.getVisions()) { v.setUser(user); }
            visionRepository.saveAll(dto.getVisions());
        }
        if (dto.getGoals() != null) {
            for (Goal g : dto.getGoals()) { g.setUser(user); }
            goalRepository.saveAll(dto.getGoals());
        }
        if (dto.getTasks() != null) {
            for (Task t : dto.getTasks()) { t.setUser(user); }
            taskRepository.saveAll(dto.getTasks());
        }
        if (dto.getHabits() != null) {
            for (Habit h : dto.getHabits()) { h.setUser(user); }
            habitRepository.saveAll(dto.getHabits());
        }
        if (dto.getNotes() != null) {
            for (Note n : dto.getNotes()) { n.setUser(user); }
            noteRepository.saveAll(dto.getNotes());
        }
        if (dto.getJournalEntries() != null) {
            for (JournalEntry j : dto.getJournalEntries()) { j.setUser(user); }
            journalEntryRepository.saveAll(dto.getJournalEntries());
        }
    }
}
