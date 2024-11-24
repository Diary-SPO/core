# Здесь хранятся все ключи, используемы для подписаний приложений

## Подпись apk

```shell
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore upload-keystore.jks ..\gen\android\app\build\outputs\apk\universal\release upload
```