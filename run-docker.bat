@echo off
REM Build and run the Docker container for ID Vault

REM Check if Docker is installed
where docker >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Docker is not installed. Please install Docker first.
    exit /b 1
)

REM Check if Docker Compose is installed
where docker-compose >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Docker Compose is not installed. Please install Docker Compose first.
    exit /b 1
)

REM Check if .env file exists
if not exist .env (
    echo Error: .env file not found.
    echo Please create a .env file with the following variables:
    echo REACT_APP_WEB3AUTH_CLIENT_ID=your_web3auth_client_id
    echo REACT_APP_WEB3AUTH_CLIENT_SECRET=your_web3auth_client_secret
    echo REACT_APP_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
    exit /b 1
)

REM Build and run the Docker container
echo Building and running ID Vault Docker container...
docker-compose up --build

REM Exit message
echo ID Vault Docker container has been stopped.