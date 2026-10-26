@echo off
title Push MLBB Counter Engine to GitHub
cd /d "%~dp0"
echo ========================================================
echo  Pushing project to https://github.com/shihab-ris/Hero-counter
echo ========================================================
echo.
git push -u origin main
echo.
if %errorlevel% equ 0 (
    echo [SUCCESS] Code successfully pushed to GitHub!
) else (
    echo [NOTICE] If prompted above, complete your GitHub login in the browser window.
)
echo.
pause
