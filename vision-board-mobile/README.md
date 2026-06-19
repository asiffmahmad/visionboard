# Vision Board Standalone Mobile Application

A premium, production-ready Android mobile application built with **Flutter & Dart**. This project is fully decoupled from the web application and backend servers, and operates as a standalone repository.

---

## 🏗️ Project Structure

The project follows a **Clean Architecture** structure:

```text
vision-board-mobile/
├── android/               # Native Android gradle configurations & code
├── assets/                # App assets and resources
├── lib/                   # Flutter source code
│   ├── main.dart          # App entrypoint
│   ├── core/              # Dependency injection, constants, theme, network, storage
│   ├── data/              # Models, repositories, and local database services
│   ├── domain/            # Entities, repository interfaces
│   └── presentation/      # ViewModels and UI views/widgets
├── test/                  # Unit and Widget tests
├── integration_test/      # Integration tests
├── .env.example           # Example environment configuration
├── pubspec.yaml           # Dependencies configuration
└── README.md              # Project documentation
```

---

## ⚙️ Environment Configuration

This app uses Dart environment variables to configure backend endpoint URLs. This prevents hardcoding of local or production servers.

### Setup Instructions

1. **Locate the Configuration Example**:
   Review `.env.example` in the root folder.

2. **Run/Build with Environment Variables**:
   Provide the `API_BASE_URL` at compilation or execution time using the `--dart-define` flag.
   - For Android Emulator (accessing backend on localhost:8080):
     ```bash
     flutter run --dart-define=API_BASE_URL=http://10.0.2.2:8080
     ```
   - For Physical Device:
     ```bash
     flutter run --dart-define=API_BASE_URL=http://<YOUR_LOCAL_IP>:8080
     ```
   - For Production:
     ```bash
     flutter run --dart-define=API_BASE_URL=https://api.yourdomain.com
     ```

---

## 🛠️ Build & Compilation Instructions

### Prerequisite Setup
Ensure you have the Flutter SDK installed on your system (`>=3.12.1` stable branch) and Android SDK configure-tools set up.

1. Fetch dependencies:
   ```bash
   flutter pub get
   ```
2. Verify code analysis:
   ```bash
   flutter analyze
   ```
3. Run the test suite:
   ```bash
   flutter test
   ```

### Compile Release Targets

When building the production binaries, remember to pass the `API_BASE_URL` using `--dart-define`:

*   **Compile Release APK**:
    ```bash
    flutter build apk --release --dart-define=API_BASE_URL=http://10.0.2.2:8080
    ```
    *Output: `build/app/outputs/flutter-apk/app-release.apk`*

*   **Compile Release App Bundle (AAB)**:
    ```bash
    flutter build appbundle --release --dart-define=API_BASE_URL=http://10.0.2.2:8080
    ```
    *Output: `build/app/outputs/bundle/release/app-release.aab`*
