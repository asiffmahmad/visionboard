# Google Play Store Submission Checklist — Vision Board

> Work through each section in order. Check each item before submission.

---

## Phase 1 — Code & Build Readiness

### Application Identity
- [ ] Change `applicationId` in `build.gradle.kts` from `com.todo.mobile` → `com.visionboard.app`
- [ ] Update `namespace` in `build.gradle.kts` to match `com.visionboard.app`
- [ ] Change `android:label` in `AndroidManifest.xml` from `"mobile"` → `"Vision Board"`
- [ ] Set final `versionCode` (must be integer, e.g. `1`) in `build.gradle.kts`
- [ ] Set final `versionName` (e.g. `"1.0.0"`) in `build.gradle.kts`
- [ ] Set `minSdk = 21` (or higher) explicitly instead of `flutter.minSdkVersion`
- [ ] Set `targetSdk = 34` (required by Play Store as of August 2024)

### App Icon & Branding
- [ ] Replace default Flutter icon with custom Vision Board icon at all densities:
  - `mipmap-mdpi/ic_launcher.png` (48×48)
  - `mipmap-hdpi/ic_launcher.png` (72×72)
  - `mipmap-xhdpi/ic_launcher.png` (96×96)
  - `mipmap-xxhdpi/ic_launcher.png` (144×144)
  - `mipmap-xxxhdpi/ic_launcher.png` (192×192)
- [ ] Add adaptive icon for Android 8+ (`ic_launcher_foreground.png` + `ic_launcher_background.xml`)
- [ ] Add round icon variant (`ic_launcher_round.png`)

### Signing
- [ ] Generate release keystore (see `SIGNING_GUIDE.md`)
- [ ] Create `android/key.properties`
- [ ] Update `build.gradle.kts` with production `signingConfig`
- [ ] Verify `.gitignore` excludes `key.properties` and `*.keystore`
- [ ] Build signed release AAB: `flutter build appbundle --release`
- [ ] Verify signing: `jarsigner -verify build/app/outputs/bundle/release/app-release.aab`

### Code Quality
- [ ] `flutter analyze` — 0 issues
- [ ] All unit tests pass: `flutter test`
- [ ] All widget tests pass: `flutter test`
- [ ] Integration test passes on real device or emulator

---

## Phase 2 — Play Console Account Setup

### Developer Account
- [ ] Create a Google Play Developer account at https://play.google.com/console
- [ ] Pay one-time $25 USD registration fee
- [ ] Complete identity verification
- [ ] Accept Developer Distribution Agreement

### App Creation
- [ ] Click "Create app" in Play Console
- [ ] Enter App name: **Vision Board**
- [ ] Select Default language: **English (United States)**
- [ ] Select App or Game: **App**
- [ ] Select Free or Paid: **Free**
- [ ] Accept Declarations

---

## Phase 3 — Store Listing

### Main Store Listing
- [ ] App name: `Vision Board` (max 50 chars)
- [ ] Short description: (max 80 chars — see `PLAYSTORE_LISTING.md`)
- [ ] Full description: (max 4000 chars — see `PLAYSTORE_LISTING.md`)
- [ ] Add all screenshot assets (min 2, max 8 per device type)
- [ ] Upload feature graphic (1024 × 500 px)
- [ ] Upload high-res app icon (512 × 512 px, PNG, no alpha)
- [ ] Select App category: **Productivity**
- [ ] Add contact email address: **asiffmahmad9@gmail.com**
- [ ] Add Privacy Policy URL (host `PRIVACY_POLICY.md` content at a public URL)

### Content Rating
- [ ] Complete IARC questionnaire in Play Console
- [ ] Expected rating: **Everyone (3+)**

### Target Audience
- [ ] Set target age group: **18 and over** (or appropriate)
- [ ] Confirm app is **not** primarily targeted at children

---

## Phase 4 — App Content Declarations

### Data Safety Section (required since May 2022)
- [ ] **Data collected**: None
- [ ] **Data shared**: None
- [ ] **Security practices**:
  - Data is encrypted in transit: N/A (no network)
  - Data is encrypted at rest: Yes (Android Keystore)
  - Users can request data deletion: Yes (uninstall app / clear data)
- [ ] Submit Data Safety form

### Permissions Declaration
- [ ] Declare `USE_BIOMETRIC` — purpose: local authentication
- [ ] No `INTERNET` permission used

---

## Phase 5 — Release Management

### Internal Testing Track (Recommended First Step)
- [ ] Upload signed AAB to **Internal Testing** track
- [ ] Add test users (your own Google accounts)
- [ ] Install from Play Store on a physical device
- [ ] Verify app installs and launches correctly
- [ ] Verify all features work end-to-end

### Production Release
- [ ] Create Production release
- [ ] Upload signed AAB
- [ ] Write release notes (see `PLAYSTORE_LISTING.md`)
- [ ] Set rollout percentage (recommend starting at **20%**)
- [ ] Submit for review

### Play App Signing
- [ ] Enrol in Play App Signing during first upload (recommended)
- [ ] Keep your upload keystore safe even after enrolling

---

## Phase 6 — Post-Launch

- [ ] Monitor Android vitals dashboard for crashes / ANRs
- [ ] Respond to user reviews within 24–48 hours
- [ ] Plan app updates with version code increments
- [ ] Set up email alias for support@yourdomain.com

---

## Quick Reference — Critical `build.gradle.kts` Changes Before Submission

```kotlin
defaultConfig {
    applicationId = "com.visionboard.app"   // ← change from com.todo.mobile
    minSdk = 21
    targetSdk = 34
    versionCode = 1
    versionName = "1.0.0"
}
```

```xml
<!-- AndroidManifest.xml -->
<application android:label="Vision Board" ...>
```
