package com.todo.mapper;

import com.todo.dto.JournalDto;
import com.todo.entity.JournalEntry;
import org.springframework.stereotype.Component;

@Component
public class JournalMapper {

    public JournalDto toDto(JournalEntry entry) {
        if (entry == null) {
            return null;
        }
        return new JournalDto(
            entry.getId(),
            entry.getTitle(),
            entry.getContent(),
            entry.getMood(),
            entry.getEntryType(),
            entry.getCreatedAt(),
            entry.getUpdatedAt()
        );
    }
}
