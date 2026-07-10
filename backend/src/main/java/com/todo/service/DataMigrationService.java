package com.todo.service;

import com.todo.entity.JournalEntry;
import com.todo.entity.Note;
import com.todo.enums.JournalType;
import com.todo.repository.JournalEntryRepository;
import com.todo.repository.NoteRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DataMigrationService {

    private static final Logger logger = LoggerFactory.getLogger(DataMigrationService.class);

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private JournalEntryRepository journalEntryRepository;

    @PostConstruct
    public void migrateNotesToJournal() {
        logger.info("Starting data migration: Notes to JournalEntries");
        try {
            List<Note> allNotes = noteRepository.findAll();
            if (allNotes.isEmpty()) {
                logger.info("No notes found to migrate.");
                return;
            }

            int migratedCount = 0;
            for (Note note : allNotes) {
                // Check if this note was already migrated by checking title/content/createdAt?
                // For safety, we can assume if we migrate, we delete the note to avoid duplication on restart.
                // But the user requested to keep the old table intact. 
                // To prevent duplicate migration on every restart, we can just check if a journal entry with exact title, content, user and createdAt exists.
                
                boolean alreadyMigrated = journalEntryRepository.findByUserIdOrderByCreatedAtDesc(note.getUser().getId()).stream()
                        .anyMatch(je -> je.getTitle().equals(note.getTitle()) 
                                && je.getCreatedAt().equals(note.getCreatedAt())
                                && je.getEntryType() == JournalType.GENERAL_NOTE);

                if (!alreadyMigrated) {
                    JournalEntry je = new JournalEntry();
                    je.setUser(note.getUser());
                    je.setTitle(note.getTitle());
                    je.setContent(note.getContent());
                    je.setEntryType(JournalType.GENERAL_NOTE);
                    je.setMood("Neutral"); // Default mood
                    je.setCreatedAt(note.getCreatedAt());
                    je.setUpdatedAt(note.getUpdatedAt());

                    journalEntryRepository.save(je);
                    migratedCount++;
                }
            }
            logger.info("Successfully migrated {} notes to journal entries.", migratedCount);
        } catch (Exception e) {
            logger.error("Error during data migration", e);
        }
    }
}
