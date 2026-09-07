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

For a publication build, copy `.env.example` to `.env` and set public links to
the final legal documents:

```dotenv
VITE_PRIVACY_POLICY_URL=https://example.org/privacy
VITE_USER_AGREEMENT_URL=https://example.org/terms
VITE_PERSONAL_DATA_CONSENT_URL=https://example.org/consent
```

When all three links are configured, the login form requires the user to accept
the user agreement and separately consent to personal data processing.

## Background grade notifications

The Android build can poll the diary directly and display a separate local
notification for every grade that is added, changed, or removed. Users enable the feature and select
a 15, 30, 60, or 120 minute daytime interval in Settings. The default selection
is 30 minutes. Between 20:00 and 06:00, network checks are limited to once every
120 minutes.

Android schedules the runner every 15 minutes, but execution is inexact and can
be delayed by Doze mode or vendor battery restrictions. The first successful
check only saves a baseline and does not create notifications.

To build a debug APK from the command line, install JDK 21+ and Android SDK 36,
set `JAVA_HOME` and `ANDROID_HOME`, then run:

```bash
bun --cwd apps/mobile run build:android
```

The APK is written to `android/app/build/outputs/apk/debug/`.
