import 'package:flutter/material.dart';
import '../../data/models/note.dart';
import '../../data/repositories/note_repository.dart';

class NoteViewModel extends ChangeNotifier {
  final NoteRepository _noteRepository;

  List<Note> _notes = [];
  bool _isLoading = false;
  String? _errorMessage;

  NoteViewModel(this._noteRepository);

  List<Note> get notes => _notes;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> fetchNotes() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _notes = await _noteRepository.getAllNotes();
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> createNote({
    required String title,
    required String content,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final note = Note(
        title: title,
        content: content,
        createdAt: DateTime.now().toIso8601String(),
        updatedAt: DateTime.now().toIso8601String(),
      );
      final created = await _noteRepository.createNote(note);
      _notes.insert(0, created);
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

  Future<bool> updateNote(Note note) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final updated = note.copyWith(content: note.content); // timestamp updated by repo
      final res = await _noteRepository.updateNote(updated);
      final index = _notes.indexWhere((n) => n.id == note.id);
      if (index != -1) {
        _notes[index] = res;
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

  Future<bool> deleteNote(int id) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      await _noteRepository.deleteNote(id);
      _notes.removeWhere((n) => n.id == id);
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
