# Установка just: sudo apt install just
# Переменные окружения: ADB (путь к adb)

set shell := ["bash", "-cu"]
set dotenv-load := true

app_id := "io.github.diaryspo"
sdk := env_var_or_default("ANDROID_SDK_ROOT", home_directory() / "Android" / "Sdk")
adb := env_var_or_default("ADB", sdk / "platform-tools" / "adb")
apk_debug := "apps/mobile/android/app/build/outputs/apk/debug/app-debug.apk"
apk_release := "apps/mobile/android/app/build/outputs/apk/release/app-release.apk"

# Показать все команды
default:
    @just --list

# -- dev ----------------------------------------------

# Web в dev-режиме
dev-web:
    cd apps/web && bun dev

# API в dev-режиме
dev-api:
    cd apps/api && bun dev

# Лендинг в dev-режиме
dev-landing:
    cd apps/landing && bun dev

# API + web одновременно
dev-all:
    bun run dev:all

# -- build --------------------------------------------

# Прод-сборка web
build-web:
    cd apps/web && bun run build

# Сборка api
build-api:
    cd apps/api && bun run build

# Web-бандл для mobile
build-mobile:
    cd apps/mobile && bun run build

# Всё сразу: api + web + mobile
build-all: build-api build-web build-mobile

# -- android apk --------------------------------------

# Синхронизировать web-бандл в android-проект
sync:
    cd apps/mobile && bun run sync

# Debug APK (пример: just apk-debug MOTRIKA_KEY)
apk-debug metric="":
    cd apps/mobile && bun run sync
    cd apps/mobile/android && {{ if metric != "" { "APPMETRICA_API_KEY='" + metric + "' " } else { "" } }}./gradlew assembleDebug

# Release APK + AAB (пример: just apk-release MOTRIKA_KEY github -canary.1)
apk-release metric="" source="" suffix="":
    cd apps/mobile && bun run sync
    cd apps/mobile/android && {{ if metric != "" { "APPMETRICA_API_KEY='" + metric + "' " } else { "" } }}{{ if source != "" { "INSTALL_SOURCE=" + source + " " } else { "" } }}{{ if suffix != "" { "VERSION_SUFFIX=" + suffix + " " } else { "" } }}./gradlew clean assembleRelease bundleRelease

# Открыть android-проект в Android Studio
open-android:
    cd apps/mobile && bun run open:android

# -- adb ----------------------------------------------
# Выбор устройства: ANDROID_SERIAL=192.168.1.60:43137 just install-release

serial := env_var_or_default("ANDROID_SERIAL", "")
target := if serial != "" { "-s " + serial } else { "" }

# Подключённые устройства
devices:
    {{ adb }} devices

# Спарить телефон по Wi-Fi отладке и сразу подключить
# Пример: just wconnect 192.168.1.5:37077 123456 192.168.1.5:39509
# (первые два значения с экрана «Подключить с помощью кода»,
# третье - порт со строки «Беспроводная отладка», можно опустить)
wconnect pair_addr code connect_addr="":
    {{ adb }} pair {{ pair_addr }} {{ code }}
    {{ if connect_addr != "" { adb + " connect " + connect_addr } else { "echo 'Спарено. Возьми порт со строки Беспроводная отладка и выполни: just wconnect2 IP:порт'" } }}
    {{ adb }} devices

# Подключиться к уже спаренному телефону: just wconnect2 192.168.1.5:39509
wconnect2 addr:
    {{ adb }} connect {{ addr }}
    {{ adb }} devices

# Список эмуляторов
avds:
    {{ sdk }}/emulator/emulator -list-avds

# Запустить эмулятор и дождаться загрузки
emulator avd="Diary_API_36":
    setsid nohup {{ sdk }}/emulator/emulator -avd {{ avd }} > /tmp/opencode/emulator.log 2>&1 < /dev/null &
    {{ adb }} {{ target }} wait-for-device
    {{ adb }} {{ target }} shell 'while [ -z "$(getprop sys.boot_completed)" ]; do sleep 2; done; echo booted'
    {{ adb }} {{ target }} shell wm density 280

# Установить debug APK
install-debug apk=apk_debug:
    {{ adb }} {{ target }} install -r {{ apk }}

# Установить release APK
install-release apk=apk_release:
    {{ adb }} {{ target }} install -r {{ apk }}

# Запустить приложение
run:
    {{ adb }} {{ target }} shell monkey -p {{ app_id }} -c android.intent.category.LAUNCHER 1

# Собрать release, установить и запустить
ship-release metric="" source="github" suffix="":
    just apk-release '{{ metric }}' '{{ source }}' '{{ suffix }}'
    just install-release
    just run

# Логи приложения
logs:
    {{ adb }} {{ target }} logcat -v time

# Очистить буфер логов
log-clear:
    {{ adb }} {{ target }} logcat -c

# Удалить приложение
uninstall:
    {{ adb }} {{ target }} uninstall {{ app_id }}

# -- качество -----------------------------------------

# Линт и формат
check:
    bunx biome check .

# Тесты web
test:
    cd apps/web && bun test

# -- чистка -------------------------------------------

# Удалить артефакты сборок
clean:
    rm -rf apps/web/dist apps/landing/dist apps/mobile/dist apps/api/dist apps/mobile/android/app/build
