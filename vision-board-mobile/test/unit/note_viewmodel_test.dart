import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:mobile/presentation/viewmodels/note_viewmodel.dart';
import 'package:mobile/data/repositories/note_repository.dart';
import 'package:mobile/data/models/note.dart';

class MockNoteRepository extends Mock implements NoteRepository {}

void main() {
  late MockNoteRepository mockRepo;
  late NoteViewModel noteViewModel;

  setUp(() {
    mockRepo = MockNoteRepository();
    noteViewModel = NoteViewModel(mockRepo);
  });

  group('NoteViewModel Unit Tests', () {
    final tNote = Note(
      id: 1,
      title: 'Test Note',
      content: 'This is a test note content.',
      createdAt: '2026-06-10T12:00:00Z',
      updatedAt: '2026-06-10T12:00:00Z',
    );

    test('Initial state should be empty and idle', () {
      expect(noteViewModel.notes, isEmpty);
      expect(noteViewModel.isLoading, isFalse);
      expect(noteViewModel.errorMessage, isNull);
    });

    test('fetchNotes success should populate notes list', () async {
      when(() => mockRepo.getAllNotes()).thenAnswer((_) async => [tNote]);

      await noteViewModel.fetchNotes();

      expect(noteViewModel.isLoading, isFalse);
      expect(noteViewModel.notes, contains(tNote));
      expect(noteViewModel.errorMessage, isNull);
      verify(() => mockRepo.getAllNotes()).called(1);
    });

    test('fetchNotes failure should set errorMessage', () async {
      when(() => mockRepo.getAllNotes()).thenThrow(Exception('DB Error'));

      await noteViewModel.fetchNotes();

      expect(noteViewModel.isLoading, isFalse);
      expect(noteViewModel.notes, isEmpty);
      expect(noteViewModel.errorMessage, contains('DB Error'));
    });

    test('createNote success should insert new note at index 0', () async {
      final newNoteInput = Note(
        title: 'New Note',
        content: 'New content',
        createdAt: '',
        updatedAt: '',
      );
      final createdNote = Note(
        id: 2,
        title: 'New Note',
        content: 'New content',
        createdAt: '2026-06-10T12:30:00Z',
        updatedAt: '2026-06-10T12:30:00Z',
      );

      // Register mocktail fallback if necessary, or just match any(that: ...) or any()
      registerFallbackValue(newNoteInput);
      when(() => mockRepo.createNote(any())).thenAnswer((_) async => createdNote);

      final success = await noteViewModel.createNote(
        title: 'New Note',
        content: 'New content',
      );

      expect(success, isTrue);
      expect(noteViewModel.notes.first, equals(createdNote));
      verify(() => mockRepo.createNote(any())).called(1);
    });

    test('updateNote success should replace the updated note in the list', () async {
      noteViewModel.notes.add(tNote);
      final updatedNote = tNote.copyWith(content: 'Updated content');

      when(() => mockRepo.updateNote(any())).thenAnswer((_) async => updatedNote);

      final success = await noteViewModel.updateNote(updatedNote);

      expect(success, isTrue);
      expect(noteViewModel.notes.first.content, equals('Updated content'));
      verify(() => mockRepo.updateNote(any())).called(1);
    });

    test('deleteNote success should remove note from the list', () async {
      noteViewModel.notes.add(tNote);

      when(() => mockRepo.deleteNote(1)).thenAnswer((_) async => {});

      final success = await noteViewModel.deleteNote(1);

      expect(success, isTrue);
      expect(noteViewModel.notes, isEmpty);
      verify(() => mockRepo.deleteNote(1)).called(1);
    });
  });
}
