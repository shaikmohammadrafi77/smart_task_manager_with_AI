# Deployment Guide

## Prerequisites

- Docker and Docker Compose installed
- Git
- (Optional) Domain name and SSL certificate for production

## Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-ai-task-organizer
   ```

2. **Set up environment variables**
   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Edit .env with your settings
   
   # Frontend
   cd ../frontend
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Build and run**
   ```bash
   cd ..
   make build
   make up
   ```

4. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost/api
   - API Docs: http://localhost/api/docs

## Development Setup

### Backend

1. **Create virtual environment**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env
   ```

4. **Run migrations** (if using Alembic)
   ```bash
   alembic upgrade head
   ```

5. **Start server**
   ```bash
   make be
   # Or: uvicorn app.main:app --reload
   ```

### Frontend

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env
   ```

3. **Start dev server**
   ```bash
   make fe
   # Or: npm run dev
   ```

## Production Deployment

### Environment Variables

**Backend (.env)**
```env
APP_ENV=production
SECRET_KEY=<generate-with-openssl-rand-hex-32>
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
DATABASE_URL=postgresql://user:pass@db:5432/taskorganizer
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=password
FRONTEND_ORIGIN=https://yourdomain.com
VAPID_PUBLIC_KEY=<your-vapid-public-key>
VAPID_PRIVATE_KEY=<your-vapid-private-key>
```

**Frontend (.env)**
```env
VITE_API_BASE=https://api.yourdomain.com
VITE_VAPID_PUBLIC_KEY=<your-vapid-public-key>
```

### Docker Compose Production

1. **Update docker-compose.yml** for production:
   - Use environment variables from secrets
   - Configure nginx with SSL
   - Set up volume mounts for persistent data

2. **Build and deploy**
   ```bash
   docker-compose -f infra/docker-compose.yml build
   docker-compose -f infra/docker-compose.yml up -d
   ```

### Nginx SSL Configuration

Update `infra/nginx/default.conf` for SSL:

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    # ... rest of config
}
```

## Database Migrations

If using Alembic:

```bash
cd backend
alembic revision --autogenerate -m "Description"
alembic upgrade head
```

## Monitoring

- Backend logs: `docker logs smart-task-backend`
- Frontend logs: `docker logs smart-task-frontend`
- Database logs: `docker logs smart-task-db`

## Backup

```bash
# Database backup
docker exec smart-task-db pg_dump -U postgres taskorganizer > backup.sql

# Restore
docker exec -i smart-task-db psql -U postgres taskorganizer < backup.sql
```

## Troubleshooting

1. **Port conflicts**: Change ports in docker-compose.yml
2. **Database connection**: Check DATABASE_URL and db service
3. **CORS errors**: Verify FRONTEND_ORIGIN in backend .env
4. **Push notifications**: Ensure VAPID keys are configured

