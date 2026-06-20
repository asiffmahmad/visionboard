package com.todo.dto;

public class ImportSummaryDto {
    private int visionsImported;
    private int goalsImported;
    private int tasksImported;
    private int habitsImported;
    private int notesImported;
    private int journalEntriesImported;

    public ImportSummaryDto() {}

    public int getVisionsImported() { return visionsImported; }
    public void setVisionsImported(int visionsImported) { this.visionsImported = visionsImported; }

    public int getGoalsImported() { return goalsImported; }
    public void setGoalsImported(int goalsImported) { this.goalsImported = goalsImported; }

    public int getTasksImported() { return tasksImported; }
    public void setTasksImported(int tasksImported) { this.tasksImported = tasksImported; }

    public int getHabitsImported() { return habitsImported; }
    public void setHabitsImported(int habitsImported) { this.habitsImported = habitsImported; }

    public int getNotesImported() { return notesImported; }
    public void setNotesImported(int notesImported) { this.notesImported = notesImported; }

    public int getJournalEntriesImported() { return journalEntriesImported; }
    public void setJournalEntriesImported(int journalEntriesImported) { this.journalEntriesImported = journalEntriesImported; }
}
