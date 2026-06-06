package com.todo.service.impl;

import com.todo.dto.AnnouncementDto;
import com.todo.dto.AnnouncementRequest;
import com.todo.entity.Announcement;
import com.todo.exception.ResourceNotFoundException;
import com.todo.mapper.AnnouncementMapper;
import com.todo.repository.AnnouncementRepository;
import com.todo.service.AnnouncementService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnnouncementServiceImpl implements AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final AnnouncementMapper announcementMapper;

    @Override
    @Transactional
    public AnnouncementDto createAnnouncement(AnnouncementRequest request) {
        Announcement announcement = new Announcement();
        announcement.setTitle(request.title());
        announcement.setContent(request.content());
        announcement.setActive(request.active());

        return announcementMapper.toDto(announcementRepository.save(announcement));
    }

    @Override
    @Transactional
    public AnnouncementDto updateAnnouncement(Long id, AnnouncementRequest request) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement not found"));

        announcement.setTitle(request.title());
        announcement.setContent(request.content());
        announcement.setActive(request.active());
        announcement.setUpdatedAt(LocalDateTime.now());

        return announcementMapper.toDto(announcementRepository.save(announcement));
    }

    @Override
    @Transactional
    public void deleteAnnouncement(Long id) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement not found"));
        announcementRepository.delete(announcement);
    }

    @Override
    public List<AnnouncementDto> getActiveAnnouncements() {
        return announcementRepository.findByActiveTrueOrderByCreatedAtDesc().stream()
                .map(announcementMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AnnouncementDto> getAllAnnouncements() {
        return announcementRepository.findAll().stream()
                .map(announcementMapper::toDto)
                .collect(Collectors.toList());
    }
}
