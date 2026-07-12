# Quickstart Validation Guide

This document defines scenarios to validate that the NestJS foundation is correctly installed, configured, and running.

## Prerequisites

- **Node.js**: v20+
- **pnpm**: v9+
- **Docker & Docker Compose** (for PostgreSQL and Redis)

## Setup Scenarios

### 1. Installation
Run the dependency installation:
```bash
pnpm install
```
Expected output: No dependency resolution or peer errors.

### 2. Infrastructure Setup
Spin up the local development database and cache:
```bash
docker compose up -d
```
Expected output: PostgreSQL and Redis containers start and are healthy on ports `5432` and `6379`.

### 3. Environment Configuration
Copy the template configuration:
```bash
cp .env.example .env
```
Expected output: `.env` file exists with default values matching the docker-compose configurations.

---

## Run and Verification Scenarios

### 4. Running Dev Server
Start the development server:
```bash
pnpm run start:dev
```
Expected output:
- NestJS application starts.
- DB migration runs successfully.
- Caching client registers namespaces.
- JSON formatted log entries appear in stdout.

### 5. Health Check Verification
Query the health check endpoint:
```bash
curl -i http://localhost:3000/health
```
Expected output:
- HTTP Status `200 OK`
- JSON payload containing database and cache "up" statuses:
  `{"status":"ok","info":{"database":{"status":"up"},"redis":{"status":"up"}}...}`

### 6. Linting & Formatting Check
Verify formatting rules:
```bash
pnpm run lint
pnpm run format:check
```
Expected output: `0` errors found.

---

## Test Scenarios

### 7. Run Unit Tests
Execute Jest unit test suites:
```bash
pnpm run test
```
Expected output: All unit tests pass, and coverage threshold reports >90%.

### 8. Run E2E Tests
Execute E2E validation:
```bash
pnpm run test:e2e
```
Expected output: NestJS application boots in memory, database migration runs on temporary Testcontainer instances, and E2E endpoints pass.
