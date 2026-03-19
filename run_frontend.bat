@echo off
echo ==================================================
echo      Chatbot Frontend Setup & Startup
echo ==================================================

echo [1/2] Installing dependencies...
call npm install

echo.
echo [2/2] Starting Frontend Server...
echo.
call npm run dev

pause
