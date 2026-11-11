# Wi-Fi Bandwidth Router — Frontend (Лабораторная работа №6)

Полнофункциональное SPA-приложение на **React**, **TypeScript**, **Redux Toolkit**, **Axios** и **React-Bootstrap** с кодогенерацией API из Swagger/OpenAPI, авторизацией по сессиям/Cookie, управлением сетевыми профилями (CRUD), лайками и проксированием запросов к бэкенду и S3-хранилищу MinIO.

---

## 1. Архитектура проекта (FSD + Redux Toolkit)

Проект организован по архитектурной методологии **FSD (Feature-Sliced Design)** с интеграцией менеджера состояний Redux Toolkit и слоя кодогенерации API:

```text
src/
├── main.tsx                            # Точка входа: Provider store={store}, подключение стилей
├── vite-env.d.ts                       # Типизация окружения Vite
├── app/
│   ├── App.tsx                         # Роутер SPA (6 маршрутов), LoadingOverlay, BottomNavbar
│   ├── routes.ts                       # Константы путей (FEED, CATALOG, ADD, LOGIN, DETAIL)
│   └── store/
│       ├── store.ts                    # Redux store (auth, filter, activity reducers + DevTools)
│       └── hooks.ts                    # Типизированные хуки useAppDispatch, useAppSelector
├── pages/
│   ├── FeedPage.tsx                    # 1. Лента с видео/фото, лайками и удалением (для владельца)
│   ├── CatalogPage.tsx                 # 2. Плитка карточек (2 в ряд) с фильтром по трафику и удалением
│   ├── AddPage.tsx                     # 3. Добавление услуги (двухшаговый черновик + публикация в MinIO)
│   ├── AuthPage.tsx                    # 4. Авторизация (ручной Axios x-www-form-urlencoded)
│   └── DetailPage.tsx                  # 5. Детальный просмотр выбранной активности
├── widgets/
│   ├── bottom-navbar/
│   │   └── BottomNavbar.tsx            # Навигационная панель (Лента, Добавление, Плитка, Вход/Выход)
│   └── media-viewer/
│       └── MediaViewer.tsx             # Плеер с fallback на изображение и локальный SVG/MP4
├── features/
│   ├── activity-filter/
│   │   ├── model/filterSlice.ts        # Срез Redux для хранения значений фильтров (search, maxTraffic)
│   │   └── ui/ActivityFilter.tsx       # Компонент фильтрации с формой и ползунком диапазона
│   └── auth/
│       └── model/authSlice.ts          # Срез Redux для состояния авторизации (ручное управление)
├── entities/
│   └── activity/
│       ├── model/
│       │   ├── activitySlice.ts        # Redux Thunks (7 методов) + fallback на mock для гостя
│       │   ├── mock.ts                 # Локальная mock-коллекция на случай отключенного сервиса
│       │   └── types.ts                # Реэкспорт сгенерированных типов NetworkActivityResponse
│       └── ui/
│           └── ActivityCard.tsx        # Карточка каталога с бейджем «Ваше» и кнопкой удаления
├── shared/
│   ├── api/
│   │   ├── authApi.ts                  # Ручной Axios-клиент (2 метода: auth и logout)
│   │   ├── generatedClient.ts          # Экземпляр кодогенерированного клиента API
│   │   └── generated/
│   │       └── Api.ts                  # СГЕНЕРИРОВАННЫЙ ИЗ SWAGGER КЛИЕНТ (7 методов)
│   └── ui/
│       └── LoadingOverlay/
│           └── LoadingOverlay.tsx      # Блокирующая анимация загрузки во время AJAX-запросов
└── styles/                             # Изолированные CSS-стили темной темы (#141526, #00F3BB, #FF4B72)
    ├── index.css                       # Глобальный мобильный контейнер 390px (по центру экрана)
    ├── pages/                          # Стили страниц (FeedPage, CatalogPage, AddPage, AuthPage, DetailPage)
    ├── widgets/                        # Стили виджетов (BottomNavbar, MediaViewer)
    ├── features/                       # Стили фильтра
    ├── entities/                       # Стили карточки
    └── shared/                         # Стили оверлея блокировки
```

---

## 2. Кодогенерация API и методы взаимодействия

В соответствии с заданием, взаимодействие с веб-сервисом разделено:
* **7 методов домена услуг (`NetworkActivities`)** — кодогенерированы из OpenAPI-спецификации `swagger.json` с помощью библиотеки `swagger-typescript-api` с генерацией Axios-клиента.
* **2 метода домена пользователей (`Users`)** — реализованы вручную на чистом Axios без thunk (`/api/users/auth` и `/api/users/logout`).

### Сгенерированные методы и их вызов в Redux Thunk:
1. `listActivities` (`GET /api/network-activities/`) → `fetchActivitiesThunk(filterTraffic)`
2. `getFeed` (`GET /api/network-activities/feed`) → `fetchFeedThunk(activityId)`
3. `getDraft` (`GET /api/network-activities/draft`) → `fetchDraftThunk()`
4. `createDraft` (`POST /api/network-activities/`) → `createDraftThunk({ title, pic, video })`
5. `publishActivity` (`PUT /api/network-activities/{id}/publish`) → `publishActivityThunk({ id, data })`
6. `deleteActivity` (`DELETE /api/network-activities/{id}`) → `deleteActivityThunk(id)`
7. `toggleLike` (`POST /api/network-activities/{id}/like`) → `toggleLikeThunk(id)`

### Команда для кодогенерации:
```bash
npm run codegen
# Или напрямую:
npx swagger-typescript-api generate -p swagger.json -o ./src/shared/api/generated -n Api.ts --axios
```

---

## 3. Описание страниц приложения

