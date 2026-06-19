import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:mobile/presentation/viewmodels/task_viewmodel.dart';
import 'package:mobile/data/repositories/task_repository.dart';
import 'package:mobile/data/models/task.dart';

class MockTaskRepository extends Mock implements TaskRepository {}

void main() {
  late MockTaskRepository mockRepo;
  late TaskViewModel taskViewModel;

  setUp(() {
    mockRepo = MockTaskRepository();
    taskViewModel = TaskViewModel(mockRepo);
  });

  group('TaskViewModel Unit Tests', () {
    final tTask = Task(
      id: 1,
      title: 'Test Task',
      description: 'Task Description',
      status: 'PENDING',
      priority: 'MEDIUM',
    );

    test('Initial state should be empty and idle', () {
      expect(taskViewModel.tasks, isEmpty);
      expect(taskViewModel.isLoading, isFalse);
      expect(taskViewModel.errorMessage, isNull);
    });

    test('fetchTasks success should populate tasks list', () async {
      when(() => mockRepo.getTasks(
            status: any(named: 'status'),
            priority: any(named: 'priority'),
            dueDate: any(named: 'dueDate'),
            search: any(named: 'search'),
          )).thenAnswer((_) async => [tTask]);

      await taskViewModel.fetchTasks();

      expect(taskViewModel.isLoading, isFalse);
      expect(taskViewModel.tasks, contains(tTask));
      expect(taskViewModel.errorMessage, isNull);
      verify(() => mockRepo.getTasks(
            status: any(named: 'status'),
            priority: any(named: 'priority'),
            dueDate: any(named: 'dueDate'),
            search: any(named: 'search'),
          )).called(1);
    });

    test('createTask success should insert new task at index 0', () async {
      final createdTask = Task(
        id: 2,
        title: 'New Task',
        description: 'New Description',
        status: 'PENDING',
        priority: 'HIGH',
      );

      registerFallbackValue(tTask);
      when(() => mockRepo.createTask(any())).thenAnswer((_) async => createdTask);

      final success = await taskViewModel.createTask(
        title: 'New Task',
        description: 'New Description',
        status: 'PENDING',
        priority: 'HIGH',
      );

      expect(success, isTrue);
      expect(taskViewModel.tasks.first, equals(createdTask));
      verify(() => mockRepo.createTask(any())).called(1);
    });

    test('updateTask success should replace the updated task in the list', () async {
      taskViewModel.tasks.add(tTask);
      final updatedTask = tTask.copyWith(description: 'Updated description');

      when(() => mockRepo.updateTask(any())).thenAnswer((_) async => updatedTask);

      final success = await taskViewModel.updateTask(updatedTask);

      expect(success, isTrue);
      expect(taskViewModel.tasks.first.description, equals('Updated description'));
      verify(() => mockRepo.updateTask(any())).called(1);
    });

    test('deleteTask success should remove task from the list', () async {
      taskViewModel.tasks.add(tTask);

      when(() => mockRepo.deleteTask(1)).thenAnswer((_) async => {});

      final success = await taskViewModel.deleteTask(1);

      expect(success, isTrue);
      expect(taskViewModel.tasks, isEmpty);
      verify(() => mockRepo.deleteTask(1)).called(1);
    });

    test('toggleTaskStatus success should toggle PENDING to COMPLETED', () async {
      taskViewModel.tasks.add(tTask);
      final toggledTask = tTask.copyWith(status: 'COMPLETED');

      when(() => mockRepo.updateTaskStatus(1, 'COMPLETED'))
          .thenAnswer((_) async => toggledTask);

      final success = await taskViewModel.toggleTaskStatus(tTask);

      expect(success, isTrue);
      expect(taskViewModel.tasks.first.status, equals('COMPLETED'));
      verify(() => mockRepo.updateTaskStatus(1, 'COMPLETED')).called(1);
    });
  });
}
