import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../viewmodels/notification_viewmodel.dart';
import '../../viewmodels/dashboard_viewmodel.dart';
import '../../widgets/glass_card.dart';
import '../../widgets/skeleton_loader.dart';
import '../../../core/theme/colors.dart';

class NotificationsView extends StatefulWidget {
  const NotificationsView({Key? key}) : super(key: key);

  @override
  State<NotificationsView> createState() => _NotificationsViewState();
}

class _NotificationsViewState extends State<NotificationsView> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<NotificationViewModel>(context, listen: false).fetchNotifications();
    });
  }

  Color _getNotificationColor(String type) {
    switch (type) {
      case 'CRITICAL':
        return AppColors.danger;
      case 'WARNING':
        return AppColors.warning;
      case 'SUCCESS':
        return AppColors.success;
      case 'INFO':
      default:
        return AppColors.primary;
    }
  }

  IconData _getNotificationIcon(String type) {
    switch (type) {
      case 'CRITICAL':
        return Icons.gpp_bad;
      case 'WARNING':
        return Icons.warning_amber;
      case 'SUCCESS':
        return Icons.check_circle_outline;
      case 'INFO':
      default:
        return Icons.info_outline;
    }
  }

  @override
  Widget build(BuildContext context) {
    final notificationVm = Provider.of<NotificationViewModel>(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications Hub'),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          if (notificationVm.unreadCount > 0)
            TextButton(
              onPressed: () async {
                await notificationVm.markAllAsRead();
                // Proactively update dashboard badge count
                if (mounted) {
                  Provider.of<DashboardViewModel>(context, listen: false)
                      .updateNotificationCount(0);
                }
              },
              child: const Text('Mark all read'),
            ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => notificationVm.fetchNotifications(),
        child: notificationVm.isLoading && notificationVm.notifications.isEmpty
            ? ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: 4,
                itemBuilder: (_, __) => const Padding(
                  padding: EdgeInsets.only(bottom: 12),
                  child: SkeletonLoader(width: double.infinity, height: 72),
                ),
              )
            : notificationVm.notifications.isEmpty
                ? Center(
                    child: Text(
                      'No notifications logs found.',
                      style: TextStyle(
                        color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                      ),
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: notificationVm.notifications.length,
                    itemBuilder: (context, index) {
                      final item = notificationVm.notifications[index];
                      final color = _getNotificationColor(item.notificationType);
                      final icon = _getNotificationIcon(item.notificationType);

                      return Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        color: item.isRead
                            ? null
                            : color.withOpacity(0.05),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                          side: BorderSide(
                            color: item.isRead
                                ? Colors.transparent
                                : color.withOpacity(0.3),
                            width: 1,
                          ),
                        ),
                        child: ListTile(
                          leading: Icon(icon, color: color, size: 28),
                          title: Text(
                            item.message,
                            style: TextStyle(
                              fontWeight: item.isRead ? FontWeight.normal : FontWeight.bold,
                            ),
                          ),
                          subtitle: Text(
                            item.createdAt.substring(0, 16).replaceAll('T', ' '),
                            style: const TextStyle(fontSize: 11),
                          ),
                          trailing: !item.isRead
                              ? IconButton(
                                  icon: const Icon(Icons.mark_chat_read_outlined),
                                  onPressed: () async {
                                    if (item.id != null) {
                                      await notificationVm.markAsRead(item.id!);
                                      if (mounted) {
                                        Provider.of<DashboardViewModel>(context, listen: false)
                                            .updateNotificationCount(notificationVm.unreadCount);
                                      }
                                    }
                                  },
                                )
                              : null,
                        ),
                      );
                    },
                  ),
      ),
    );
  }
}
