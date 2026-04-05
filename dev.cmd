@echo off
setlocal
cd /d "%~dp0"

REM Prefer PowerShell helper (refreshes PATH for freshly installed Node)
where powershell >nul 2>&1
if not errorlevel 1 (
  powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\playve-dev.ps1"
  exit /b %ERRORLEVEL%
)

where npm >nul 2>&1
if errorlevel 1 (
  echo [Playve] npm을 찾을 수 없습니다.
  echo   Node.js LTS: https://nodejs.org
  echo   또는: winget install OpenJS.NodeJS.LTS
  exit /b 1
)

call npm install
if errorlevel 1 exit /b 1
call npm run dev
