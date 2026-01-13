# Implementation Guide - Full-Stack TypeScript Monorepo

This guide provides step-by-step instructions for implementing the architecture defined in [`ARCHITECTURE.md`](ARCHITECTURE.md).

---

## 📋 Implementation Phases

### Phase 1: Monorepo Foundation
### Phase 2: Shared Types Package
### Phase 3: Backend Implementation
### Phase 4: Frontend Implementation
### Phase 5: Testing & Validation

---

## Phase 1: Monorepo Foundation

### 1.1 Root Package Configuration

**File**: `package.json`

```json
{
  "name": "notes-de-frais-monorepo",
  "version": "1.0.0",
  "private": true,
  "description": "Production-ready full-stack TypeScript monorepo",
  "workspaces": [
    "backend",
    "frontend",
    "shared"
  ],
  "scripts": {
    "dev": "concurrently \"npm run dev -w backend\" \"npm run dev -w frontend\"",
    "build": "npm run build -w shared && npm run build -w backend && npm run build -w frontend",
    "test": "npm run test -w backend && npm run test -w frontend",
    "test:coverage": "npm run test:coverage -w backend && npm run test:coverage -w frontend",
    "lint": "npm run lint -w backend && npm run lint -w frontend",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,md}\""
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^6.15.0",
    "@typescript-eslint/parser": "^6.15.0",
    "concurrently": "^8.2.2",
    "eslint": "^8.56.0",
    "prettier": "^3.1.1",
    "typescript": "^5.3.3"
  },
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=10.0.0"
  }
}
```

### 1.2 TypeScript Base Configuration

**File**: `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "moduleResolution": "node",
    "baseUrl": ".",
    "paths": {
      "@shared/*": ["shared/src/*"]
    }
  }
}
```

### 1.3 ESLint Configuration

**File**: `.eslintrc.js`

```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    node: true,
    es2022: true,
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
  ignorePatterns: ['dist', 'node_modules', 'coverage'],
};
```

### 1.4 Prettier Configuration

**File**: `.prettierrc`

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always"
}
```

### 1.5 Git Ignore

**File**: `.gitignore`

```
# Dependencies
node_modules/
package-lock.json

# Build outputs
dist/
build/
*.tsbuildinfo

# Environment files
.env
.env.local
.env.*.local

# Database
*.sqlite
*.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Testing
coverage/
.nyc_output/

# Logs
logs/
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db
```

---

## Phase 2: Shared Types Package

### 2.1 Package Configuration

**File**: `shared/package.json`

```json
{
  "name": "@shared/types",
  "version": "1.0.0",
  "private": true,
  "description": "Shared TypeScript types for monorepo",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "watch": "tsc --watch",
    "clean": "rm -rf dist"
  },
  "devDependencies": {
    "typescript": "^5.3.3"
  }
}
```

### 2.2 TypeScript Configuration

**File**: `shared/tsconfig.json`

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "composite": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 2.3 Type Definitions

**File**: `shared/src/hello.types.ts`

```typescript
/**
 * Response type for Hello endpoint
 */
export interface HelloResponse {
  /** Unique identifier */
  id: number;
  
  /** Hello message content */
  message: string;
  
  /** Timestamp when the message was created */
  timestamp: Date;
}

/**
 * DTO for creating a Hello entity
 */
export interface CreateHelloDto {
  /** Message content */
  message: string;
}
```

**File**: `shared/src/index.ts`

```typescript
export * from './hello.types';
```

---

## Phase 3: Backend Implementation

### 3.1 Package Configuration

**File**: `backend/package.json`

```json
{
  "name": "backend",
  "version": "1.0.0",
  "private": true,
  "description": "NestJS backend API",
  "scripts": {
    "build": "nest build",
    "dev": "nest start --watch",
    "start": "nest start",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,test}/**/*.ts\"",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "dependencies": {
    "@nestjs/common": "^10.3.0",
    "@nestjs/core": "^10.3.0",
    "@nestjs/platform-express": "^10.3.0",
    "@nestjs/swagger": "^7.1.17",
    "@nestjs/typeorm": "^10.0.1",
    "@shared/types": "*",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "reflect-metadata": "^0.1.14",
    "rxjs": "^7.8.1",
    "sqlite3": "^5.1.6",
    "typeorm": "^0.3.19"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.2.1",
    "@nestjs/schematics": "^10.0.3",
    "@nestjs/testing": "^10.3.0",
    "@types/express": "^4.17.21",
    "@types/jest": "^29.5.11",
    "@types/node": "^20.10.6",
    "@types/supertest": "^6.0.2",
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.1",
    "ts-loader": "^9.5.1",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.3.3"
  }
}
```

### 3.2 NestJS Configuration

**File**: `backend/nest-cli.json`

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true,
    "webpack": false
  }
}
```

