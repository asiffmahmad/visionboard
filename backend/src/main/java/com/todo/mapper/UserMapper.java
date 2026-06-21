package com.todo.mapper;

import com.todo.dto.UserDto;
import com.todo.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    private final com.todo.service.FeatureFlagService featureFlagService;

    public UserMapper(com.todo.service.FeatureFlagService featureFlagService) {
        this.featureFlagService = featureFlagService;
    }

    public UserDto toDto(User user) {
        if (user == null) {
            return null;
        }
        return new UserDto(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getRole().name(),
            featureFlagService.getEnabledFeaturesForUser(user.getId()),
            user.getAvatarUrl(),
            user.isGoogleSynced()
        );
    }
}
