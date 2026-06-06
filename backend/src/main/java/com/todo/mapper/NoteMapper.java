package com.todo.mapper;

import com.todo.dto.NoteDto;
import com.todo.entity.Note;
import org.springframework.stereotype.Component;

@Component
public class NoteMapper {

    public NoteDto toDto(Note note) {
        if (note == null) {
            return null;
        }
        return new NoteDto(
            note.getId(),
            note.getTitle(),
            note.getContent(),
            note.getCreatedAt(),
            note.getUpdatedAt()
        );
    }
}
