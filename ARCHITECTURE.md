# Full-Stack TypeScript Monorepo - Architecture Plan

## 📋 Project Overview

This document outlines the complete architecture for a production-ready full-stack TypeScript monorepo. The stack is designed to be a **technical foundation only** - no business logic, authentication, or domain-specific features are included.

**Key Principle**: Infrastructure-first, business-agnostic, production-ready.

---

## 🏗️ Monorepo Structure

```
notes-de-frais/
├── package.json                 # Root workspace configuration
├── tsconfig.json               # Base TypeScript config
├── .eslintrc.js                # ESLint configuration
├── .prettierrc                 # Prettier configuration
├── .gitignore                  # Git ignore rules
├── README.md                   # Project documentation
│
├── backend/                    # NestJS API
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   ├── .env.example
│   ├── test/
│   │   └── jest-e2e.json
│   └── src/
│       ├── main.ts
│       ├── app.module.ts
│       ├── config/
│       │   ├── database.config.ts
│       │   └── swagger.config.ts
│       └── modules/
│           └── hello/
│               ├── hello.module.ts
│               ├── hello.controller.ts
│               ├── hello.service.ts
│               ├── hello.entity.ts
│               ├── dto/
│               │   ├── hello-response.dto.ts
│               │   └── create-hello.dto.ts
│               └── tests/
│                   ├── hello.controller.spec.ts
│                   └── hello.service.spec.ts
│
├── frontend/                   # React SPA
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   ├── .env.example
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── pages/
│       │   └── HelloPage.tsx
│       ├── components/
│       │   ├── HelloDisplay.tsx
│       │   └── __tests__/
│       │       └── HelloDisplay.test.tsx
│       ├── services/
│       │   ├── api.service.ts
│       │   └── __tests__/
│       │       └── api.service.test.ts
│       ├── hooks/
│       │   └── useHello.ts
│       ├── routes/
│       │   └── AppRouter.tsx
│       ├── styles/
│       │   └── index.css
│       └── types/
│           └── index.ts
│
└── shared/                     # Shared TypeScript types
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── index.ts
        └── hello.types.ts
```

---

## 🔧 Technology Stack

### Core Technologies

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Runtime | Node.js | 20 LTS | JavaScript runtime |
| Language | TypeScript | ^5.3.0 | Type-safe development |
| Monorepo | NPM Workspaces | Built-in | Workspace management |
| Backend Framework | NestJS | ^10.0.0 | Enterprise Node.js framework |
| Frontend Framework | React | ^18.2.0 | UI library |
| Build Tool (Frontend) | Vite | ^5.0.0 | Fast development & build |
| Database | SQLite | ^3.0.0 | Embedded SQL database |
| ORM | TypeORM | ^0.3.0 | Database abstraction |
| Styling | Tailwind CSS | ^3.4.0 | Utility-first CSS |
| Routing | React Router | ^6.20.0 | Client-side routing |

### Development Tools

| Tool | Purpose |
|------|---------|
| ESLint | Code linting |
| Prettier | Code formatting |
| Jest | Backend testing |
| Vitest | Frontend testing |
| React Testing Library | Component testing |
| Swagger/OpenAPI | API documentation |

---

## 🔙 Backend Architecture (NestJS)

### Design Principles

1. **Modular Architecture**: Each feature is a self-contained module
2. **Repository Pattern**: Database access abstracted through TypeORM repositories
3. **DTO Validation**: All inputs validated using `class-validator`
4. **Dependency Injection**: NestJS built-in DI container
5. **API Versioning**: All endpoints prefixed with `/api/v1`

### Module Structure (Hello Module)

```typescript
// hello.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([HelloEntity])],
  controllers: [HelloController],
  providers: [HelloService],
})
export class HelloModule {}
```

**Responsibilities**:
- **Controller**: HTTP layer, request/response handling
- **Service**: Business logic (minimal in this case)
- **Entity**: Database model
- **DTOs**: Data transfer objects with validation

### Database Configuration

