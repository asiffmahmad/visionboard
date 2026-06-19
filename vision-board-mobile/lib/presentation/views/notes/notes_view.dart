import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../viewmodels/note_viewmodel.dart';
import '../../../data/models/note.dart';
import '../../widgets/glass_card.dart';
import '../../widgets/skeleton_loader.dart';
import '../../../core/theme/colors.dart';

class NotesView extends StatefulWidget {
  const NotesView({Key? key}) : super(key: key);

  @override
  State<NotesView> createState() => _NotesViewState();
}

class _NotesViewState extends State<NotesView> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<NoteViewModel>(context, listen: false).fetchNotes();
    });
  }

  void _showNoteDetailDialog(Note note) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(note.title, style: const TextStyle(fontWeight: FontWeight.bold)),
        content: SingleChildScrollView(
          child: Text(
            note.content,
            style: const TextStyle(fontSize: 14, height: 1.4),
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Close')),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _showCreateNoteSheet(existingNote: note);
            },
            child: const Text('Edit'),
          ),
        ],
      ),
    );
  }

  void _showCreateNoteSheet({Note? existingNote}) {
    final titleController = TextEditingController(text: existingNote?.title);
    final contentController = TextEditingController(text: existingNote?.content);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom,
            top: 24,
            left: 24,
            right: 24,
          ),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  existingNote == null ? 'Create Note' : 'Edit Note',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 20),
                TextField(
                  controller: titleController,
                  decoration: const InputDecoration(
                    labelText: 'Note Title',
                    hintText: 'e.g. Project brainstorm ideas',
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: contentController,
                  decoration: const InputDecoration(
                    labelText: 'Content',
                    hintText: 'Write details here...',
                  ),
                  maxLines: 6,
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: () async {
                    if (titleController.text.trim().isNotEmpty) {
                      final noteVm = Provider.of<NoteViewModel>(context, listen: false);
                      bool success;

                      if (existingNote == null) {
                        success = await noteVm.createNote(
                          title: titleController.text.trim(),
                          content: contentController.text.trim(),
                        );
                      } else {
                        final updated = existingNote.copyWith(
                          title: titleController.text.trim(),
                          content: contentController.text.trim(),
                        );
                        success = await noteVm.updateNote(updated);
                      }

                      if (success && mounted) {
                        Navigator.pop(context);
                      }
                    }
                  },
                  child: const Text('Save Note', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
                const SizedBox(height: 24),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final noteVm = Provider.of<NoteViewModel>(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Notes Sandbox'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: RefreshIndicator(
        onRefresh: () => noteVm.fetchNotes(),
        child: noteVm.isLoading && noteVm.notes.isEmpty
            ? GridView.builder(
                padding: const EdgeInsets.all(16),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                ),
                itemCount: 4,
                itemBuilder: (_, __) => const SkeletonLoader(width: 100, height: 100),
              )
            : noteVm.notes.isEmpty
                ? Center(
                    child: Text(
                      'Your sandbox is empty. Jot down an idea!',
                      style: TextStyle(
                        color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                      ),
                    ),
                  )
                : GridView.builder(
                    padding: const EdgeInsets.all(16),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                      childAspectRatio: 1.1,
                    ),
                    itemCount: noteVm.notes.length,
                    itemBuilder: (context, index) {
                      final note = noteVm.notes[index];
                      return GlassCard(
                        onTap: () => _showNoteDetailDialog(note),
                        padding: const EdgeInsets.all(12),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Expanded(
                                      child: Text(
                                        note.title,
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                                      ),
                                    ),
                                    PopupMenuButton<String>(
                                      icon: const Icon(Icons.more_vert, size: 16),
                                      padding: EdgeInsets.zero,
                                      constraints: const BoxConstraints(),
                                      onSelected: (action) {
                                        if (action == 'DELETE' && note.id != null) {
                                          noteVm.deleteNote(note.id!);
                                        }
                                      },
                                      itemBuilder: (context) => const [
                                        PopupMenuItem(value: 'DELETE', child: Text('Delete Note', style: TextStyle(color: AppColors.danger))),
                                      ],
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 6),
                                Text(
                                  note.content,
                                  maxLines: 3,
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: isDark
                                        ? AppColors.darkTextSecondary
                                        : AppColors.lightTextSecondary,
                                  ),
                                ),
                              ],
                            ),
                            if (note.createdAt != null)
                              Text(
                                note.createdAt!.substring(0, 10),
                                style: const TextStyle(fontSize: 9, color: Colors.grey),
                              ),
                          ],
                        ),
                      );
                    },
                  ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showCreateNoteSheet(),
        child: const Icon(Icons.add),
      ),
    );
  }
}
