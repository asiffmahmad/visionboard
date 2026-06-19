import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../viewmodels/vision_viewmodel.dart';
import '../../viewmodels/goal_viewmodel.dart';
import '../../../data/models/vision.dart';
import '../../../data/models/goal.dart';
import '../../widgets/glass_card.dart';
import '../../widgets/skeleton_loader.dart';
import '../../../core/theme/colors.dart';
import '../goals/create_goal_view.dart';
import '../goals/goal_detail_view.dart';

class VisionDetailView extends StatefulWidget {
  final Vision vision;

  const VisionDetailView({Key? key, required this.vision}) : super(key: key);

  @override
  State<VisionDetailView> createState() => _VisionDetailViewState();
}

class _VisionDetailViewState extends State<VisionDetailView> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (widget.vision.id != null) {
        Provider.of<GoalViewModel>(context, listen: false).fetchGoalsByVision(widget.vision.id!);
      }
    });
  }

  void _delete() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Vision'),
        content: const Text('Are you sure? This will also cascade delete all associated goals and tasks.'),
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

    if (confirmed == true && widget.vision.id != null && mounted) {
      final success = await Provider.of<VisionViewModel>(context, listen: false).deleteVision(widget.vision.id!);
      if (success && mounted) {
        Navigator.pop(context); // Go back to Visions list
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final goalVm = Provider.of<GoalViewModel>(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Vision Details'),
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
            // Core Vision Info GlassCard
            GlassCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        widget.vision.visionType,
                        style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold),
                      ),
                      Text('Target: ${widget.vision.targetDate}'),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    widget.vision.title,
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontSize: 22, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    widget.vision.description,
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
                          value: widget.vision.progress / 100.0,
                          backgroundColor: isDark ? Colors.white10 : Colors.black12,
                          valueColor: const AlwaysStoppedAnimation<Color>(AppColors.success),
                          minHeight: 6,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Text(
                        '${widget.vision.progress.toStringAsFixed(0)}%',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Linked Goals Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Associated Goals',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                ),
                TextButton.icon(
                  onPressed: () {
                    if (widget.vision.id != null) {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (_) => CreateGoalView(visionId: widget.vision.id!),
                        ),
                      ).then((_) {
                        // Refresh goals list
                        Provider.of<GoalViewModel>(context, listen: false).fetchGoalsByVision(widget.vision.id!);
                      });
                    }
                  },
                  icon: const Icon(Icons.add),
                  label: const Text('Add Goal'),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Goals list
            if (goalVm.isLoading)
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: 2,
                itemBuilder: (_, __) => const Padding(
                  padding: EdgeInsets.only(bottom: 12),
                  child: SkeletonLoader(width: double.infinity, height: 80),
                ),
              )
            else if (goalVm.goals.isEmpty)
              GlassCard(
                child: Center(
                  child: Text(
                    'No goals associated with this vision yet.',
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
                itemCount: goalVm.goals.length,
                itemBuilder: (context, index) {
                  final goal = goalVm.goals[index];
                  return Card(
                    margin: const EdgeInsets.only(bottom: 12),
                    child: ListTile(
                      title: Text(goal.title, style: const TextStyle(fontWeight: FontWeight.bold)),
                      subtitle: Text('Type: ${goal.goalType} • Progress: ${goal.progress.toStringAsFixed(0)}%'),
                      trailing: const Icon(Icons.chevron_right),
                      onTap: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(builder: (_) => GoalDetailView(goal: goal)),
                        ).then((_) {
                          // Refresh lists
                          Provider.of<GoalViewModel>(context, listen: false).fetchGoalsByVision(widget.vision.id!);
                        });
                      },
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
