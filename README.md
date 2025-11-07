# Pricing Tool - Microservices Architecture

A microservices-based architecture built with NestJS, following SOLID principles and clean design patterns with full abstraction. The system uses MikroORM with PostgreSQL, gRPC for inter-service communication, and Redis for token storage.

## 📋 Table of Contents

- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Migrations](#database-migrations)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Development Guidelines](#development-guidelines)

---

## 🏗️ Architecture

### Overview

This is a microservices architecture with three main services:

```
┌─────────────────┐
│   API Gateway   │  (HTTP REST API - Port 3000)
│   (NestJS)      │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────┐
│  Auth  │ │  User  │
│Service │ │Service │
│(gRPC)  │ │(gRPC)  │
│:50051  │ │:50052  │
└───┬────┘ └───┬────┘
    │          │
    └────┬─────┘
         │
    ┌────▼────┐
    │PostgreSQL│
    │  (User  │
    │   DB)   │
    └─────────┘
         │
    ┌────▼────┐
    │  Redis  │
    │ (Token │
    │ Storage)│
    └─────────┘
```

### Services

#### 1. **API Gateway** (Port 3000)
- **Purpose**: Single entry point for all client requests
- **Protocol**: HTTP REST API
- **Responsibilities**:
  - Receives HTTP requests from clients
  - Validates authentication tokens
  - Routes requests to appropriate microservices via gRPC
  - Formats responses using standardized API response structure
  - Handles HTTP exceptions and errors

#### 2. **Auth Service** (Port 50051)
- **Purpose**: Authentication and authorization
- **Protocol**: gRPC
- **Responsibilities**:
  - Validates user credentials
  - Generates MD5-based authentication tokens
  - Stores user context (userId, roles, token) in Redis
  - Uses User Service database for credential validation

#### 3. **User Service** (Port 50052)
- **Purpose**: User management
- **Protocol**: gRPC
- **Responsibilities**:
  - User CRUD operations
  - Password hashing with salt
  - User data persistence
  - Owns the database schema and migrations

### Data Flow

#### Login Flow
1. Client sends HTTP POST request to `/auth/login` (API Gateway)
2. API Gateway forwards request via gRPC to Auth Service
3. Auth Service accesses User Service database to validate credentials
4. On success, Auth Service generates MD5 token and stores user context in Redis
5. Token returned to client via API Gateway

#### Protected Request Flow
1. Client includes token in `Authorization: Bearer <token>` header
2. API Gateway validates token by checking Redis
3. Gateway retrieves user context and forwards request to downstream service
4. Response formatted and returned to client

---

## 📁 Project Structure

```
pricing-tool/
├── services/
│   ├── api-gateway/          # HTTP REST API Gateway
│   │   ├── src/
│   │   │   ├── features/
│   │   │   │   ├── auth/     # Authentication feature
│   │   │   │   │   ├── controllers/
│   │   │   │   │   ├── services/
│   │   │   │   │   ├── dto/
│   │   │   │   │   └── interfaces/
│   │   │   │   └── user/     # User feature
│   │   │   │       ├── controllers/
│   │   │   │       ├── services/
│   │   │   │       └── dto/
│   │   │   └── common/       # Shared utilities
│   │   └── proto/             # gRPC proto files (references)
│   │
│   ├── auth-service/         # Authentication microservice
│   │   ├── src/
│   │   │   ├── features/
│   │   │   │   └── auth/
│   │   │   │       ├── controllers/
│   │   │   │       ├── services/
│   │   │   │       ├── repositories/
│   │   │   │       ├── entities/
│   │   │   │       └── dto/
│   │   │   └── scripts/
│   │   └── proto/
│   │       └── auth.proto
│   │
│   └── user-service/         # User management microservice
│       ├── src/
│       │   ├── features/
│       │   │   └── user/
│       │   │       ├── controllers/
│       │   │       ├── services/
│       │   │       ├── repositories/
│       │   │       ├── entities/
│       │   │       └── dto/
│       │   ├── migrations/   # Database migrations
│       │   └── scripts/
│       └── proto/
│           └── user.proto
│
└── shared-infra/             # Shared infrastructure code
    └── src/
        ├── entities/         # Base entities
        ├── repositories/     # Base repositories
        ├── errors/           # Exception classes
        ├── filters/          # Exception filters
        ├── modules/          # Shared modules (Database, Redis)
        └── config/           # Configuration utilities
```

### Feature-Based Structure

Each service follows a feature-based folder structure:

```
features/
└── {feature-name}/
    ├── controllers/          # HTTP/gRPC controllers
    ├── services/             # Business logic
    │   ├── {service}.ts
    │   └── {service}.contract.ts  # Interface
    ├── repositories/         # Data access layer
    │   ├── {repository}.ts
    │   └── {repository}.contract.ts
    ├── entities/            # Database entities
    ├── dto/                 # Data Transfer Objects
    ├── interfaces/          # TypeScript interfaces
    ├── types/               # Type definitions
    ├── constants/           # Feature constants
    └── {feature}.module.ts # NestJS module
```

---

## 📦 Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **PostgreSQL** (v14 or higher)
- **Redis** (v6 or higher)
- **TypeScript** (v5.3.3)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd pricing-tool
```

### 2. Install Dependencies

From the root directory:

```bash
npm install
```

This will install dependencies for all workspaces (root, services, and shared-infra).

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
USER_SERVICE_DB_HOST=localhost
USER_SERVICE_DB_PORT=5432
USER_SERVICE_DB_USER=postgres
USER_SERVICE_DB_PASSWORD=your_password
USER_SERVICE_DB_NAME=user_db

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# Default User (for seeding)
DEFAULT_USER_EMAIL=admin@example.com
DEFAULT_USER_PASSWORD=admin123
DEFAULT_USER_FIRST_NAME=Admin
DEFAULT_USER_LAST_NAME=User

# Service Ports and Hosts
GATEWAY_PORT=3000
GATEWAY_HOST=0.0.0.0
AUTH_SERVICE_GRPC_PORT=50051
AUTH_SERVICE_GRPC_HOST=0.0.0.0
USER_SERVICE_GRPC_PORT=50052
USER_SERVICE_GRPC_HOST=0.0.0.0
```

### 4. Set Up Database

Create the PostgreSQL database:

```bash
psql -U postgres -c "CREATE DATABASE user_db;"
```

### 5. Set Up Redis

Start Redis server:

```bash
# Using Docker
docker run -d -p 6379:6379 redis:latest

# Or using local installation
redis-server
```

---

## 🗄️ Database Migrations

### How Migrations Work

Migrations are **NOT** automatically applied. You must explicitly run migration commands to update the database schema.

#### Migration Workflow

1. **Modify Entity Classes** - Make changes to your entity classes (e.g., add/remove fields)
2. **Generate Migration** - Create a migration file based on schema changes
3. **Review Migration** - Check the generated SQL in the migration file
4. **Apply Migration** - Run the migration to update the database

### Migration Commands

All migration commands are run from the `services/user-service` directory:

```bash
cd services/user-service
```

#### Create a Migration

```bash
# Create migration with auto-generated name
npm run migration:create

# Create migration with custom name
npm run migration:create -- --name=AddPhoneNumberToUser
```

This will:
- Compare current entities with database schema
- Generate a migration file in `src/migrations/`
- Create SQL statements to apply changes

#### Apply Migrations

```bash
# Run all pending migrations
npm run migration:up
```

#### Other Migration Commands

```bash
# Rollback last migration
npm run migration:down

# List all migrations
npm run migration:list

# Check pending migrations
npm run migration:pending

# Drop database and rerun all migrations (⚠️ DESTRUCTIVE)
npm run migration:fresh
```

### Migration Files

Migrations are stored in `services/user-service/src/migrations/`:

```typescript
// Example: Migration20251106163902.ts
import { Migration } from '@mikro-orm/migrations';

export class Migration20251106163902 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table "users" add column "salt" varchar(255);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "users" drop column "salt";`);
  }
}
```

### Important Notes

- ⚠️ **Migrations are manual-only** - They will NOT run automatically on startup
- ⚠️ **Always review migration files** before applying
- ⚠️ **Backup your database** before running migrations in production
- ✅ **Migration files are version controlled** - Commit them to git

### Initial Setup

For a fresh database:

```bash
cd services/user-service

