import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../viewmodels/habit_viewmodel.dart';
import '../../../data/models/habit.dart';
import '../../widgets/glass_card.dart';
import '../../widgets/skeleton_loader.dart';
import '../../../core/theme/colors.dart';

class HabitsView extends StatefulWidget {
  const HabitsView({Key? key}) : super(key: key);

  @override
  State<HabitsView> createState() => _HabitsViewState();
}

class _HabitsViewState extends State<HabitsView> {
  final String _todayDate = DateFormat('yyyy-MM-dd').format(DateTime.now());

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<HabitViewModel>(context, listen: false).fetchHabits();
    });
  }

  void _showCreateHabitSheet() {
    final titleController = TextEditingController();
    final purposeController = TextEditingController();
    String frequency = 'DAILY';

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
                      'Build New Habit',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 20),
                    TextField(
                      controller: titleController,
                      decoration: const InputDecoration(
                        labelText: 'Habit Title',
                        hintText: 'e.g. Do 30 Pushups',
                      ),
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: purposeController,
                      decoration: const InputDecoration(
                        labelText: 'Purpose / Motivation',
                        hintText: 'e.g. Build strength and stamina',
                      ),
                    ),
                    const SizedBox(height: 16),
                    DropdownButtonFormField<String>(
                      value: frequency,
                      decoration: const InputDecoration(labelText: 'Frequency'),
                      items: const [
                        DropdownMenuItem(value: 'DAILY', child: Text('Daily')),
                        DropdownMenuItem(value: 'WEEKLY', child: Text('Weekly')),
                      ],
                      onChanged: (val) {
                        if (val != null) {
                          setModalState(() {
                            frequency = val;
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
                          final success = await Provider.of<HabitViewModel>(context, listen: false).createHabit(
                            title: titleController.text.trim(),
                            purpose: purposeController.text.trim(),
                            frequency: frequency,
                          );
                          if (success && mounted) {
                            Navigator.pop(context);
                          }
                        }
                      },
                      child: const Text('Save Habit', style: TextStyle(fontWeight: FontWeight.bold)),
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

  void _showSkipDialog(Habit habit) {
    final reasonController = TextEditingController();
    final notesController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Skip Habit: ${habit.title}'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: reasonController,
              decoration: const InputDecoration(
                labelText: 'Reason for skipping',
                hintText: 'e.g. Feeling unwell',
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: notesController,
              decoration: const InputDecoration(
                labelText: 'Additional Notes',
                hintText: 'e.g. Will catch up tomorrow',
              ),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
          TextButton(
            onPressed: () async {
              if (reasonController.text.trim().isNotEmpty && habit.id != null) {
                final success = await Provider.of<HabitViewModel>(context, listen: false).skipHabit(
                  id: habit.id!,
                  date: _todayDate,
                  reason: reasonController.text.trim(),
                  notes: notesController.text.trim(),
                );
                if (success && mounted) {
                  Navigator.pop(context);
                }
              }
            },
            child: const Text('Confirm Skip'),
          ),
        ],
      ),
    );
  }

  void _showCelebrateSnackbar(Habit habit) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.stars, color: Colors.amber),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                '🎉 Excellent! Streak updated for "${habit.title}"! Current Streak: ${habit.streak} days!',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
        duration: const Duration(seconds: 3),
        backgroundColor: AppColors.success,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final habitVm = Provider.of<HabitViewModel>(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Consistency Tracker'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: RefreshIndicator(
        onRefresh: () => habitVm.fetchHabits(),
        child: habitVm.isLoading && habitVm.habits.isEmpty
            ? ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: 3,
                itemBuilder: (_, __) => const Padding(
                  padding: EdgeInsets.only(bottom: 16),
                  child: SkeletonLoader(width: double.infinity, height: 100),
                ),
              )
            : habitVm.habits.isEmpty
                ? Center(
                    child: Text(
                      'No habits registered yet.',
                      style: TextStyle(
                        color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                      ),
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: habitVm.habits.length,
                    itemBuilder: (context, index) {
                      final habit = habitVm.habits[index];
                      final isCompletedToday = habit.completedDates.contains(_todayDate);

                      return Padding(
                        padding: const EdgeInsets.only(bottom: 16),
                        child: GlassCard(
                          child: Row(
                            children: [
                              // Toggle Button
                              IconButton(
                                iconSize: 32,
                                icon: Icon(
                                  isCompletedToday
                                      ? Icons.check_circle
                                      : Icons.radio_button_unchecked,
                                  color: isCompletedToday ? AppColors.success : Colors.grey,
                                ),
                                onPressed: () async {
                                  if (habit.id != null) {
                                    final success = await habitVm.logHabit(
                                      id: habit.id!,
                                      date: _todayDate,
                                      completed: !isCompletedToday,
                                    );
                                    if (success && !isCompletedToday) {
                                      _showCelebrateSnackbar(habit);
                                    }
                                  }
                                },
                              ),
                              const SizedBox(width: 12),

                              // Description/Info
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      habit.title,
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                        decoration: isCompletedToday
                                            ? TextDecoration.lineThrough
                                            : null,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      habit.purpose,
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: isDark
                                            ? AppColors.darkTextSecondary
                                            : AppColors.lightTextSecondary,
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    Row(
                                      children: [
                                        const Icon(Icons.bolt, color: Colors.amber, size: 16),
                                        const SizedBox(width: 4),
                                        Text(
                                          'Streak: ${habit.streak} days',
                                          style: const TextStyle(
                                            fontSize: 11,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                        const SizedBox(width: 16),
                                        Icon(Icons.pie_chart, color: AppColors.primary.withOpacity(0.8), size: 16),
                                        const SizedBox(width: 4),
                                        Text(
                                          'Completion: ${(habit.completionRate * 100).toStringAsFixed(0)}%',
                                          style: const TextStyle(
                                            fontSize: 11,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),

                              // Quick menu: Skip or delete
                              PopupMenuButton<String>(
                                icon: const Icon(Icons.more_vert),
                                onSelected: (action) {
                                  if (action == 'SKIP') {
                                    _showSkipDialog(habit);
                                  } else if (action == 'DELETE' && habit.id != null) {
                                    habitVm.deleteHabit(habit.id!);
                                  }
                                },
                                itemBuilder: (context) => const [
                                  PopupMenuItem(value: 'SKIP', child: Text('Skip for Today')),
                                  PopupMenuItem(value: 'DELETE', child: Text('Delete Habit', style: TextStyle(color: AppColors.danger))),
                                ],
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _showCreateHabitSheet,
        child: const Icon(Icons.add),
      ),
    );
  }
}
