import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:mobile/core/storage/local_database_service.dart';
import 'package:mobile/data/repositories/vision_repository.dart';
import 'package:mobile/data/repositories/goal_repository.dart';
import 'package:mobile/data/repositories/task_repository.dart';
import 'package:mobile/data/repositories/note_repository.dart';
import 'package:mobile/data/models/vision.dart';
import 'package:mobile/data/models/goal.dart';
import 'package:mobile/data/models/task.dart';
import 'package:mobile/data/models/note.dart';

class MockLocalDatabaseService extends Mock implements LocalDatabaseService {}

void main() {
  late MockLocalDatabaseService mockDb;
  late VisionRepository visionRepo;
  late GoalRepository goalRepo;
  late TaskRepository taskRepo;
  late NoteRepository noteRepo;

  setUp(() {
    mockDb = MockLocalDatabaseService();
    visionRepo = VisionRepository(mockDb);
    goalRepo = GoalRepository(mockDb);
    taskRepo = TaskRepository(mockDb);
    noteRepo = NoteRepository(mockDb);
  });

  group('VisionRepository Tests', () {
    final tVision = Vision(
      id: 1,
      title: 'My Vision',
      description: 'Vision Description',
      visionType: 'LIFE',
      targetDate: '2026-12-31',
    );

    test('getAllVisions should query visions table', () async {
      when(() => mockDb.queryAll('visions'))
          .thenAnswer((_) async => [tVision.toDbMap()]);

      final result = await visionRepo.getAllVisions();

      expect(result.length, equals(1));
      expect(result.first.title, equals('My Vision'));
      verify(() => mockDb.queryAll('visions')).called(1);
    });

    test('createVision should insert vision without id and return it with inserted id', () async {
      final inputVision = Vision(
        title: 'New Vision',
        description: 'New Desc',
        visionType: 'CAREER',
        targetDate: '2026-06-30',
      );

      when(() => mockDb.insert('visions', any()))
          .thenAnswer((_) async => 42);

      final result = await visionRepo.createVision(inputVision);

      expect(result.id, equals(42));
      expect(result.title, equals('New Vision'));
      verify(() => mockDb.insert('visions', any())).called(1);
    });
  });

  group('GoalRepository Tests', () {
    final tGoal = Goal(
      id: 1,
      title: 'My Goal',
      description: 'Goal Description',
      goalType: 'SHORT_TERM',
      visionId: 1,
      targetDate: '2026-08-30',
    );

    test('getGoalsByVision should query goals table with vision_id where clause', () async {
      when(() => mockDb.queryAll('goals', where: 'vision_id = ?', whereArgs: [1]))
          .thenAnswer((_) async => [tGoal.toDbMap()]);

      final result = await goalRepo.getGoalsByVision(1);

      expect(result.length, equals(1));
      expect(result.first.title, equals('My Goal'));
      verify(() => mockDb.queryAll('goals', where: 'vision_id = ?', whereArgs: [1])).called(1);
    });
  });

  group('TaskRepository Tests', () {
    final tTask = Task(
      id: 1,
      title: 'My Task',
      description: 'Task Description',
      status: 'PENDING',
      priority: 'MEDIUM',
      goalId: 1,
      dueDate: '2026-06-15',
    );

    test('createTask should insert task without id and return it with inserted id', () async {
      final inputTask = Task(
        title: 'New Task',
        description: 'Task Desc',
        status: 'PENDING',
        priority: 'HIGH',
        goalId: 1,
        dueDate: '2026-06-20',
      );

      when(() => mockDb.insert('tasks', any()))
          .thenAnswer((_) async => 101);

      final result = await taskRepo.createTask(inputTask);

      expect(result.id, equals(101));
      expect(result.title, equals('New Task'));
      verify(() => mockDb.insert('tasks', any())).called(1);
    });
  });
}
