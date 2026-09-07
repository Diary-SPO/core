# Mobile

Android application built from the existing React UI with Capacitor. Unlike the
regular web build, its `@runtime-api` alias points to a native Capacitor HTTP
adapter and talks directly to `https://poo.tomedu.ru`.

```bash
bun install
bun --cwd apps/mobile run sync
bun --cwd apps/mobile run open:android
```

Override the upstream URL for a build with `VITE_DIARY_URL`.

To build a debug APK from the command line, install JDK 21+ and Android SDK 36,
set `JAVA_HOME` and `ANDROID_HOME`, then run:

```bash
bun --cwd apps/mobile run build:android
```

The APK is written to `android/app/build/outputs/apk/debug/`.
