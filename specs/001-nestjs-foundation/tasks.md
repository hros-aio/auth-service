# Tasks: Build Enterprise NestJS Foundation

**Input**: Design documents from `specs/001-nestjs-foundation/`

**Prerequisites**: plan.md (required), spec.md (required)

**Tests**: Unit, integration, and E2E tests are required to validate configuration loading, request context, and API health checks.

**Organization**: Tasks are grouped by setup, foundation, and user story phases to enable independent implementation and incremental testing.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initial repository configuration, code quality tooling, and container/Kubernetes templates.

- [X] T001 [P] Configure ESLint, Prettier, Husky, Commitlint, and lint-staged in package.json, .eslintrc.js, .prettierrc, and commitlint.config.js
- [X] T002 [P] Configure EditorConfig in .editorconfig and VSCode workspace settings in .vscode/settings.json
- [X] T003 [P] Configure dev & prod Docker configurations in docker/Dockerfile and docker-compose.yml
- [X] T004 [P] Configure Kubernetes deployments, services, ingress, configmaps, and secrets in k8s/deployment.yaml, k8s/service.yaml, k8s/ingress.yaml, k8s/configmap.yaml, and k8s/secret.yaml
- [X] T005 [P] Configure Jest runner settings in tsconfig.json, jest.config.js, and test/jest-e2e.json
- [X] T006 [P] Configure GitHub Actions CI workflow in .github/workflows/ci.yml

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core environment configurations, Async Context, and Logging frameworks.

**⚠️ CRITICAL**: This phase must be completed before any user stories can be implemented.

- [X] T007 Create environment validation schema using class-validator in src/modules/config/env.validation.ts
- [X] T008 Implement YAML configuration loader utilizing js-yaml in src/modules/config/configuration.ts
- [X] T009 Create strongly-typed ConfigurationModule in src/modules/config/config.module.ts
- [X] T010 Create AsyncLocalStorage context manager in src/modules/context/context.manager.ts
- [X] T011 Create ContextMiddleware to bind request parameters in src/modules/context/context.middleware.ts
- [X] T012 Implement structured JSON AppLogger wrapper in src/modules/context/logger.wrapper.ts

**Checkpoint**: Foundational context, configuration, and logs ready.

---

## Phase 3: User Story 1 - Developer Core Bootstrapping & Configuration (Priority: P1) 🎯 MVP

**Goal**: Setup database initialization, namespaced caching, and application bootstrap.

**Independent Test**: Spin up local containers, run dev server, and check stdout for type-validated configuration startup logs.

- [X] T013 [P] [US1] Create local CacheModule wrapping @hrms/libs-core CacheManager in src/modules/cache/cache.module.ts
- [X] T014 [US1] Configure TypeORM database initialization using configuration module in src/app.module.ts
- [X] T015 [US1] Create local wrapper ExceptionFilter, ValidationPipe, and ResponseInterceptor registrations in src/main.ts
- [X] T016 [P] [US1] Create unit test for configuration loader in src/modules/config/config.service.spec.ts
- [X] T017 [P] [US1] Create unit test for CacheModule namespace logic in src/modules/cache/cache.service.spec.ts

**Checkpoint**: Core application bootstrapped and connected to DB/Cache.

---

## Phase 4: User Story 2 - Operations Observability & Health Gating (Priority: P2)

**Goal**: Implement health probes, request tracing, and logging interceptors.

**Independent Test**: Curl `/health` to verify healthy JSON response; perform requests to verify correlation IDs in JSON logs.

- [X] T018 [P] [US2] Implement health check probes using Terminus or base health indicator in src/modules/health/health.controller.ts
- [X] T019 [US2] Create health module containing health indicator providers in src/modules/health/health.module.ts
- [X] T020 [US2] Create LoggingInterceptor to trace and measure execution time in src/modules/context/logging.interceptor.ts
- [X] T021 [P] [US2] Create unit test for health controller in src/modules/health/health.controller.spec.ts
- [X] T022 [P] [US2] Create unit test for LoggingInterceptor in src/modules/context/logging.interceptor.spec.ts

**Checkpoint**: Health probes and observability integrations verified.

---

## Phase 5: User Story 3 - Automated CI/CD & Testing Foundation (Priority: P3)

**Goal**: Setup E2E test suites, database test container helpers, and validation workflows.

**Independent Test**: Run `pnpm run test:e2e` to verify Testcontainers spin up and health endpoints validate.

- [X] T023 [P] [US3] Create test database migration run helper in test/test-database.helper.ts
- [X] T024 [US3] Create baseline E2E test for health check endpoint in test/health.e2e-spec.ts
- [X] T025 [US3] Create baseline E2E test verifying correlation headers propagation in test/correlation.e2e-spec.ts

**Checkpoint**: Automated testing pipeline and CI gates fully functional.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Documentation updates, final code reviews, and dependency checks.

- [X] T026 Update root README.md with configuration guidelines and quickstart instructions
- [X] T027 Perform final verification run of all tests and verify linting compliance

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
  - User Story 1 (P1) -> User Story 2 (P2) -> User Story 3 (P3)
- **Polish (Final Phase)**: Depends on all user stories being complete.

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T001-T006).
- Test tasks within Phase 3 and Phase 4 marked [P] can run in parallel (T016, T017, T021, T022).

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational (blocking prerequisites).
3. Complete Phase 3: User Story 1.
4. **STOP and VALIDATE**: Verify app starts and connects to local postgres and redis.
