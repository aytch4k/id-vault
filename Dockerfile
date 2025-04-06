# Use Node.js LTS as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

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
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]