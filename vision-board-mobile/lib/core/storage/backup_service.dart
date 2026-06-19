import 'dart:convert';
import 'local_database_service.dart';

class BackupService {
  final LocalDatabaseService _dbService;

  BackupService(this._dbService);

  // List of all tables to export/import
  static const List<String> _tables = [
    'users',
    'visions',
    'goals',
    'tasks',
    'habits',
    'habit_logs',
    'notes',
    'journal_entries',
    'milestones',
    'notifications',
  ];

  Future<String> exportBackup() async {
    final Map<String, dynamic> backupData = {
      'backup_version': 1,
      'exported_at': DateTime.now().toIso8601String(),
    };

    for (final table in _tables) {
      final records = await _dbService.queryAll(table);
      backupData[table] = records;
    }

    return json.encode(backupData);
  }

  Future<bool> importBackup(String jsonString) async {
    try {
      final Map<String, dynamic> backupData = json.decode(jsonString) as Map<String, dynamic>;
      
      // Basic schema validation
      if (!backupData.containsKey('backup_version') || backupData['backup_version'] != 1) {
        throw Exception('Invalid backup version or format');
      }

      final db = await _dbService.database;

      // Import in a single transaction to maintain data integrity
      await db.transaction((txn) async {
        for (final table in _tables) {
          // Clear table first
          await txn.delete(table);

          // Get backup records
          final records = backupData[table];
          if (records != null && records is List) {
            for (final record in records) {
              if (record is Map<String, dynamic>) {
                await txn.insert(table, record);
              }
            }
          }
        }
      });

      return true;
    } catch (e) {
      return false;
    }
  }
}
