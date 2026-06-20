package com.todo.dto;

import com.todo.entity.*;
import java.util.List;

public class DataSyncDto {
    private List<Vision> visions;
    private List<Goal> goals;
    private List<Task> tasks;
    private List<Habit> habits;
    private List<Note> notes;
    private List<JournalEntry> journalEntries;

    public DataSyncDto() {}

    public List<Vision> getVisions() { return visions; }
    public void setVisions(List<Vision> visions) { this.visions = visions; }

    public List<Goal> getGoals() { return goals; }
    public void setGoals(List<Goal> goals) { this.goals = goals; }

    public List<Task> getTasks() { return tasks; }
    public void setTasks(List<Task> tasks) { this.tasks = tasks; }

    public List<Habit> getHabits() { return habits; }
    public void setHabits(List<Habit> habits) { this.habits = habits; }

    public List<Note> getNotes() { return notes; }
    public void setNotes(List<Note> notes) { this.notes = notes; }

    public List<JournalEntry> getJournalEntries() { return journalEntries; }
    public void setJournalEntries(List<JournalEntry> journalEntries) { this.journalEntries = journalEntries; }
}
