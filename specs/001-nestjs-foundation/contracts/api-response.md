# Common API Response Envelope Contract

All standard HTTP JSON responses returned by the backend MUST follow this structure, which is automatically handled by the global `ResponseInterceptor` from `@hrms/libs-apis`.

## Success Envelope

- **Status Code**: `200 OK` or `201 Created`

### Body Schema

```json
{
  "success": true,
  "statusCode": 200,
  "data": {},
  "timestamp": "2026-07-12T21:17:00Z",
  "requestId": "uuid-correlation-id"
}
```

---

## Error Envelope

When exceptions occur, the global `ExceptionFilter` from `@hrms/libs-apis` intercepts them and returns a standardized error response.

- **Status Code**: `4xx` or `5xx`

### Body Schema

```json
{
  "success": false,
  "statusCode": 400,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Validation failed",
    "details": [
      {
        "property": "email",
        "constraints": {
          "isEmail": "email must be an email"
        }
      }
    ]
  },
  "timestamp": "2026-07-12T21:17:00Z",
  "requestId": "uuid-correlation-id"
}
```
