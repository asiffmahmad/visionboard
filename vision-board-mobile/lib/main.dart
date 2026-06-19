import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/di/injection_container.dart' as di;
import 'core/theme/app_theme.dart';
import 'presentation/viewmodels/auth_viewmodel.dart';
import 'presentation/viewmodels/dashboard_viewmodel.dart';
import 'presentation/viewmodels/vision_viewmodel.dart';
import 'presentation/viewmodels/goal_viewmodel.dart';
import 'presentation/viewmodels/task_viewmodel.dart';
import 'presentation/viewmodels/habit_viewmodel.dart';
import 'presentation/viewmodels/note_viewmodel.dart';
import 'presentation/viewmodels/journal_viewmodel.dart';
import 'presentation/viewmodels/milestone_viewmodel.dart';
import 'presentation/viewmodels/notification_viewmodel.dart';
import 'presentation/views/auth/login_view.dart';
import 'presentation/views/navigation/main_navigation_view.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize dependency injection
  await di.init();



  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider<AuthViewModel>(create: (_) => di.sl<AuthViewModel>()),
        ChangeNotifierProvider<DashboardViewModel>(create: (_) => di.sl<DashboardViewModel>()),
        ChangeNotifierProvider<VisionViewModel>(create: (_) => di.sl<VisionViewModel>()),
        ChangeNotifierProvider<GoalViewModel>(create: (_) => di.sl<GoalViewModel>()),
        ChangeNotifierProvider<TaskViewModel>(create: (_) => di.sl<TaskViewModel>()),
        ChangeNotifierProvider<HabitViewModel>(create: (_) => di.sl<HabitViewModel>()),
        ChangeNotifierProvider<NoteViewModel>(create: (_) => di.sl<NoteViewModel>()),
        ChangeNotifierProvider<JournalViewModel>(create: (_) => di.sl<JournalViewModel>()),
        ChangeNotifierProvider<MilestoneViewModel>(create: (_) => di.sl<MilestoneViewModel>()),
        ChangeNotifierProvider<NotificationViewModel>(create: (_) => di.sl<NotificationViewModel>()),
      ],
      child: MaterialApp(
        title: 'Vision Board',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        themeMode: ThemeMode.system, // Dynamically maps system preference
        home: const RootViewSwitcher(),
      ),
    );
  }
}

class RootViewSwitcher extends StatefulWidget {
  const RootViewSwitcher({Key? key}) : super(key: key);

  @override
  State<RootViewSwitcher> createState() => _RootViewSwitcherState();
}

class _RootViewSwitcherState extends State<RootViewSwitcher> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<AuthViewModel>(context, listen: false).checkAuthStatus();
    });
  }

  @override
  Widget build(BuildContext context) {
    final authVm = Provider.of<AuthViewModel>(context);

    if (authVm.isLoading) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    if (authVm.isAuthenticated) {
      return const MainNavigationView();
    }

    return const LoginView();
  }
}
