package com.todo.service.impl;

import com.todo.dto.HabitDto;
import com.todo.dto.HabitRequest;
import com.todo.entity.Habit;
import com.todo.entity.HabitLog;
import com.todo.entity.User;
import com.todo.exception.ResourceNotFoundException;
import com.todo.mapper.HabitMapper;
import com.todo.repository.HabitLogRepository;
import com.todo.repository.HabitRepository;
import com.todo.repository.UserRepository;
import com.todo.service.HabitService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HabitServiceImpl implements HabitService {

    private final HabitRepository habitRepository;
    private final HabitLogRepository habitLogRepository;
    private final UserRepository userRepository;
    private final HabitMapper habitMapper;

    @Override
    @Transactional
    public HabitDto createHabit(HabitRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Habit habit = new Habit();
        habit.setUser(user);
        habit.setTitle(request.title());
        habit.setFrequency(request.frequency());
        habit.setPurpose(request.purpose());
        habit.setStartDate(request.startDate() != null ? request.startDate() : LocalDate.now());
        habit.setStreak(0);
        habit.setBestStreak(0);
        habit.setCompletionRate(0.0);
        habit.setHealthScore(0.0);
        habit.setDaysActive(0);

        return habitMapper.toDto(habitRepository.save(habit));
    }

    @Override
    @Transactional
    public HabitDto updateHabit(Long id, HabitRequest request, String username) {
        Habit habit = habitRepository.findByIdAndUserUsername(id, username)
                .orElseThrow(() -> new ResourceNotFoundException("Habit not found"));

        habit.setTitle(request.title());
        habit.setFrequency(request.frequency());
        if (request.purpose() != null) {
            habit.setPurpose(request.purpose());
        }
        if (request.startDate() != null) {
            habit.setStartDate(request.startDate());
        }
        habit.setUpdatedAt(LocalDateTime.now());

        return habitMapper.toDto(habitRepository.save(habit));
    }

    @Override
    @Transactional
    public void deleteHabit(Long id, String username) {
        Habit habit = habitRepository.findByIdAndUserUsername(id, username)
                .orElseThrow(() -> new ResourceNotFoundException("Habit not found"));
        habitRepository.delete(habit);
    }

    @Override
    public HabitDto getHabit(Long id, String username) {
        Habit habit = habitRepository.findByIdAndUserUsername(id, username)
                .orElseThrow(() -> new ResourceNotFoundException("Habit not found"));
        return habitMapper.toDto(habit);
    }

    @Override
    public List<HabitDto> getAllHabits(String username) {
        return habitRepository.findByUserUsernameOrderByCreatedAtDesc(username).stream()
                .map(habitMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public HabitDto logHabit(Long id, LocalDate date, boolean completed, String username) {
        Habit habit = habitRepository.findByIdAndUserUsername(id, username)
                .orElseThrow(() -> new ResourceNotFoundException("Habit not found"));

        Optional<HabitLog> existingLog = habitLogRepository.findByHabitIdAndDate(id, date);

        com.todo.enums.HabitLogStatus newStatus = completed ? com.todo.enums.HabitLogStatus.COMPLETED : com.todo.enums.HabitLogStatus.NONE;

        if (existingLog.isPresent()) {
            HabitLog log = existingLog.get();
            log.setStatus(newStatus);
            habitLogRepository.save(log);
        } else {
            HabitLog log = new HabitLog();
            log.setHabit(habit);
            log.setDate(date);
            log.setStatus(newStatus);
            habitLogRepository.save(log);
        }

        // Simplistic streak & completion calculation (will be replaced/enhanced by HabitAnalyticsService later)
        long totalLogs = habitLogRepository.findByHabitIdOrderByDateDesc(id).size();
        long completedLogs = habitLogRepository.findByHabitIdOrderByDateDesc(id).stream().filter(l -> l.getStatus() == com.todo.enums.HabitLogStatus.COMPLETED).count();
        habit.setCompletionRate(totalLogs > 0 ? (double) completedLogs / totalLogs * 100 : 0.0);
        
        habit.setStreak(completed ? habit.getStreak() + 1 : 0);
        if (habit.getStreak() > habit.getBestStreak()) {
            habit.setBestStreak(habit.getStreak());
        }
        
        // Naive days active calculation
        if (habit.getStartDate() != null) {
            habit.setDaysActive((int) java.time.temporal.ChronoUnit.DAYS.between(habit.getStartDate(), LocalDate.now()) + 1);
        }

        return habitMapper.toDto(habitRepository.save(habit));
    }

    @Override
    @Transactional
    public HabitDto skipHabit(Long id, LocalDate date, String skipReason, String notes, String username) {
        Habit habit = habitRepository.findByIdAndUserUsername(id, username)
                .orElseThrow(() -> new ResourceNotFoundException("Habit not found"));

        Optional<HabitLog> existingLog = habitLogRepository.findByHabitIdAndDate(id, date);

        HabitLog log;
        if (existingLog.isPresent()) {
            log = existingLog.get();
        } else {
            log = new HabitLog();
            log.setHabit(habit);
            log.setDate(date);
        }

        log.setStatus(com.todo.enums.HabitLogStatus.SKIPPED);
        log.setSkipReason(skipReason);
        log.setNotes(notes);
        habitLogRepository.save(log);

        habit.setStreak(0); // Skip breaks streak
        return habitMapper.toDto(habitRepository.save(habit));
    }
}
