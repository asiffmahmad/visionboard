import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:mobile/main.dart';
import 'package:mobile/core/di/injection_container.dart' as di;
import 'package:mobile/data/repositories/auth_repository.dart';

class MockAuthRepository extends Mock implements AuthRepository {}

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  setUpAll(() async {
    // Initialize the full DI container
    await di.init();
  });

  tearDownAll(() async {
    // Reset GetIt so state doesn't leak between test runs
    await di.sl.reset();
  });

  group('End-to-End Integration Tests', () {
    testWidgets(
        'booting application should show login page when unauthenticated',
        (WidgetTester tester) async {
      await tester.pumpWidget(const MyApp());

      // Allow async auth-check to complete
      await tester.pumpAndSettle(const Duration(seconds: 3));

      // App should land on Login screen since no user is registered yet
      expect(find.text('Log In'), findsWidgets);
      expect(find.text('Email Address'), findsOneWidget);
    });
  });
}
