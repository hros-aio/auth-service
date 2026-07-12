# Feature Specification: Build Enterprise NestJS Foundation

**Feature Branch**: `001-build-base-source`

**Created**: 2026-07-12

**Status**: Draft

**Input**: User description: "Build the complete project foundation for an enterprise-grade NestJS backend. Do NOT implement any business modules. The goal is to produce a clean, production-ready architecture that future features can plug into with minimal effort."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Developer Core Bootstrapping & Configuration (Priority: P1)

As a backend developer, I want a fully configured NestJS application base with structured configuration loading and unified dependency injection for shared libraries (libs-core, libs-sql, libs-apis) so that I can focus entirely on writing business logic without repeating boilerplate setup.

**Why this priority**: Block-level prerequisite. Without the bootstrap and standard dependency injection setup, no other developer story or business feature can be implemented.

**Independent Test**: Bootstrapping the application successfully connects to the database and cache, registers core modules, and prints startup logs without errors.

**Acceptance Scenarios**:

1. **Given** a configured environment, **When** the NestJS application starts, **Then** the configuration is validated against a schema and the app boots without error.
2. **Given** a running application, **When** a request is made, **Then** shared library filters, interceptors, and pipes are automatically applied.

---

### User Story 2 - Operations Observability & Health Gating (Priority: P2)

As an operations engineer, I want the system to output structured JSON logs containing correlation IDs (Request ID, Tenant Code, User ID, Session ID) stored in Async Context, and provide standard health endpoints for Kubernetes probes so that the service runs reliably and observably in production.

**Why this priority**: Essential for production readiness, log analysis, error tracking, and Kubernetes integration.

**Independent Test**: Making an HTTP request traces the execution logs via correlation IDs and querying the health endpoint returns service status.

**Acceptance Scenarios**:

1. **Given** a request with correlation headers, **When** processed by the app, **Then** all logs produced during the execution of that request contain the correlation headers.
2. **Given** a Kubernetes liveness/readiness probe, **When** it hits the `/health` endpoint, **Then** it receives a `200 OK` status.

---

### User Story 3 - Automated CI/CD & Testing Foundation (Priority: P3)

As a QA engineer, I want Jest test configurations (unit, integration, E2E) and GitHub Actions workflow configurations to run automatically on code changes so that we guarantee zero regressions and maintain strict coverage thresholds.

**Why this priority**: Ensures codebase quality and prevents regressions, but does not block developers from local building.

**Independent Test**: Running test and lint commands locally and in CI validates code styling and tests.

**Acceptance Scenarios**:

1. **Given** a pull request with new code, **When** the CI workflow is triggered, **Then** it executes linting, formatting, testing, and database migration validations successfully.

---

### Edge Cases

- **Database/Cache Unreachable on Startup**: If the database or cache is offline, the application MUST fail to boot gracefully, outputting a clear error log, and exit with a non-zero status code (fail-fast behavior).
- **Missing or Invalid Configuration**: If environment variables or YAML configs fail validation schema checks on startup, the application MUST immediately log the validation error details and exit.
- **Async Context Fallback**: If logs or services access the async storage context outside of an active request lifecyle (e.g. during application bootstrap or cron executions), it MUST fall back to a default value without throwing exceptions.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST load and validate configurations from `.env`, `.env.local`, and YAML files using a strict validation schema during bootstrap.
- **FR-002**: The system MUST store and propagate request-scoped context (Request ID, Tenant Code, User ID, Session ID, Language, Timezone) using `AsyncLocalStorage`.
- **FR-003**: The system MUST log all messages in structured JSON format including correlation variables automatically resolved from the async context.
- **FR-004**: The system MUST integrate `@hrms/libs-sql` for TypeORM initialization, using the shared naming strategy, `BaseEntity`, and soft delete configurations.
- **FR-005**: The system MUST expose namespaced cache operations using the `CacheManager` from `@hrms/libs-core`.
- **FR-006**: The system MUST intercept incoming requests at the boundary to enforce asymmetric JWT RS256 validation and extract permissions using decorators.
- **FR-007**: The system MUST expose a health check endpoint `/health` returning liveness and readiness statuses.

### Key Entities *(include if feature involves data)*

No business-specific entities are introduced in the foundation. Database infrastructure relies on:
- **BaseEntity**: Shared database model containing ID, timestamps, version, and `deletedAt`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The bootstrapped NestJS application successfully starts up and handles HTTP traffic in under 5 seconds in Docker.
- **SC-002**: 100% of incoming HTTP requests receive correlation IDs attached to their response headers and logs.
- **SC-003**: Code coverage of the foundation modules meets or exceeds 90% Statements/Functions and 85% Branches in the CI pipeline.
- **SC-004**: All container builds and security scans complete under 10 minutes.

## Assumptions

- **Shared Libraries Availablity**: The packages `@hrms/libs-core`, `@hrms/libs-sql`, and `@hrms/libs-apis` are available and successfully resolved in the workspace dependencies.
- **Docker Daemon**: The development and production environments have access to Docker for building images.
- **Asymmetric Encryption**: The auth service handles key issuance; the foundation only requires the public key for token verification.
