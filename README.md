# Smart AI Task Organizer

A production-grade, AI-powered task management application with smart reminders, AI suggestions, and comprehensive analytics.

## 🎯 Features

- **Task Management**: Create, update, delete tasks with priorities, deadlines, and reminders
- **Smart Reminders**: Scheduled notifications via Web Push and Email
- **AI Suggestions**: Intelligent task prioritization and optimal time slot recommendations
- **Analytics Dashboard**: Track completion rates, overdue tasks, and weekly trends
- **Secure Authentication**: JWT-based auth with refresh tokens
- **Responsive UI**: Modern, mobile-friendly interface built with React and TailwindCSS

## 🏗️ Architecture

This is a monorepo containing:

- **Frontend**: React + Vite + TypeScript + TailwindCSS
- **Backend**: FastAPI + SQLModel + APScheduler
- **AI Module**: Heuristic engine + optional scikit-learn ML
- **Infrastructure**: Docker + docker-compose + nginx

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed architecture.

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker & Docker Compose (optional)

### Development Setup

**Windows Users:** See [WINDOWS_SETUP.md](WINDOWS_SETUP.md) for Windows-specific instructions.

1. **Clone and setup backend:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env  # Windows: copy .env.example .env
   # Edit .env with your settings
   ```

2. **Setup frontend:**
   ```bash
   cd frontend
   npm install
   cp .env.example .env  # Windows: copy .env.example .env
   # Edit .env with your settings
   ```

3. **Run with Make (Linux/Mac) or Batch files (Windows):**
   ```bash
   # Linux/Mac
   make dev        # Full stack with docker-compose
   make be         # Backend only
   make fe         # Frontend only
   
   # Windows
   backend\run.bat     # Backend only
   frontend\run.bat    # Frontend only
   ```

### Docker Setup

```bash
make build
make up
```

Access:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 📚 Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [API Reference](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Testing Guide](docs/TESTING.md)
- [Roadmap](docs/ROADMAP.md)

## 🧪 Testing

```bash
make test    # Backend unit tests
make e2e     # Frontend e2e tests
```

## 🛠️ Development

```bash
make fmt     # Format code
make clean   # Clean build artifacts
```

## 📝 License

MIT

