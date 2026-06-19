import 'package:flutter/material.dart';
import '../../data/models/milestone.dart';
import '../../data/repositories/milestone_repository.dart';

class MilestoneViewModel extends ChangeNotifier {
  final MilestoneRepository _milestoneRepository;

  List<Milestone> _milestones = [];
  bool _isLoading = false;
  String? _errorMessage;

  MilestoneViewModel(this._milestoneRepository);

  List<Milestone> get milestones => _milestones;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> fetchMilestones(int goalId) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _milestones = await _milestoneRepository.getMilestonesByGoal(goalId);
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> createMilestone({
    required int goalId,
    required String title,
    required String description,
    required String dueDate,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final milestone = Milestone(
        goalId: goalId,
        title: title,
        description: description,
        dueDate: dueDate,
      );
      final created = await _milestoneRepository.createMilestone(milestone);
      _milestones.add(created);
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

  Future<bool> toggleMilestone(Milestone milestone) async {
    final id = milestone.id;
    if (id == null) return false;

    // Optimistic UI toggle
    final index = _milestones.indexWhere((m) => m.id == id);
    if (index != -1) {
      _milestones[index] = milestone.copyWith(completed: !milestone.completed);
      notifyListeners();
    }

    try {
      final updated = await _milestoneRepository.toggleMilestoneCompletion(id);
      if (index != -1) {
        _milestones[index] = updated;
      }
      notifyListeners();
      return true;
    } catch (e) {
      // Revert status on failure
      if (index != -1) {
        _milestones[index] = milestone;
        notifyListeners();
      }
      _errorMessage = e.toString();
      return false;
    }
  }

  Future<bool> deleteMilestone(int id, int goalId) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      await _milestoneRepository.deleteMilestone(id, goalId);
      _milestones.removeWhere((m) => m.id == id);
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
