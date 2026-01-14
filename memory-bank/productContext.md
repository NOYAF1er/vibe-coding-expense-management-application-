# Product Context

This file provides a high-level overview of the project and the expected product that will be created. Initially it is based upon projectBrief.md (if provided) and all other available project-related information in the working directory. This file is intended to be updated as the project evolves, and should be used to inform all other modes of the project's goals and context.
2026-01-13 16:16:59 - Log of updates made will be appended as footnotes to the end of this file.

## Project Goal

Create a production-ready full-stack TypeScript monorepo that serves as a **technical foundation** for future applications. This is an infrastructure-only project with no business logic, designed to demonstrate best practices and provide a solid starting point for enterprise-grade development.

## Key Features

### Technical Infrastructure
- **Monorepo Architecture**: NPM workspaces managing backend, frontend, and shared packages
- **Type Safety**: Full TypeScript strict mode across all workspaces
- **API Documentation**: Fully functional Swagger/OpenAPI documentation
- **Database Integration**: SQLite with TypeORM demonstrating real database operations
- **Testing**: Comprehensive test coverage (≥80%) for both frontend and backend
- **Code Quality**: ESLint and Prettier configured for consistent code standards
- **Development Workflow**: Unified scripts for development, testing, and building

### Backend (NestJS)
- RESTful API with versioning (`/api/v1`)
- Modular architecture following NestJS best practices
- TypeORM with Repository pattern
- DTO validation using class-validator
- Swagger documentation auto-generated from decorators
- Jest testing with high coverage

### Frontend (React)
- Modern React 18 with TypeScript
- Vite for fast development and optimized builds
- Tailwind CSS for responsive, utility-first styling
- React Router for client-side routing
- Custom hooks for reusable logic
- Vitest and React Testing Library for component testing

### Shared Types
- Centralized TypeScript type definitions
- Shared between frontend and backend
- Ensures type consistency across the stack

## Overall Architecture

### Monorepo Structure
```
notes-de-frais/
├── backend/          # NestJS API (Node.js 20, TypeScript, SQLite)
├── frontend/         # React SPA (Vite, Tailwind CSS)
├── shared/           # Shared TypeScript types
└── package.json      # Root workspace configuration
```

### Technology Stack
- **Runtime**: Node.js 20 LTS
- **Language**: TypeScript 5.3+ (strict mode)
- **Backend Framework**: NestJS 10
- **Frontend Framework**: React 18
- **Build Tool**: Vite 5
- **Database**: SQLite 3
- **ORM**: TypeORM 0.3
- **Styling**: Tailwind CSS 3
- **Testing**: Jest (backend), Vitest (frontend)
- **API Docs**: Swagger/OpenAPI

### Design Principles
1. **Infrastructure-First**: No business logic, only technical foundation
2. **Type Safety**: Strict TypeScript throughout
3. **Testability**: All code must be tested (≥80% coverage)
4. **Modularity**: Clear separation of concerns
5. **Production-Ready**: Enterprise-grade patterns and practices
6. **Documentation**: Comprehensive inline and API documentation
7. **Maintainability**: Clean, readable, well-structured code

### Demonstration Features
The "Hello" module demonstrates:
- Real database interaction (SQLite via TypeORM)
- API endpoint with Swagger documentation
- DTO validation
- Frontend-backend communication
- Shared type usage
- Comprehensive testing
- Responsive UI design

---

**2026-01-13 16:49:30** - Initial project context created for full-stack TypeScript monorepo initialization

**2026-01-14 09:49:00** - Expense Management System context added

## Expense Management Application

### Business Domain
The application manages employee expense reports with the following workflow:
1. Employees create expense reports and add individual expenses
2. Expenses can have attachments (receipts, invoices)
3. Managers review and approve/reject reports
4. Approved reports are marked as paid

### Data Model
**Four Core Entities**:
1. **User** - Application users (employees, managers, admins)
2. **ExpenseReport** - Container for multiple expenses
3. **Expense** - Individual expense items
4. **Attachment** - Receipt/proof files

### Key Features
- User management with role-based access (EMPLOYEE, MANAGER, ADMIN)
- Expense report creation and management
- Individual expense tracking with categories
- Attachment support for receipts
- Report workflow (Draft → Submitted → Under Review → Approved/Rejected → Paid)
- Soft delete for audit trail
- Comprehensive validation and error handling

### Technical Specifications
- **Backend**: NestJS + TypeORM + SQLite
- **Entities**: 4 entities with proper relationships
- **API**: RESTful with Swagger documentation
- **Testing**: ≥80% coverage with Jest
- **Security**: Password hashing with bcrypt (JWT deferred to Phase 2)
- **Storage**: Local filesystem for attachments (cloud migration path available)
