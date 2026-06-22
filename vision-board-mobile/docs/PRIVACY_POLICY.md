# Privacy Policy — Vision Board

**Effective Date:** 10 June 2026  
**Last Updated:** 10 June 2026

---

## 1. Introduction

Welcome to **Vision Board** ("the App"). This App is developed and maintained by **asiff**. This Privacy Policy explains how the App handles your information. Your privacy is fundamental to us — Vision Board is designed from the ground up to keep all of your data on your device.

---

## 2. Data We Do NOT Collect

Vision Board does **not** collect, transmit, store, or process any personal data on external servers.

Specifically, we **never** collect:

- Your name, email address, or any account credentials
- Your location
- Device identifiers (IMEI, advertising ID, etc.)
- Usage analytics or crash reports
- Financial information
- Health information
- Any content you create in the App (visions, goals, tasks, journal entries, notes, habits)

---

## 3. Data Stored Locally on Your Device

All data you enter into the App is stored **exclusively on your device** in a local SQLite database:

| Data Type | Storage Location | Purpose |
|---|---|---|
| Visions, Goals, Tasks | SQLite database | Core app functionality |
| Journal entries | SQLite database | Journaling feature |
| Notes | SQLite database | Notes feature |
| Habits & check-ins | SQLite database | Habit tracking feature |
| PIN / password hash | Android Keystore (flutter_secure_storage) | Authentication |
| Biometric preference | Android Keystore | Authentication |

This data never leaves your device unless you explicitly choose to export a backup file using the in-app **Export Data Backup** feature.

---

## 4. Permissions

The App requests the following Android permissions:

| Permission | Reason |
|---|---|
| `USE_BIOMETRIC` | Allows fingerprint / face unlock for app access |
| `READ_EXTERNAL_STORAGE` *(optional, Android ≤12)* | Reading a backup file during Restore |
| `WRITE_EXTERNAL_STORAGE` *(optional, Android ≤12)* | Exporting a backup file |

The App does **not** request `INTERNET`, `ACCESS_NETWORK_STATE`, `ACCESS_FINE_LOCATION`, `READ_CONTACTS`, or any other sensitive permission.

---

## 5. Third-Party Services

Vision Board uses **no third-party analytics, advertising, or crash-reporting SDKs**. The following Flutter packages are used purely for local functionality:

| Package | Purpose |
|---|---|
| `sqflite` | Local SQLite database |
| `flutter_secure_storage` | Secure credential storage |
| `local_auth` | Biometric authentication |
| `google_fonts` | Typography (fonts loaded from bundled assets) |
| `provider` / `get_it` | State management (on-device only) |
| `connectivity_plus` | Offline status detection (no data sent) |
| `crypto` | Local password hashing |

None of these packages send data to external servers.

---

## 6. Children's Privacy

The App does not knowingly collect data from children under the age of 13 (or equivalent minimum age in the relevant jurisdiction). Since the App collects no data at all, it is safe for users of all ages.

---

## 7. Data Security

- All credentials are stored using **Android Keystore** via `flutter_secure_storage`, which provides hardware-backed encryption where available.
- The local SQLite database is stored in the App's private data directory (`/data/data/com.visionboard.app/databases/`), which is inaccessible to other apps without root access.
- Backup files exported by the user are the user's own responsibility once saved to external storage.

---

## 8. Your Rights

Since Vision Board stores all data locally on your device:

- **Access**: View all your data directly in the App.
- **Export**: Use the **Export Data Backup** feature to export a JSON file of all your data.
- **Delete**: Uninstalling the App removes all data permanently. You may also clear app data via Android Settings → Apps → Vision Board → Clear Data.

---

## 9. Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of any changes by updating the **Last Updated** date at the top of this document. We encourage you to review this Privacy Policy periodically.

---

## 10. Contact Us

If you have any questions about this Privacy Policy, please contact us at:

**Developer:** asiff  
**Email:** noreplydesk01@gmail.com  
**GitHub:** https://github.com/asiff

---

*Vision Board, developed by asiff, is committed to being a zero-data-collection application. Your thoughts and goals are yours alone.*
