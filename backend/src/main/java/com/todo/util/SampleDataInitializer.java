package com.todo.util;

import com.todo.entity.User;
import com.todo.enums.Role;
import com.todo.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class SampleDataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(SampleDataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.todo.repository.VisionRepository visionRepository;
    private final com.todo.repository.GoalRepository goalRepository;
    private final com.todo.repository.TaskRepository taskRepository;
    private final com.todo.repository.HabitRepository habitRepository;

    public SampleDataInitializer(
            UserRepository userRepository, 
            PasswordEncoder passwordEncoder,
            com.todo.repository.VisionRepository visionRepository,
            com.todo.repository.GoalRepository goalRepository,
            com.todo.repository.TaskRepository taskRepository,
            com.todo.repository.HabitRepository habitRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.visionRepository = visionRepository;
        this.goalRepository = goalRepository;
        this.taskRepository = taskRepository;
        this.habitRepository = habitRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        logger.info("Initializing sample data...");

        if (!userRepository.existsByEmail("admin@example.com")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setRole(Role.ADMIN);
            admin.setEnabled(true);
            userRepository.save(admin);
            logger.info("Created default admin user: admin@example.com");
        }

        if (!userRepository.existsByEmail("user@example.com")) {
            User user = new User();
            user.setUsername("user");
            user.setEmail("user@example.com");
            user.setPassword(passwordEncoder.encode("User@123"));
            user.setRole(Role.USER);
            user.setEnabled(true);
            userRepository.save(user);
            logger.info("Created default user: user@example.com");
        }
        
        // Seed Test Data for regular user
        User regularUser = userRepository.findByEmail("user@example.com").orElse(null);
        if (regularUser != null && visionRepository.count() == 0) {
            seedDataForUser(regularUser);
        }
        
        // Seed Test Data for Admin
        User adminUser = userRepository.findByEmail("admin@example.com").orElse(null);
        if (adminUser != null && goalRepository.count() == 1) { // assuming 1 was just seeded for regular user
            seedDataForUser(adminUser);
        }

        logger.info("Sample data initialization completed.");
    }
    
    private void seedDataForUser(User targetUser) {
        logger.info("Seeding test data for user: " + targetUser.getEmail());
        
        com.todo.entity.Vision vision = new com.todo.entity.Vision();
        vision.setUser(targetUser);
        vision.setTitle("Become a Senior Engineer");
        vision.setDescription("Master backend architectures and frontend design.");
        vision.setVisionType(com.todo.enums.VisionType.CAREER);
        vision.setTargetDate(java.time.LocalDate.now().plusMonths(6));
        vision.setStatus(com.todo.enums.TaskStatus.IN_PROGRESS);
        vision.setAchieved(false);
        visionRepository.save(vision);

        com.todo.entity.Goal goal = new com.todo.entity.Goal();
        goal.setUser(targetUser);
        goal.setVision(vision);
        goal.setTitle("Learn Spring Boot deeply");
        goal.setDescription("Read docs, build 5 projects.");
        goal.setGoalType(com.todo.enums.GoalType.SHORT_TERM);
        goal.setTargetDate(java.time.LocalDate.now().plusMonths(2));
        goal.setStatus(com.todo.enums.TaskStatus.IN_PROGRESS);
        goal.setProgress(35.0);
        goal.setAchieved(false);
        goalRepository.save(goal);

        com.todo.entity.Task task1 = new com.todo.entity.Task();
        task1.setUser(targetUser);
        task1.setGoal(goal);
        task1.setTitle("Complete Security Module");
        task1.setDescription("Implement JWT auth");
        task1.setStatus(com.todo.enums.TaskStatus.PENDING);
        task1.setPriority(com.todo.enums.Priority.HIGH);
        task1.setDueDate(java.time.LocalDate.now().plusDays(2));
        taskRepository.save(task1);

        com.todo.entity.Task task2 = new com.todo.entity.Task();
        task2.setUser(targetUser);
        task2.setGoal(goal);
        task2.setTitle("Design the Dashboard UI");
        task2.setDescription("Create a world-class OS interface.");
        task2.setStatus(com.todo.enums.TaskStatus.COMPLETED);
        task2.setPriority(com.todo.enums.Priority.HIGH);
        task2.setDueDate(java.time.LocalDate.now().minusDays(1));
        taskRepository.save(task2);

        com.todo.entity.Habit habit = new com.todo.entity.Habit();
        habit.setUser(targetUser);
        habit.setTitle("Read Tech Blogs");
        habit.setFrequency(com.todo.enums.HabitFrequency.DAILY);
        habitRepository.save(habit);
    }
}