- **Development**: SQLite with `synchronize: true` (auto-schema sync)
- **File Location**: `backend/database.sqlite`
- **ORM**: TypeORM with Repository pattern
- **Migrations**: Not required for initial setup (synchronize handles schema)

### API Endpoint Specification

```
GET /api/v1/hello
Response: 200 OK
{
  "id": 1,
  "message": "Hello from NestJS!",
  "timestamp": "2026-01-13T15:45:00.000Z"
}
```

**Requirements**:
- ✅ Real database interaction (create or read from SQLite)
- ✅ Swagger documentation
- ✅ DTO validation
- ✅ Unit tests (controller + service)
- ✅ Coverage ≥ 80%

### Swagger Configuration

- **URL**: `http://localhost:3000/api/docs`
- **Features**:
  - Auto-generated from decorators
  - Request/response schemas
  - Try-it-out functionality
  - DTO validation examples

---

## 🎨 Frontend Architecture (React)

### Design Principles

1. **Component-Based**: Reusable, testable components
2. **Service Layer**: API calls abstracted in services
3. **Custom Hooks**: Reusable stateful logic
4. **Type Safety**: Full TypeScript integration with shared types
5. **Responsive Design**: Mobile-first with Tailwind CSS

### Component Hierarchy

```
App
└── AppRouter
    └── HelloPage
        └── HelloDisplay (receives data from useHello hook)
```

### Data Flow

```
User → HelloPage → useHello() → api.service → Backend API
                      ↓
                  HelloDisplay (renders response)
```

### Service Layer

```typescript
// api.service.ts
export class ApiService {
  private baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
  
  async getHello(): Promise<HelloResponse> {
    const response = await fetch(`${this.baseURL}/hello`);
    return response.json();
  }
}
```

### Styling Strategy

- **Tailwind CSS**: Utility-first approach
- **Responsive**: Mobile-first breakpoints
- **Theme**: Minimal, professional design
- **No custom CSS**: Use Tailwind utilities only

---

## 🔁 Shared Types Package

### Purpose

Ensure type consistency between frontend and backend without code duplication.

### Structure

```typescript
// shared/src/hello.types.ts
export interface HelloResponse {
  id: number;
  message: string;
  timestamp: Date;
}

export interface CreateHelloDto {
  message: string;
}
```

### Usage

**Backend**:
```typescript
import { HelloResponse } from '@shared/hello.types';
```

**Frontend**:
```typescript
import { HelloResponse } from '@shared/hello.types';
```

### Configuration

- **Package Name**: `@shared/types`
- **TypeScript**: Compiled to `dist/`
- **Exports**: All types via `index.ts`

---

## 🧪 Testing Strategy

### Backend Testing (Jest)

**Framework**: Jest (built-in with NestJS)

**Test Types**:
1. **Unit Tests**: Services and controllers in isolation
2. **Integration Tests**: Module-level tests with database

**Coverage Requirements**:
- Overall: ≥ 80%
- Statements: ≥ 80%
- Branches: ≥ 80%
- Functions: ≥ 80%
- Lines: ≥ 80%

**Test Structure**:
```typescript
describe('HelloService', () => {
  let service: HelloService;
  let repository: Repository<HelloEntity>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        HelloService,
        { provide: getRepositoryToken(HelloEntity), useClass: Repository }
      ],
    }).compile();
    
    service = module.get<HelloService>(HelloService);
    repository = module.get<Repository<HelloEntity>>(getRepositoryToken(HelloEntity));
  });

  it('should return hello message from database', async () => {
    // Test implementation
  });
});
```

### Frontend Testing (Vitest + RTL)

**Framework**: Vitest + React Testing Library

**Test Types**:
1. **Component Tests**: Render and interaction tests
2. **Service Tests**: API service mocking
3. **Hook Tests**: Custom hook behavior

**Coverage Requirements**: Same as backend (≥ 80%)