**File**: `backend/tsconfig.json`

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": "./",
    "paths": {
      "@shared/*": ["../shared/src/*"]
    },
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "allowSyntheticDefaultImports": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "test"]
}
```

### 3.3 Main Application Entry

**File**: `backend/src/main.ts`

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * Bootstrap the NestJS application
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend communication
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  // Global API prefix
  app.setGlobalPrefix('api/v1');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Notes de Frais API')
    .setDescription('Production-ready API documentation')
    .setVersion('1.0')
    .addTag('hello')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Backend running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
```

### 3.4 App Module

**File**: `backend/src/app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelloModule } from './modules/hello/hello.module';

/**
 * Root application module
 */
@Module({
  imports: [
    // TypeORM configuration for SQLite
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_PATH || './database.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production', // Auto-sync in development
      logging: process.env.NODE_ENV === 'development',
    }),
    HelloModule,
  ],
})
export class AppModule {}
```

### 3.5 Hello Module Implementation

**File**: `backend/src/modules/hello/hello.entity.ts`

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

/**
 * Hello entity for database persistence
 */
@Entity('hello')
export class HelloEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  message: string;

  @CreateDateColumn()
  timestamp: Date;
}
```

**File**: `backend/src/modules/hello/dto/hello-response.dto.ts`

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { HelloResponse } from '@shared/hello.types';

/**
 * Response DTO for Hello endpoint
 */
export class HelloResponseDto implements HelloResponse {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  id: number;

  @ApiProperty({ example: 'Hello from NestJS!', description: 'Hello message' })
  message: string;

  @ApiProperty({ example: '2026-01-13T15:45:00.000Z', description: 'Creation timestamp' })
  timestamp: Date;
}
```

**File**: `backend/src/modules/hello/dto/create-hello.dto.ts`

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { CreateHelloDto as ICreateHelloDto } from '@shared/hello.types';

/**
 * DTO for creating a Hello entity
 */
export class CreateHelloDto implements ICreateHelloDto {
  @ApiProperty({
    example: 'Hello from NestJS!',
    description: 'Message content',
    minLength: 1,
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(500)
  message: string;
}
```

**File**: `backend/src/modules/hello/hello.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HelloEntity } from './hello.entity';
import { HelloResponseDto } from './dto/hello-response.dto';

/**
 * Service handling Hello business logic
 */
@Injectable()
export class HelloService {
  constructor(
    @InjectRepository(HelloEntity)
    private readonly helloRepository: Repository<HelloEntity>,
  ) {}

  /**
   * Get or create a hello message from the database
   * This demonstrates real database interaction
   */
  async getHello(): Promise<HelloResponseDto> {
    // Try to find existing hello message
    let hello = await this.helloRepository.findOne({
      where: {},
      order: { id: 'DESC' },
    });

    // If none exists, create one
    if (!hello) {
      hello = this.helloRepository.create({
        message: 'Hello from NestJS!',
      });
      hello = await this.helloRepository.save(hello);
    }

    return {
      id: hello.id,
      message: hello.message,
      timestamp: hello.timestamp,
    };
  }
}
```

**File**: `backend/src/modules/hello/hello.controller.ts`

```typescript
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HelloService } from './hello.service';
import { HelloResponseDto } from './dto/hello-response.dto';

/**
 * Controller handling Hello endpoints
 */
@ApiTags('hello')
@Controller('hello')
export class HelloController {
  constructor(private readonly helloService: HelloService) {}

  /**
   * Get hello message from database
   */
  @Get()
  @ApiOperation({ summary: 'Get hello message' })
  @ApiResponse({
    status: 200,
    description: 'Hello message retrieved successfully',
    type: HelloResponseDto,
  })
  async getHello(): Promise<HelloResponseDto> {
    return this.helloService.getHello();
  }
}
```

**File**: `backend/src/modules/hello/hello.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelloController } from './hello.controller';
import { HelloService } from './hello.service';
import { HelloEntity } from './hello.entity';

/**
 * Hello feature module
 */
