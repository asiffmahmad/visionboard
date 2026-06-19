import 'package:get_it/get_it.dart';
import '../storage/secure_storage_service.dart';
import '../storage/local_database_service.dart';
import '../storage/backup_service.dart';
import '../../data/repositories/auth_repository.dart';
import '../../data/repositories/dashboard_repository.dart';
import '../../data/repositories/vision_repository.dart';
import '../../data/repositories/goal_repository.dart';
import '../../data/repositories/task_repository.dart';
import '../../data/repositories/habit_repository.dart';
import '../../data/repositories/note_repository.dart';
import '../../data/repositories/journal_repository.dart';
import '../../data/repositories/milestone_repository.dart';
import '../../data/repositories/notification_repository.dart';
import '../../presentation/viewmodels/auth_viewmodel.dart';
import '../../presentation/viewmodels/dashboard_viewmodel.dart';
import '../../presentation/viewmodels/vision_viewmodel.dart';
import '../../presentation/viewmodels/goal_viewmodel.dart';
import '../../presentation/viewmodels/task_viewmodel.dart';
import '../../presentation/viewmodels/habit_viewmodel.dart';
import '../../presentation/viewmodels/note_viewmodel.dart';
import '../../presentation/viewmodels/journal_viewmodel.dart';
import '../../presentation/viewmodels/milestone_viewmodel.dart';
import '../../presentation/viewmodels/notification_viewmodel.dart';

final sl = GetIt.instance;

Future<void> init() async {
  // Core infrastructure
  sl.registerLazySingleton<SecureStorageService>(() => SecureStorageService());
  sl.registerLazySingleton<LocalDatabaseService>(() => LocalDatabaseService());
  sl.registerLazySingleton<BackupService>(() => BackupService(sl()));

  // Repositories
  sl.registerLazySingleton<AuthRepository>(() => AuthRepository(sl(), sl()));
  sl.registerLazySingleton<DashboardRepository>(() => DashboardRepository(sl()));
  sl.registerLazySingleton<VisionRepository>(() => VisionRepository(sl()));
  sl.registerLazySingleton<GoalRepository>(() => GoalRepository(sl()));
  sl.registerLazySingleton<TaskRepository>(() => TaskRepository(sl()));
  sl.registerLazySingleton<HabitRepository>(() => HabitRepository(sl()));
  sl.registerLazySingleton<NoteRepository>(() => NoteRepository(sl()));
  sl.registerLazySingleton<JournalRepository>(() => JournalRepository(sl()));
  sl.registerLazySingleton<MilestoneRepository>(() => MilestoneRepository(sl()));
  sl.registerLazySingleton<NotificationRepository>(() => NotificationRepository(sl()));

  // ViewModels (Factory)
  sl.registerFactory(() => AuthViewModel(sl()));
  sl.registerFactory(() => DashboardViewModel(sl(), sl()));
  sl.registerFactory(() => VisionViewModel(sl()));
  sl.registerFactory(() => GoalViewModel(sl()));
  sl.registerFactory(() => TaskViewModel(sl()));
  sl.registerFactory(() => HabitViewModel(sl()));
  sl.registerFactory(() => NoteViewModel(sl()));
  sl.registerFactory(() => JournalViewModel(sl()));
  sl.registerFactory(() => MilestoneViewModel(sl()));
  sl.registerFactory(() => NotificationViewModel(sl()));
}