**Test Structure**:
```typescript
describe('HelloDisplay', () => {
  it('should render hello message', () => {
    render(<HelloDisplay message="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

---

## 📦 NPM Workspaces Configuration

### Root `package.json`

```json
{
  "name": "notes-de-frais-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "backend",
    "frontend",
    "shared"
  ],
  "scripts": {
    "dev": "concurrently \"npm run dev -w backend\" \"npm run dev -w frontend\"",
    "build": "npm run build -w shared && npm run build -w backend && npm run build -w frontend",
    "test": "npm run test -w backend && npm run test -w frontend",
    "lint": "npm run lint -w backend && npm run lint -w frontend",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\""
  }
}
```

### Workspace Dependencies

**Backend** depends on:
- `@shared/types` (workspace)

**Frontend** depends on:
- `@shared/types` (workspace)

**Shared** has no dependencies (only dev dependencies)

---

## 🚀 Development Workflow

### Initial Setup

```bash
# Install all dependencies
npm install

# Start development servers (backend + frontend)
npm run dev
```

### Development Servers

- **Backend**: `http://localhost:3000`
  - API: `http://localhost:3000/api/v1`
  - Swagger: `http://localhost:3000/api/docs`
- **Frontend**: `http://localhost:5173`

### Build Process

```bash
# Build all workspaces
npm run build

# Build specific workspace
npm run build -w backend
npm run build -w frontend
npm run build -w shared
```

### Testing

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test -- --coverage

# Run specific workspace tests
npm run test -w backend
npm run test -w frontend
```

### Linting & Formatting

```bash
# Lint all code
npm run lint

# Format all code
npm run format
```

---

## 🔒 Configuration Management

### Environment Variables

**Backend** (`.env`):
```env
NODE_ENV=development
PORT=3000
DATABASE_PATH=./database.sqlite
```

**Frontend** (`.env`):
```env
VITE_API_URL=http://localhost:3000/api/v1
```

### TypeScript Configuration

**Root** (`tsconfig.json`):
- Base configuration for all workspaces
- Strict mode enabled
- Path aliases configured

**Backend** (`backend/tsconfig.json`):
- Extends root config
- Node.js target
- Decorators enabled

**Frontend** (`frontend/tsconfig.json`):
- Extends root config
- DOM types included
- JSX support

---

## ✅ Acceptance Criteria

### Functional Requirements

- [x] `npm install` completes successfully
- [x] `npm run dev` starts both frontend and backend
- [x] Swagger UI accessible at `/api/docs`
- [x] Frontend displays "Hello World" page
- [x] Frontend successfully calls backend API
- [x] Backend reads/writes to SQLite database
- [x] All tests pass (`npm run test`)
- [x] Test coverage ≥ 80% for both frontend and backend

### Code Quality Requirements

- [x] TypeScript strict mode enabled
- [x] ESLint configured and passing
- [x] Prettier configured
- [x] All code documented with comments
- [x] No hardcoded values (use environment variables)
- [x] Professional code structure
- [x] Production-ready patterns

### Prohibited Features

- ❌ No business logic
- ❌ No authentication/authorization
- ❌ No features beyond "Hello" module
- ❌ No untested code
- ❌ No unjustified hardcoding

---

## 📊 Project Metrics

### Expected File Count

- **Backend**: ~25 files
- **Frontend**: ~20 files
- **Shared**: ~5 files
- **Root**: ~10 files
- **Total**: ~60 files

### Expected Lines of Code

- **Backend**: ~800 lines
- **Frontend**: ~600 lines
- **Shared**: ~50 lines
- **Config**: ~300 lines
- **Tests**: ~600 lines
- **Total**: ~2,350 lines

---

## 🎯 Next Steps

This architecture document serves as the blueprint for implementation. The next phase will be:

1. **Code Mode**: Implement the complete stack following this architecture
2. **Testing**: Verify all acceptance criteria
3. **Documentation**: Update README with usage instructions

---

## 📝 Notes

- This is a **technical foundation** only - no business logic
- All patterns are **production-ready** and follow industry best practices
- The stack is designed to be **easily extensible** for future features
- **Type safety** is enforced throughout the entire stack
- **Testing** is a first-class citizen, not an afterthought

---

**Document Version**: 1.0  
**Last Updated**: 2026-01-13  
**Status**: Ready for Implementation
