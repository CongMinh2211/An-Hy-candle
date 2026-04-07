@echo off
setlocal EnableExtensions

title An Hy Candle - Local Runner
cd /d "%~dp0"

echo ======================================================
echo   An Hy Candle - Local Development Runner
echo ======================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Node.js chua duoc cai dat hoac chua co trong PATH.
    echo Vui long cai Node.js LTS, sau do mo lai file nay.
    pause
    exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
    echo [ERROR] npm chua duoc cai dat hoac chua co trong PATH.
    echo Vui long cai Node.js LTS kem npm, sau do mo lai file nay.
    pause
    exit /b 1
)

if not exist "BE\package.json" (
    echo [ERROR] Khong tim thay BE\package.json.
    pause
    exit /b 1
)

if not exist "FE\package.json" (
    echo [ERROR] Khong tim thay FE\package.json.
    pause
    exit /b 1
)

echo [1/4] Kiem tra dependency backend...
if not exist "BE\node_modules\" (
    pushd "BE"
    call npm install
    if errorlevel 1 (
        echo [ERROR] Cai dependency backend that bai.
        popd
        pause
        exit /b 1
    )
    popd
) else (
    echo Backend dependencies da san sang.
)

echo.
echo [2/4] Kiem tra dependency frontend...
if not exist "FE\node_modules\" (
    pushd "FE"
    call npm install
    if errorlevel 1 (
        echo [ERROR] Cai dependency frontend that bai.
        popd
        pause
        exit /b 1
    )
    popd
) else (
    echo Frontend dependencies da san sang.
)

echo.
echo [3/4] Mo backend va frontend trong 2 cua so rieng...
start "An Hy Backend" cmd /k "cd /d ""%~dp0BE"" && title An Hy Backend && npm start"
start "An Hy Frontend" cmd /k "cd /d ""%~dp0FE"" && title An Hy Frontend && npm run dev -- --host 127.0.0.1"

echo.
echo [4/4] Hoan tat.
echo Backend:  http://localhost:5000/api
echo Frontend: http://localhost:5173
echo.
echo Luu y: Neu backend can database, hay bat MongoDB tai mongodb://127.0.0.1:27017/anhy_candle.
echo Neu muon nap san pham mau, chay: cd BE ^&^& node seed/seedData.js
echo.

timeout /t 4 >nul
start "" "http://localhost:5173"

echo Cac server dang chay trong cua so rieng. Co the dong cua so nay neu khong can theo doi.
pause
