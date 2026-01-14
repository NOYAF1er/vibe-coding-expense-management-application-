# Expense Management System - Implementation Plan (Part 3)

## Continuation from Part 2...

### **Phase 7: Testing** (continued)

#### Example: User Controller Test (continued)
**File**: [`backend/src/modules/users/tests/user.controller.spec.ts`](backend/src/modules/users/tests/user.controller.spec.ts)

```typescript
      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const expectedResult = { id: '1', email: 'john@example.com' };
      mockUsersService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne('1');

      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      mockUsersService.remove.mockResolvedValue(undefined);

      await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});
```

#### Example: DTO Validation Test
**File**: [`backend/src/modules/users/tests/create-user.dto.spec.ts`](backend/src/modules/users/tests/create-user.dto.spec.ts)

```typescript
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserRole } from '../../../common/enums/user-role.enum';

describe('CreateUserDto', () => {
  it('should pass validation with valid data', async () => {
    const dto = plainToClass(CreateUserDto, {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      role: UserRole.EMPLOYEE,
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation with invalid email', async () => {
    const dto = plainToClass(CreateUserDto, {
      firstName: 'John',
      lastName: 'Doe',
      email: 'invalid-email',
      password: 'password123',
      role: UserRole.EMPLOYEE,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('should fail validation with short password', async () => {
    const dto = plainToClass(CreateUserDto, {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'short',
      role: UserRole.EMPLOYEE,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
  });

  it('should fail validation with invalid role', async () => {
    const dto = plainToClass(CreateUserDto, {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'INVALID_ROLE',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('role');
  });

  it('should fail validation with missing required fields', async () => {
    const dto = plainToClass(CreateUserDto, {});

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
```

---

### **Phase 8: Install Dependencies** (5 min)

```bash
# Navigate to backend directory
cd backend

# Install bcrypt for password hashing
npm install bcrypt
npm install -D @types/bcrypt

# Return to root
cd ..
```

---

### **Phase 9: Database Setup & Verification** (15 min)

#### Step 9.1: Verify TypeORM Configuration
The database will be automatically created when the app starts due to `synchronize: true` in development mode.

#### Step 9.2: Create Database Seed Script (Optional)
**File**: [`backend/src/seed.ts`](backend/src/seed.ts)

```typescript
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './modules/users/entities/user.entity';
import { ExpenseReport } from './modules/expense-reports/entities/expense-report.entity';
import { Expense } from './modules/expenses/entities/expense.entity';
import { Attachment } from './modules/attachments/entities/attachment.entity';
import { UserRole } from './common/enums/user-role.enum';
import { ExpenseReportStatus } from './common/enums/expense-report-status.enum';
import { ExpenseCategory } from './common/enums/expense-category.enum';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'expense-management.db',
  entities: [User, ExpenseReport, Expense, Attachment],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();

  const userRepository = AppDataSource.getRepository(User);
  const reportRepository = AppDataSource.getRepository(ExpenseReport);
  const expenseRepository = AppDataSource.getRepository(Expense);

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const employee = userRepository.create({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: hashedPassword,
    role: UserRole.EMPLOYEE,
  });

  const manager = userRepository.create({
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    password: hashedPassword,
    role: UserRole.MANAGER,
  });

  const admin = userRepository.create({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: hashedPassword,
    role: UserRole.ADMIN,
  });

  await userRepository.save([employee, manager, admin]);
  console.log('✅ Users created');

  // Create expense report
  const report = reportRepository.create({
    userId: employee.id,
    title: 'Business Trip to San Francisco',
    reportDate: new Date('2024-01-15'),
    status: ExpenseReportStatus.SUBMITTED,
    totalAmount: 1250.75,
    currency: 'EUR',
  });

  await reportRepository.save(report);
  console.log('✅ Expense report created');

  // Create expenses
  const expense1 = expenseRepository.create({
    reportId: report.id,
    name: 'Flight to San Francisco',
    description: 'Round trip business class',
    amount: 850.50,
    expenseDate: new Date('2024-01-15'),
    category: ExpenseCategory.TRAVEL,
  });

  const expense2 = expenseRepository.create({
    reportId: report.id,
    name: 'Hotel Accommodation',
    description: '3 nights at Hilton',
    amount: 300.25,
    expenseDate: new Date('2024-01-16'),
    category: ExpenseCategory.HOTEL,
  });

  const expense3 = expenseRepository.create({
    reportId: report.id,
    name: 'Client Dinner',
    description: 'Dinner with client at restaurant',
    amount: 100.00,
    expenseDate: new Date('2024-01-17'),
    category: ExpenseCategory.MEAL,
  });

  await expenseRepository.save([expense1, expense2, expense3]);
  console.log('✅ Expenses created');

  console.log('\n🎉 Database seeded successfully!');
  await AppDataSource.destroy();
}

seed().catch((error) => {
  console.error('❌ Error seeding database:', error);
  process.exit(1);
});
```

