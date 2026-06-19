# docs/ — Vision Board Documentation Index

This folder contains all documentation required to publish the Vision Board Android app on the Google Play Store.

---

## 📋 Document Index

| File | Purpose |
|---|---|
| [PLAYSTORE_CHECKLIST.md](./PLAYSTORE_CHECKLIST.md) | **Start here** — Step-by-step submission checklist |
| [PLAYSTORE_LISTING.md](./PLAYSTORE_LISTING.md) | App name, description, keywords, screenshots, release notes |
| [SIGNING_GUIDE.md](./SIGNING_GUIDE.md) | How to generate a keystore and configure release signing |
| [PRIVACY_POLICY.md](./PRIVACY_POLICY.md) | Privacy policy (must be hosted at a public URL for Play Store) |
| [TERMS_OF_SERVICE.md](./TERMS_OF_SERVICE.md) | Terms of service |
| [CHANGELOG.md](./CHANGELOG.md) | Release history following Keep a Changelog format |
| [TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md) | Full technical specification — architecture, schema, dependencies |

---

## 🚀 Quick Start — Path to Play Store

### Step 1 — Fix pre-submission code items
See [PLAYSTORE_CHECKLIST.md → Phase 1](./PLAYSTORE_CHECKLIST.md)

Critical changes needed in code before submission:
```
applicationId  com.todo.mobile   →   com.visionboard.app
android:label  "mobile"          →   "Vision Board"
minSdk         flutter.minSdk    →   21
signingConfig  debug key         →   release keystore
```

### Step 2 — Generate release keystore
See [SIGNING_GUIDE.md](./SIGNING_GUIDE.md)

```bash
keytool -genkey -v \
  -keystore android/vision-board-release.keystore \
  -alias vision-board-key \
  -keyalg RSA -keysize 2048 -validity 10000
```

### Step 3 — Build signed AAB
```bash
flutter build appbundle --release
```

### Step 4 — Create Play Console account
Go to https://play.google.com/console ($25 one-time fee)

### Step 5 — Host Privacy Policy
Upload [PRIVACY_POLICY.md](./PRIVACY_POLICY.md) content to a public URL (GitHub Pages, your website, etc.)

### Step 6 — Create store listing
Use content from [PLAYSTORE_LISTING.md](./PLAYSTORE_LISTING.md)

### Step 7 — Upload AAB and submit for review
Google typically reviews apps within 1–3 days.

---

## ⚠️ Important Notes

1. **Application ID**: Must be changed from `com.todo.mobile` to a unique ID you own (e.g. `com.visionboard.app`) **before** the first Play Store upload. You cannot change it after publishing.

2. **Keystore**: Never lose your release keystore. Losing it means you can never update the published app. Back it up to multiple secure locations.

3. **Privacy Policy URL**: Must be a live, publicly accessible URL — a local markdown file is not acceptable. Host it on GitHub Pages, your domain, or a privacy policy generator service.

4. **AAB vs APK**: Always upload the AAB (`app-release.aab`) to Play Store — not the APK. The AAB is smaller and Google generates optimised APKs for each device type from it.
