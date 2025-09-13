# Task C - Database CRUD API

A Next.js API implementation for CRUD operations on the Interview_Tests table using Supabase.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

## API Endpoints

### GET /api/interview-tests
List all records with optional filtering:
- `?field_3=true` - Filter by boolean field
- `?field_2_min=10&field_2_max=100` - Filter by numeric range

### POST /api/interview-tests
Create a new record:
```json
{
  "name": "Test Name",
  "field_1": {"key": "value"},
  "field_2": 42,
  "field_3": true
}
```

### GET /api/interview-tests/[id]
Get a specific record by ID

### PUT /api/interview-tests/[id]
Update a specific record by ID

### DELETE /api/interview-tests/[id]
Delete a specific record by ID

## Validation
- field_1: Must be valid JSON
- field_2: Must be numeric
- field_3: Must be boolean

## Status Codes
- 200: Success (read/update)
- 201: Created
- 204: Deleted
- 400: Bad request/validation error
- 404: Not found
- 405: Method not allowed
- 500: Server error