# Generate initial migration
npm run migration:create -- --name=InitialMigration

# Review the generated migration file
# Then apply it
npm run migration:up
```

---

## 🏃 Running the Application

### Development Mode

#### Option 1: Start All Services with Script (Recommended)

From the root directory, use the convenience script:

```bash
# Start all services
npm run start:local
# or
./scripts/start-local.sh start
```

This script will:
- ✅ Check prerequisites (Node.js, npm, .env file)
- ✅ Check for running services on ports
- ✅ Start all services in the correct order
- ✅ Wait for services to be ready
- ✅ Show service status and log locations

**Other script commands:**
```bash
# Stop all services
npm run stop:local
# or
./scripts/start-local.sh stop

# Restart all services
npm run restart:local
# or
./scripts/start-local.sh restart

# Check service status
npm run status:local
# or
./scripts/start-local.sh status

# View logs from all services
npm run logs:local
# or
./scripts/start-local.sh logs
```

#### Option 2: Run All Services Together (Concurrently)

From the root directory:

```bash
npm run start:all
```

This starts all three services concurrently using `concurrently`.

#### Option 3: Run Services Individually

**Terminal 1 - API Gateway:**
```bash
npm run start:gateway
# Or
cd services/api-gateway
npm run start:dev
```

**Terminal 2 - Auth Service:**
```bash
npm run start:auth
# Or
cd services/auth-service
npm run start:dev
```

**Terminal 3 - User Service:**
```bash
npm run start:user
# Or
cd services/user-service
npm run start:dev
```

### Production Mode

Build and run each service:

```bash
# Build
cd services/api-gateway && npm run build
cd services/auth-service && npm run build
cd services/user-service && npm run build

