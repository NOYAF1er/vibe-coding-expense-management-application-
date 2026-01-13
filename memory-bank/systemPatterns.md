# System Patterns

This file documents recurring patterns and standards used in the project.
It is optional, but recommended to be updated as the project evolves.
2026-01-13 16:17:22 - Log of updates made.

---

## Coding Patterns

### TypeScript Strict Mode
- All workspaces use `strict: true` in tsconfig.json
- No `any` types without explicit justification
- Explicit return types for public functions
- Null safety enforced throughout

### Naming Conventions
- **Files**: kebab-case (e.g., `hello.service.ts`)
- **Classes**: PascalCase (e.g., `HelloService`)
- **Interfaces**: PascalCase with descriptive names (e.g., `HelloResponse`)
- **Functions/Methods**: camelCase (e.g., `getHello()`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_VERSION`)

### Code Organization
- One class/interface per file
- Group related files in directories
- Index files for clean exports
- Separate concerns (controller, service, entity, DTO)

### Documentation
- JSDoc comments for all public APIs
- Inline comments for complex logic
- Type definitions serve as documentation

---

## Architectural Patterns

### Monorepo Structure
```
root/
├── backend/      # NestJS API
├── frontend/     # React SPA
├── shared/       # Shared types
└── package.json  # Workspace config
```

### Backend Patterns (NestJS)

#### Module Pattern
- Each feature is a self-contained module
- Modules declare their dependencies
- Clear module boundaries

#### Repository Pattern
- Database access abstracted through repositories
- Services use repositories, not direct database access
- TypeORM repositories injected via DI

#### DTO Pattern
- Separate DTOs for requests and responses
- Validation decorators on DTOs
- DTOs implement shared interfaces

#### Dependency Injection
- Constructor-based injection
- Interface-based dependencies
- Testable through mocking

### Frontend Patterns (React)

#### Custom Hooks Pattern
- Reusable stateful logic in hooks
- Prefix with `use` (e.g., `useHello`)
- Handle loading, error, and data states

#### Service Layer Pattern
- API calls abstracted in service classes
- Singleton instances exported
- Type-safe responses using shared types

#### Component Composition
- Small, focused components
- Props-based composition
- Separation of container and presentational components

### Shared Types Pattern
- Single source of truth for types
- Interfaces over types for extensibility
- Exported via barrel file (index.ts)

---

## Testing Patterns

### Backend Testing (Jest)

#### Unit Test Structure
- Describe blocks for organization
- beforeEach for setup
- afterEach for cleanup
- Arrange, Act, Assert pattern

#### Mocking Pattern
- Mock repositories and external dependencies
- Use Jest mock functions
- Clear mocks between tests

### Frontend Testing (Vitest + RTL)

#### Component Test Pattern
- Test user-visible behavior
- Query by accessible roles/text
- Avoid implementation details

#### Service Test Pattern
- Mock global fetch
- Test success and error cases
- Verify correct API calls

### Test Coverage Requirements
- Minimum 80% coverage for all metrics
- Focus on critical paths
- Test edge cases and error handling

---

**2026-01-13 16:52:36** - Initial system patterns documented for full-stack monorepo
