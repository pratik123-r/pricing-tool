FROM node:18-alpine

WORKDIR /app

# Copy root package.json and workspace files
COPY package.json ./
COPY package-lock.json* ./

# Copy shared-infra package
COPY shared-infra/package.json ./shared-infra/

# Copy service package
COPY services/auth-service/package.json ./services/auth-service/

# Install dependencies from root (workspace-aware)
RUN npm ci

# Copy source files
COPY shared-infra ./shared-infra
COPY services/auth-service ./services/auth-service

# Build shared-infra first
WORKDIR /app/shared-infra
RUN npm run build

# Build auth-service
WORKDIR /app/services/auth-service
RUN npm run build

WORKDIR /app/services/auth-service

# Expose port
EXPOSE 50051

# Run the application
CMD ["node", "dist/main.js"]

