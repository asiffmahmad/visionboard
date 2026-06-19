# Release Signing Guide — Vision Board

> ⚠️  **IMPORTANT**: Never commit your keystore file or `key.properties` to version control.
> Both are already listed in `.gitignore`.

---

## Overview

Google Play requires all APKs and AABs to be signed with a **release keystore** before upload. Currently the app is signed with the debug key. Follow these steps **once** before your first Play Store upload.

---

## Step 1 — Generate a Release Keystore

Run the following command from your terminal. Replace the placeholder values with your own details.

```bash
keytool -genkey -v \
  -keystore android/vision-board-release.keystore \
  -alias vision-board-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass YOUR_STORE_PASSWORD \
  -keypass  YOUR_KEY_PASSWORD \
  -dname "CN=asiff, OU=Vision Board, O=asiff, L=Your City, S=Your State, C=US"
```

> **Keep the generated `.keystore` file and both passwords safe.**  
> Losing this keystore means you can never update the app on Play Store.

---

## Step 2 — Create `android/key.properties`

Create the file `android/key.properties` with the following content:

```properties
storePassword=YOUR_STORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=vision-board-key
storeFile=../vision-board-release.keystore
```

> The path in `storeFile` is **relative to the `android/app/` directory**.

---

## Step 3 — Update `android/app/build.gradle.kts`

Replace the current `buildTypes` block with the following:

```kotlin
// At the top of the android {} block — BEFORE android {}
val keystoreProperties = java.util.Properties()
val keystorePropertiesFile = rootProject.file("key.properties")
if (keystorePropertiesFile.exists()) {
    keystorePropertiesFile.inputStream().use { keystoreProperties.load(it) }
}

android {
    // ... existing config ...

    signingConfigs {
        create("release") {
            keyAlias     = keystoreProperties["keyAlias"] as String
            keyPassword  = keystoreProperties["keyPassword"] as String
            storeFile    = keystoreProperties["storeFile"]?.let { file(it) }
            storePassword = keystoreProperties["storePassword"] as String
        }
    }

    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("release")
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            ndk {
                debugSymbolLevel = "none"
            }
        }
    }
}
```

---

## Step 4 — Add Keystore to `.gitignore`

Verify your `.gitignore` contains:

```
# Release signing — NEVER commit these
android/key.properties
android/*.keystore
android/*.jks
```

---

## Step 5 — Build Signed Release AAB

```bash
cd vision-board-mobile
flutter build appbundle --release
```

The signed AAB will be at:
```
build/app/outputs/bundle/release/app-release.aab
```

---

## Step 6 — Verify Signing

```bash
jarsigner -verify -verbose -certs \
  build/app/outputs/bundle/release/app-release.aab
```

You should see `jar verified` in the output.

---

## Step 7 — Enable Play App Signing (Recommended)

When uploading to Google Play for the first time, **enable Play App Signing**. Google will:

1. Store a copy of your upload key certificate.
2. Re-sign your APK with the Play distribution key before delivery to users.

This protects you if you ever lose your keystore — you can generate a new upload key and ask Google to update it.

To enable: During your first release upload in the Play Console, follow the **Play App Signing** setup prompt.

---

## Keystore Backup Checklist

- [ ] Keystore file backed up to at least 2 offline locations (USB drive, etc.)
- [ ] `key.properties` backed up securely (password manager or encrypted vault)
- [ ] Passwords recorded in password manager
- [ ] Both keystore and passwords excluded from all version control systems
