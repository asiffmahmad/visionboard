import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../viewmodels/task_viewmodel.dart';
import '../../viewmodels/goal_viewmodel.dart';
import '../../../data/models/task.dart';
import '../../widgets/glass_card.dart';
import '../../widgets/skeleton_loader.dart';
import '../../../core/theme/colors.dart';

class TasksView extends StatefulWidget {
  const TasksView({Key? key}) : super(key: key);

  @override
  State<TasksView> createState() => _TasksViewState();
}

class _TasksViewState extends State<TasksView> {
  final _searchController = TextEditingController();
  bool _isListView = true;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<TaskViewModel>(context, listen: false).fetchTasks();
      Provider.of<GoalViewModel>(context, listen: false).fetchGoals();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _showCreateTaskSheet() {
    final titleController = TextEditingController();
    final descController = TextEditingController();
    String priority = 'MEDIUM';
    int? selectedGoalId;
    DateTime selectedDate = DateTime.now().add(const Duration(days: 7));

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        final goalVm = Provider.of<GoalViewModel>(context);
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
                      'Create New Task',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 20),
                    TextField(
                      controller: titleController,
                      decoration: const InputDecoration(
                        labelText: 'Task Title',
                        hintText: 'e.g. Draft architecture report',
                      ),
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: descController,
                      decoration: const InputDecoration(
                        labelText: 'Description',
                        hintText: 'e.g. Focus on offline outbox mappings and DB constraints.',
                      ),
                      maxLines: 2,
                    ),
                    const SizedBox(height: 16),
                    DropdownButtonFormField<String>(
                      value: priority,
                      decoration: const InputDecoration(labelText: 'Priority Level'),
                      items: const [
                        DropdownMenuItem(value: 'LOW', child: Text('Low')),
                        DropdownMenuItem(value: 'MEDIUM', child: Text('Medium')),
                        DropdownMenuItem(value: 'HIGH', child: Text('High')),
                        DropdownMenuItem(value: 'CRITICAL', child: Text('Critical')),
                      ],
                      onChanged: (val) {
                        if (val != null) {
                          setModalState(() {
                            priority = val;
                          });
                        }
                      },
                    ),
                    const SizedBox(height: 16),
                    DropdownButtonFormField<int>(
                      value: selectedGoalId,
                      decoration: const InputDecoration(labelText: 'Associated Goal (Optional)'),
                      items: [
                        const DropdownMenuItem<int>(value: null, child: Text('None')),
                        ...goalVm.goals.map((g) => DropdownMenuItem<int>(
                              value: g.id,
                              child: Text(g.title),
                            )),
                      ],
                      onChanged: (val) {
                        setModalState(() {
                          selectedGoalId = val;
                        });
                      },
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
                          firstDate: DateTime.now().subtract(const Duration(days: 30)),
                          lastDate: DateTime.now().add(const Duration(days: 365 * 3)),
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
                        if (titleController.text.trim().isNotEmpty) {
                          final success = await Provider.of<TaskViewModel>(context, listen: false).createTask(
                            title: titleController.text.trim(),
                            description: descController.text.trim(),
                            status: 'PENDING',
                            priority: priority,
                            dueDate: DateFormat('yyyy-MM-dd').format(selectedDate),
                            goalId: selectedGoalId,
                          );
                          if (success && mounted) {
                            Navigator.pop(context);
                          }
                        }
                      },
                      child: const Text('Create Task', style: TextStyle(fontWeight: FontWeight.bold)),
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

