package com.todo.entity;

import com.todo.enums.FeatureName;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feature_flags")
public class FeatureFlag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "feature_name", nullable = false, unique = true)
    private FeatureName featureName;

    @Column(name = "enabled_globally", nullable = false)
    private boolean enabledGlobally = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public FeatureFlag() {
    }

    public FeatureFlag(FeatureName featureName, boolean enabledGlobally) {
        this.featureName = featureName;
        this.enabledGlobally = enabledGlobally;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public FeatureName getFeatureName() {
        return featureName;
    }

    public void setFeatureName(FeatureName featureName) {
        this.featureName = featureName;
    }

    public boolean isEnabledGlobally() {
        return enabledGlobally;
    }

    public void setEnabledGlobally(boolean enabledGlobally) {
        this.enabledGlobally = enabledGlobally;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
