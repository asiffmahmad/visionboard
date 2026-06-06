package com.todo.mapper;

import com.todo.dto.FeatureFlagDto;
import com.todo.entity.FeatureFlag;
import org.springframework.stereotype.Component;

@Component
public class FeatureFlagMapper {

    public FeatureFlagDto toDto(FeatureFlag featureFlag) {
        if (featureFlag == null) {
            return null;
        }
        return new FeatureFlagDto(
            featureFlag.getId(),
            featureFlag.getFeatureName(),
            featureFlag.isEnabledGlobally()
        );
    }
}
