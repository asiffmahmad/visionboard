package com.todo.service.impl;

import com.todo.dto.FeatureFlagDto;
import com.todo.dto.UserFeatureOverrideDto;
import com.todo.entity.FeatureFlag;
import com.todo.entity.User;
import com.todo.entity.UserFeatureOverride;
import com.todo.enums.FeatureName;
import com.todo.exception.ResourceNotFoundException;
import com.todo.mapper.FeatureFlagMapper;
import com.todo.mapper.UserFeatureOverrideMapper;
import com.todo.repository.FeatureFlagRepository;
import com.todo.repository.UserFeatureOverrideRepository;
import com.todo.repository.UserRepository;
import com.todo.service.FeatureFlagService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeatureFlagServiceImpl implements FeatureFlagService {

    private final FeatureFlagRepository featureFlagRepository;
    private final UserFeatureOverrideRepository overrideRepository;
    private final UserRepository userRepository;
    private final FeatureFlagMapper featureFlagMapper;
    private final UserFeatureOverrideMapper overrideMapper;

    @Override
    public List<FeatureFlagDto> getAllFeatureFlags() {
        return featureFlagRepository.findAll().stream()
                .map(featureFlagMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public FeatureFlagDto updateGlobalFlag(FeatureName featureName, boolean enabled) {
        FeatureFlag flag = featureFlagRepository.findByFeatureName(featureName)
                .orElseGet(() -> {
                    FeatureFlag newFlag = new FeatureFlag();
                    newFlag.setFeatureName(featureName);
                    return newFlag;
                });
        flag.setEnabledGlobally(enabled);
        return featureFlagMapper.toDto(featureFlagRepository.save(flag));
    }

    @Override
    @Transactional
    public UserFeatureOverrideDto overrideUserFeature(Long userId, FeatureName featureName, boolean enabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserFeatureOverride override = overrideRepository.findByUserIdAndFeatureName(userId, featureName)
                .orElseGet(() -> {
                    UserFeatureOverride newOverride = new UserFeatureOverride();
                    newOverride.setUser(user);
                    newOverride.setFeatureName(featureName);
                    return newOverride;
                });
        override.setEnabled(enabled);
        return overrideMapper.toDto(overrideRepository.save(override));
    }

    @Override
    @Transactional
    public void removeUserOverride(Long userId, FeatureName featureName) {
        overrideRepository.findByUserIdAndFeatureName(userId, featureName)
                .ifPresent(overrideRepository::delete);
    }

    @Override
    public boolean isFeatureEnabled(FeatureName featureName, Long userId) {
        Optional<UserFeatureOverride> override = overrideRepository.findByUserIdAndFeatureName(userId, featureName);
        if (override.isPresent()) {
            return override.get().isEnabled();
        }

        return featureFlagRepository.findByFeatureName(featureName)
                .map(FeatureFlag::isEnabledGlobally)
                .orElse(false);
    }

    @Override
    public Map<String, Boolean> getEnabledFeaturesForUser(Long userId) {
        Map<String, Boolean> features = new HashMap<>();
        
        // 1. Get global flags
        List<FeatureFlag> globalFlags = featureFlagRepository.findAll();
        for (FeatureFlag flag : globalFlags) {
            features.put(flag.getFeatureName().name(), flag.isEnabledGlobally());
        }

        // 2. Override with user-specific flags
        List<UserFeatureOverride> overrides = overrideRepository.findByUserId(userId);
        for (UserFeatureOverride override : overrides) {
            features.put(override.getFeatureName().name(), override.isEnabled());
        }

        return features;
    }
}
