# Дневник СПО

Дневник СПО — обёртка над дневником Сетевого города для СПО (как минимум API совпадает с Томской областью)

## О Сервисе

Клиентская часть написана на Preact / TS / VKUI / VK mini-apps-router с использованием VK Bridge для взаимодействия с
юзером внутри VK

Сервис также работает и вне VK

## Статистика работы серверов
|Роль|Статус|Uptime|Ping|Расположение|
|----|------|------|----|--------|
|[Оригинальный дневник](https://poo.tomedu.ru/)|![status](https://uptime.diary.keenetic.link/api/badge/7/status)|![uptime](https://uptime.diary.keenetic.link/api/badge/7/uptime/24)|![ping](https://uptime.diary.keenetic.link/api/badge/7/ping/24)|Томск|
|[Web-интерфейс](https://spo-diary.ru/)|![status](https://uptime.diary.keenetic.link/api/badge/10/status)|![uptime](https://uptime.diary.keenetic.link/api/badge/10/uptime/24)|![ping](https://uptime.diary.keenetic.link/api/badge/10/ping/24)|Москва|
|[Основной сервер](https://api.spo-diary.ru/)|![status](https://uptime.diary.keenetic.link/api/badge/5/status)|![uptime](https://uptime.diary.keenetic.link/api/badge/5/uptime/24)|![ping](https://uptime.diary.keenetic.link/api/badge/5/ping/24)|Москва|
|[Аварийный сервер](https://dnevnik3.kopchan7.keenetic.link/)|![status](https://uptime.diary.keenetic.link/api/badge/8/status)|![uptime](https://uptime.diary.keenetic.link/api/badge/8/uptime/24)|![ping](https://uptime.diary.keenetic.link/api/badge/8/ping/24)|Томск|

Смотри подробнее [здесь](https://uptime.diary.keenetic.link/status/dnevniks).

## Для программистов

### Запуск проекта

- Установка зависимостей

```bash
yarn
```

- Создание .env файла

```dotenv
# Основной сервер для запросов
VITE_SERVER_URL=<URL>

### Опциональный параметр ###

# Второстепенный сервер в случае неисправности основного 
VITE_SERVER_URL_SECOND=<URL>

# В качестве основного сервера можно использовать наш -> https://api.spo-diary.ru
```

- Запуск сервера

```bash
yarn dev
```

### Структура проекта

- transformers - функция от разработчиков VKUI для корректной работы VKUI
- components - UI компоненты
- methods - асинхронные методы
  - server - запросы к серверу
  - Раньше тут также были запросы к VK Bridge, но в процессе развития сервиса они были удалены
- routes - маршруты в приложении
- modals - модальные окна
  - LessonModal - модальное окно с подробностями о паре
- hooks - кастомные хуки
  - useSnackbar - для упрощения работы со снекбарами из VKUI
  - useScrollPosition - для отслеживания текущего положения скролла
  - useRateLimitExceeded - для удобной обработки достигнутого rate лимита
  - useDebouncedChangeWeek - для группирования запросов смены недели в один при быстрых кликах
- views - разные страницы сервиса
- utils - различные утилиты для работы с данными и не только
  - базовые утилиты находятся в корне папки
  - formatted - различные функции для форматирования дат, данных и др.
  - marks - различные функции для работы с оценками
- types - глобальные типы, также там находятся типы для библиотеки jshashes, т.к. по умолчанию их нет
- store - хранилище для глобального состояния

В каждой утилите / хуке также присутствуют комментарии для более лучшего понимания

#### Конфиг проекта

Конфиг настроен следующим образом

- Плагины для работы с Preact
- Различные build опции для улучшения итоговой сборки проекта
- Кастомные пути в проекте
