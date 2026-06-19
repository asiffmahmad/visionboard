package com.todo.dto;

import com.todo.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserActivityDto {
    private Long id;
    private String username;
    private String email;
    private Role role;
    private boolean enabled;
    
    // Activity counts
    private Long tasksCount;
    private Long goalsCount;
    private Long habitsCount;
    private Long visionsCount;
    
    // Login Info
    private java.time.LocalDateTime lastSeen;
}
