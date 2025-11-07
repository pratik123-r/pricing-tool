# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy root package.json and workspace files
COPY package.json ./
COPY package-lock.json* ./
COPY tsconfig.json ./

# Copy shared-infra package
COPY shared-infra/package.json ./shared-infra/

# Copy service package
COPY services/user-service/package.json ./services/user-service/

# Install dependencies from root (workspace-aware)
RUN npm ci

# Copy source files
COPY shared-infra ./shared-infra
COPY services/user-service ./services/user-service

# Build shared-infra first
WORKDIR /app/shared-infra
RUN npm run build

# Build user-service
WORKDIR /app/services/user-service
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json ./
COPY package-lock.json* ./
COPY shared-infra/package.json ./shared-infra/
COPY services/user-service/package.json ./services/user-service/

# Install dependencies - include dev dependencies for migrations
# Note: We need @mikro-orm/cli and @mikro-orm/migrations for running migrations
# Install from root (workspace-aware)
RUN npm ci

# Copy built applications
COPY --from=builder /app/shared-infra/dist ./shared-infra/dist
COPY --from=builder /app/services/user-service/dist ./services/user-service/dist

# Copy proto files
COPY --from=builder /app/services/user-service/proto ./services/user-service/proto

# Copy migration files and config
COPY --from=builder /app/services/user-service/src/migrations ./services/user-service/src/migrations
COPY --from=builder /app/services/user-service/src/scripts/mikro-orm.config.ts ./services/user-service/src/scripts/mikro-orm.config.ts

# Copy source files needed for migrations (entities and their dependencies)
COPY --from=builder /app/services/user-service/src/features ./services/user-service/src/features
COPY --from=builder /app/shared-infra/src ./shared-infra/src

# Copy tsconfig files (needed for migrations to compile TypeScript)
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/services/user-service/tsconfig.json ./services/user-service/tsconfig.json

# Copy entrypoint script
COPY services/user-service/docker-entrypoint.sh ./services/user-service/docker-entrypoint.sh
RUN chmod +x ./services/user-service/docker-entrypoint.sh

WORKDIR /app/services/user-service

# Expose port
EXPOSE 50052

# Use entrypoint script
ENTRYPOINT ["./docker-entrypoint.sh"]

