package com.todo.dto;

import com.todo.enums.FeatureName;

public record FeatureFlagDto(
    Long id,
    FeatureName featureName,
    boolean enabledGlobally
) {}