# Run
cd services/api-gateway && npm run start:prod
cd services/auth-service && npm run start:prod
cd services/user-service && npm run start:prod
```

### Default User Seeding

On first startup, if no users exist in the database, a default user is automatically created:

- **Email**: `admin@example.com` (or `DEFAULT_USER_EMAIL`)
- **Password**: `admin123` (or `DEFAULT_USER_PASSWORD`)
- **Name**: `Admin User` (or `DEFAULT_USER_FIRST_NAME` + `DEFAULT_USER_LAST_NAME`)

You can also seed manually:

```bash
cd services/user-service
npm run seed:default-user
```


## 🚢 Deployment

### Prerequisites for Production

1. **Environment Variables** - Set all required environment variables
2. **Database** - PostgreSQL database created and accessible
3. **Redis** - Redis server running and accessible
4. **Build** - All services built for production

### Deployment Steps

#### 1. Build All Services

```bash
# From root directory
npm run build
```

This builds all workspaces (services and shared-infra).

#### 2. Run Database Migrations

```bash
cd services/user-service
npm run migration:up
```

⚠️ **Important**: Always run migrations before starting services in production.

#### 3. Start Services

Use a process manager like PM2:

```bash
# Install PM2 globally
npm install -g pm2

# Start API Gateway
cd services/api-gateway
pm2 start dist/main.js --name api-gateway

# Start Auth Service
cd services/auth-service
pm2 start dist/main.js --name auth-service

# Start User Service
cd services/user-service
pm2 start dist/main.js --name user-service
```

Or use Docker Compose (if configured).

#### 4. Health Checks

Verify services are running:

```bash
# Check API Gateway
curl http://localhost:3000/users

