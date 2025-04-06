# Use Ubuntu-based Node.js image with CUDA support
FROM nvidia/cuda:12.3.1-devel-ubuntu22.04

# Install Node.js
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs python3 make g++ && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install AMD ROCm
RUN apt-get update && \
    apt-get install -y wget gnupg2 && \
    wget https://repo.radeon.com/amdgpu-install/5.7/ubuntu/jammy/amdgpu-install_5.7.50700-1_all.deb && \
    apt-get install -y ./amdgpu-install_5.7.50700-1_all.deb && \
    amdgpu-install --usecase=rocm --no-dkms -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Set environment variables for better performance
ENV NODE_OPTIONS="--max-old-space-size=32768"
ENV NPM_CONFIG_LOGLEVEL="error"
ENV NPM_CONFIG_FUND="false"
ENV NPM_CONFIG_AUDIT="false"
ENV NPM_CONFIG_PREFER_OFFLINE="true"

# Copy package.json
COPY package.json ./

# Install dependencies with maximum concurrency
RUN npm install --prefer-offline --no-audit --no-fund --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the application with maximum concurrency
RUN npm run build

# Expose port 5173 for Vite dev server
EXPOSE 5173

# Start the application with optimized settings
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--strictPort"]