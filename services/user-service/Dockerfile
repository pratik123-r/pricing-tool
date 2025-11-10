FROM node:18-alpine

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
# Note: We need dev dependencies for migrations (@mikro-orm/cli, @mikro-orm/migrations)
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

# Copy entrypoint script
COPY services/user-service/docker-entrypoint.sh ./services/user-service/docker-entrypoint.sh
RUN chmod +x ./services/user-service/docker-entrypoint.sh

WORKDIR /app/services/user-service

# Expose port
EXPOSE 50052

# Use entrypoint script
ENTRYPOINT ["./docker-entrypoint.sh"]

