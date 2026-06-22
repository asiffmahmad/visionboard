package com.todo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class TodoApplication {
    public static void main(String[] args) {
        SpringApplication.run(TodoApplication.class, args);
    }

    @org.springframework.context.annotation.Bean
    public org.springframework.boot.CommandLineRunner schemaFixer(org.springframework.jdbc.core.JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                jdbcTemplate.execute("ALTER TABLE habit_logs MODIFY COLUMN status VARCHAR(50)");
                jdbcTemplate.execute("ALTER TABLE feature_flags MODIFY COLUMN feature_name VARCHAR(100)");
                jdbcTemplate.execute("ALTER TABLE user_feature_overrides MODIFY COLUMN feature_name VARCHAR(100)");
                System.out.println("Successfully altered database schemas to prevent enum truncation");
            } catch (Exception e) {
                System.err.println("Failed to alter table: " + e.getMessage());
            }
        };
    }
}