### 1. Страница «Лента» (`/network-activities/feed`)
* Полноэкранный вертикальный просмотр сетевых активностей (Reels/TikTok).
* **Элементы:** видеоплеер с fallback, счетчик лайков, характеристики скорости (Мбит/с) и задержки (мс), кнопка «♡ Лайк».
* **Для владельца (`is_owner === 1`):** отображается бейдж «Ваше» и кнопка «🗑 Удалить» с вызовом `deleteActivityThunk`.
* **Гостевой режим:** если бэкенд выключен, данные автоматически загружаются из `MOCK_ACTIVITIES`, лайки переключаются локально.

### 2. Страница «Плитка» (`/network-activities`)
* Сетка карточек по 2 в ряд, центрированная в вертикальном мобильном контейнере.
* **Фильтры Redux Toolkit:** форма поиска по названию и ползунок диапазона максимального трафика (0–150 Мбит/с). Значения сохраняются в `filterSlice`.
* **Клик по карточке:** переход в ленту к выбранной активности (`/network-activities/feed?activity_id=:id`).
* **Для владельца (`is_owner === 1`):** бейдж «Ваше» и красная кнопка «Удалить» на самой карточке.

### 3. Страница «Добавление услуги» (`/network-activities/draft`)
* Доступна только авторизованным пользователям (гостю предлагается войти).
* **Шаг 1 (Создание черновика):** поле ввода названия, загрузка изображения и видеоролика с моментальным предпросмотром медиа. Создание черновика через `createDraftThunk`.
* **Шаг 2 (Публикация):** ввод описания сетевого профиля, числовые input-поля среднего трафика и допустимой задержки с синхронными слайдерами. Публикация в базу через `publishActivityThunk`.

### 4. Страница «Авторизация и регистрация» (`/users/auth`)
* Переключатель режимов «Вход» и «Регистрация» с валидацией логина и пароля.
* Глазок для переключения видимости пароля.
* Отправка запросов через ручной Axios на `/api/users/auth` и `/api/users/register`.
* При успешном ответе сохраняется `session_id` в Cookie и `localStorage`, а состояние в Redux обновляется через `dispatch(loginSuccess({ username }))`.

### 5. Навигационная панель (`BottomNavbar`)
* **Лента** — активна всегда (`/network-activities/feed`).
* **Добавление** — доступна авторизованному пользователю (`/network-activities/draft`); для гостя заблокирована (серая).
* **Плитка** — активна всегда (`/network-activities`).
* **Вход / Выход:**
  * В состоянии гостя: иконка пользователя и кнопка «Вход» (`/users/auth`).
  * После авторизации: отображается красная иконка и кнопка **«Выход»**.
  * При нажатии на «Выход» вызывается `POST /api/users/logout`, удаляются Cookie/localStorage, состояние переходит в гостя (`logoutSuccess`), и **автоматически сбрасывается фильтр пользователя** (`resetFilters()`).

---

## 4. Проксирование и обход CORS (`vite.config.ts`)

Для прозрачной работы AJAX-запросов и загрузки медиафайлов из хранилища настроен реверс-прокси:
* `/api` → `http://localhost:8000` (FastAPI-сервер)
* `/media` → `http://localhost:9000` (MinIO S3 Bucket)
* `/minio` → `http://localhost:9000` (MinIO API)

---

## 5. Чек-лист для показа и защиты перед преподавателем (Канев А.И.)

| Скриншоты | Что демонстрировать | Где находится / Что нажимать |
| :--- | :--- | :--- |
| **1–2** | Две страницы (Лента и Плитка) с mock без запущенного сервиса. | Остановить бэкенд, открыть `/feed` и `/catalog` (данные берутся из fallback `MOCK_ACTIVITIES`). |
| **3–6** | 4 страницы фронтенда с запущенным бэкендом. | Запустить бэкенд: показать 1) Лента, 2) Плитка, 3) Добавление, 4) Авторизация. |
| **7–8** | Внести изменения в БД (через форму добавления или Swagger/Postman) и показать их во фронтенде. | Создать активность на `/add` или изменить в БД — она отображается в каталоге. |
| **9** | Авторизоваться, нажать F5 (обновить страницу): Redux сбрасывается в гостя, а во вкладке DevTools **Application** видно, что `session_id` остался в Cookie/localStorage. | Авторизоваться под `ivan_test`, нажать F5, показать DevTools → Application → Cookies / LocalStorage. |
| **10** | Использовать `session_id` из Application, чтобы показать карточки пользователя в Insomnia/Postman с признаком для удаления (`is_owner: 1`). | Отправить `GET /api/network-activities/` с Cookie `session_id=...` в Postman. |
| **11–12** | Показать в коде все состояния Redux (slices: auth, filter, activity) и показать Axios в кодогенерации. | `src/app/store/store.ts`, `authSlice.ts`, `filterSlice.ts`, `activitySlice.ts`, `src/shared/api/generated/Api.ts`. |
| **13–14** | Показать применение сгенерированного кода из Swagger в Thunk и что они названы по теме. | `fetchActivitiesThunk`, `createDraftThunk`, `publishActivityThunk` в `activitySlice.ts` вызывают `networkActivitiesApi`. |
| **15–16** | Показать во вкладке **Network** адреса AJAX через proxy (`/api/...`) и адреса медиа из MinIO/Silo. | Открыть Network: запросы идут на `http://localhost:3000/api/...` и превью с `/media/...`. |

---

## 6. Запуск проекта

```bash
# 1. Установка зависимостей (Redux Toolkit, React-Redux, Axios)
npm install

# 2. Повторная кодогенерация API (при необходимости обновления swagger.json)
npm run codegen

# 3. Запуск dev-сервера с прокси
npm run dev

# 4. Проверка типов TypeScript
npm run build
```
