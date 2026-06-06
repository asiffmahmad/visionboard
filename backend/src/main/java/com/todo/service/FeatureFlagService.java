package com.todo.service;

import com.todo.dto.FeatureFlagDto;
import com.todo.dto.UserFeatureOverrideDto;
import com.todo.enums.FeatureName;

import java.util.List;
import java.util.Map;

public interface FeatureFlagService {
    List<FeatureFlagDto> getAllFeatureFlags();
    FeatureFlagDto updateGlobalFlag(FeatureName featureName, boolean enabled);
    
    UserFeatureOverrideDto overrideUserFeature(Long userId, FeatureName featureName, boolean enabled);
    void removeUserOverride(Long userId, FeatureName featureName);
    
    boolean isFeatureEnabled(FeatureName featureName, Long userId);
    Map<String, Boolean> getEnabledFeaturesForUser(Long userId);
}
