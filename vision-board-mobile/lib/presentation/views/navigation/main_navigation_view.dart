import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../viewmodels/dashboard_viewmodel.dart';
import '../dashboard/dashboard_view.dart';
import '../visions/visions_view.dart';
import '../tasks/tasks_view.dart';
import '../habits/habits_view.dart';
import '../journal/journal_view.dart';
import '../profile/profile_view.dart';
import '../../../core/theme/colors.dart';

class MainNavigationView extends StatefulWidget {
  const MainNavigationView({Key? key}) : super(key: key);

  @override
  State<MainNavigationView> createState() => _MainNavigationViewState();
}

class _MainNavigationViewState extends State<MainNavigationView> {
  int _currentIndex = 0;

  final List<Widget> _pages = [
    const DashboardView(),
    const VisionsView(),
    const TasksView(),
    const HabitsView(),
    const JournalView(),
    const ProfileView(),
  ];

  @override
  void initState() {
    super.initState();
    // Proactively refresh dashboard stats on startup
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<DashboardViewModel>(context, listen: false).refreshDashboard();
    });
  }

  @override
  Widget build(BuildContext context) {
    final dashboardVm = Provider.of<DashboardViewModel>(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _pages,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        elevation: 8,
        backgroundColor: isDark ? AppColors.darkSurface : Colors.white,
        indicatorColor: AppColors.primary.withOpacity(0.15),
        destinations: [
          const NavigationDestination(
            icon: Icon(Icons.dashboard_outlined),
            selectedIcon: Icon(Icons.dashboard, color: AppColors.primary),
            label: 'Dashboard',
          ),
          const NavigationDestination(
            icon: Icon(Icons.remove_red_eye_outlined),
            selectedIcon: Icon(Icons.remove_red_eye, color: AppColors.primary),
            label: 'Visions',
          ),
          const NavigationDestination(
            icon: Icon(Icons.task_alt_outlined),
            selectedIcon: Icon(Icons.task_alt, color: AppColors.primary),
            label: 'Tasks',
          ),
          const NavigationDestination(
            icon: Icon(Icons.repeat_outlined),
            selectedIcon: Icon(Icons.repeat, color: AppColors.primary),
            label: 'Habits',
          ),
          const NavigationDestination(
            icon: Icon(Icons.book_outlined),
            selectedIcon: Icon(Icons.book, color: AppColors.primary),
            label: 'Journal',
          ),
          NavigationDestination(
            icon: Badge(
              label: Text('${dashboardVm.unreadNotificationsCount}'),
              isLabelVisible: dashboardVm.unreadNotificationsCount > 0,
              child: const Icon(Icons.person_outline),
            ),
            selectedIcon: Badge(
              label: Text('${dashboardVm.unreadNotificationsCount}'),
              isLabelVisible: dashboardVm.unreadNotificationsCount > 0,
              child: const Icon(Icons.person, color: AppColors.primary),
            ),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