# Check logs
pm2 logs
```

### Docker Deployment

The project includes Dockerfiles for all services. **Note**: PostgreSQL and Redis should be running on your host machine (not in Docker).

#### Prerequisites

1. **PostgreSQL** running on your host machine
2. **Redis** running on your host machine
3. **Migrations** must be run locally before starting Docker containers

#### Step 1: Run Migrations Locally

Before starting Docker containers, run migrations locally:

```bash
cd services/user-service
npm run migration:up
```

#### Step 2: Configure Environment Variables

Ensure your `.env` file has the correct host URLs for Docker:

```env
# Database - Use host.docker.internal to access host PostgreSQL
USER_SERVICE_DB_HOST=host.docker.internal
USER_SERVICE_DB_PORT=5432
USER_SERVICE_DB_USER=postgres
USER_SERVICE_DB_PASSWORD=your_password
USER_SERVICE_DB_NAME=user_db

# Redis - Use host.docker.internal to access host Redis
REDIS_HOST=host.docker.internal
REDIS_PORT=6379

# Service Ports
GATEWAY_PORT=3000
GATEWAY_HOST=0.0.0.0
AUTH_SERVICE_GRPC_PORT=50051
AUTH_SERVICE_GRPC_HOST=0.0.0.0
USER_SERVICE_GRPC_PORT=50052
USER_SERVICE_GRPC_HOST=0.0.0.0
```

#### Step 3: Build Docker Images

From the root directory:

```bash
# Build all services
docker-compose build

# Or build individual service
docker-compose build api-gateway
docker-compose build auth-service
docker-compose build user-service
```

#### Step 4: Start Services

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Docker Compose Services

The `docker-compose.yml` includes:

- **api-gateway**: HTTP REST API (port 3000)
- **auth-service**: Authentication microservice (port 50051)
- **user-service**: User management microservice (port 50052)

All services:
- Connect to host PostgreSQL via `host.docker.internal`
- Connect to host Redis via `host.docker.internal`
- Use environment variables from `.env` file
- Are on the same Docker network for inter-service communication

#### Migration Options

You have two options for running migrations:

**Option 1: Run Migrations Locally (Default)**
```bash
# Run migrations locally before starting Docker
cd services/user-service
npm run migration:up

# Then start Docker containers
docker-compose up -d
```

**Option 2: Run Migrations Automatically in Docker**
```bash
# Set RUN_MIGRATIONS=true in .env or docker-compose
RUN_MIGRATIONS=true docker-compose up -d
```

Or add to your `.env` file:
```env
RUN_MIGRATIONS=true
```

⚠️ **Note**: When `RUN_MIGRATIONS=true`, migrations will run automatically every time the container starts. This is useful for automated deployments but may cause issues if migrations fail.

#### Important Notes

⚠️ **Migrations**: By default, migrations are **NOT** run automatically in Docker. You must either:
- Run them locally before starting containers (recommended)
- Set `RUN_MIGRATIONS=true` to run them automatically in Docker

⚠️ **Database & Redis**: These should be running on your **host machine**, not in Docker. Use `host.docker.internal` to access them from containers.

⚠️ **Build Process**: Dockerfiles use multi-stage builds:
- **Builder stage**: Installs all dependencies and builds the application
- **Production stage**: Includes all dependencies (needed for migrations if enabled)

### Environment-Specific Configuration

Use different `.env` files for different environments:

```bash
# Development
.env.development

