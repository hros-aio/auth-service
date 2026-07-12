# Research and Architectural Decisions: NestJS Foundation

## Decisions

### 1. Centralized Configuration Management
- **Decision**: Implement a strongly-typed `ConfigModule` that loads `.env`, `.env.local`, and custom YAML configuration files, validating the output at boot using `class-validator` and `plainToInstance`.
- **Rationale**: Ensures the application fails fast if configuration is missing or malformed. Strong typing prevents runtime reference bugs.
- **Alternatives Considered**: 
  - Raw `process.env` lookups: Rejected because it lacks schema validation and type safety.
  - JSON configuration files: Rejected because YAML is more human-readable and supports comments.

### 2. Async Context with AsyncLocalStorage
- **Decision**: Leverage Node's `AsyncLocalStorage` to capture, store, and propagate request correlation keys (Request ID, Tenant Code, User ID, Session ID) across execution threads without invoking NestJS request-scoped DI.
- **Rationale**: Standard NestJS request-scoped providers degrade performance significantly. `AsyncLocalStorage` is globally accessible via DI singleton wrappers and maintains high performance.
- **Alternatives Considered**:
  - Request-scoped DI injection: Rejected due to significant overhead and inability to use context in database subscribers.

### 3. Database Integration and Extension
- **Decision**: Integrate `@hrms/libs-sql` elements directly by inheriting `BaseEntity` on all local entities and `BaseRepository` on all custom repositories. Local migrations under `src/migrations/` will run on start/CI via TypeORM CLI configured with `@hrms/libs-sql` settings.
- **Rationale**: Guarantees consistency of indexing, soft-deletes, naming strategy, and transaction management across all microservices.
- **Alternatives Considered**:
  - Locally defined ORM config: Rejected to prevent drift and configuration duplication.

### 4. Cache & Logging Architecture
- **Decision**: Create thin local wrappers around `@hrms/libs-core`'s `CacheManager` and `AppLogger` to provide microservice-local namespaces, injecting these wrapper providers into local modules.
- **Rationale**: Ensures domain separation (distinct cache key namespaces) while reusing the heavy logging/caching client configurations of the shared library.
- **Alternatives Considered**:
  - Importing raw `ioredis` or custom logger: Rejected because it duplicates connection handling and telemetry logging.
