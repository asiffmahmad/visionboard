package com.todo.repository;

import com.todo.entity.UserFeatureOverride;
import com.todo.enums.FeatureName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserFeatureOverrideRepository extends JpaRepository<UserFeatureOverride, Long> {
    List<UserFeatureOverride> findByUserId(Long userId);
    Optional<UserFeatureOverride> findByUserIdAndFeatureName(Long userId, FeatureName featureName);
}
