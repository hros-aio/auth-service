# Data Model: NestJS Foundation Infrastructure

## Shared Database Infrastructure

This project is a technical foundation. It does not introduce business-specific tables. All future entities MUST inherit from the shared `@new-hros/libs-sql` base entity structures.

### BaseEntity (Shared Infrastructure)

Every entity class MUST extend `BaseEntity` from `@new-hros/libs-sql`.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | `uuid` | No | Primary Key, auto-generated UUID |
| `created_at` | `timestamp` | No | Record creation timestamp |
| `updated_at` | `timestamp` | No | Record modification timestamp |
| `deleted_at` | `timestamp` | Yes | Soft-delete target column |
| `version` | `integer` | No | Optimistic locking version counter |

### Naming Strategy and Indexes

- **Tables**: Snake case representation of class names (e.g. `employee_record`).
- **Columns**: Snake case mapping.
- **Foreign Keys**: Suffixed with `_id` (e.g. `tenant_id`).
- **Index Naming**: `idx_<table_name>_<column_names>` (e.g. `idx_employee_record_tenant_id`).
- **Composite Index**: For tenant-scoped tables, `tenant_id` must lead.
