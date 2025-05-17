@echo off
echo Opening WSL to build Establo with Anchor...

REM Check if WSL is installed
where wsl >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo WSL is not installed or not in PATH. Please install WSL first.
    echo Visit: https://docs.microsoft.com/en-us/windows/wsl/install
    pause
    exit /b 1
)

REM Convert Windows path to WSL path
set "WIN_PATH=%~dp0"
set "WIN_PATH=%WIN_PATH:\=/%"
set "WIN_PATH=%WIN_PATH:C:/=/mnt/c/%"
set "WIN_PATH=%WIN_PATH:D:/=/mnt/d/%"
set "WIN_PATH=%WIN_PATH:E:/=/mnt/e/%"
set "WIN_PATH=%WIN_PATH:F:/=/mnt/f/%"

REM Give execute permission to the scripts
wsl -e chmod +x "%WIN_PATH%setup_wsl.sh"
wsl -e chmod +x "%WIN_PATH%build-anchor.sh"

REM Check if first run
set FIRST_RUN=false
if not exist "%~dp0.wsl_setup_done" set FIRST_RUN=true

if "%FIRST_RUN%"=="true" (
    echo First run detected, running setup script...
    wsl -e bash -c "cd \"%WIN_PATH%\" && ./setup_wsl.sh"
    echo. > "%~dp0.wsl_setup_done"
)

echo Building with Anchor...
wsl -e bash -c "cd \"%WIN_PATH%\" && ./build-anchor.sh"

echo If build was successful, you should see build artifacts in target/deploy
pause