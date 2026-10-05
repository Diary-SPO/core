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

Для отправки статистики запусков и сессий в AppMetrica передайте Android API key
при сборке одним из способов:

```bash
export APPMETRICA_API_KEY=ваш_api_key
```

или добавьте параметр `-PAPPMETRICA_API_KEY=ваш_api_key` к вызову Gradle. Без
ключа приложение собирается, но AppMetrica не инициализируется.

## Debug APK

Из корня репозитория выполните:

```bash
bun run --cwd apps/mobile build:android
```

Если с метрикой:
```bash
APPMETRICA_API_KEY='ваш_api_key' bun run --cwd apps/mobile build:android
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

Если с метрикой:
```bash
bun run --cwd apps/mobile sync
cd apps/mobile/android
APPMETRICA_API_KEY='ваш_api_key' ./gradlew clean assembleRelease bundleRelease
```

Готовые файлы:

- `apps/mobile/android/app/build/outputs/apk/release/app-release.apk`;
- `apps/mobile/android/app/build/outputs/bundle/release/app-release.aab`.

Файлы `diaryspo-release.jks` и `keystore.properties` не коммитятся. Храните их
в защищённой резервной копии: без прежнего ключа нельзя выпустить обновление
приложения с той же подписью.

## CI: сборка APK/AAB и публикация лендинга

Workflow `.github/workflows/release-mobile.yml` запускается на push в `main` /
`pre-main` (и вручную). Он трижды собирает релиз с ключом AppMetrica и разным
`INSTALL_SOURCE`, поэтому в метрике видны 3 источника установок:

| Сборка | Канал | Куда летит |
| --- | --- | --- |
| `app-rustore.aab` | `rustore` | остаётся артефактом сборки (задел под автопубликацию в RuStore) |
| `app-github.apk` | `github` | в релиз (единственный файл релиза) |
| `app-landing.apk` | `landing` | артефактом в job лендинга, в `dist/` рядом с сайтом |

Канал запекается в `BuildConfig.INSTALL_SOURCE` и отправляется в AppMetrica
событием `install_source` при первом запуске (`DiaryApplication`).

`main` публикует релиз `vX.Y.Z` (версия из `build.gradle`) и лендинг в корень
`gh-pages`; `pre-main` — пререлиз `vX.Y.Z-pre.N` и лендинг в `gh-pages/pre/`.

Секреты репозитория: `APPMETRICA_API_KEY`, `ANDROID_KEYSTORE_BASE64`,
`ANDROID_KEY_ALIAS`, `ANDROID_STORE_PASSWORD`, `ANDROID_KEY_PASSWORD`.
Keystore для CI можно получить из боевого: `base64 -w0 diaryspo-release.jks`.
Локальная сборка канала вручную: `./gradlew assembleRelease
-PAPPMETRICA_API_KEY=... -PINSTALL_SOURCE=landing`.