# Production
.env.production
```

Load them based on `NODE_ENV`:

```bash
NODE_ENV=production npm run start:prod
```

---

## 🔐 Environment Variables

### Required Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `USER_SERVICE_DB_HOST` | PostgreSQL host | `localhost` | `localhost` |
| `USER_SERVICE_DB_PORT` | PostgreSQL port | `5432` | `5432` |
| `USER_SERVICE_DB_USER` | PostgreSQL user | `postgres` | `postgres` |
| `USER_SERVICE_DB_PASSWORD` | PostgreSQL password | - | `your_password` |
| `USER_SERVICE_DB_NAME` | Database name | `user_db` | `user_db` |
| `REDIS_HOST` | Redis host | `localhost` | `localhost` |
| `REDIS_PORT` | Redis port | `6379` | `6379` |

### Service Ports and Hosts

| Variable | Description | Default | Notes |
|----------|-------------|---------|-------|
| `GATEWAY_PORT` | API Gateway HTTP port | `3000` | - |
| `GATEWAY_HOST` | API Gateway HTTP host | `0.0.0.0` | `0.0.0.0` = all interfaces |
| `AUTH_SERVICE_GRPC_PORT` | Auth Service gRPC port | `50051` | - |
| `AUTH_SERVICE_GRPC_HOST` | Auth Service gRPC host (binding) | `0.0.0.0` | `0.0.0.0` = all interfaces |
| `AUTH_SERVICE_GRPC_HOST` | Auth Service gRPC host (client) | `localhost` | Used by API Gateway to connect |
| `USER_SERVICE_GRPC_PORT` | User Service gRPC port | `50052` | - |
| `USER_SERVICE_GRPC_HOST` | User Service gRPC host (binding) | `0.0.0.0` | `0.0.0.0` = all interfaces |
| `USER_SERVICE_GRPC_HOST` | User Service gRPC host (client) | `localhost` | Used by API Gateway to connect |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DEFAULT_USER_EMAIL` | Default user email | `admin@example.com` |
| `DEFAULT_USER_PASSWORD` | Default user password | `admin123` |
| `DEFAULT_USER_FIRST_NAME` | Default user first name | `Admin` |
| `DEFAULT_USER_LAST_NAME` | Default user last name | `User` |

---

## 💻 Development Guidelines

### Code Structure

- **Feature-based organization** - Group related code by feature
- **Separation of concerns** - Controllers, services, repositories in separate folders
- **Interface contracts** - Use `.contract.ts` files for interfaces
- **DRY principle** - Use shared infrastructure code from `@shared/infra`

### Adding New Features

1. Create feature folder: `features/{feature-name}/`
2. Add controllers, services, repositories, DTOs
3. Create feature module: `{feature}.module.ts`
4. Import module in `app.module.ts`

### Database Changes

1. Modify entity classes
2. Generate migration: `npm run migration:create -- --name=FeatureName`
3. Review migration file
4. Apply migration: `npm run migration:up`

### Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

### Code Style

```bash
# Format code
npm run format

# Lint code
npm run lint
```

---

## 🛠️ Troubleshooting

### Services Won't Start

1. Check if ports are available:
   ```bash
   lsof -i :3000  # API Gateway
   lsof -i :50051 # Auth Service
   lsof -i :50052 # User Service
   ```

2. Verify database connection:
   ```bash
   psql -U postgres -d user_db -c "SELECT 1;"
   ```

3. Check Redis connection:
   ```bash
   redis-cli ping
   ```

### Migration Issues

1. Check migration status:
   ```bash
   npm run migration:list
   ```

2. Rollback if needed:
   ```bash
   npm run migration:down
   ```

3. Check database schema:
   ```bash
   psql -U postgres -d user_db -c "\d users"
   ```

### gRPC Connection Issues

1. Verify proto files are in correct locations
2. Check service URLs in client configurations
3. Ensure services are running before starting API Gateway

---

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [MikroORM Documentation](https://mikro-orm.io/docs/)
- [gRPC Documentation](https://grpc.io/docs/)
- [Redis Documentation](https://redis.io/docs/)

---

## 📝 License

[Your License Here]

---

## 👥 Contributors

[Your Team/Contributors]

---

## 📧 Support

For issues and questions, please [create an issue](link-to-issues) or contact [your-email].

