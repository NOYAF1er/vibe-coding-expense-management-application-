# Expense Management System - Implementation Plan

## 🎯 Project Overview

**Goal**: Create a complete, production-ready backend for an expense management application using NestJS, TypeScript, TypeORM, and SQLite.

**Deliverables**:
- ✅ 4 complete entities with proper relationships
- ✅ Full CRUD services for all entities
- ✅ RESTful API controllers with Swagger documentation
- ✅ Comprehensive unit tests (≥80% coverage)
- ✅ DTOs with validation
- ✅ Functional Swagger UI for API testing

---

## 📋 Prerequisites

### Existing Infrastructure
- ✅ NestJS project initialized
- ✅ TypeORM configured with SQLite
- ✅ Swagger/OpenAPI setup
- ✅ Jest testing framework
- ✅ Example module (hello) as reference

### Required Dependencies (Already Installed)
```json
{
  "@nestjs/common": "^10.3.0",
  "@nestjs/typeorm": "^10.0.1",
  "@nestjs/swagger": "^7.1.17",
  "typeorm": "^0.3.19",
  "class-validator": "^0.14.0",
  "class-transformer": "^0.5.1",
  "sqlite3": "^5.1.6"
}
```

### Additional Dependencies Needed
```bash
# For password hashing
npm install bcrypt
npm install -D @types/bcrypt

# For file uploads (if implementing attachment upload)
npm install @nestjs/platform-express multer
npm install -D @types/multer
```

---

## 🏗️ Architecture Decisions

### 1. **Status System: Single Level (Report Only)**
**Decision**: Remove status from individual Expense entities, keep only on ExpenseReport

**Rationale**:
- Simpler workflow and business logic
- Avoids conflicting states
- Report-level approval is standard practice
- Individual expense validation happens before submission

