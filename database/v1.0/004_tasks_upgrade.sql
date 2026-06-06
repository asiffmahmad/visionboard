-- Upgrade tasks table to include goalId, priority CRITICAL (DB keeps using string, no alter needed), tags, and progress.
ALTER TABLE tasks ADD COLUMN goal_id BIGINT;
ALTER TABLE tasks ADD COLUMN tags VARCHAR(1000);
ALTER TABLE tasks ADD COLUMN progress DOUBLE NOT NULL DEFAULT 0.0;
ALTER TABLE tasks ADD CONSTRAINT fk_task_goal FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE SET NULL;
