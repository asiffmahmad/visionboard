package com.todo.service;

import com.todo.dto.AnnouncementDto;
import com.todo.dto.AnnouncementRequest;

import java.util.List;

public interface AnnouncementService {
    AnnouncementDto createAnnouncement(AnnouncementRequest request);
    AnnouncementDto updateAnnouncement(Long id, AnnouncementRequest request);
    void deleteAnnouncement(Long id);
    List<AnnouncementDto> getActiveAnnouncements();
    List<AnnouncementDto> getAllAnnouncements();
}
