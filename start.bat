@echo off
chcp 65001 >nul
title EduAssess

echo Starting EduAssess...
echo.

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js not found. Please install it first.
    echo Run "install_nodejs.bat" for help.
    pause
    exit /b 1
)

npm install
if %errorlevel% neq 0 (
    echo Installation failed. Check your internet connection.
    pause
    exit /b 1
)

echo.
echo Server starting...
echo.
echo Login: admin / jhj0901
echo.

echo Opening browser in 5 seconds...
timeout /t 5 /nobreak >nul
start http://localhost:5000

cross-env NODE_ENV=development tsx server/index.ts

pause