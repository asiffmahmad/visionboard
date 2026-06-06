package com.todo.mapper;

import com.todo.dto.AnnouncementDto;
import com.todo.entity.Announcement;
import org.springframework.stereotype.Component;

@Component
public class AnnouncementMapper {

    public AnnouncementDto toDto(Announcement announcement) {
        if (announcement == null) {
            return null;
        }
        return new AnnouncementDto(
            announcement.getId(),
            announcement.getTitle(),
            announcement.getContent(),
            announcement.isActive(),
            announcement.getCreatedAt(),
            announcement.getUpdatedAt()
        );
    }
}
