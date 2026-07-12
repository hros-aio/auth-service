# Implementation Plan: Build Enterprise NestJS Foundation

**Branch**: `001-build-base-source` | **Date**: 2026-07-12 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-nestjs-foundation/spec.md`

## Summary

Implement a production-ready architectural foundation for the NestJS microservice. This implementation establishes centralized configuration loading with YAML validation, an AsyncLocalStorage request context namespace, structured JSON logging with request tracking, TypeORM integration inheriting from `@hrms/libs-sql`, namespaced Redis cache client utilizing `@hrms/libs-core`, asymmetric RS256 token validation from `@hrms/libs-apis`, and global HTTP pipeline components (validation pipes, exception filters, interceptors). No business modules will be introduced.

## Technical Context

**Language/Version**: TypeScript (v5.x+) on Node.js (v20+)

**Primary Dependencies**: NestJS (v10+), class-validator, class-transformer, js-yaml, dotenv

**Storage**: PostgreSQL (via TypeORM), Redis (caching)

**Testing**: Jest (Unit, Integration, E2E), Testcontainers

**Target Platform**: Docker, Kubernetes (AKS/EKS/GKE)

**Project Type**: Microservice Web Service

**Performance Goals**: Bootstrap < 5s; request tracking context overhead < 1ms

**Constraints**: Maximize reuse of `@hrms/libs-core`, `@hrms/libs-sql`, and `@hrms/libs-apis`. Zero duplication of shared library code.

**Scale/Scope**: Template framework for all microservices in the HRMS suite.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Layering Compliance Gate**: The repository MUST maintain strict `controllers` -> `services` -> `repositories` boundaries. (Passed)
- **Shared Library Gate**: The implementation MUST NOT duplicate logic from `@hrms/libs-core`, `@hrms/libs-sql`, and `@hrms/libs-apis`. (Passed)
- **Asymmetric Encryption Gate**: Authentication validation MUST rely on JWT RS256 asymmetric keys. (Passed)
- **Coverage Gate**: CI pipeline test configuration must verify a minimum of 90% Statements/Functions and 85% Branches. (Passed)

## Project Structure

### Documentation (this feature)

```text
specs/001-nestjs-foundation/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── modules/
│   ├── config/          # Local Configuration module
│   ├── cache/           # Local Cache wrapper module (delegates to libs-core)
│   ├── context/         # AsyncLocalStorage request context
│   └── health/          # Health probe module
├── main.ts              # App bootstrap
└── app.module.ts        # App root module

test/
├── health.e2e-spec.ts   # E2E health endpoint tests
├── correlation.e2e-spec.ts  # E2E correlation/context tests
└── jest-e2e.json        # Jest E2E configuration
```

**Structure Decision**: Standard single project microservice layout conforming to the HRMS repository structure guidelines.

## Complexity Tracking

*No violations detected.*
