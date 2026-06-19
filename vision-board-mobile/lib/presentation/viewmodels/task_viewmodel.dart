import 'package:flutter/material.dart';
import '../../data/models/task.dart';
import '../../data/repositories/task_repository.dart';

class TaskViewModel extends ChangeNotifier {
  final TaskRepository _taskRepository;

  List<Task> _tasks = [];
  bool _isLoading = false;
  String? _errorMessage;

  // Filters
  String? _filterStatus;
  String? _filterPriority;
  String? _filterDueDate;
  String? _filterSearch;

  TaskViewModel(this._taskRepository);

  List<Task> get tasks => _tasks;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  String? get filterStatus => _filterStatus;
  String? get filterPriority => _filterPriority;
  String? get filterDueDate => _filterDueDate;
  String? get filterSearch => _filterSearch;

  void setFilters({
    String? status,
    String? priority,
    String? dueDate,
    String? search,
  }) {
    _filterStatus = status;
    _filterPriority = priority;
    _filterDueDate = dueDate;
    _filterSearch = search;
    fetchTasks();
  }

  void clearFilters() {
    _filterStatus = null;
    _filterPriority = null;
    _filterDueDate = null;
    _filterSearch = null;
    fetchTasks();
  }

  Future<void> fetchTasks() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _tasks = await _taskRepository.getTasks(
        status: _filterStatus,
        priority: _filterPriority,
        dueDate: _filterDueDate,
        search: _filterSearch,
      );
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> createTask({
    required String title,
    required String description,
    required String status,
    required String priority,
    String? dueDate,
    int? goalId,
    String? tags,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final task = Task(
        title: title,
        description: description,
        status: status,
        priority: priority,
        dueDate: dueDate,
        goalId: goalId,
        tags: tags,
      );
      final created = await _taskRepository.createTask(task);
      _tasks.insert(0, created);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> updateTask(Task task) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final updated = await _taskRepository.updateTask(task);
      final index = _tasks.indexWhere((t) => t.id == task.id);
      if (index != -1) {
        _tasks[index] = updated;
      }
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> deleteTask(int id) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      await _taskRepository.deleteTask(id);
      _tasks.removeWhere((t) => t.id == id);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> toggleTaskStatus(Task task) async {
    final newStatus = task.status == 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    final id = task.id;
    if (id == null) return false;

    // Fast local UI update (optimistic UI)
    final index = _tasks.indexWhere((t) => t.id == id);
    if (index != -1) {
      _tasks[index] = task.copyWith(status: newStatus);
      notifyListeners();
    }

    try {
      final updated = await _taskRepository.updateTaskStatus(id, newStatus);
      if (index != -1) {
        _tasks[index] = updated;
      }
      notifyListeners();
      return true;
    } catch (e) {
      // Revert status on failure
      if (index != -1) {
        _tasks[index] = task;
        notifyListeners();
      }
      return false;
    }
  }
}
