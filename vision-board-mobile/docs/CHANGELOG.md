# Changelog — Vision Board

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2026-06-10

### Initial Release 🚀

#### Added
- **Dashboard** — At-a-glance summary of active tasks, habits, recent notes, and upcoming goals
- **Vision Board** — Create and manage life visions across any life area (career, health, finance, relationships, etc.)
- **Goal Management** — Break each vision into measurable goals with target dates and progress tracking
- **Task Management** — Organise daily tasks under goals with due dates, priority levels, and status toggling
- **Habit Tracker** — Daily habit check-ins with streak counters and visual progress rings
- **Journal** — Daily journal entries with mood selector (Happy, Neutral, Sad, Grateful, Motivated)
- **Notes** — Free-form note capture with tagging, search, and rich-text editing
- **Local Authentication** — PIN / password login with optional biometric (fingerprint / face) unlock
- **Data Backup** — Full data export to JSON backup file
- **Data Restore** — One-tap restore from a previous backup file
- **100% Offline Architecture** — Zero network requests; all data stored locally in SQLite
- **Material 3 Glassmorphism UI** — Premium dark mode design with smooth animations
- **Google Fonts integration** — Poppins and Inter typography

#### Technical
- Flutter 3.x with Dart 3
- SQLite persistence via `sqflite`
- Secure credential storage via `flutter_secure_storage` (Android Keystore)
- Biometric authentication via `local_auth`
- State management via `provider` + `get_it`
- 26 unit and widget tests — all passing
- Integration test on Android API 36 — passing

---

## [Unreleased]

### Planned
- Widget support (home screen task widget)
- Calendar view for goals and tasks
- Photo attachments for vision boards
- Multiple theme options (light / dark / system)
- CSV export option
- Search across all content types
- Reminder notifications