@Module({
  imports: [TypeOrmModule.forFeature([HelloEntity])],
  controllers: [HelloController],
  providers: [HelloService],
})
export class HelloModule {}
```

### 3.6 Backend Tests

**File**: `backend/src/modules/hello/tests/hello.service.spec.ts`

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HelloService } from '../hello.service';
import { HelloEntity } from '../hello.entity';

describe('HelloService', () => {
  let service: HelloService;
  let repository: Repository<HelloEntity>;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HelloService,
        {
          provide: getRepositoryToken(HelloEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<HelloService>(HelloService);
    repository = module.get<Repository<HelloEntity>>(getRepositoryToken(HelloEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getHello', () => {
    it('should return existing hello message from database', async () => {
      const mockHello: HelloEntity = {
        id: 1,
        message: 'Hello from NestJS!',
        timestamp: new Date('2026-01-13T15:45:00.000Z'),
      };

      mockRepository.findOne.mockResolvedValue(mockHello);

      const result = await service.getHello();

      expect(result).toEqual({
        id: 1,
        message: 'Hello from NestJS!',
        timestamp: new Date('2026-01-13T15:45:00.000Z'),
      });
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: {},
        order: { id: 'DESC' },
      });
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should create new hello message if none exists', async () => {
      const mockHello: HelloEntity = {
        id: 1,
        message: 'Hello from NestJS!',
        timestamp: new Date('2026-01-13T15:45:00.000Z'),
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockHello);
      mockRepository.save.mockResolvedValue(mockHello);

      const result = await service.getHello();

      expect(result).toEqual({
        id: 1,
        message: 'Hello from NestJS!',
        timestamp: new Date('2026-01-13T15:45:00.000Z'),
      });
      expect(mockRepository.findOne).toHaveBeenCalled();
      expect(mockRepository.create).toHaveBeenCalledWith({
        message: 'Hello from NestJS!',
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockHello);
    });
  });
});
```

**File**: `backend/src/modules/hello/tests/hello.controller.spec.ts`

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { HelloController } from '../hello.controller';
import { HelloService } from '../hello.service';
import { HelloResponseDto } from '../dto/hello-response.dto';

describe('HelloController', () => {
  let controller: HelloController;
  let service: HelloService;

  const mockHelloService = {
    getHello: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HelloController],
      providers: [
        {
          provide: HelloService,
          useValue: mockHelloService,
        },
      ],
    }).compile();

    controller = module.get<HelloController>(HelloController);
    service = module.get<HelloService>(HelloService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHello', () => {
    it('should return hello response from service', async () => {
      const mockResponse: HelloResponseDto = {
        id: 1,
        message: 'Hello from NestJS!',
        timestamp: new Date('2026-01-13T15:45:00.000Z'),
      };

      mockHelloService.getHello.mockResolvedValue(mockResponse);

      const result = await controller.getHello();

      expect(result).toEqual(mockResponse);
      expect(service.getHello).toHaveBeenCalled();
    });
  });
});
```

**File**: `backend/jest.config.js`

```javascript
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/*.spec.ts',
    '!**/node_modules/**',
    '!**/dist/**',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/../../shared/src/$1',
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

**File**: `backend/.env.example`

```env
NODE_ENV=development
PORT=3000
DATABASE_PATH=./database.sqlite
FRONTEND_URL=http://localhost:5173
```

---

## Phase 4: Frontend Implementation

### 4.1 Package Configuration

**File**: `frontend/package.json`

```json
{
  "name": "frontend",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "description": "React frontend application",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  },
  "dependencies": {
    "@shared/types": "*",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/react": "^14.1.2",
    "@testing-library/user-event": "^14.5.1",
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "@vitejs/plugin-react": "^4.2.1",
    "@vitest/coverage-v8": "^1.1.0",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.56.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "jsdom": "^23.0.1",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.3",
    "vite": "^5.0.10",
    "vitest": "^1.1.0"
  }
}
```

### 4.2 Vite Configuration

**File**: `frontend/vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared/src'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.spec.ts',
        '**/*.test.tsx',
      ],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
});
```

### 4.3 TypeScript Configuration

**File**: `frontend/tsconfig.json`

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@shared/*": ["../shared/src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**File**: `frontend/tsconfig.node.json`

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

### 4.4 Tailwind Configuration

**File**: `frontend/tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**File**: `frontend/postcss.config.js`

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 4.5 HTML Entry Point

**File**: `frontend/index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Notes de Frais</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 4.6 Main Application Entry

**File**: `frontend/src/main.tsx`

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

**File**: `frontend/src/App.tsx`

```typescript
import { AppRouter } from './routes/AppRouter';

/**
 * Root application component
 */
function App() {
  return <AppRouter />;
}

export default App;
```

**File**: `frontend/src/styles/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
```

### 4.7 API Service

**File**: `frontend/src/services/api.service.ts`

```typescript
import { HelloResponse } from '@shared/hello.types';

/**
 * API service for backend communication
 */
export class ApiService {
  private readonly baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
  }

  /**
   * Fetch hello message from backend
   */
  async getHello(): Promise<HelloResponse> {
    const response = await fetch(`${this.baseURL}/hello`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      ...data,
      timestamp: new Date(data.timestamp),
    };
  }
}

// Singleton instance
export const apiService = new ApiService();
```

### 4.8 Custom Hook

**File**: `frontend/src/hooks/useHello.ts`

```typescript
import { useState, useEffect } from 'react';
import { HelloResponse } from '@shared/hello.types';
import { apiService } from '../services/api.service';

/**
 * Custom hook for fetching hello data
 */
export function useHello() {
  const [data, set