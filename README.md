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
