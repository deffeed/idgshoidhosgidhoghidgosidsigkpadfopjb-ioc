# OperaX Browser

Кроссплатформенный веб-браузер с тёмной темой в стиле современной Opera. Работает на ПК через Electron и на Android через WebView.

## Возможности

- Тёмная тема с красивым интерфейсом
- Вкладки с анимацией
- Боковая панель с закладками и историей
- Быстрый доступ (Speed Dial) на стартовой странице
- Навигация: назад, вперёд, обновление, домой
- Адаптивный дизайн для ПК и мобильных устройств

## Структура проекта

```
├── index.html              # Entry point (Vite)
├── src/
│   ├── App.tsx             # Главный компонент браузера
│   ├── main.tsx            # React entry
│   ├── index.css           # Стили
│   ├── hooks/
│   │   └── useBrowser.ts   # Логика браузера (вкладки, история, закладки)
│   └── components/
│       ├── TabBar.tsx      # Панель вкладок
│       ├── Toolbar.tsx     # Адресная строка и кнопки навигации
│       ├── Sidebar.tsx     # Боковая панель
│       ├── WebView.tsx     # Компонент iframe для сайтов
│       └── SpeedDial.tsx   # Стартовая страница с плитками
├── electron-main.js        # Точка входа Electron
└── README.md               # Инструкции
```

## Запуск на ПК (Electron)

### 1. Сборка веб-приложения

```bash
npm install
npm run build
```

После сборки в папке `dist/` будут готовые статические файлы.

### 2. Установка Electron

```bash
npm install electron --save-dev
```

### 3. Запуск Electron

Добавьте в `package.json` в раздел `scripts`:

```json
"electron": "electron electron-main.js",
"electron:build": "npm run build && electron-builder"
```

Затем запустите:

```bash
npm run electron
```

### 4. Сборка установщика (опционально)

Установите `electron-builder`:

```bash
npm install electron-builder --save-dev
```

Добавьте в `package.json`:

```json
"build": {
  "appId": "com.yourcompany.operax",
  "productName": "OperaX Browser",
  "directories": {
    "output": "release"
  },
  "files": [
    "dist/**/*",
    "electron-main.js"
  ],
  "mac": {
    "target": "dmg"
  },
  "win": {
    "target": "nsis"
  },
  "linux": {
    "target": "AppImage"
  }
}
```

Соберите:

```bash
npm run electron:build
```

## Запуск на Android (WebView)

### Способ 1: Через Android Studio (рекомендуется)

1. Создайте новый проект в Android Studio: **Empty Views Activity**
2. В `build.gradle` (Module: app) добавьте в `dependencies`:

```gradle
implementation 'androidx.webkit:webkit:1.9.0'
```

3. В `AndroidManifest.xml` добавьте разрешение:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

4. В `res/layout/activity_main.xml` замените содержимое на:

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <WebView
        android:id="@+id/webview"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />
</RelativeLayout>
```

5. В `MainActivity.java` или `MainActivity.kt`:

**Kotlin:**
```kotlin
package com.example.operax

import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val webView: WebView = findViewById(R.id.webview)
        val webSettings: WebSettings = webView.settings
        webSettings.javaScriptEnabled = true
        webSettings.domStorageEnabled = true
        webSettings.allowFileAccess = true
        webSettings.allowContentAccess = true

        webView.webViewClient = WebViewClient()
        webView.webChromeClient = WebChromeClient()

        // Загрузка локального HTML
        webView.loadUrl("file:///android_asset/browser/index.html")
    }

    override fun onBackPressed() {
        val webView: WebView = findViewById(R.id.webview)
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
```

6. Скопируйте содержимое папки `dist/` (после `npm run build`) в `app/src/main/assets/browser/`

7. Соберите APK и установите на устройство.

### Способ 2: Простое Android-приложение (без Android Studio)

Используйте приложение **WebView Gold** или **Website2APK Builder** из Google Play — просто укажите URL или загрузите локальные файлы.

### Способ 3: PWA (Progressive Web App)

1. Залейте содержимое `dist/` на любой хостинг (GitHub Pages, Netlify, Vercel)
2. Откройте сайт в Chrome на Android
3. Нажмите "Добавить на главный экран"
4. Приложение будет работать как нативное

## Адаптация под Redmi Note 14

Дизайн адаптирован под экран 6.67" (1080x2400):
- Боковая панель скрывается по умолчанию на мобильных
- Кнопки навигации увеличены для удобного нажатия
- Адресная строка оптимизирована под ширину экрана
- Плитки Speed Dial перестраиваются в 2 колонки

## Примечания

- **iframe ограничения**: Многие современные сайты (Google, Facebook, Twitter и др.) используют заголовок `X-Frame-Options` или CSP, запрещающий отображение во фреймах. Это ограничение безопасности браузеров. Для полноценного браузера на Electron рекомендуется использовать `<webview>` тег вместо iframe.
- Для Electron замените `iframe` на `webview` в `WebView.tsx` для обхода ограничений:
  ```tsx
  <webview src={url} style={{ width: '100%', height: '100%' }} />
  ```

## Лицензия

MIT
