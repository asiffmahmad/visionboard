import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:mobile/presentation/viewmodels/auth_viewmodel.dart';
import 'package:mobile/data/repositories/auth_repository.dart';
import 'package:mobile/data/models/user.dart';

class MockAuthRepository extends Mock implements AuthRepository {}

void main() {
  late MockAuthRepository mockRepo;
  late AuthViewModel authViewModel;

  setUp(() {
    mockRepo = MockAuthRepository();
    authViewModel = AuthViewModel(mockRepo);
  });

  group('AuthViewModel Unit Tests', () {
    final tUser = User(id: 1, username: 'testuser', email: 'test@example.com', role: 'USER');

    test('Initial state should be logged out and idle', () {
      expect(authViewModel.user, isNull);
      expect(authViewModel.isLoading, isFalse);
      expect(authViewModel.errorMessage, isNull);
      expect(authViewModel.isAuthenticated, isFalse);
    });

    test('Login success should set user and authenticated status', () async {
      when(() => mockRepo.login('test@example.com', 'password'))
          .thenAnswer((_) async => tUser);

      final success = await authViewModel.login('test@example.com', 'password');

      expect(success, isTrue);
      expect(authViewModel.user, equals(tUser));
      expect(authViewModel.isAuthenticated, isTrue);
      expect(authViewModel.isLoading, isFalse);
      verify(() => mockRepo.login('test@example.com', 'password')).called(1);
    });

    test('Login failure should populate errorMessage', () async {
      when(() => mockRepo.login('test@example.com', 'bad_password'))
          .thenThrow(Exception('Invalid email or password'));

      final success = await authViewModel.login('test@example.com', 'bad_password');

      expect(success, isFalse);
      expect(authViewModel.user, isNull);
      expect(authViewModel.isAuthenticated, isFalse);
      expect(authViewModel.errorMessage, equals('Invalid email or password'));
      expect(authViewModel.isLoading, isFalse);
    });
  });
}
