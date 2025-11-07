# Architecture

## Overview

Smart AI Task Organizer is a full-stack application built with a modern tech stack, following a monorepo structure.

## System Architecture

```
┌─────────────┐
│   Browser   │
│  (React)    │
└──────┬──────┘
       │ HTTP/REST
       │
┌──────▼─────────────────┐
│   Nginx (Reverse Proxy)│
└──────┬─────────────────┘
       │
       ├──────────────┐
       │              │
┌──────▼──────┐  ┌────▼──────┐
│  Frontend   │  │  Backend  │
│  (Vite)     │  │ (FastAPI) │
└─────────────┘  └────┬──────┘
                      │
              ┌───────▼───────┐
              │   PostgreSQL  │
              │   (Database)  │
              └───────────────┘
```

## Backend Architecture

### Core Components

1. **FastAPI Application** (`app/main.py`)
   - RESTful API endpoints
   - CORS middleware
   - Request/response validation

2. **Database Layer** (`app/db.py`)
   - SQLModel ORM
   - Session management
   - Database initialization

3. **Models** (`app/models/`)
   - User, Task, Notification, PushSubscription
   - SQLModel table definitions
   - Relationships and constraints

4. **Schemas** (`app/schemas/`)
   - Pydantic models for request/response
   - Validation and serialization

5. **API Routes** (`app/api/`)
   - Auth: register, login, refresh, me
   - Tasks: CRUD operations
   - Analytics: summary statistics
   - AI: suggestion endpoint
   - Notifications: push subscription

6. **Services** (`app/services/`)
   - Task service: business logic + reminder scheduling
   - AI service: heuristic + ML suggestions
   - Notification service: web push + email

7. **Jobs** (`app/jobs/`)
   - APScheduler background jobs
   - Reminder job: fires at remind_at time

8. **Scheduler** (`app/core/scheduler.py`)
   - BackgroundScheduler instance
   - Job management (add/remove/rebuild)

## Frontend Architecture

### Core Components

1. **React + Vite**
   - TypeScript for type safety
   - Component-based architecture

2. **State Management**
   - Zustand for global state (auth)
   - React Query for server state

3. **Routing**
   - React Router for navigation
   - Private routes for protected pages

4. **API Client** (`src/lib/api.ts`)
   - Axios instance with interceptors
   - Automatic token refresh
   - Error handling

5. **Pages**
   - Login/Register: Authentication
   - Dashboard: Analytics overview
   - Tasks: Task management
   - Calendar: Calendar view (read-only)
   - Settings: Notification preferences
   - Profile: User information

6. **Components**
   - Layout: Navigation and structure
   - TaskForm: Create/edit tasks
   - TaskList: Display tasks
   - AnalyticsCards: Summary cards
   - TasksChart: Chart.js visualization
   - UpcomingDeadlines: Deadline list

## Data Flow

### Task Creation Flow

1. User fills form → `TaskForm` component
2. Submit → `tasksApi.create()` → POST `/tasks`
3. Backend validates → `TaskService.create_task_with_reminder()`
4. Task saved to database
5. If `remind_at` set → APScheduler job scheduled
6. Response returned → React Query cache updated
7. UI updates with new task

### Reminder Flow

1. APScheduler fires at `remind_at` time
2. `send_reminder()` job executes
3. Notification record created
4. Web push sent (if subscription exists)
5. Email sent (if SMTP configured)
6. Notification marked as delivered

### AI Suggestion Flow

1. User clicks "AI Suggest" → `aiApi.suggest()`
2. POST `/ai/suggest` with task context
3. Backend analyzes user history
4. Heuristic calculates priority + time slots
5. Response with suggestions + reasoning
6. Form auto-fills with suggestions

## Security

- **Authentication**: JWT tokens (access + refresh)
- **Password Hashing**: bcrypt
- **CORS**: Configured for frontend origin
- **Authorization**: User ownership validation on all task operations
- **Token Refresh**: Automatic via axios interceptor

## Deployment

- **Docker**: Multi-stage builds for frontend/backend
- **Docker Compose**: Full stack orchestration
- **Nginx**: Reverse proxy + static file serving
- **PostgreSQL**: Production database (SQLite for dev)

## AI Module

### Heuristic Approach

1. **Priority Suggestion**:
   - Keyword analysis (urgent, asap, etc.)
   - Historical priority distribution
   - User preference patterns

2. **Time Slot Suggestion**:
   - Completion time histogram
   - Preferred hours analysis
   - Next 72h availability

### Future ML Enhancement

- scikit-learn models (LogisticRegression/RandomForest)
- Feature engineering: time_of_day, weekday, duration, success_rate
- Model persistence per user
- Incremental learning

