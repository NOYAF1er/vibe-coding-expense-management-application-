# Implementation Guide - Part 2 (Frontend Continued)

This is a continuation of [`IMPLEMENTATION_GUIDE.md`](IMPLEMENTATION_GUIDE.md).

---

## Phase 4: Frontend Implementation (Continued)

### 4.8 Custom Hook (Continued)

**File**: `frontend/src/hooks/useHello.ts`

```typescript
import { useState, useEffect } from 'react';
import { HelloResponse } from '@shared/hello.types';
import { apiService } from '../services/api.service';

/**
 * Custom hook for fetching hello data
 */
export function useHello() {
  const [data, setData] = useState<HelloResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiService.getHello();
        
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
}
```

### 4.9 Components

**File**: `frontend/src/components/HelloDisplay.tsx`

```typescript
import { HelloResponse } from '@shared/hello.types';

interface HelloDisplayProps {
  data: HelloResponse;
}

/**
 * Component to display hello message
 */
export function HelloDisplay({ data }: HelloDisplayProps) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {data.message}
        </h1>
        
        <div className="space-y-2 text-gray-600">
          <p className="text-sm">
            <span className="font-semibold">ID:</span> {data.id}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Timestamp:</span>{' '}
            {new Date(data.timestamp).toLocaleString()}
          </p>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
          <span>Connected to backend</span>
        </div>
      </div>
    </div>
  );
}
```

**File**: `frontend/src/components/__tests__/HelloDisplay.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HelloDisplay } from '../HelloDisplay';
import { HelloResponse } from '@shared/hello.types';

describe('HelloDisplay', () => {
  const mockData: HelloResponse = {
    id: 1,
    message: 'Hello from NestJS!',
    timestamp: new Date('2026-01-13T15:45:00.000Z'),
  };

  it('should render hello message', () => {
    render(<HelloDisplay data={mockData} />);
    expect(screen.getByText('Hello from NestJS!')).toBeInTheDocument();
  });

  it('should display ID', () => {
    render(<HelloDisplay data={mockData} />);
    expect(screen.getByText(/ID:/)).toBeInTheDocument();
    expect(screen.getByText(/1/)).toBeInTheDocument();
  });

  it('should display timestamp', () => {
    render(<HelloDisplay data={mockData} />);
    expect(screen.getByText(/Timestamp:/)).toBeInTheDocument();
  });

  it('should show connected status', () => {
    render(<HelloDisplay data={mockData} />);
    expect(screen.getByText('Connected to backend')).toBeInTheDocument();
  });
});
```

### 4.10 Pages

**File**: `frontend/src/pages/HelloPage.tsx`

```typescript
import { useHello } from '../hooks/useHello';
import { HelloDisplay } from '../components/HelloDisplay';

/**
 * Hello page component
 */
export function HelloPage() {
  const { data, loading, error } = useHello();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600">{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <HelloDisplay data={data} />
    </div>
  );
}
```

### 4.11 Router

**File**: `frontend/src/routes/AppRouter.tsx`

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelloPage } from '../pages/HelloPage';

/**
 * Application router configuration
 */
export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HelloPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 4.12 Frontend Tests

**File**: `frontend/src/services/__tests__/api.service.test.ts`

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ApiService } from '../api.service';

