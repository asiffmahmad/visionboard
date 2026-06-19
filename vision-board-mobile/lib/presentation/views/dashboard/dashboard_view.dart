import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../viewmodels/dashboard_viewmodel.dart';
import '../../widgets/glass_card.dart';
import '../../widgets/skeleton_loader.dart';
import '../../../core/theme/colors.dart';
import '../../../data/models/dashboard_stats.dart';
import '../../../data/models/task.dart';
import '../../../data/models/vision.dart';
import '../../../data/models/habit.dart';
import '../tasks/tasks_view.dart';
import '../notes/notes_view.dart';

class DashboardView extends StatelessWidget {
  const DashboardView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final dashboardVm = Provider.of<DashboardViewModel>(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Vision Board',
          style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => dashboardVm.refreshDashboard(),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => dashboardVm.refreshDashboard(),
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Banners / Active Announcements
              if (dashboardVm.announcements.isNotEmpty) ...[
                _buildAnnouncements(context, dashboardVm.announcements),
                const SizedBox(height: 16),
              ],

              // Premium Glassmorphic Core Progress Card
              if (dashboardVm.isLoading && dashboardVm.stats == null)
                const SkeletonLoader(width: double.infinity, height: 160, borderRadius: 16)
              else if (dashboardVm.stats != null)
                _buildProgressCard(context, dashboardVm.stats!),

              const SizedBox(height: 20),

              // Aggregated metrics grid
              if (dashboardVm.isLoading && dashboardVm.stats == null)
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    childAspectRatio: 1.6,
                  ),
                  itemCount: 4,
                  itemBuilder: (_, __) => const SkeletonLoader(width: 100, height: 80),
                )
              else if (dashboardVm.stats != null)
                _buildMetricsGrid(context, dashboardVm.stats!),

              const SizedBox(height: 24),

              // Quick Actions Row (e.g. quick access to Notes Sandbox)
              _buildQuickActions(context),

              const SizedBox(height: 24),

              // Recent tasks heading
              Text(
                'Recent Tasks',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              const SizedBox(height: 12),

              // Recent Tasks List
              if (dashboardVm.isLoading && dashboardVm.stats == null)
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: 3,
                  itemBuilder: (_, __) => const Padding(
                    padding: EdgeInsets.symmetric(vertical: 6),
                    child: SkeletonLoader(width: double.infinity, height: 70),
                  ),
                )
              else if (dashboardVm.stats != null && dashboardVm.stats!.recentTasks.isEmpty)
                GlassCard(
                  child: Center(
                    child: Text(
                      'No recent tasks found. Create one to begin!',
                      style: TextStyle(
                        color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                      ),
                    ),
                  ),
                )
              else if (dashboardVm.stats != null)
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: dashboardVm.stats!.recentTasks.length,
                  itemBuilder: (context, index) {
                    final task = dashboardVm.stats!.recentTasks[index];
                    return Card(
                      margin: const EdgeInsets.only(bottom: 10),
                      child: ListTile(
                        leading: Icon(
                          task.status == 'COMPLETED'
                              ? Icons.check_circle
                              : Icons.radio_button_unchecked,
                          color: task.status == 'COMPLETED'
                              ? AppColors.success
                              : Colors.grey,
                        ),
                        title: Text(
                          task.title,
                          style: TextStyle(
                            decoration: task.status == 'COMPLETED'
                                ? TextDecoration.lineThrough
                                : null,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        subtitle: Text('Priority: ${task.priority}'),
                        trailing: const Icon(Icons.chevron_right),
                        onTap: () {
                          // Quick navigation to Tasks listing
                        },
                      ),
                    );
                  },
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAnnouncements(BuildContext context, List<dynamic> announcements) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.primary.withOpacity(0.08),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.primary.withOpacity(0.2)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.campaign, color: AppColors.primary),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  announcements.first.title,
                  style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.primary),
                ),
                const SizedBox(height: 4),
                Text(
                  announcements.first.content,
                  style: const TextStyle(fontSize: 13),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProgressCard(BuildContext context, DashboardStats stats) {
    return GlassCard(
      gradient: AppColors.primaryGradient,
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Your Progress',
                  style: TextStyle(
                    color: Colors.white70,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  '${stats.completedTasks}/${stats.totalTasks} Tasks Done',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 12),
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: LinearProgressIndicator(
                    value: stats.totalTasks > 0 ? stats.completedTasks / stats.totalTasks : 0,
                    backgroundColor: Colors.white24,
                    valueColor: const AlwaysStoppedAnimation<Color>(Colors.white),
                    minHeight: 8,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  '${stats.completionPercentage.toStringAsFixed(1)}% Completion Rate',
                  style: const TextStyle(color: Colors.white70, fontSize: 12),
                ),
              ],
            ),
          ),
          const SizedBox(width: 24),
          // Circular Progress Indicator Ring
          Stack(
            alignment: Alignment.center,
            children: [
              SizedBox(
                width: 70,
                height: 70,
                child: CircularProgressIndicator(
                  value: stats.totalTasks > 0 ? stats.completedTasks / stats.totalTasks : 0,
                  backgroundColor: Colors.white24,
                  valueColor: const AlwaysStoppedAnimation<Color>(Colors.white),
                  strokeWidth: 8,
                ),
              ),
              Text(
                '${stats.completionPercentage.toStringAsFixed(0)}%',
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
            ],
          )
        ],
      ),
    );
  }

  Widget _buildMetricsGrid(BuildContext context, DashboardStats stats) {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      crossAxisSpacing: 12,
      mainAxisSpacing: 12,
      childAspectRatio: 1.5,
      children: [
        _buildStatCard(context, 'Active Visions', '${stats.totalVisions}', Icons.remove_red_eye, Colors.deepOrange),
        _buildStatCard(context, 'Goals Target', '${stats.completedGoals}/${stats.totalGoals}', Icons.flag, Colors.purple),
        _buildStatCard(context, 'Habit Streak', '${stats.bestStreak} days', Icons.bolt, Colors.amber),
        _buildStatCard(context, 'Journal Logs', '${stats.totalJournalEntries}', Icons.rate_review, Colors.teal),
      ],
    );
  }

  Widget _buildStatCard(
      BuildContext context, String title, String value, IconData icon, Color color) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Icon(icon, color: color, size: 24),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    'Stats',
                    style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  value,
                  style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 2),
                Text(
                  title,
                  style: TextStyle(
                    color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                    fontSize: 11,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickActions(BuildContext context) {
    return GlassCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Quick Workspace Catchment',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildActionButton(
                context,
                icon: Icons.note_alt_outlined,
                label: 'Notes Sandbox',
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(builder: (_) => const NotesView()),
                  );
                },
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton(
      BuildContext context, {required IconData icon, required String label, required VoidCallback onTap}) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          children: [
            CircleAvatar(
              backgroundColor: AppColors.primary.withOpacity(0.1),
              child: Icon(icon, color: AppColors.primary),
            ),
            const SizedBox(height: 8),
            Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500)),
          ],
        ),
      ),
    );
  }
}
