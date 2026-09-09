# DiarySPO Mobile

Android-приложение электронного дневника на React и Capacitor. Показывает расписание и оценки, напрямую получает данные с `https://poo.tomedu.ru` и умеет уведомлять об изменениях оценок в фоне.

## Требования

- Bun;
- JDK 21 или новее;
- Android SDK 36;
- настроенные `JAVA_HOME` и `ANDROID_HOME`.

Установите зависимости из корня репозитория:

```bash
bun install
```

Скопируйте `apps/mobile/.env.example` в `apps/mobile/.env`. Для публикации
укажите в нём итоговые ссылки на юридические документы. При необходимости адрес
дневника можно изменить через `VITE_DIARY_URL`.

## Debug APK

Из корня репозитория выполните:

```bash
bun run --cwd apps/mobile build:android
```

Готовый APK: `apps/mobile/android/app/build/outputs/apk/debug/app-debug.apk`.

## Release APK и AAB

Перед сборкой:

1. Увеличьте `versionCode` и обновите `versionName` в
   `apps/mobile/android/app/build.gradle`.
2. Проверьте наличие файлов подписи:
   - `apps/mobile/android/signing/diaryspo-release.jks`;
   - `apps/mobile/android/keystore.properties`.

Из корня репозитория выполните:

```bash
bun run --cwd apps/mobile sync
cd apps/mobile/android
./gradlew clean assembleRelease bundleRelease
```

Готовые файлы:

- `apps/mobile/android/app/build/outputs/apk/release/app-release.apk`;
- `apps/mobile/android/app/build/outputs/bundle/release/app-release.aab`.

Файлы `diaryspo-release.jks` и `keystore.properties` не коммитятся. Храните их
в защищённой резервной копии: без прежнего ключа нельзя выпустить обновление
приложения с той же подписью.
