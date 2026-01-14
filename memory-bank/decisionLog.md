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

---

## [2026-01-14 09:48:00] Expense Management System - Data Architecture

### Decision 1: Single Status System (Report-Level Only)

**Decision**: Remove status field from individual Expense entities, maintain only on ExpenseReport

**Rationale**:
- Prevents conflicting states between report and individual expenses
- Simplifies workflow and business logic
- Report-level approval is standard practice in expense management
- Individual expense validation happens before submission
- Reduces complexity in status management

**Implementation Details**:
- ExpenseReport status: `DRAFT`, `SUBMITTED`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`, `PAID`
- Expense entity: No status field (inherits state from parent report)
- Validation ensures expenses cannot be modified after report submission

---

### Decision 2: Password Hashing with bcrypt (No JWT Yet)

**Decision**: Implement password hashing with bcrypt, defer JWT authentication to Phase 2

**Rationale**:
- Focus on core CRUD functionality first
- Password field required for future authentication
- JWT implementation adds complexity (guards, strategies, tokens)
- Simpler testing without authentication middleware
- Allows incremental development approach

**Implementation Details**:
- User entity has `password` field (hashed with bcrypt)
- Service method uses bcrypt.hash() with salt rounds of 10
- No authentication guards or JWT tokens in MVP
- Password excluded from API responses using `@Exclude()` decorator
- ClassSerializerInterceptor applied globally

---

### Decision 3: Local Filesystem Storage for Attachments

**Decision**: Store attachment files in local `/uploads` directory

**Rationale**:
- Simpler for development and testing
- No external dependencies (AWS S3, Google Cloud Storage)
- Easy to migrate to cloud storage later
- Sufficient for MVP and proof of concept
- Reduces infrastructure complexity

**Implementation Details**:
- Files stored in: `/uploads/attachments/{expenseId}/{filename}`
- Database stores metadata: `fileName`, `fileUrl`, `mimeType`, `fileSize`
- Future migration path to cloud storage is straightforward
- File upload endpoint to be implemented in Phase 2

---

### Decision 4: Cascade Delete Strategy

**Decision**: Enable cascade deletes for parent-child relationships

**Rationale**:
- Maintains referential integrity automatically
- Prevents orphaned records in database
- Standard practice for owned relationships
- Simplifies deletion logic in services
- TypeORM handles cascade operations efficiently

**Implementation Details**:
- User -> ExpenseReport: `cascade: ['remove']` (soft delete)
- ExpenseReport -> Expense: `cascade: true, onDelete: 'CASCADE'`
- Expense -> Attachment: `cascade: true, onDelete: 'CASCADE'`

---

### Decision 5: Soft Delete for User and ExpenseReport

**Decision**: Use soft delete for User and ExpenseReport entities, hard delete for Expense and Attachment

**Rationale**:
- Preserves audit trail for reports and users
- Complies with data retention policies
- Allows recovery of accidentally deleted data
- Expenses and Attachments are children, follow parent lifecycle
- Reduces database bloat for child entities

**Implementation Details**:
- Add `@DeleteDateColumn()` to User and ExpenseReport
- Use `softRemove()` method in services
- Regular `remove()` for Expense and Attachment
- Soft-deleted records excluded from queries by default

---

### Decision 6: Single Currency (EUR) with Future Expansion

**Decision**: Support only EUR currency for MVP, add currency field for future multi-currency support

**Rationale**:
- Simplifies calculations and validation
- Avoids exchange rate complexity
- Easy to extend later with currency conversion
- Meets current business requirements
- Field structure supports future expansion

**Implementation Details**:
- Add `currency` field with default 'EUR' (ISO 4217 code)
- All amounts in same currency
- Future: Add currency conversion service
- Future: Support multiple currencies per report

---

### Decision 7: Explicit Foreign Key Columns

**Decision**: Add explicit foreign key columns alongside TypeORM relations

**Rationale**:
- Improves query performance
- Makes relationships explicit in code
- Easier to write raw SQL queries if needed
- Better database schema visibility
- Follows TypeORM best practices

**Implementation Details**:
```typescript
@Column()
userId: string;

@ManyToOne(() => User)
@JoinColumn({ name: 'userId' })
user: User;
```

---

### Decision 8: Decimal Precision for Money Fields

**Decision**: Use `decimal(10, 2)` for all monetary amounts

**Rationale**:
- Prevents floating-point precision errors
- Standard for financial applications
- Supports amounts up to 99,999,999.99
- Two decimal places for cents/centimes
- Database-level precision guarantee

**Implementation Details**:
```typescript
@Column({ type: 'decimal', precision: 10, scale: 2 })
amount: number;
```

---

### Decision 9: UUID Primary Keys

**Decision**: Use UUID (v4) for all entity primary keys

**Rationale**:
- Globally unique identifiers
- Better for distributed systems
- Prevents ID enumeration attacks
- No auto-increment collisions
- Industry standard for modern applications

**Implementation Details**:
```typescript
@PrimaryGeneratedColumn('uuid')
id: string;
```

---

### Decision 10: Comprehensive Testing Strategy

**Decision**: Implement unit tests for all layers with ≥80% coverage target

**Rationale**:
- Ensures code quality and reliability
- Catches bugs early in development
- Facilitates refactoring and maintenance
- Documents expected behavior
- Industry best practice

**Implementation Details**:
- Entity tests: Validate structure
- DTO tests: Validate validation rules with class-validator
- Service tests: Unit tests with mocked repositories
- Controller tests: Integration tests with mocked services
- Jest for testing framework
- Coverage reports with `npm run test:coverage`

---

### Decision 11: Four-Entity Data Model

**Decision**: Implement exactly 4 entities: User, ExpenseReport, Expense, Attachment

**Rationale**:
- Clear hierarchy and relationships
- Matches business domain model
- Proper separation of concerns
- Scalable architecture
- Standard expense management pattern

**Implementation Details**:
- User (1) -> ExpenseReport (N)
- ExpenseReport (1) -> Expense (N)
- Expense (1) -> Attachment (N)
- All entities extend BaseEntity with id, createdAt, updatedAt

---

### Decision 12: Fixed Category Enum (No Category Entity)

**Decision**: Implement expense categories as enum, not as separate entity

**Rationale**:
- Categories are fixed and predefined
- No need for dynamic category management
- Simpler data model
- Better type safety
- Prevents invalid categories

**Implementation Details**:
```typescript
enum ExpenseCategory {
  TRAVEL = 'TRAVEL',
  MEAL = 'MEAL',
  HOTEL = 'HOTEL',
  TRANSPORT = 'TRANSPORT',
  OFFICE_SUPPLIES = 'OFFICE_SUPPLIES',
  OTHER = 'OTHER'
}
```

---

**2026-01-14 09:48:00** - Expense management system architectural decisions documented
