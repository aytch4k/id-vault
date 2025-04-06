#!/bin/bash

# Build and run the Docker container for ID Vault

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found."
    echo "Please create a .env file with the following variables:"
    echo "VITE_WEB3AUTH_CLIENT_ID=your_web3auth_client_id"
    echo "VITE_WEB3AUTH_CLIENT_SECRET=your_web3auth_client_secret"
    echo "VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id"
    exit 1
fi

# Build and run the Docker container
echo "Building and running ID Vault Docker container..."
docker-compose up --build

# Exit message
echo "ID Vault Docker container has been stopped."