  Color _getPriorityColor(String priority) {
    switch (priority) {
      case 'CRITICAL':
        return Colors.red.shade900;
      case 'HIGH':
        return Colors.red.shade600;
      case 'MEDIUM':
        return Colors.orange;
      case 'LOW':
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    final taskVm = Provider.of<TaskViewModel>(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Task Backlog'),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            icon: Icon(_isListView ? Icons.grid_view : Icons.view_list),
            onPressed: () {
              setState(() {
                _isListView = !_isListView;
              });
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Filter Search Bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _searchController,
                    decoration: InputDecoration(
                      hintText: 'Search tasks...',
                      prefixIcon: const Icon(Icons.search),
                      suffixIcon: _searchController.text.isNotEmpty
                          ? IconButton(
                              icon: const Icon(Icons.clear),
                              onPressed: () {
                                _searchController.clear();
                                taskVm.setFilters(search: '');
                              },
                            )
                          : null,
                    ),
                    onSubmitted: (val) {
                      taskVm.setFilters(search: val.trim());
                    },
                  ),
                ),
                const SizedBox(width: 8),
                PopupMenuButton<String>(
                  icon: const Icon(Icons.filter_list),
                  onSelected: (status) {
                    if (status == 'ALL') {
                      taskVm.clearFilters();
                    } else {
                      taskVm.setFilters(status: status);
                    }
                  },
                  itemBuilder: (context) => const [
                    PopupMenuItem(value: 'ALL', child: Text('All Tasks')),
                    PopupMenuItem(value: 'PENDING', child: Text('Pending')),
                    PopupMenuItem(value: 'IN_PROGRESS', child: Text('In Progress')),
                    PopupMenuItem(value: 'COMPLETED', child: Text('Completed')),
                  ],
                )
              ],
            ),
          ),

          // Priority chips
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _buildPriorityChip(context, taskVm, 'All Priorities', null),
                  const SizedBox(width: 8),
                  _buildPriorityChip(context, taskVm, 'Critical', 'CRITICAL'),
                  const SizedBox(width: 8),
                  _buildPriorityChip(context, taskVm, 'High', 'HIGH'),
                  const SizedBox(width: 8),
                  _buildPriorityChip(context, taskVm, 'Medium', 'MEDIUM'),
                  const SizedBox(width: 8),
                  _buildPriorityChip(context, taskVm, 'Low', 'LOW'),
                ],
              ),
            ),
          ),

          const SizedBox(height: 8),

          // Main Tasks List / Grid
          Expanded(
            child: RefreshIndicator(
              onRefresh: () => taskVm.fetchTasks(),
              child: taskVm.isLoading && taskVm.tasks.isEmpty
                  ? ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: 5,
                      itemBuilder: (_, __) => const Padding(
                        padding: EdgeInsets.only(bottom: 12),
                        child: SkeletonLoader(width: double.infinity, height: 72),
                      ),
                    )
                  : taskVm.tasks.isEmpty
                      ? Center(
                          child: Text(
                            'No tasks found.',
                            style: TextStyle(
                              color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                            ),
                          ),
                        )
                      : _isListView
                          ? _buildTasksList(context, taskVm.tasks)
                          : _buildTasksGrid(context, taskVm.tasks),
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _showCreateTaskSheet,
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildPriorityChip(BuildContext context, TaskViewModel vm, String label, String? priority) {
    final isSelected = vm.filterPriority == priority;
    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (selected) {
        if (selected) {
          vm.setFilters(priority: priority);
        }
      },
    );
  }

  Widget _buildTasksList(BuildContext context, List<Task> tasks) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: tasks.length,
      itemBuilder: (context, index) {
        final task = tasks[index];
        final pColor = _getPriorityColor(task.priority);
        final isCompleted = task.status == 'COMPLETED';

        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            leading: Checkbox(
              value: isCompleted,
              onChanged: (_) {
                Provider.of<TaskViewModel>(context, listen: false).toggleTaskStatus(task);
              },
            ),
            title: Text(
              task.title,
              style: TextStyle(
                decoration: isCompleted ? TextDecoration.lineThrough : null,
                fontWeight: FontWeight.bold,
              ),
            ),
            subtitle: Text(
              '${task.description}\nDue: ${task.dueDate ?? "No Date"}',
              style: const TextStyle(fontSize: 12),
            ),
            trailing: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: pColor.withOpacity(0.15),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                task.priority,
                style: TextStyle(color: pColor, fontSize: 9, fontWeight: FontWeight.bold),
              ),
            ),
            isThreeLine: true,
          ),
        );
      },
    );
  }

  Widget _buildTasksGrid(BuildContext context, List<Task> tasks) {
    return GridView.builder(
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 1.2,
      ),
      itemCount: tasks.length,
      itemBuilder: (context, index) {
        final task = tasks[index];
        final pColor = _getPriorityColor(task.priority);
        final isCompleted = task.status == 'COMPLETED';

        return GlassCard(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: pColor.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      task.priority,
                      style: TextStyle(color: pColor, fontSize: 8, fontWeight: FontWeight.bold),
                    ),
                  ),
                  Checkbox(
                    value: isCompleted,
                    onChanged: (_) {
                      Provider.of<TaskViewModel>(context, listen: false).toggleTaskStatus(task);
                    },
                  ),
                ],
              ),
              Expanded(
                child: Text(
                  task.title,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    decoration: isCompleted ? TextDecoration.lineThrough : null,
                  ),
                ),
              ),
              Text(
                'Due: ${task.dueDate ?? "No Date"}',
                style: const TextStyle(fontSize: 10, color: Colors.grey),
              ),
            ],
          ),
        );
      },
    );
  }
}
