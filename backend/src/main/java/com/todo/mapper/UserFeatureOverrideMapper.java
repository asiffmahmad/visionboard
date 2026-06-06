package com.todo.mapper;

import com.todo.dto.UserFeatureOverrideDto;
import com.todo.entity.UserFeatureOverride;
import org.springframework.stereotype.Component;

@Component
public class UserFeatureOverrideMapper {

    public UserFeatureOverrideDto toDto(UserFeatureOverride override) {
        if (override == null) {
            return null;
        }
        return new UserFeatureOverrideDto(
            override.getId(),
            override.getUser() != null ? override.getUser().getId() : null,
            override.getUser() != null ? override.getUser().getUsername() : null,
            override.getFeatureName(),
            override.isEnabled()
        );
    }
}
