#!/bin/bash

# Скрипт для создания ZIP-архива OperaX Browser

echo "🚀 Сборка OperaX Browser..."

# Сборка веб-приложения
npm run build

# Создание структуры для ZIP
mkdir -p operax-browser/dist
mkdir -p operax-browser/src/components
mkdir -p operax-browser/src/hooks
mkdir -p operax-browser/src/utils

# Копирование файлов
cp index.html operax-browser/
cp package.json operax-browser/
cp vite.config.ts operax-browser/
cp tsconfig.json operax-browser/
cp electron-main.js operax-browser/
cp preload.js operax-browser/
cp electron-package.json operax-browser/
cp README.md operax-browser/
cp ANDROID_GUIDE.md operax-browser/
cp -r dist/* operax-browser/dist/
cp -r src/* operax-browser/src/

# Создание ZIP
zip -r operax-browser.zip operax-browser/

# Очистка
rm -rf operax-browser/

echo "✅ Архив operax-browser.zip создан!"
echo ""
echo "Содержимое:"
echo "  - dist/          → Готовые файлы для WebView/Android"
echo "  - src/           → Исходный код React"
echo "  - electron-main.js → Точка входа Electron"
echo "  - README.md      → Инструкции"
echo "  - ANDROID_GUIDE.md → Инструкции для Android"
