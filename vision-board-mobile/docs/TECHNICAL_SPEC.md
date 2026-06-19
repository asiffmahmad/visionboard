# App Technical Specification — Vision Board

**Version:** 1.0.0 (Build 1)  
**Platform:** Android  
**Developer:** asiff  
**Package Name:** `com.visionboard.app`  
**Framework:** Flutter 3.x / Dart 3

---

## Application Summary

Vision Board is a **100% offline, standalone** personal productivity Android application. All user data is persisted locally on-device using SQLite. The app has zero network dependencies — no APIs, no cloud services, no analytics, no crash reporting.

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                 Presentation Layer               │
│  (Flutter Widgets, Material 3, Glassmorphism)   │
├─────────────────────────────────────────────────┤
│                  ViewModel Layer                 │
│  (ChangeNotifier ViewModels, Provider pattern)  │
├─────────────────────────────────────────────────┤
│                 Repository Layer                 │
│  (AuthRepository, VisionRepository, GoalRepo    │
│   TaskRepo, HabitRepo, NoteRepo, JournalRepo    │
│   DashboardRepo, BackupService)                 │
├─────────────────────────────────────────────────┤
│              Local Persistence Layer            │
│        (LocalDatabaseService — sqflite)         │
├─────────────────────────────────────────────────┤
│             Android Device Storage              │
│   /data/data/com.visionboard.app/databases/     │
└─────────────────────────────────────────────────┘
```

### Design Patterns
- **MVVM** — ViewModel per feature module
- **Repository Pattern** — Abstracts data sources
- **Dependency Injection** — GetIt service locator
- **State Management** — Provider + ChangeNotifier

---

## Android Configuration

| Property | Value |
|---|---|
| Application ID | `com.visionboard.app` |
| Min SDK | API 24 (Android 7.0 Nougat) |
| Target SDK | API 34 (Android 14) |
| Compile SDK | API 36 (Android 16) |
| NDK Version | Flutter default |
| JVM Target | Java 17 |
| Version Code | 1 |
| Version Name | 1.0.0 |

---

## Permissions

| Permission | Mandatory | Purpose |
|---|---|---|
| `USE_BIOMETRIC` | Optional | Fingerprint / face authentication |
| `READ_EXTERNAL_STORAGE` | Optional (Android ≤12) | Restore data backup |
| `WRITE_EXTERNAL_STORAGE` | Optional (Android ≤12) | Export data backup |

**No `INTERNET` permission is declared or used.**

---

## Database Schema

### `users` table
| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | Auto-increment |
| `username` | TEXT UNIQUE | Display name |
| `email` | TEXT UNIQUE | Local identifier |
| `password_hash` | TEXT | SHA-256 + salt |
| `created_at` | TEXT | ISO 8601 |

### `visions` table
| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | Auto-increment |
| `user_id` | INTEGER FK | → users.id |
| `title` | TEXT | Vision title |
| `description` | TEXT | |
| `category` | TEXT | Career, Health, etc. |
| `color` | TEXT | Hex colour |
| `image_path` | TEXT | Local file path (nullable) |
| `target_date` | TEXT | ISO 8601 |
| `progress` | REAL | 0.0 – 1.0 |
| `created_at` | TEXT | |
| `updated_at` | TEXT | |

### `goals` table
| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | |
| `vision_id` | INTEGER FK | → visions.id |
| `title` | TEXT | |
| `description` | TEXT | |
| `status` | TEXT | ACTIVE, COMPLETED, PAUSED |
| `target_date` | TEXT | |
| `progress` | REAL | |
| `created_at` | TEXT | |
| `updated_at` | TEXT | |

### `tasks` table
| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | |
| `goal_id` | INTEGER FK | → goals.id (nullable) |
| `user_id` | INTEGER FK | → users.id |
| `title` | TEXT | |
| `description` | TEXT | |
| `status` | TEXT | PENDING, COMPLETED, OVERDUE |
| `priority` | TEXT | LOW, MEDIUM, HIGH |
| `due_date` | TEXT | |
| `completed_at` | TEXT | |
| `created_at` | TEXT | |

### `habits` table
| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | |
| `user_id` | INTEGER FK | |
| `title` | TEXT | |
| `description` | TEXT | |
| `frequency` | TEXT | DAILY, WEEKLY |
| `streak_count` | INTEGER | Current streak |
| `last_completed_date` | TEXT | |
| `is_active` | INTEGER | 0 or 1 |
| `created_at` | TEXT | |

### `habit_logs` table
| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | |
| `habit_id` | INTEGER FK | → habits.id |
| `completed_date` | TEXT | |
| `created_at` | TEXT | |

### `notes` table
| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | |
| `user_id` | INTEGER FK | |
| `goal_id` | INTEGER FK | Nullable |
| `title` | TEXT | |
| `content` | TEXT | |
| `tags` | TEXT | Comma-separated |
| `created_at` | TEXT | |
| `updated_at` | TEXT | |

### `journal_entries` table
| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | |
| `user_id` | INTEGER FK | |
| `title` | TEXT | |
| `content` | TEXT | |
| `mood` | TEXT | HAPPY, NEUTRAL, SAD, GRATEFUL, MOTIVATED |
| `entry_date` | TEXT | |
| `created_at` | TEXT | |

---

## Dependencies

### Production
| Package | Version | Purpose |
|---|---|---|
| `sqflite` | ^2.3.0 | Local SQLite database |
| `flutter_secure_storage` | ^9.0.0 | Keystore-backed credential storage |
| `local_auth` | ^2.1.8 | Biometric authentication |
| `provider` | ^6.1.1 | State management |
| `get_it` | ^7.6.0 | Dependency injection |
| `google_fonts` | ^6.1.0 | Typography |
| `connectivity_plus` | ^5.0.2 | Offline detection |
| `intl` | ^0.18.1 | Date/number formatting |
| `uuid` | ^4.3.3 | Unique ID generation |
| `crypto` | ^3.0.3 | Password hashing (SHA-256) |
| `path` | ^1.8.3 | File path utilities |
| `cupertino_icons` | ^1.0.8 | iOS-style icons |

### Development / Test
| Package | Version | Purpose |
|---|---|---|
| `flutter_test` | SDK | Unit and widget testing |
| `integration_test` | SDK | End-to-end testing |
| `mocktail` | ^1.0.3 | Mock objects in tests |
| `flutter_lints` | ^6.0.0 | Static analysis |

---

## Build Artifacts

| Artifact | Path | Size |
|---|---|---|
| Release APK | `build/app/outputs/flutter-apk/app-release.apk` | ~484 MB |
| Release AAB | `build/app/outputs/bundle/release/app-release.aab` | ~131 MB |

> Note: APK size is large due to Flutter's bundled engine and uncompressed native `.so` libraries (required to avoid NDK 28 strip error). The AAB is the recommended upload format — Google Play will produce optimised, architecture-specific APKs from the AAB for each device.

---

## Security

| Mechanism | Implementation |
|---|---|
| Password hashing | SHA-256 with salt (crypto package) |
| Credential storage | Android Keystore via flutter_secure_storage |
| Biometric auth | Android BiometricPrompt via local_auth |
| Database access | Sandboxed private app storage |
| Network | No internet permission — zero attack surface |

---

## Test Coverage

| Test Type | Count | Status |
|---|---|---|
| Unit tests | 19 | ✅ All Passing |
| Widget tests | 7 | ✅ All Passing |
| Integration tests | 1 | ✅ Passing (Android API 36) |
| Static analysis | — | ✅ 0 issues |

---

## Feature List

| Feature | Status |
|---|---|
| Dashboard overview | ✅ Complete |
| Vision management (CRUD) | ✅ Complete |
| Goal management (CRUD) | ✅ Complete |
| Task management (CRUD + toggle) | ✅ Complete |
| Habit tracking + streaks | ✅ Complete |
| Journal entries + mood | ✅ Complete |
| Notes (CRUD + tagging) | ✅ Complete |
| Local authentication (PIN) | ✅ Complete |
| Biometric authentication | ✅ Complete |
| Data export (JSON backup) | ✅ Complete |
| Data restore (JSON backup) | ✅ Complete |
| 100% offline operation | ✅ Complete |
| Dark mode UI | ✅ Complete |
| Google Fonts typography | ✅ Complete |
