import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/presentation/widgets/glass_card.dart';

void main() {
  group('GlassCard Widget Test', () {
    testWidgets('renders child widget content correctly', (WidgetTester tester) async {
      const childWidget = Text('Glass Card Content');

      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: GlassCard(
              child: childWidget,
            ),
          ),
        ),
      );

      final textFinder = find.text('Glass Card Content');
      expect(textFinder, findsOneWidget);
    });

    testWidgets('calls onTap callback when tapped', (WidgetTester tester) async {
      bool tapped = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: GlassCard(
              onTap: () {
                tapped = true;
              },
              child: const Text('Tap Me'),
            ),
          ),
        ),
      );

      final textFinder = find.text('Tap Me');
      await tester.tap(textFinder);
      await tester.pumpAndSettle();

      expect(tapped, isTrue);
    });
  });
}
