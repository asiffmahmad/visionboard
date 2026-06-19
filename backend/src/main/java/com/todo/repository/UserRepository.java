package com.todo.repository;

import com.todo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import com.todo.dto.UserActivityDto;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);

    @Query("SELECT new com.todo.dto.UserActivityDto(" +
           "u.id, u.username, u.email, u.role, u.enabled, " +
           "(SELECT COUNT(t) FROM Task t WHERE t.user = u), " +
           "(SELECT COUNT(g) FROM Goal g WHERE g.user = u), " +
           "(SELECT COUNT(h) FROM Habit h WHERE h.user = u), " +
           "(SELECT COUNT(v) FROM Vision v WHERE v.user = u), " +
           "u.lastSeen) " +
           "FROM User u")
    List<UserActivityDto> findAllUsersWithActivityCounts();
}
