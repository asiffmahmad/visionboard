import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:mobile/core/storage/secure_storage_service.dart';

class MockFlutterSecureStorage extends Mock implements FlutterSecureStorage {}

void main() {
  late MockFlutterSecureStorage mockStorage;
  late SecureStorageService secureStorageService;

  setUp(() {
    mockStorage = MockFlutterSecureStorage();
    secureStorageService = SecureStorageService(storage: mockStorage);
  });

  group('SecureStorageService Test', () {
    test('saveTokens should call write twice on FlutterSecureStorage', () async {
      when(() => mockStorage.write(key: any(named: 'key'), value: any(named: 'value')))
          .thenAnswer((_) async {});

      await secureStorageService.saveTokens(
        accessToken: 'access_jwt',
        refreshToken: 'refresh_jwt',
      );

      verify(() => mockStorage.write(key: 'access_token', value: 'access_jwt')).called(1);
      verify(() => mockStorage.write(key: 'refresh_token', value: 'refresh_jwt')).called(1);
    });

    test('getAccessToken should read from key access_token', () async {
      when(() => mockStorage.read(key: 'access_token'))
          .thenAnswer((_) async => 'token_val');

      final token = await secureStorageService.getAccessToken();

      expect(token, equals('token_val'));
      verify(() => mockStorage.read(key: 'access_token')).called(1);
    });

    test('clearTokens should delete keys', () async {
      when(() => mockStorage.delete(key: any(named: 'key')))
          .thenAnswer((_) async {});

      await secureStorageService.clearTokens();

      verify(() => mockStorage.delete(key: 'access_token')).called(1);
      verify(() => mockStorage.delete(key: 'refresh_token')).called(1);
    });
  });
}