**Implementation**:
- ExpenseReport status: `DRAFT`, `SUBMITTED`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`, `PAID`
- Expense: No status field (inherits from parent report)

### 2. **Authentication: Password Hashing Only (No JWT Yet)**
**Decision**: Implement password hashing with bcrypt, defer JWT implementation

**Rationale**:
- Focus on core CRUD functionality first
- Password field required for future auth
- JWT can be added in Phase 2
- Simpler testing without auth middleware

**Implementation**:
- User entity has `password` field
- Service method to hash passwords
- No authentication guards yet

### 3. **File Storage: Local Filesystem**
**Decision**: Store attachments in local `/uploads` directory

**Rationale**:
- Simpler for development and testing
- No external dependencies (S3, etc.)
- Easy to migrate to cloud storage later
- Sufficient for MVP

**Implementation**:
- Files stored in: `/uploads/attachments/{expenseId}/{filename}`
- Database stores: `fileName`, `fileUrl`, `mimeType`, `fileSize`

### 4. **Cascade Deletes: Enabled**
**Decision**: Enable cascade deletes for parent-child relationships

**Rationale**:
- Maintains referential integrity
- Prevents orphaned records
- Standard practice for owned relationships

**Implementation**:
```typescript
User -> ExpenseReport: cascade: ['remove'] (soft delete)
ExpenseReport -> Expense: cascade: true, onDelete: 'CASCADE'
Expense -> Attachment: cascade: true, onDelete: 'CASCADE'
```

### 5. **Soft Delete: Enabled for User and ExpenseReport**
**Decision**: Use soft delete for User and ExpenseReport, hard delete for Expense and Attachment

**Rationale**:
- Preserve audit trail for reports
- Comply with data retention policies
- Expenses/Attachments are children, follow parent lifecycle

**Implementation**:
- Add `@DeleteDateColumn()` to User and ExpenseReport
- Regular delete for Expense and Attachment

### 6. **Currency: Single Currency (EUR)**
**Decision**: Support only EUR for MVP, add currency field for future expansion

**Rationale**:
- Simplifies calculations
- Avoids exchange rate complexity
- Easy to extend later

**Implementation**:
- Add `currency` field with default 'EUR'
- All amounts in same currency

---

## 📁 Project Structure

```
backend/src/
├── common/
│   ├── entities/
│   │   └── base.entity.ts              # Base entity with common fields
│   └── enums/
│       ├── user-role.enum.ts
│       ├── expense-report-status.enum.ts
│       └── expense-category.enum.ts
│
├── modules/
│   ├── users/
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   ├── update-user.dto.ts
│   │   │   └── user-response.dto.ts
│   │   ├── tests/
│   │   │   ├── user.entity.spec.ts
│   │   │   ├── user.service.spec.ts
│   │   │   ├── user.controller.spec.ts
│   │   │   └── dto/*.spec.ts
│   │   ├── users.service.ts
│   │   ├── users.controller.ts
│   │   └── users.module.ts
│   │
│   ├── expense-reports/
│   │   ├── entities/
│   │   │   └── expense-report.entity.ts
│   │   ├── dto/
│   │   │   ├── create-expense-report.dto.ts
│   │   │   ├── update-expense-report.dto.ts
│   │   │   └── expense-report-response.dto.ts
│   │   ├── tests/
│   │   │   ├── expense-report.entity.spec.ts
│   │   │   ├── expense-report.service.spec.ts
│   │   │   ├── expense-report.controller.spec.ts
│   │   │   └── dto/*.spec.ts
│   │   ├── expense-reports.service.ts
│   │   ├── expense-reports.controller.ts
│   │   └── expense-reports.module.ts
│   │
│   ├── expenses/
│   │   ├── entities/
│   │   │   └── expense.entity.ts
│   │   ├── dto/
│   │   │   ├── create-expense.dto.ts
│   │   │   ├── update-expense.dto.ts
│   │   │   └── expense-response.dto.ts
│   │   ├── tests/
│   │   │   ├── expense.entity.spec.ts
│   │   │   ├── expense.service.spec.ts
│   │   │   ├── expense.controller.spec.ts
│   │   │   └── dto/*.spec.ts
│   │   ├── expenses.service.ts
│   │   ├── expenses.controller.ts
│   │   └── expenses.module.ts
│   │
│   └── attachments/
│       ├── entities/
│       │   └── attachment.entity.ts
│       ├── dto/
│       │   ├── create-attachment.dto.ts
│       │   ├── update-attachment.dto.ts
│       │   └── attachment-response.dto.ts
│       ├── tests/
│       │   ├── attachment.entity.spec.ts
│       │   ├── attachment.service.spec.ts
│       │   ├── attachment.controller.spec.ts
│       │   └── dto/*.spec.ts
│       ├── attachments.service.ts
│       ├── attachments.controller.ts
│       └── attachments.module.ts
│
├── app.module.ts                        # Updated with new modules
└── main.ts                              # Entry point
```

---

## 🔧 Implementation Phases

### **Phase 1: Foundation & Enums** (30 min)

#### Step 1.1: Create Base Entity
**File**: [`backend/src/common/entities/base.entity.ts`](backend/src/common/entities/base.entity.ts)

```typescript
import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
```

#### Step 1.2: Create Enums
**File**: [`backend/src/common/enums/user-role.enum.ts`](backend/src/common/enums/user-role.enum.ts)
```typescript
export enum UserRole {
  EMPLOYEE = 'EMPLOYEE',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
}
```

**File**: [`backend/src/common/enums/expense-report-status.enum.ts`](backend/src/common/enums/expense-report-status.enum.ts)
```typescript
export enum ExpenseReportStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PAID = 'PAID',
}
```

**File**: [`backend/src/common/enums/expense-category.enum.ts`](backend/src/common/enums/expense-category.enum.ts)
```typescript
export enum ExpenseCategory {
  TRAVEL = 'TRAVEL',
  MEAL = 'MEAL',
  HOTEL = 'HOTEL',
  TRANSPORT = 'TRANSPORT',
  OFFICE_SUPPLIES = 'OFFICE_SUPPLIES',
  OTHER = 'OTHER',
}
```

---

### **Phase 2: User Module** (1.5 hours)

#### Step 2.1: User Entity
**File**: [`backend/src/modules/users/entities/user.entity.ts`](backend/src/modules/users/entities/user.entity.ts)

```typescript
import { Entity, Column, OneToMany, DeleteDateColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { UserRole } from '../../../common/enums/user-role.enum';
import { ExpenseReport } from '../../expense-reports/entities/expense-report.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ length: 100 })
  firstName!: string;

  @Column({ length: 100 })
  lastName!: string;

  @Index()
  @Column({ unique: true, length: 255 })
  email!: string;

  @Column({ length: 255 })
  password!: string; // Hashed

  @Index()
  @Column({
    type: 'text',
    enum: UserRole,
    default: UserRole.EMPLOYEE,
  })
  role!: UserRole;

  @Column({ default: true })
  isActive!: boolean;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => ExpenseReport, (report) => report.user, {
    cascade: ['remove'],
  })
  expenseReports!: ExpenseReport[];
}
```

#### Step 2.2: User DTOs
**File**: [`backend/src/modules/users/dto/create-user.dto.ts`](backend/src/modules/users/dto/create-user.dto.ts)

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { UserRole } from '../../../common/enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'John', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName!: string;

  @ApiProperty({ example: 'Doe', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName!: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email!: string;

  @ApiProperty({ example: 'SecurePass123!', minLength: 8 })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  @ApiProperty({ enum: UserRole, default: UserRole.EMPLOYEE })
  @IsEnum(UserRole)
  role!: UserRole;
}
```

**File**: [`backend/src/modules/users/dto/update-user.dto.ts`](backend/src/modules/users/dto/update-user.dto.ts)

```typescript
import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password'] as const)
) {}
```

**File**: [`backend/src/modules/users/dto/user-response.dto.ts`](backend/src/modules/users/dto/user-response.dto.ts)

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UserRole } from '../../../common/enums/user-role.enum';

export class UserResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty()
  email!: string;

  @Exclude()
  password!: string;

  @ApiProperty({ enum: UserRole })
  role!: UserRole;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
```

#### Step 2.3: User Service
**File**: [`backend/src/modules/users/users.service.ts`](backend/src/modules/users/users.service.ts)

```typescript
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.softRemove(user);
  }
}
```

#### Step 2.4: User Controller
**File**: [`backend/src/modules/users/users.controller.ts`](backend/src/modules/users/users.controller.ts)

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('users')
@Controller('api/v1/users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created', type: UserResponseDto })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users', type: [UserResponseDto] })
  async findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user (soft delete)' })
  @ApiResponse({ status: 204, description: 'User deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
```

#### Step 2.5: User Module
**File**: [`backend/src/modules/users/users.module.ts`](backend/src/modules/users/users.module.ts)

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

---

### **Phase 3: ExpenseReport Module** (1.5 hours)

#### Step 3.1: ExpenseReport Entity
**File**: [`backend/src/modules/expense-reports/entities/expense-report.entity.ts`](backend/src/modules/expense-reports/entities/expense-report.entity.ts)

```typescript
import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ExpenseReportStatus } from '../../../common/enums/expense-report-status.enum';
import { User } from '../../users/entities/user.entity';
import { Expense } from '../../expenses/entities/expense.entity';

@Entity('expense_reports')
export class ExpenseReport extends BaseEntity {
  @Column()
  userId!: string;

  @ManyToOne(() => User, (user) => user.expenseReports, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ length: 200 })
  title!: string;

  @Index()
  @Column({ type: 'date' })
  reportDate!: Date;

  @Index()
  @Column({
    type: 'text',
    enum: ExpenseReportStatus,
    default: ExpenseReportStatus.DRAFT,
  })
  status!: ExpenseReportStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount!: number;

  @Column({ length: 3, default: 'EUR' })
  currency!: string;

  @Column({ nullable: true })
  reviewedBy?: string;

  @Column({ type: 'datetime', nullable: true })
  reviewedAt?: Date;

  @Column({ type: 'text', nullable: true })
  rejectionReason?: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Expense, (expense) => expense.report, {
    cascade: true,
  })
  expenses!: Expense[];
}
```

#### Step 3.2: ExpenseReport DTOs
**File**: [`backend/src/modules/expense-reports/dto/create-expense-report.dto.ts`](backend/src/modules/expense-reports/dto/create-expense-report.dto.ts)

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MaxLength, IsDateString } from 'class-validator';

export class CreateExpenseReportDto {
  @ApiProperty({ example: 'uuid-of-user' })
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @ApiProperty({ example: 'Business Trip to San Francisco', maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  @IsNotEmpty()
  reportDate!: string;
}
```

**File**: [`backend/src/modules/expense-reports/dto/update-expense-report.dto.ts`](backend/src/modules/expense-reports/dto/update-expense-report.dto.ts)

```typescript
import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateExpenseReportDto } from './create-expense-report.dto';
import { ExpenseReportStatus } from '../../../common/enums/expense-report-status.enum';

export class UpdateExpenseReportDto extends PartialType(CreateExpenseReportDto) {
  @ApiProperty({ enum: ExpenseReportStatus, required: false })
  @IsEnum(ExpenseReportStatus)
  @IsOptional()
  status?: ExpenseReportStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  rejectionReason?: string;
}
```

**File**: [`backend/src/modules/expense-reports/dto/expense-report-response.dto.ts`](backend/src/modules/expense-reports/dto/expense-report-response.dto.ts)

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { ExpenseReportStatus } from '../../../common/enums/expense-report-status.enum';

export class ExpenseReportResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  reportDate!: Date;

  @ApiProperty({ enum: ExpenseReportStatus })
  status!: ExpenseReportStatus;

  @ApiProperty()
  totalAmount!: number;

  @ApiProperty()
  currency!: string;

  @ApiProperty({ required: false })
  reviewedBy?: string;

  @ApiProperty({ required: false })
  reviewedAt?: Date;

  @ApiProperty({ required: false })
  rejectionReason?: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
```

#### Step 3.3: ExpenseReport Service
**File**: [`backend/src/modules/expense-reports/expense-reports.service.ts`](backend/src/modules/expense-reports/expense-reports.service.ts)

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseReport } from './entities/expense-report.entity';
import { CreateExpenseReportDto } from './dto/create-expense-report.dto';
import { UpdateExpenseReportDto } from './dto/update-expense-report.dto';

@Injectable()
export class ExpenseReportsService {
  constructor(
    @InjectRepository(ExpenseReport)
    private readonly reportRepository: Repository<ExpenseReport>,
  ) {}

  async create(createDto: CreateExpenseReportDto): Promise<ExpenseReport> {
    const report = this.reportRepository.create(createDto);
    return this.reportRepository.save(report);
  }

  async findAll(): Promise<ExpenseReport[]> {
    return this.reportRepository.find({
      relations: ['user', 'expenses'],
    });
  }

  async findOne(id: string): Promise<ExpenseReport> {
    const report = await this.reportRepository.findOne({
      where: { id },
      relations: ['user', 'expenses'],
    });

    if (!report) {
      throw new NotFoundException(`ExpenseReport with ID ${id} not found`);
    }

    return report;
  }

  async findByUser(userId: string): Promise<ExpenseReport[]> {
    return this.reportRepository.find({
      where: { userId },
      relations: ['expenses'],
    });
  }

  async update(id: string, updateDto: UpdateExpenseReportDto): Promise<ExpenseReport> {
    const report = await this.findOne(id);
    Object.assign(report, updateDto);
    return this.reportRepository.save(report);
  }

  async remove(id: string): Promise<void> {
    const report = await this.findOne(id);
    await this.reportRepository.softRemove(report);
  }

  async calculateTotal(id: string): Promise<number> {
    const report = await this.findOne(id);
    const total = report.expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
    report.totalAmount = total;
    await this.reportRepository.save(report);
    return total;
  }
}
```

#### Step 3.4: ExpenseReport Controller
**File**: [`backend/src/modules/expense-reports/expense-reports.controller.ts`](backend/src/modules/expense-reports/expense-reports.controller.ts)

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ExpenseReportsService } from './expense-reports.service';
import { CreateExpenseReportDto } from './dto/create-expense-report.dto';
import { UpdateExpenseReportDto } from './dto/update-expense-report.dto';
import { ExpenseReportResponseDto } from './dto/expense-report-response.dto';

@ApiTags('expense-reports')
@Controller('api/v1/expense-reports')
export class ExpenseReportsController {
  constructor(private readonly reportsService: ExpenseReportsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new expense report' })
  @ApiResponse({ status: 201, type: ExpenseReportResponseDto })
  async create(@Body() createDto: CreateExpenseReportDto): Promise<ExpenseReportResponseDto> {
    return this.reportsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all expense reports' })
  @ApiResponse({ status: 200, type: [ExpenseReportResponseDto] })
  async findAll(): Promise<ExpenseReportResponseDto[]> {
    return this.reportsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get expense report by ID' })
  @ApiResponse({ status: 200, type: ExpenseReportResponseDto })
  @ApiResponse({ status: 404, description: 'Report not found' })
  async findOne(@Param('id') id: string): Promise<ExpenseReportResponseDto> {
    return this.reportsService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all reports for a user' })
  @ApiResponse({ status: 200, type: [ExpenseReportResponseDto] })
  async findByUser(@Param('userId') userId: string): Promise<ExpenseReportResponseDto[]> {
    return this.reportsService.findByUser(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update expense report' })
  @ApiResponse({ status: 200, type: ExpenseReportResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateExpenseReportDto,
  ): Promise<ExpenseReportResponseDto> {
    return this.reportsService.update(id, updateDto);
  }

  @Post(':id/calculate-total')
  @ApiOperation({ summary: 'Recalculate report total from expenses' })
  @ApiResponse({ status: 200, description: 'Total amount' })
  async calculateTotal(@Param('id') id: string): Promise<{ total: number }> {
    const total = await this.reportsService.calculateTotal(id);
    return { total };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete expense report (soft delete)' })
  @ApiResponse({ status: 204 })
  async remove(@Param('id') id: string): Promise<void> {
    return this.reportsService.remove(id);
  }
}
```

#### Step 3.5: ExpenseReport Module
**File**: [`backend/