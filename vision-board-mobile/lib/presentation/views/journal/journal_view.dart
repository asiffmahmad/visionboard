import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../viewmodels/journal_viewmodel.dart';
import '../../../data/models/journal_entry.dart';
import '../../widgets/glass_card.dart';
import '../../widgets/skeleton_loader.dart';
import '../../../core/theme/colors.dart';

class JournalView extends StatefulWidget {
  const JournalView({Key? key}) : super(key: key);

  @override
  State<JournalView> createState() => _JournalViewState();
}

class _JournalViewState extends State<JournalView> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<JournalViewModel>(context, listen: false).fetchEntries();
    });
  }

  void _showCreateEntrySheet({JournalEntry? existingEntry}) {
    final titleController = TextEditingController(text: existingEntry?.title);
    final contentController = TextEditingController(text: existingEntry?.content);
    String mood = existingEntry?.mood ?? '🙂 NEUTRAL';
    String entryType = existingEntry?.entryType ?? 'DAILY_LOG';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
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
                      existingEntry == null ? 'New Reflection Entry' : 'Edit Reflection Entry',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 20),
                    TextField(
                      controller: titleController,
                      decoration: const InputDecoration(
                        labelText: 'Entry Title',
                        hintText: 'e.g. Daily Check-in',
                      ),
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: contentController,
                      decoration: const InputDecoration(
                        labelText: 'Content',
                        hintText: 'Write down your thoughts, struggles, or lessons...',
                      ),
                      maxLines: 4,
                    ),
                    const SizedBox(height: 16),
                    DropdownButtonFormField<String>(
                      value: mood,
                      decoration: const InputDecoration(labelText: 'Current Mood'),
                      items: const [
                        DropdownMenuItem(value: '😊 HAPPY', child: Text('😊 Happy')),
                        DropdownMenuItem(value: '🙂 NEUTRAL', child: Text('🙂 Neutral')),
                        DropdownMenuItem(value: '😢 SAD', child: Text('😢 Sad')),
                        DropdownMenuItem(value: '😠 ANGRY', child: Text('😠 Angry')),
                        DropdownMenuItem(value: '😴 TIRED', child: Text('😴 Tired')),
                      ],
                      onChanged: (val) {
                        if (val != null) {
                          setModalState(() {
                            mood = val;
                          });
                        }
                      },
                    ),
                    const SizedBox(height: 16),
                    DropdownButtonFormField<String>(
                      value: entryType,
                      decoration: const InputDecoration(labelText: 'Entry Category'),
                      items: const [
                        DropdownMenuItem(value: 'DAILY_LOG', child: Text('Daily Log')),
                        DropdownMenuItem(value: 'REFLECTION', child: Text('Reflection')),
                        DropdownMenuItem(value: 'GRATITUDE', child: Text('Gratitude')),
                        DropdownMenuItem(value: 'IDEA', child: Text('Idea')),
                        DropdownMenuItem(value: 'LESSON_LEARNED', child: Text('Lesson Learned')),
                      ],
                      onChanged: (val) {
                        if (val != null) {
                          setModalState(() {
                            entryType = val;
                          });
                        }
                      },
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
                          final journalVm = Provider.of<JournalViewModel>(context, listen: false);
                          bool success;

                          if (existingEntry == null) {
                            success = await journalVm.createEntry(
                              title: titleController.text.trim(),
                              content: contentController.text.trim(),
                              mood: mood,
                              entryType: entryType,
                            );
                          } else {
                            final updated = existingEntry.copyWith(
                              title: titleController.text.trim(),
                              content: contentController.text.trim(),
                              mood: mood,
                              entryType: entryType,
                            );
                            success = await journalVm.updateEntry(updated);
                          }

                          if (success && mounted) {
                            Navigator.pop(context);
                          }
                        }
                      },
                      child: Text(
                        existingEntry == null ? 'Save Entry' : 'Update Entry',
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final journalVm = Provider.of<JournalViewModel>(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Journal & Reflections'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: RefreshIndicator(
        onRefresh: () => journalVm.fetchEntries(),
        child: journalVm.isLoading && journalVm.entries.isEmpty
            ? ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: 4,
                itemBuilder: (_, __) => const Padding(
                  padding: EdgeInsets.only(bottom: 16),
                  child: SkeletonLoader(width: double.infinity, height: 110),
                ),
              )
            : journalVm.entries.isEmpty
                ? Center(
                    child: Text(
                      'No journal entries written yet.',
                      style: TextStyle(
                        color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                      ),
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: journalVm.entries.length,
                    itemBuilder: (context, index) {
                      final entry = journalVm.entries[index];
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 16),
                        child: GlassCard(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Row(
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                        decoration: BoxDecoration(
                                          color: AppColors.primary.withOpacity(0.1),
                                          borderRadius: BorderRadius.circular(12),
                                        ),
                                        child: Text(
                                          entry.entryType.replaceAll('_', ' '),
                                          style: const TextStyle(
                                            color: AppColors.primary,
                                            fontSize: 10,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      Text(
                                        entry.mood,
                                        style: const TextStyle(fontSize: 12),
                                      ),
                                    ],
                                  ),
                                  PopupMenuButton<String>(
                                    icon: const Icon(Icons.more_horiz, size: 20),
                                    onSelected: (action) {
                                      if (action == 'EDIT') {
                                        _showCreateEntrySheet(existingEntry: entry);
                                      } else if (action == 'DELETE' && entry.id != null) {
                                        journalVm.deleteEntry(entry.id!);
                                      }
                                    },
                                    itemBuilder: (context) => const [
                                      PopupMenuItem(value: 'EDIT', child: Text('Edit Entry')),
                                      PopupMenuItem(value: 'DELETE', child: Text('Delete Entry', style: TextStyle(color: AppColors.danger))),
                                    ],
                                  ),
                                ],
                              ),
                              const SizedBox(height: 10),
                              Text(
                                entry.title,
                                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                    ),
                              ),
                              const SizedBox(height: 6),
                              Text(
                                entry.content,
                                style: TextStyle(
                                  fontSize: 13,
                                  color: isDark
                                      ? AppColors.darkTextSecondary
                                      : AppColors.lightTextSecondary,
                                  height: 1.4,
                                ),
                              ),
                              if (entry.createdAt != null) ...[
                                const SizedBox(height: 12),
                                Text(
                                  entry.createdAt!.substring(0, 10),
                                  style: const TextStyle(fontSize: 11, color: Colors.grey),
                                ),
                              ],
                            ],
                          ),
                        ),
                      );
                    },
                  ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showCreateEntrySheet(),
        child: const Icon(Icons.edit),
      ),
    );
  }
}
