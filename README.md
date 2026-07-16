# HRMS Access Service (Access Service)

Enterprise-grade NestJS foundation for the Authentication and Authorization microservice.

---

## Technical Stack
- **Framework**: NestJS (v10)
- **Language**: TypeScript
- **Database**: PostgreSQL with TypeORM
- **Cache**: Redis
- **Observability**: Prometheus (`/metrics`) & NestJS Terminus (`/health`)
- **Tracing**: AsyncLocalStorage Context tracing (correlation logs)
- **Formatting & Linting**: ESLint, Prettier, Husky, Commitlint

---

## Repository Structure
```text
├── config/              # Configuration schemas (YAML)
├── docker/              # Multi-stage Dockerfile
├── k8s/                 # Kubernetes manifests (deployments, ingress, service)
├── src/
│   ├── app.module.ts    # Root application module
│   ├── main.ts          # Application bootstrapping entrypoint
│   └── modules/
│       ├── cache/       # Caching with namespace prefixing
│       ├── common/      # Global response interceptors & filters
│       ├── config/      # Strongly-typed YAML configuration loader & validation
│       ├── context/     # Request context middleware, manager, wrapper logger
│       ├── health/      # Health check probes (SQL + Redis)
│       └── metrics/     # Prometheus metrics exporter
└── test/                # E2E integration test suites
```

---

## Setup & Configuration

The service uses a hierarchical configuration system. Configurations are loaded from `config/config.yaml` and can be overridden by local configurations in `config/config.local.yaml` or system environment variables.

### Configuration Schema (`config.yaml`)
```yaml
PORT: 3000
DB_HOST: "localhost"
DB_PORT: 5432
DB_USERNAME: "postgres"
DB_PASSWORD: "postgres"
DB_NAME: "access"
REDIS_HOST: "localhost"
REDIS_PORT: 6379
JWT_PUBLIC_KEY: "test-public-key"
```

To run the application, ensure Postgres and Redis are listening on their standard ports or override these parameters in your local environment.

---

## Development Commands

### Install Dependencies
```bash
pnpm install --ignore-scripts
```

### Run Service in Development Mode
```bash
pnpm run start:dev
```

### Run Linter & Formatter
```bash
pnpm run lint
pnpm run format
```

---

## Testing

### Unit Tests
```bash
# Set CI=true to prevent Node v24 Jest status bar calculation crash
env CI=true pnpm run test
```

### End-to-End (E2E) Tests
Runs E2E integration tests against the configured local PostgreSQL and Redis databases.
```bash
env CI=true pnpm run test:e2e
```
