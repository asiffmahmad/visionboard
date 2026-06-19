import 'package:flutter/material.dart';
import '../../data/models/journal_entry.dart';
import '../../data/repositories/journal_repository.dart';

class JournalViewModel extends ChangeNotifier {
  final JournalRepository _journalRepository;

  List<JournalEntry> _entries = [];
  bool _isLoading = false;
  String? _errorMessage;

  JournalViewModel(this._journalRepository);

  List<JournalEntry> get entries => _entries;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> fetchEntries() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _entries = await _journalRepository.getAllEntries();
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> createEntry({
    required String title,
    required String content,
    required String mood,
    required String entryType,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final entry = JournalEntry(
        title: title,
        content: content,
        mood: mood,
        entryType: entryType,
        createdAt: DateTime.now().toIso8601String(),
      );
      final created = await _journalRepository.createEntry(entry);
      _entries.insert(0, created);
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

  Future<bool> updateEntry(JournalEntry entry) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final updated = await _journalRepository.updateEntry(entry);
      final index = _entries.indexWhere((e) => e.id == entry.id);
      if (index != -1) {
        _entries[index] = updated;
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

  Future<bool> deleteEntry(int id) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      await _journalRepository.deleteEntry(id);
      _entries.removeWhere((e) => e.id == id);
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
