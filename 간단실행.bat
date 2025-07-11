@echo off
title EduAssess 실행

echo EduAssess를 시작합니다...
echo.

cd /d C:\jhj
npm install
cross-env NODE_ENV=development tsx server/index.ts

pause