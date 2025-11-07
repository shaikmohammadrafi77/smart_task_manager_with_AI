.PHONY: help dev be fe fmt test e2e build up down clean

help:
	@echo "Smart AI Task Organizer - Makefile"
	@echo ""
	@echo "Commands:"
	@echo "  make dev        - Run frontend and backend with docker-compose"
	@echo "  make be         - Run backend with uvicorn (reload)"
	@echo "  make fe         - Run frontend dev server"
	@echo "  make fmt        - Format code (ruff/black/isort)"
	@echo "  make test       - Run pytest with coverage"
	@echo "  make e2e        - Run Playwright e2e tests"
	@echo "  make build      - Build docker images"
	@echo "  make up         - Start docker-compose services"
	@echo "  make down       - Stop docker-compose services"
	@echo "  make clean      - Clean build artifacts"

dev:
	docker-compose -f infra/docker-compose.yml up --build

be:
	cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

fe:
	cd frontend && npm run dev

fmt:
	cd backend && ruff check --fix . && black . && isort .
	cd frontend && npm run format || true

test:
	cd backend && pytest --cov=app --cov-report=html --cov-report=term

e2e:
	cd frontend && npm run test:e2e

build:
	docker-compose -f infra/docker-compose.yml build

up:
	docker-compose -f infra/docker-compose.yml up -d

down:
	docker-compose -f infra/docker-compose.yml down

clean:
	find . -type d -name __pycache__ -exec rm -r {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	rm -rf backend/.pytest_cache backend/htmlcov backend/.coverage
	rm -rf frontend/node_modules frontend/dist frontend/.vite
	rm -rf .coverage htmlcov