describe('ApiService', () => {
  let apiService: ApiService;

  beforeEach(() => {
    apiService = new ApiService();
    global.fetch = vi.fn();
  });

  describe('getHello', () => {
    it('should fetch hello data successfully', async () => {
      const mockResponse = {
        id: 1,
        message: 'Hello from NestJS!',
        timestamp: '2026-01-13T15:45:00.000Z',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiService.getHello();

      expect(result).toEqual({
        id: 1,
        message: 'Hello from NestJS!',
        timestamp: new Date('2026-01-13T15:45:00.000Z'),
      });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/hello')
      );
    });

    it('should throw error on failed request', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(apiService.getHello()).rejects.toThrow('HTTP error! status: 500');
    });

    it('should handle network errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      await expect(apiService.getHello()).rejects.toThrow('Network error');
    });
  });
});
```

**File**: `frontend/src/test/setup.ts`

```typescript
import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});
```

**File**: `frontend/.env.example`

```env
VITE_API_URL=http://localhost:3000/api/v1
```

---

## Phase 5: Testing & Validation

### 5.1 Validation Checklist

After implementation, verify the following:

#### Installation & Setup
- [ ] `npm install` completes without errors
- [ ] All workspaces are properly linked
- [ ] TypeScript compiles without errors
- [ ] ESLint passes without errors

#### Backend Validation
- [ ] `npm run dev -w backend` starts successfully
- [ ] Backend runs on `http://localhost:3000`
- [ ] Swagger UI accessible at `http://localhost:3000/api/docs`
- [ ] GET `/api/v1/hello` returns valid response
- [ ] SQLite database file is created
- [ ] Database contains hello entity
- [ ] All backend tests pass
- [ ] Backend test coverage ≥ 80%

#### Frontend Validation
- [ ] `npm run dev -w frontend` starts successfully
- [ ] Frontend runs on `http://localhost:5173`
- [ ] Page loads without errors
- [ ] "Hello World" message displays
- [ ] API call to backend succeeds
- [ ] Loading state displays correctly
- [ ] Error state handles failures
- [ ] Responsive design works on mobile
- [ ] All frontend tests pass
- [ ] Frontend test coverage ≥ 80%

#### Integration Validation
- [ ] `npm run dev` starts both servers
- [ ] Frontend successfully communicates with backend
- [ ] CORS is properly configured
- [ ] Shared types work in both frontend and backend
- [ ] No TypeScript errors in any workspace

#### Code Quality
- [ ] All code is properly commented
- [ ] No hardcoded values (uses env variables)
- [ ] Follows professional coding standards
- [ ] No console errors in browser
- [ ] No linting errors

### 5.2 Testing Commands

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run backend tests only
npm run test -w backend

# Run frontend tests only
npm run test -w frontend

# Watch mode for development
npm run test:watch -w backend
npm run test:watch -w frontend
```

### 5.3 Expected Test Output

**Backend Coverage**:
```
File                  | % Stmts | % Branch | % Funcs | % Lines |
----------------------|---------|----------|---------|---------|
All files             |   85.00 |    80.00 |   85.00 |   85.00 |
 hello.controller.ts  |   100   |    100   |   100   |   100   |
 hello.service.ts     |   90.00 |    80.00 |   90.00 |   90.00 |
```

**Frontend Coverage**:
```
File                  | % Stmts | % Branch | % Funcs | % Lines |
----------------------|---------|----------|---------|---------|
All files             |   85.00 |    80.00 |   85.00 |   85.00 |
 HelloDisplay.tsx     |   100   |    100   |   100   |   100   |
 api.service.ts       |   90.00 |    80.00 |   90.00 |   90.00 |
```

---

## 📚 Additional Documentation Files

### README.md

**File**: `README.md`

```markdown
# Notes de Frais - Full-Stack TypeScript Monorepo

Production-ready full-stack application built with NestJS, React, and TypeScript.

## 🏗️ Architecture

This is a monorepo containing:
- **Backend**: NestJS API with TypeORM and SQLite
- **Frontend**: React SPA with Vite and Tailwind CSS
- **Shared**: Common TypeScript types

See [`ARCHITECTURE.md`](ARCHITECTURE.md) for detailed architecture documentation.

## 🚀 Quick Start

### Prerequisites

- Node.js 20 LTS or higher
- npm 10 or higher

### Installation

```bash
# Install all dependencies
npm install
```

### Development

```bash
# Start both frontend and backend
npm run dev

# Start backend only
npm run dev -w backend

# Start frontend only
npm run dev -w frontend
```

### Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api/v1
- **Swagger Docs**: http://localhost:3000/api/docs

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run specific workspace tests
npm run test -w backend
npm run test -w frontend
```

## 🏗️ Build

```bash
# Build all workspaces
npm run build

