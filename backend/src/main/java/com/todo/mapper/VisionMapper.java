package com.todo.mapper;

import com.todo.dto.VisionDto;
import com.todo.entity.Vision;
import org.springframework.stereotype.Component;

@Component
public class VisionMapper {

    public VisionDto toDto(Vision vision) {
        if (vision == null) {
            return null;
        }
        return new VisionDto(
            vision.getId(),
            vision.getTitle(),
            vision.getDescription(),
            vision.getVisionType(),
            vision.getTargetDate(),
            vision.getStatus(),
            vision.isAchieved(),
            vision.getProgress(),
            vision.getCreatedAt(),
            vision.getUpdatedAt()
        );
    }
}
