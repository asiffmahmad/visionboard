package com.todo.repository;

import com.todo.entity.FeatureFlag;
import com.todo.enums.FeatureName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FeatureFlagRepository extends JpaRepository<FeatureFlag, Long> {
    Optional<FeatureFlag> findByFeatureName(FeatureName featureName);
}
