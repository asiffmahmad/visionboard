import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../viewmodels/goal_viewmodel.dart';
import '../../viewmodels/milestone_viewmodel.dart';
import '../../../data/models/goal.dart';
import '../../widgets/glass_card.dart';
import '../../widgets/skeleton_loader.dart';
import '../../../core/theme/colors.dart';

class GoalDetailView extends StatefulWidget {
  final Goal goal;

  const GoalDetailView({Key? key, required this.goal}) : super(key: key);

  @override
  State<GoalDetailView> createState() => _GoalDetailViewState();
}

class _GoalDetailViewState extends State<GoalDetailView> {
  late Goal _currentGoal;

  @override
  void initState() {
    super.initState();
    _currentGoal = widget.goal;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_currentGoal.id != null) {
        Provider.of<MilestoneViewModel>(context, listen: false).fetchMilestones(_currentGoal.id!);
      }
    });
  }

  void _delete() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Goal'),
        content: const Text('Are you sure you want to delete this goal? This will also cascade delete linked tasks.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            style: TextButton.styleFrom(foregroundColor: AppColors.danger),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirmed == true && _currentGoal.id != null && mounted) {
      final success = await Provider.of<GoalViewModel>(context, listen: false).deleteGoal(_currentGoal.id!);
      if (success && mounted) {
        Navigator.pop(context);
      }
    }
  }

  void _showAddMilestoneSheet() {
    final titleController = TextEditingController();
    final descController = TextEditingController();
    DateTime selectedDate = DateTime.now().add(const Duration(days: 30));

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
                      'Add Milestone',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 20),
                    TextField(
                      controller: titleController,
                      decoration: const InputDecoration(
                        labelText: 'Milestone Title',
                        hintText: 'e.g. Finish Module 3 practice coding',
                      ),
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: descController,
                      decoration: const InputDecoration(
                        labelText: 'Description',
                        hintText: 'e.g. Build dynamic list elements in playground',
                      ),
                    ),
                    const SizedBox(height: 16),
                    ListTile(
                      title: const Text('Due Date'),
                      subtitle: Text(DateFormat('yyyy-MM-dd').format(selectedDate)),
                      trailing: const Icon(Icons.calendar_month),
                      onTap: () async {
                        final picked = await showDatePicker(
                          context: context,
                          initialDate: selectedDate,
                          firstDate: DateTime.now(),
                          lastDate: DateTime.now().add(const Duration(days: 365)),
                        );
                        if (picked != null) {
                          setModalState(() {
                            selectedDate = picked;
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
                        if (titleController.text.trim().isNotEmpty && _currentGoal.id != null) {
                          final success = await Provider.of<MilestoneViewModel>(context, listen: false).createMilestone(
                            goalId: _currentGoal.id!,
                            title: titleController.text.trim(),
                            description: descController.text.trim(),
                            dueDate: DateFormat('yyyy-MM-dd').format(selectedDate),
                          );
                          if (success && mounted) {
                            // Fetch updated goal from VM to reflect progress updates
                            final goals = Provider.of<GoalViewModel>(context, listen: false).goals;
                            final matchingGoal = goals.firstWhere((g) => g.id == _currentGoal.id, orElse: () => _currentGoal);
                            setState(() {
                              _currentGoal = matchingGoal;
                            });
                            Navigator.pop(context);
                          }
                        }
                      },
                      child: const Text('Save Milestone', style: TextStyle(fontWeight: FontWeight.bold)),
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
    final milestoneVm = Provider.of<MilestoneViewModel>(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Goal Details'),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_outline, color: AppColors.danger),
            onPressed: _delete,
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Core Goal Details
            GlassCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.primary.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          _currentGoal.goalType,
                          style: const TextStyle(color: AppColors.primary, fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                      ),
                      Text('Target: ${_currentGoal.targetDate}'),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    _currentGoal.title,
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontSize: 22, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _currentGoal.description,
                    style: TextStyle(
                      color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 20),
                  Row(
                    children: [
                      Expanded(
                        child: LinearProgressIndicator(
                          value: _currentGoal.progress / 100.0,
                          backgroundColor: isDark ? Colors.white10 : Colors.black12,
                          valueColor: const AlwaysStoppedAnimation<Color>(AppColors.success),
                          minHeight: 6,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Text(
                        '${_currentGoal.progress.toStringAsFixed(0)}%',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Milestones list header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Milestones Checklist',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                ),
                TextButton.icon(
                  onPressed: _showAddMilestoneSheet,
                  icon: const Icon(Icons.add_task),
                  label: const Text('Add Milestone'),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Milestones list
            if (milestoneVm.isLoading)
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: 2,
                itemBuilder: (_, __) => const Padding(
                  padding: EdgeInsets.only(bottom: 10),
                  child: SkeletonLoader(width: double.infinity, height: 60),
                ),
              )
            else if (milestoneVm.milestones.isEmpty)
              GlassCard(
                child: Center(
                  child: Text(
                    'No milestones set for this goal.',
                    style: TextStyle(
                      color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                    ),
                  ),
                ),
              )
            else
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: milestoneVm.milestones.length,
                itemBuilder: (context, index) {
                  final milestone = milestoneVm.milestones[index];
                  return Card(
                    margin: const EdgeInsets.only(bottom: 10),
                    child: CheckboxListTile(
                      title: Text(
                        milestone.title,
                        style: TextStyle(
                          decoration: milestone.completed ? TextDecoration.lineThrough : null,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      subtitle: Text(
                        '${milestone.description}\nDue: ${milestone.dueDate}',
                        style: const TextStyle(fontSize: 12),
                      ),
                      value: milestone.completed,
                      isThreeLine: true,
                      onChanged: (val) async {
                        final success = await milestoneVm.toggleMilestone(milestone);
                        if (success) {
                          // Update parent goal progress state from VM
                          final goals = Provider.of<GoalViewModel>(context, listen: false).goals;
                          final matchingGoal = goals.firstWhere((g) => g.id == _currentGoal.id, orElse: () => _currentGoal);
                          setState(() {
                            _currentGoal = matchingGoal;
                          });
                        }
                      },
                      secondary: IconButton(
                        icon: const Icon(Icons.delete_outline, color: AppColors.danger),
                        onPressed: () async {
                          if (milestone.id != null && _currentGoal.id != null) {
                            final success = await milestoneVm.deleteMilestone(milestone.id!, _currentGoal.id!);
                            if (success) {
                              final goals = Provider.of<GoalViewModel>(context, listen: false).goals;
                              final matchingGoal = goals.firstWhere((g) => g.id == _currentGoal.id, orElse: () => _currentGoal);
                              setState(() {
                                _currentGoal = matchingGoal;
                              });
                            }
                          }
                        },
                      ),
                    ),
                  );
                },
              ),
          ],
        ),
      ),
    );
  }
}
