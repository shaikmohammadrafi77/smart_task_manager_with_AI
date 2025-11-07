# API Reference

Base URL: `http://localhost:8000`

All responses use `snake_case` JSON. Dates are in ISO 8601 format.

## Authentication

### Register

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer"
}
```

### Refresh Token

```http
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJ..."
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer"
}
```

### Get Current User

```http
GET /auth/me
Authorization: Bearer {access_token}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2024-01-01T00:00:00Z"
}
```

## Tasks

### List Tasks

```http
GET /tasks?status=todo&priority=high&page=1&size=20
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `status`: `todo`, `in_progress`, `done` (optional)
- `priority`: `low`, `medium`, `high` (optional)
- `due_from`: ISO datetime (optional)
- `due_to`: ISO datetime (optional)
- `page`: integer (default: 1)
- `size`: integer (default: 20, max: 100)

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "user_id": 1,
    "title": "Complete project",
    "description": "Finish the task",
    "priority": "high",
    "due_at": "2024-01-15T10:00:00Z",
    "remind_at": "2024-01-15T09:00:00Z",
    "status": "todo",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

### Get Task

```http
GET /tasks/{id}
Authorization: Bearer {access_token}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Complete project",
  "description": "Finish the task",
  "priority": "high",
  "due_at": "2024-01-15T10:00:00Z",
  "remind_at": "2024-01-15T09:00:00Z",
  "status": "todo",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Create Task

```http
POST /tasks
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "New task",
  "description": "Task description",
  "priority": "medium",
  "due_at": "2024-01-15T10:00:00Z",
  "remind_at": "2024-01-15T09:00:00Z"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "user_id": 1,
  "title": "New task",
  "description": "Task description",
  "priority": "medium",
  "due_at": "2024-01-15T10:00:00Z",
  "remind_at": "2024-01-15T09:00:00Z",
  "status": "todo",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Update Task

```http
PATCH /tasks/{id}
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "status": "in_progress",
  "priority": "high"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "user_id": 1,
  "title": "New task",
  "description": "Task description",
  "priority": "high",
  "due_at": "2024-01-15T10:00:00Z",
  "remind_at": "2024-01-15T09:00:00Z",
  "status": "in_progress",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T01:00:00Z"
}
```

### Delete Task

```http
DELETE /tasks/{id}
Authorization: Bearer {access_token}
```

**Response:** `204 No Content`

## Analytics

### Get Summary

```http
GET /analytics/summary
Authorization: Bearer {access_token}
```

**Response:** `200 OK`
```json
{
  "total_tasks": 50,
  "completed_tasks": 30,
  "overdue_tasks": 5,
  "completion_rate": 60.0,
  "tasks_per_day": {
    "2024-01-01": 3,
    "2024-01-02": 5
  },
  "upcoming_deadlines": [
    {
      "id": 1,
      "title": "Task 1",
      "due_at": "2024-01-15T10:00:00Z",
      "priority": "high"
    }
  ]
}
```

## AI Suggestions

### Get Suggestions

```http
POST /ai/suggest
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "Important meeting",
  "description": "Prepare presentation",
  "estimated_duration_minutes": 60
}
```

**Response:** `200 OK`
```json
{
  "suggested_priority": "high",
  "priority_reason": "High priority due to urgency keywords",
  "suggested_time_slots": [
    {
      "start": "2024-01-15T14:00:00Z",
      "end": "2024-01-15T15:00:00Z",
      "confidence": 0.75
    }
  ],
  "reasoning": "Based on user's historical completion patterns"
}
```

## Notifications

### Subscribe to Push

```http
POST /notifications/subscribe
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "endpoint": "https://fcm.googleapis.com/...",
  "keys": {
    "p256dh": "base64...",
    "auth": "base64..."
  }
}
```

**Response:** `200 OK`
```json
{
  "status": "subscribed"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Email already registered"
}
```

### 401 Unauthorized
```json
{
  "detail": "Invalid token"
}
```

### 404 Not Found
```json
{
  "detail": "Task not found"
}
```

### 422 Unprocessable Entity
```json
{
  "detail": "remind_at must be before or equal to due_at"
}
```

