# Health API Contract

## Endpoint

`GET /health`

### Response Envelope

- **Status Code**: `200 OK` (when healthy) or `503 Service Unavailable` (when degraded/down)
- **Headers**: `Content-Type: application/json`

### Body Schema (JSON)

```json
{
  "status": "ok" | "error",
  "info": {
    "database": {
      "status": "up"
    },
    "redis": {
      "status": "up"
    }
  },
  "error": {},
  "details": {
    "database": {
      "status": "up"
    },
    "redis": {
      "status": "up"
    }
  }
}
```