#### Step 9.3: Add Seed Script to package.json
**File**: [`backend/package.json`](backend/package.json)

```json
{
  "scripts": {
    "seed": "ts-node src/seed.ts"
  }
}
```

---

### **Phase 10: API Documentation Summary** (10 min)

#### Swagger Endpoints Overview

Once implemented, the following endpoints will be available:

**Users API** (`/api/v1/users`)
- `POST /api/v1/users` - Create user
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `PATCH /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user (soft)

**Expense Reports API** (`/api/v1/expense-reports`)
- `POST /api/v1/expense-reports` - Create report
- `GET /api/v1/expense-reports` - Get all reports
- `GET /api/v1/expense-reports/:id` - Get report by ID
- `GET /api/v1/expense-reports/user/:userId` - Get reports by user
- `PATCH /api/v1/expense-reports/:id` - Update report
- `POST /api/v1/expense-reports/:id/calculate-total` - Recalculate total
- `DELETE /api/v1/expense-reports/:id` - Delete report (soft)

**Expenses API** (`/api/v1/expenses`)
- `POST /api/v1/expenses` - Create expense
- `GET /api/v1/expenses` - Get all expenses (with filters)
- `GET /api/v1/expenses?reportId=xxx` - Filter by report
- `GET /api/v1/expenses?category=TRAVEL` - Filter by category
- `GET /api/v1/expenses/:id` - Get expense by ID
- `PATCH /api/v1/expenses/:id` - Update expense
- `DELETE /api/v1/expenses/:id` - Delete expense

**Attachments API** (`/api/v1/attachments`)
- `POST /api/v1/attachments` - Create attachment
- `GET /api/v1/attachments` - Get all attachments
- `GET /api/v1/attachments?expenseId=xxx` - Filter by expense
- `GET /api/v1/attachments/:id` - Get attachment by ID
- `PATCH /api/v1/attachments/:id` - Update attachment metadata
- `DELETE /api/v1/attachments/:id` - Delete attachment

**Swagger UI**: `http://localhost:3000/api/docs`

---

## 📊 Implementation Timeline

| Phase | Task | Estimated Time | Files Created |
|-------|------|----------------|---------------|
| 1 | Foundation & Enums | 30 min | 4 files |
| 2 | User Module | 1.5 hours | 10 files |
| 3 | ExpenseReport Module | 1.5 hours | 10 files |
| 4 | Expense Module | 1.5 hours | 10 files |
| 5 | Attachment Module | 1 hour | 10 files |
| 6 | Update App Module | 15 min | 1 file |
| 7 | Testing (All Modules) | 3 hours | 40+ test files |
| 8 | Install Dependencies | 5 min | - |
| 9 | Database Setup | 15 min | 1 file |
| 10 | Documentation | 10 min | - |
| **TOTAL** | **~9 hours** | **96+ files** |

---

## 🎯 File Count Summary

```
Total Files to Create: ~96 files

Common (4 files):
├── common/entities/base.entity.ts
└── common/enums/
    ├── user-role.enum.ts
    ├── expense-report-status.enum.ts
    └── expense-category.enum.ts

Users Module (10 files):
├── entities/user.entity.ts
├── dto/ (3 files)
├── tests/ (6 files)
├── users.service.ts
├── users.controller.ts
└── users.module.ts

ExpenseReports Module (10 files):
├── entities/expense-report.entity.ts
├── dto/ (3 files)
├── tests/ (6 files)
├── expense-reports.service.ts
├── expense-reports.controller.ts
└── expense-reports.module.ts

Expenses Module (10 files):
├── entities/expense.entity.ts
├── dto/ (3 files)
├── tests/ (6 files)
├── expenses.service.ts
├── expenses.controller.ts
└── expenses.module.ts

Attachments Module (10 files):
├── entities/attachment.entity.ts
├── dto/ (3 files)
├── tests/ (6 files)
├── attachments.service.ts
├── attachments.controller.ts
└── attachments.module.ts

Configuration (2 files):
├── app.module.ts (updated)
└── seed.ts
```

---

## ✅ Acceptance Criteria Checklist

### Functional Requirements
- [ ] All 4 entities created with proper TypeORM decorators
- [ ] UUID primary keys on all entities
- [ ] createdAt/updatedAt timestamps on all entities
- [ ] Proper relationships (ManyToOne, OneToMany) with foreign keys
- [ ] Enums for roles, statuses, and categories
- [ ] Soft delete on User and ExpenseReport
- [ ] Cascade delete configured properly

### API Requirements
- [ ] Full CRUD operations for all entities
- [ ] RESTful endpoints following conventions
- [ ] Proper HTTP status codes
- [ ] Input validation with class-validator
- [ ] Error handling (NotFoundException, ConflictException)
- [ ] Query filters (by user, by report, by category)