# Build specific workspace
npm run build -w backend
npm run build -w frontend
```

## 📁 Project Structure

```
/
├── backend/          # NestJS API
├── frontend/         # React SPA
├── shared/           # Shared TypeScript types
└── package.json      # Root workspace configuration
```

## 🛠️ Technology Stack

### Backend
- NestJS 10
- TypeORM
- SQLite
- Swagger/OpenAPI
- Jest

### Frontend
- React 18
- Vite 5
- Tailwind CSS 3
- React Router 6
- Vitest

### Shared
- TypeScript 5 (strict mode)
- ESLint
- Prettier

## 📖 Documentation

- [Architecture](ARCHITECTURE.md) - Detailed architecture documentation
- [Implementation Guide](IMPLEMENTATION_GUIDE.md) - Step-by-step implementation guide

## ✅ Features

- ✅ Full TypeScript support with strict mode
- ✅ Monorepo with NPM workspaces
- ✅ API documentation with Swagger
- ✅ Comprehensive testing (≥80% coverage)
- ✅ Code quality tools (ESLint, Prettier)
- ✅ Production-ready architecture
- ✅ Responsive design

## 🔒 Environment Variables

### Backend

Create `backend/.env`:
```env
NODE_ENV=development
PORT=3000
DATABASE_PATH=./database.sqlite
FRONTEND_URL=http://localhost:5173
```

### Frontend

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:3000/api/v1
```

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development servers |
| `npm run build` | Build all workspaces |
| `npm run test` | Run all tests |
| `npm run lint` | Lint all code |
| `npm run format` | Format all code |

## 🤝 Contributing

This is a technical foundation project. No business logic should be added.

## 📄 License

Private - Internal Use Only
```

---

## 🎯 Implementation Order

Follow this exact order for implementation:

1. **Root Configuration** (Phase 1)
   - Create root `package.json`
   - Create `tsconfig.json`
   - Create `.eslintrc.js`
   - Create `.prettierrc`
   - Create `.gitignore`

2. **Shared Package** (Phase 2)
   - Create `shared/package.json`
   - Create `shared/tsconfig.json`
   - Create type definitions
   - Build shared package

3. **Backend** (Phase 3)
   - Create `backend/package.json`
   - Create NestJS configuration files
   - Implement main.ts and app.module.ts
   - Implement Hello module (entity, service, controller, DTOs)
   - Create tests
   - Create `.env.example`

4. **Frontend** (Phase 4)
   - Create `frontend/package.json`
   - Create Vite and Tailwind configuration
   - Implement main.tsx and App.tsx
   - Implement API service
   - Implement custom hook
   - Implement components and pages
   - Implement router
   - Create tests
   - Create `.env.example`

5. **Documentation** (Phase 5)
   - Create `README.md`
   - Verify all acceptance criteria
   - Run all tests
   - Verify coverage

---

## 🔍 Troubleshooting

### Common Issues

**Issue**: `Cannot find module '@shared/hello.types'`
- **Solution**: Run `npm run build -w shared` first

**Issue**: Backend tests fail with database errors
- **Solution**: Ensure SQLite is properly installed

**Issue**: Frontend cannot connect to backend
- **Solution**: Check CORS configuration and environment variables

**Issue**: Coverage below 80%
- **Solution**: Add more test cases for uncovered branches

---

## ✨ Final Verification

Before considering the implementation complete, verify:

1. ✅ All files created as specified
2. ✅ `npm install` works without errors
3. ✅ `npm run dev` starts both servers
4. ✅ Frontend displays hello message from backend
5. ✅ Swagger documentation is accessible
6. ✅ All tests pass with ≥80% coverage
7. ✅ No linting errors
8. ✅ Code is well-documented
9. ✅ No hardcoded values
10. ✅ Production-ready code quality

---

**Document Version**: 1.0  
**Last Updated**: 2026-01-13  
**Status**: Ready for Implementation
