# Flutter ProGuard rules for Vision Board
# Keep Flutter wrapper classes
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.** { *; }
-keep class io.flutter.util.** { *; }
-keep class io.flutter.view.** { *; }
-keep class io.flutter.** { *; }
-keep class io.flutter.plugins.** { *; }

# Keep sqflite
-keep class com.tekartik.sqflite.** { *; }

# Keep flutter_secure_storage
-keep class com.it_nomads.fluttersecurestorage.** { *; }

# Keep local_auth
-keep class io.flutter.plugins.localauth.** { *; }

# Keep connectivity_plus
-keep class dev.fluttercommunity.plus.connectivity.** { *; }

# Dart/Flutter serialization — keep all model classes
-keepattributes Signature
-keepattributes *Annotation*
-keepattributes EnclosingMethod
-keepattributes InnerClasses

# General Android rules
-dontwarn **