### Documentation Requirements
- [ ] Swagger decorators on all endpoints
- [ ] API documentation accessible at `/api/docs`
- [ ] Request/Response DTOs documented
- [ ] Example values in Swagger

### Testing Requirements
- [ ] Unit tests for all entities
- [ ] Unit tests for all DTOs (validation)
- [ ] Unit tests for all services
- [ ] Unit tests for all controllers
- [ ] Test coverage ≥ 80%
- [ ] All tests passing

### Code Quality Requirements
- [ ] TypeScript strict mode
- [ ] No linting errors
- [ ] Consistent naming conventions
- [ ] Proper error handling
- [ ] Code comments where needed
- [ ] Following NestJS best practices

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
cd backend
npm install bcrypt
npm install -D @types/bcrypt

# Run development server
npm run dev

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Seed database (after implementation)
npm run seed

# Access Swagger UI
# Open browser: http://localhost:3000/api/docs
```

---

## 🔍 Testing the API

### Example API Calls

#### 1. Create a User
```bash
POST http://localhost:3000/api/v1/users
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "role": "EMPLOYEE"
}
```

#### 2. Create an Expense Report
```bash
POST http://localhost:3000/api/v1/expense-reports
Content-Type: application/json

{
  "userId": "uuid-from-step-1",
  "title": "Business Trip to Paris",
  "reportDate": "2024-01-20"
}
```

#### 3. Create an Expense
```bash
POST http://localhost:3000/api/v1/expenses
Content-Type: application/json

{
  "reportId": "uuid-from-step-2",
  "name": "Flight to Paris",
  "description": "Round trip economy",
  "amount": 450.00,
  "expenseDate": "2024-01-20",
  "category": "TRAVEL"
}
```

#### 4. Create an Attachment
```bash
POST http://localhost:3000/api/v1/attachments
Content-Type: application/json

{
  "expenseId": "uuid-from-step-3",
  "fileName": "receipt-001.pdf",
  "fileUrl": "/uploads/attachments/uuid/receipt-001.pdf",
  "mimeType": "application/pdf",
  "fileSize": 245678
}
```

---

## 🐛 Common Issues & Solutions

### Issue 1: TypeORM Circular Dependency
**Problem**: Circular import between entities
**Solution**: Use string references in decorators
```typescript
@ManyToOne(() => User, user => user.expenseReports)
// Instead of direct import
```

### Issue 2: UUID Not Generated
**Problem**: ID is undefined after save
**Solution**: Ensure `@PrimaryGeneratedColumn('uuid')` is used

### Issue 3: Validation Not Working
**Problem**: DTOs not validating
**Solution**: Add `ValidationPipe` globally in main.ts
```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}));
```

### Issue 4: Password Visible in Response
**Problem**: Password returned in API response
**Solution**: Use `@Exclude()` decorator and `ClassSerializerInterceptor`

### Issue 5: Soft Delete Not Working
**Problem**: Records hard deleted
**Solution**: Use `softRemove()` instead of `remove()`

---

## 📚 Additional Resources

### TypeORM Documentation
- [Entities](https://typeorm.io/entities)
- [Relations](https://typeorm.io/relations)
- [Decorators](https://typeorm.io/decorator-reference)

### NestJS Documentation
- [Controllers](https://docs.nestjs.com/controllers)
- [Providers](https://docs.nestjs.com/providers)
- [Validation](https://docs.nestjs.com/techniques/validation)
- [Swagger](https://docs.nestjs.com/openapi/introduction)

### Testing
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)

---

## 🎓 Next Steps After Implementation

### Phase 2 Enhancements (Future)
1. **Authentication & Authorization**
   - JWT tokens
   - Auth guards
   - Role-based access control

2. **File Upload**
   - Multer integration
   - File validation
   - Cloud storage (S3/GCS)

3. **Advanced Features**
   - Pagination
   - Sorting
   - Advanced filtering
   - Search functionality

4. **Workflow Automation**
   - Email notifications
   - Approval workflows
   - Status transitions

5. **Reporting**
   - Expense analytics
   - Export to PDF/Excel
   - Dashboard statistics

---

## 📝 Summary

This implementation plan provides a complete, production-ready backend for an expense management system with:

✅ **4 Complete Entities** with proper relationships
✅ **Full CRUD APIs** with validation
✅ **Comprehensive Testing** (≥80% coverage)
✅ **Swagger Documentation** for easy API testing
✅ **Best Practices** following NestJS conventions
✅ **Type Safety** with TypeScript strict mode
✅ **Database Integration** with TypeORM and SQLite

**Total Implementation Time**: ~9 hours
**Total Files**: ~96 files
**Test Coverage Target**: ≥80%

The system is designed to be:
- **Scalable**: Easy to add new features
- **Maintainable**: Clean, well-structured code
- **Testable**: Comprehensive test coverage
- **Documented**: Full Swagger API documentation
- **Production-Ready**: Following enterprise best practices

---

**Ready to implement? Switch to Code mode and follow this plan step by step!**
