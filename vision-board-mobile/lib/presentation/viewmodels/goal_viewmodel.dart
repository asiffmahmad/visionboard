import 'package:flutter/material.dart';
import '../../data/models/goal.dart';
import '../../data/repositories/goal_repository.dart';

class GoalViewModel extends ChangeNotifier {
  final GoalRepository _goalRepository;

  List<Goal> _goals = [];
  bool _isLoading = false;
  String? _errorMessage;

  GoalViewModel(this._goalRepository);

  List<Goal> get goals => _goals;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> fetchGoals() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _goals = await _goalRepository.getAllGoals();
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchGoalsByVision(int visionId) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _goals = await _goalRepository.getGoalsByVision(visionId);
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> createGoal({
    required String title,
    required String description,
    required String goalType,
    required String targetDate,
    required int visionId,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final goal = Goal(
        title: title,
        description: description,
        goalType: goalType,
        targetDate: targetDate,
        visionId: visionId,
      );
      final created = await _goalRepository.createGoal(goal);
      _goals.insert(0, created);
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

  Future<bool> updateGoal(Goal goal) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final updated = await _goalRepository.updateGoal(goal);
      final index = _goals.indexWhere((g) => g.id == goal.id);
      if (index != -1) {
        _goals[index] = updated;
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

  Future<bool> deleteGoal(int id) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      await _goalRepository.deleteGoal(id);
      _goals.removeWhere((g) => g.id == id);
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
}
