import 'package:flutter/material.dart';
import '../../data/models/notification.dart';
import '../../data/repositories/notification_repository.dart';

class NotificationViewModel extends ChangeNotifier {
  final NotificationRepository _notificationRepository;

  List<AppNotification> _notifications = [];
  int _unreadCount = 0;
  bool _isLoading = false;

  NotificationViewModel(this._notificationRepository);

  List<AppNotification> get notifications => _notifications;
  int get unreadCount => _unreadCount;
  bool get isLoading => _isLoading;

  Future<void> fetchNotifications() async {
    _isLoading = true;
    notifyListeners();

    try {
      _notifications = await _notificationRepository.getNotifications();
      _unreadCount = await _notificationRepository.getUnreadCount();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> markAsRead(int id) async {
    try {
      await _notificationRepository.markAsRead(id);
      final index = _notifications.indexWhere((n) => n.id == id);
      if (index != -1) {
        _notifications[index] = _notifications[index].copyWith(isRead: true);
      }
      _unreadCount = await _notificationRepository.getUnreadCount();
      notifyListeners();
    } catch (e) {
      // Ignore
    }
  }

  Future<void> markAllAsRead() async {
    try {
      await _notificationRepository.markAllAsRead();
      _notifications = _notifications.map((n) => n.copyWith(isRead: true)).toList();
      _unreadCount = 0;
      notifyListeners();
    } catch (e) {
      // Ignore
    }
  }

  Future<void> addNotification(String message, String type) async {
    try {
      final created = await _notificationRepository.addNotification(message, type);
      _notifications.insert(0, created);
      _unreadCount = await _notificationRepository.getUnreadCount();
      notifyListeners();
    } catch (e) {
      // Ignore
    }
  }
}
