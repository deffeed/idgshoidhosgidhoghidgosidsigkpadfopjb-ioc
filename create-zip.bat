@echo off
chcp 65001 >nul
echo 🚀 Сборка OperaX Browser...

:: Сборка веб-приложения
call npm run build

:: Создание структуры для ZIP
if exist operax-browser rmdir /s /q operax-browser
mkdir operax-browser\dist
mkdir operax-browser\src\components
mkdir operax-browser\src\hooks
mkdir operax-browser\src\utils

:: Копирование файлов
copy index.html operax-browser\
copy package.json operax-browser\
copy vite.config.ts operax-browser\
copy tsconfig.json operax-browser\
copy electron-main.js operax-browser\
copy preload.js operax-browser\
copy electron-package.json operax-browser\
copy README.md operax-browser\
copy ANDROID_GUIDE.md operax-browser\
xcopy /e /i dist\* operax-browser\dist\
xcopy /e /i src\* operax-browser\src\

:: Создание ZIP с помощью PowerShell
echo Создание архива...
powershell -Command "Compress-Archive -Path operax-browser -DestinationPath operax-browser.zip -Force"

:: Очистка
rmdir /s /q operax-browser

echo ✅ Архив operax-browser.zip создан!
echo.
echo Содержимое:
echo   - dist\t	→ Готовые файлы для WebView/Android
echo   - src		→ Исходный код React
echo   - electron-main.js	→ Точка входа Electron
echo   - README.md	→ Инструкции
echo   - ANDROID_GUIDE.md	→ Инструкции для Android

pause
