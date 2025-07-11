@echo off
chcp 65001 >nul
echo ========================================
echo       EduAssess Online Assessment System
echo ========================================
echo.

echo [1/3] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo X Node.js is not installed.
    echo.
    echo Please install Node.js from:
    echo https://nodejs.org
    echo.
    echo After installation, restart this program.
    pause
    exit /b 1
)
echo OK Node.js is installed

echo.
echo [2/3] Checking dependencies...
if not exist "node_modules" (
    echo Installing packages...
    call npm install
    if %errorlevel% neq 0 (
        echo X Package installation failed.
        pause
        exit /b 1
    )
)
echo OK Dependencies ready

echo.
echo [3/3] Starting server...
echo.
echo Starting EduAssess...
echo.
echo Login Info:
echo    Teacher: admin / jhj0901
echo    Student: name + birthdate (6 digits)
echo.
echo Press Ctrl+C to stop
echo.

echo Opening browser in 5 seconds...
timeout /t 5 /nobreak >nul
start http://localhost:5000

call cross-env NODE_ENV=development tsx server/index.ts

pause