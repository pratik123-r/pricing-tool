FROM node:18-alpine

WORKDIR /app

# Copy root package.json and workspace files
COPY package.json ./
COPY package-lock.json* ./

# Copy shared-infra package
COPY shared-infra/package.json ./shared-infra/

# Copy service package
COPY services/api-gateway/package.json ./services/api-gateway/

# Install dependencies from root (workspace-aware)
RUN npm ci

# Copy source files
COPY shared-infra ./shared-infra
COPY services/api-gateway ./services/api-gateway

# Copy service source files needed for DTO imports (relative paths)
COPY services/auth-service/src ./services/auth-service/src
COPY services/user-service/src ./services/user-service/src

# Copy proto files from other services (needed for gRPC client connections)
COPY services/auth-service/proto ./services/auth-service/proto
COPY services/user-service/proto ./services/user-service/proto

# Build shared-infra first
WORKDIR /app/shared-infra
RUN npm run build

# Build api-gateway
WORKDIR /app/services/api-gateway
RUN npm run build

WORKDIR /app/services/api-gateway

# Expose port
EXPOSE 3000

# Run the application
CMD ["node", "dist/main.js"]

