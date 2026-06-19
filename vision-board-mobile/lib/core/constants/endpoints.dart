class Endpoints {
  static String baseUrl = const String.fromEnvironment('API_BASE_URL');

  // Auth endpoints
  static const String register = '/api/auth/register';
  static const String login = '/api/auth/login';
  static const String refresh = '/api/auth/refresh';
  static const String logout = '/api/auth/logout';

  // Profile endpoints
  static const String userProfile = '/api/users/profile';

  // Dashboard endpoints
  static const String dashboardStats = '/api/dashboard/stats';
  static const String activeAnnouncements = '/api/v1/announcements/active';

  // Vision endpoints
  static const String visions = '/api/v1/visions';

  // Goal endpoints
  static const String goals = '/api/v1/goals';

  // Task endpoints
  static const String tasks = '/api/tasks';

  // Habit endpoints
  static const String habits = '/api/v1/habits';

  // Note endpoints
  static const String notes = '/api/v1/notes';

  // Journal endpoints
  static const String journal = '/api/v1/journal';
}
