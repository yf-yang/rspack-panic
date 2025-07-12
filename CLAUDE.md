# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript + Python hybrid monorepo template that combines:
- **Frontend**: React application with React Router v7, built with Rsbuild
- **Backend**: FastAPI Python application with MongoDB integration
- **Shared Configuration**: ESLint, TypeScript, Jest configurations as workspace packages

## Architecture

### Monorepo Structure
- **pnpm workspace** manages TypeScript packages (`apps/`, `configs/`, `packages/`)
- **uv workspace** manages Python packages (`pyPackages/`)
- **Shared configs** centralized in `configs/` directory with reusable ESLint, TypeScript, and Jest configurations

### Key Components
- **Frontend (`apps/frontend/`)**: React app with React Router, TailwindCSS, shadcn/ui, React Compiler
- **Backend (`pyPackages/app/`)**: FastAPI app with automatic OpenAPI schema generation
- **Macro system (`configs/macro/`)**: Custom development macros for logging, assertions, and environment checks

## Common Commands

### Development
```bash
# Install all dependencies (both JS and Python)
pnpm initialize

# Start both frontend and backend in development mode
pnpm dev

# Start only backend
pnpm dev:backend

# Start only frontend  
pnpm dev:frontend
```

### Frontend-specific (run in apps/frontend/)
```bash
# Build for production
pnpm build

# Run linting
pnpm lint

# Fix linting issues
pnpm lint:fix

# Run spell check
pnpm spellcheck

# Type checking
pnpm typecheck

# Generate API types from backend schema
pnpm gen-schema

# Start Storybook
pnpm sb
```

### Python/Backend
```bash
# Run Python tests
uv run pytest

# Run backend in development mode
fastapi_dev ./pyPackages/app/app/main.py --port 10086

# Generate OpenAPI schema
gen_schema

# Run demo scripts
demo_app
demo_mongo
```

### Linting & Code Quality
```bash
# Run ESLint with timing (from any workspace package)
TIMING=1 eslint '**/*.{ts,js,tsx,jsx}' --cache --report-unused-disable-directives

# Python linting and formatting
uv run ruff check
uv run ruff format
```

## Development Workflow

### Type Generation
The project automatically generates TypeScript types from the Python backend:
1. Backend generates `openapi.json` and `schema.json`
2. Frontend runs `pnpm gen-schema` to convert these to TypeScript definitions
3. Generated types are available in `apps/frontend/src/apis/`

### Macro System
The frontend uses custom macros for development (defined in `configs/macro/`):
- `IS_DEV`, `IS_PROD`, `IS_TEST` - Environment checks
- `MAKE_LOGGER()`, `DEBUG()`, `INFO()`, `WARN()`, `ERROR()` - Logging with namespaced colors
- `ASSERT()`, `FAIL()`, `NOT_IMPLEMENTED()`, `UNREACHABLE()` - Assertions and debugging
- `DEBUGGER()` - Breakpoint trigger

These macros are replaced by Rsbuild during build and removed in production.

### Code Style
- **No comments in code** unless explicitly requested
- **No Chinese characters** in code
- **No abbreviations** - all words must pass spell checker
- **2-space indentation** for Python
- **Conventional commits** supported via git aliases

## Testing

### Frontend Testing
- Jest configuration in `configs/jest/`
- Test files should be co-located with components or in `__tests__` directories

### Backend Testing
- pytest configuration in root `pyproject.toml`
- Python tests in `pyPackages/app/` directory structure

## Important Notes

### DevContainer Setup
The project uses a two-stage DevContainer setup:
1. Base image built from `devImages/base/`
2. Development container with additional extensions and tools

### Environment Variables
Create `.env` file in root for API keys:
```
ANTHROPIC_API_KEY=your_api_key
OPENAI_API_KEY=your_api_key
```

### Python Environment
- Uses `uv` for Python package management
- Virtual environment should be automatically configured in `.venv/`
- Python 3.12+ required

### MongoDB Integration
- Backend includes MongoDB integration via PyMongo
- Use VS Code MongoDB extension or `mongosh` for database operations