# Testing Guide

## Backend Testing

### Unit Tests

Run tests with coverage:

```bash
cd backend
make test
# Or: pytest --cov=app --cov-report=html
```

### Test Structure

```
backend/tests/
├── unit/
│   ├── test_auth.py
│   ├── test_tasks.py
│   └── test_ai_service.py
└── integration/
    └── test_api.py
```

### Example Test

```python
# tests/unit/test_auth.py
import pytest
from app.core.security import get_password_hash, verify_password

def test_password_hashing():
    password = "test123"
    hashed = get_password_hash(password)
    assert verify_password(password, hashed)
    assert not verify_password("wrong", hashed)
```

## Frontend Testing

### E2E Tests (Playwright)

```bash
cd frontend
make e2e
# Or: npm run test:e2e
```

### Example E2E Test

```typescript
// e2e/login.spec.ts
import { test, expect } from '@playwright/test'

test('user can login', async ({ page }) => {
  await page.goto('http://localhost:5173/login')
  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('input[name="password"]', 'password123')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('http://localhost:5173/dashboard')
})
```

## Manual Testing

### Test Reminder Flow

1. Create a task with `remind_at` set to 2 minutes from now
2. Wait for reminder to fire
3. Check notification in database
4. Verify web push/email sent

### Test AI Suggestions

1. Create several tasks and mark some as done
2. Create new task and click "AI Suggest"
3. Verify priority and time slots are suggested
4. Check reasoning is provided

### Test Authentication

1. Register new user
2. Login with credentials
3. Access protected route
4. Refresh token
5. Logout

## Coverage Goals

- Backend services: >= 70%
- Critical paths: 100%
- E2E: Basic user flows

