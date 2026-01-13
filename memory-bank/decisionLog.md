# Decision Log

This file records architectural and implementation decisions using a list format.
2026-01-13 16:17:17 - Log of updates made.

---

## [2026-01-13 16:49:30] Monorepo Architecture with NPM Workspaces

**Decision**: Use NPM workspaces for monorepo management instead of alternatives like Lerna, Nx, or Turborepo.

**Rationale**:
- Built-in to NPM (no additional dependencies)
- Simpler configuration for small-to-medium projects
- Sufficient for managing 3 packages (backend, frontend, shared)
- Native support in Node.js ecosystem
- Easier onboarding for developers familiar with NPM

**Implementation Details**:
- Root `package.json` defines workspaces array
- Each workspace has its own `package.json`
- Shared dependencies hoisted to root
- Workspace protocol (`*`) for internal dependencies

---

## [2026-01-13 16:49:30] NestJS for Backend Framework

**Decision**: Use NestJS as the backend framework instead of Express, Fastify, or other Node.js frameworks.

**Rationale**:
- Enterprise-grade architecture out of the box
- Built-in dependency injection
- Excellent TypeScript support with decorators
- Modular architecture promotes scalability
- Built-in Swagger integration
- Strong community and ecosystem
- Production-ready patterns and best practices

**Implementation Details**:
- NestJS 10.x with TypeScript strict mode
- Module-based architecture
- Repository pattern with TypeORM
- Global validation pipe with class-validator
- Swagger auto-documentation

---

## [2026-01-13 16:49:30] SQLite for Database

**Decision**: Use SQLite as the database instead of PostgreSQL, MySQL, or MongoDB.

**Rationale**:
- Zero configuration required
- No external database server needed
- Perfect for development and demonstration
- File-based storage (easy to reset/backup)
- Sufficient for technical foundation project
- Easy migration to other SQL databases later (via TypeORM)
- Reduces infrastructure complexity

**Implementation Details**:
- SQLite 3.x with TypeORM
- `synchronize: true` in development (auto-schema sync)
- Database file: `backend/database.sqlite`
- Repository pattern for data access

---

## [2026-01-13 16:49:30] TypeORM as ORM

**Decision**: Use TypeORM instead of Prisma, Sequelize, or other ORMs.

**Rationale**:
- Native NestJS integration
- Decorator-based entity definitions
- Repository pattern support
- Active Record and Data Mapper patterns
- Excellent TypeScript support
- Migration support for production
- Works with multiple database types

**Implementation Details**:
- TypeORM 0.3.x
- Entity decorators for schema definition
- Repository injection via `@InjectRepository`
- Auto-synchronization in development

---

## [2026-01-13 16:49:30] React with Vite for Frontend

**Decision**: Use React with Vite instead of Next.js, Create React App, or other frameworks.

**Rationale**:
- Vite provides extremely fast development experience
- No server-side rendering needed (SPA is sufficient)
- Simpler architecture than Next.js for this use case
- Better performance than Create React App
- Modern build tooling with ESM
- Excellent TypeScript support
- Smaller bundle sizes

**Implementation Details**:
- React 18.x with TypeScript
- Vite 5.x for build and dev server
- React Router 6 for client-side routing
- Vitest for testing (same ecosystem as Vite)

---

## [2026-01-13 16:49:30] Tailwind CSS for Styling

**Decision**: Use Tailwind CSS instead of CSS Modules, Styled Components, or traditional CSS.

**Rationale**:
- Utility-first approach promotes consistency
- No CSS-in-JS runtime overhead
- Excellent responsive design utilities
- Smaller bundle sizes with purging
- Faster development with pre-built utilities
- Easy to maintain and refactor
- Industry standard for modern web apps

**Implementation Details**:
- Tailwind CSS 3.x
- PostCSS for processing
- Autoprefixer for browser compatibility
- Purge unused styles in production

---

## [2026-01-13 16:49:30] Shared Types Package

**Decision**: Create a dedicated `shared` package for TypeScript types instead of duplicating types or using a monolithic approach.

**Rationale**:
- Single source of truth for types
- Prevents type drift between frontend and backend
- Enforces API contract consistency
- Easier to maintain and update
- Supports type-safe development across stack
- Can be extended to include utilities and constants

**Implementation Details**:
- Separate workspace: `shared/`
- Exports all types via `index.ts`
- Imported using workspace protocol
- Compiled to `dist/` for consumption

---

## [2026-01-13 16:49:30] Testing Strategy: Jest + Vitest

**Decision**: Use Jest for backend testing and Vitest for frontend testing instead of a single testing framework.

**Rationale**:
- Jest is the standard for NestJS (built-in support)
- Vitest is optimized for Vite projects (faster, better DX)
- Both have similar APIs (easy to learn)
- Each optimized for their respective environments
- Better performance than using Jest for both
- Native ESM support in Vitest

**Implementation Details**:
- Backend: Jest with ts-jest
- Frontend: Vitest with jsdom
- React Testing Library for component tests
- Coverage threshold: ≥80% for all metrics
- Mocking strategies for services and repositories

---

## [2026-01-13 16:49:30] API Versioning Strategy

**Decision**: Implement API versioning with `/api/v1` prefix from the start.

**Rationale**:
- Enables future API evolution without breaking changes
- Industry best practice
- Clear separation from other routes
- Easier to maintain multiple versions if needed
- Professional API design

**Implementation Details**:
- Global prefix: `/api/v1`
- Configured in `main.ts` via `app.setGlobalPrefix()`
- Swagger documentation reflects versioned endpoints

---

## [2026-01-13 16:49:30] No Authentication/Authorization

**Decision**: Explicitly exclude authentication and authorization from this project.

**Rationale**:
- Project scope is technical foundation only
- Authentication adds complexity not needed for demonstration
- Easier to add later when business requirements are known
- Keeps focus on infrastructure and architecture
- Reduces initial setup time

**Implementation Details**:
- No auth guards or middleware
- No user management
- No JWT or session handling
- Can be added as a module later

---

## [2026-01-13 16:49:30] Strict TypeScript Configuration

**Decision**: Enable TypeScript strict mode across all workspaces.

**Rationale**:
- Catches more errors at compile time
- Enforces better code quality
- Prevents common runtime errors
- Industry best practice for production code
- Better IDE support and autocomplete
- Easier refactoring

**Implementation Details**:
- `strict: true` in all `tsconfig.json` files
- Additional strict flags enabled
- No `any` types without justification
- Explicit return types encouraged

---

**2026-01-13 16:50:51** - Initial architectural decisions documented
