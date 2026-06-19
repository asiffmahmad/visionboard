import 'package:flutter/material.dart';
import '../../data/models/dashboard_stats.dart';
import '../../data/models/announcement.dart';
import '../../data/repositories/dashboard_repository.dart';
import '../../data/repositories/notification_repository.dart';

class DashboardViewModel extends ChangeNotifier {
  final DashboardRepository _dashboardRepository;
  final NotificationRepository _notificationRepository;

  DashboardStats? _stats;
  List<Announcement> _announcements = [];
  int _unreadNotificationsCount = 0;
  bool _isLoading = false;
  String? _errorMessage;

  DashboardViewModel(this._dashboardRepository, this._notificationRepository);

  DashboardStats? get stats => _stats;
  List<Announcement> get announcements => _announcements;
  int get unreadNotificationsCount => _unreadNotificationsCount;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> refreshDashboard() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _stats = await _dashboardRepository.getDashboardStats();
      _announcements = await _dashboardRepository.getActiveAnnouncements();
      _unreadNotificationsCount = await _notificationRepository.getUnreadCount();
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Update notification count badge dynamically
  void updateNotificationCount(int count) {
    _unreadNotificationsCount = count;
    notifyListeners();
  }
}
