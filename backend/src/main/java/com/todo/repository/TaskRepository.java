package com.todo.repository;

import com.todo.entity.Task;
import com.todo.enums.Priority;
import com.todo.enums.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    @EntityGraph(attributePaths = {"goal"})
    @Query("SELECT t FROM Task t WHERE t.user.id = :userId AND " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:priority IS NULL OR t.priority = :priority) AND " +
           "(:dueDate IS NULL OR t.dueDate = :dueDate) AND " +
           "(:search IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Task> findByUserIdAndFilters(
            @Param("userId") Long userId,
            @Param("status") TaskStatus status,
            @Param("priority") Priority priority,
            @Param("dueDate") LocalDate dueDate,
            @Param("search") String search,
            Pageable pageable
    );

    Long countByUserId(Long userId);

    Long countByUserIdAndStatus(Long userId, TaskStatus status);

    Long countByGoalId(Long goalId);

    Long countByGoalIdAndStatus(Long goalId, TaskStatus status);

    @EntityGraph(attributePaths = {"goal"})
    List<Task> findTop5ByUserIdOrderByCreatedAtDesc(Long userId);

    @EntityGraph(attributePaths = {"goal"})
    List<Task> findByUserIdOrderByCreatedAtDesc(Long userId);
}
