import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:mocktail/mocktail.dart';
import 'package:mobile/presentation/views/auth/login_view.dart';
import 'package:mobile/presentation/viewmodels/auth_viewmodel.dart';
import 'package:mobile/data/repositories/auth_repository.dart';

class MockAuthRepository extends Mock implements AuthRepository {}

void main() {
  late MockAuthRepository mockRepo;
  late AuthViewModel authVm;

  setUp(() {
    mockRepo = MockAuthRepository();
    authVm = AuthViewModel(mockRepo);
  });

  Widget createWidgetUnderTest() {
    return ChangeNotifierProvider<AuthViewModel>.value(
      value: authVm,
      child: const MaterialApp(
        home: LoginView(),
      ),
    );
  }

  group('LoginView Widget Tests', () {
    testWidgets('renders input fields and login buttons', (WidgetTester tester) async {
      await tester.pumpWidget(createWidgetUnderTest());

      expect(find.byType(TextFormField), findsNWidgets(2)); // Email and Password
      expect(find.text('Email Address'), findsOneWidget);
      expect(find.text('Password'), findsOneWidget);
      expect(find.widgetWithText(ElevatedButton, 'Log In'), findsOneWidget);
    });

    testWidgets('shows validation errors when fields are empty', (WidgetTester tester) async {
      await tester.pumpWidget(createWidgetUnderTest());

      final loginBtn = find.widgetWithText(ElevatedButton, 'Log In');
      await tester.tap(loginBtn);
      await tester.pump();

      expect(find.text('Email is required'), findsOneWidget);
      expect(find.text('Password is required'), findsOneWidget);
    });
  });
}
