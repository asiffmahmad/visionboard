import 'package:flutter/material.dart';
import '../../data/models/habit.dart';
import '../../data/repositories/habit_repository.dart';

class HabitViewModel extends ChangeNotifier {
  final HabitRepository _habitRepository;

  List<Habit> _habits = [];
  bool _isLoading = false;
  String? _errorMessage;

  HabitViewModel(this._habitRepository);

  List<Habit> get habits => _habits;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> fetchHabits() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _habits = await _habitRepository.getAllHabits();
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> createHabit({
    required String title,
    required String frequency,
    required String purpose,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final habit = Habit(
        title: title,
        frequency: frequency,
        purpose: purpose,
        startDate: DateTime.now().toIso8601String().substring(0, 10),
      );
      final created = await _habitRepository.createHabit(habit);
      _habits.insert(0, created);
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

  Future<bool> deleteHabit(int id) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      await _habitRepository.deleteHabit(id);
      _habits.removeWhere((h) => h.id == id);
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

  Future<bool> logHabit({
    required int id,
    required String date,
    required bool completed,
  }) async {
    // Optimistic UI state toggle
    final index = _habits.indexWhere((h) => h.id == id);
    Habit? originalHabit;
    if (index != -1) {
      originalHabit = _habits[index];
      final List<String> updatedDates = List.from(originalHabit.completedDates);
      if (completed) {
        if (!updatedDates.contains(date)) updatedDates.add(date);
      } else {
        updatedDates.remove(date);
      }
      _habits[index] = originalHabit.copyWith(completedDates: updatedDates);
      notifyListeners();
    }

    try {
      final updated = await _habitRepository.logHabitCompletion(id, date, completed);
      if (index != -1) {
        _habits[index] = updated;
      }
      notifyListeners();
      return true;
    } catch (e) {
      // Revert status on failure
      if (index != -1 && originalHabit != null) {
        _habits[index] = originalHabit;
        notifyListeners();
      }
      _errorMessage = e.toString();
      return false;
    }
  }

  Future<bool> skipHabit({
    required int id,
    required String date,
    required String reason,
    required String notes,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final updated = await _habitRepository.skipHabit(id, date, reason, notes);
      final index = _habits.indexWhere((h) => h.id == id);
      if (index != -1) {
        _habits[index] = updated;
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
}
