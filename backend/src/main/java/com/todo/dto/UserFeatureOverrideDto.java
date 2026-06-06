package com.todo.dto;

import com.todo.enums.FeatureName;

public record UserFeatureOverrideDto(
    Long id,
    Long userId,
    String username,
    FeatureName featureName,
    boolean enabled
) {}
