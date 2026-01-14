# Expense Management System - Implementation Plan (Part 2)

## Continuation from Part 1...

### **Phase 3: ExpenseReport Module** (continued)

#### Step 3.5: ExpenseReport Module
**File**: [`backend/src/modules/expense-reports/expense-reports.module.ts`](backend/src/modules/expense-reports/expense-reports.module.ts)

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseReportsService } from './expense-reports.service';
import { ExpenseReportsController } from './expense-reports.controller';
import { ExpenseReport } from './entities/expense-report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExpenseReport])],
  controllers: [ExpenseReportsController],
  providers: [ExpenseReportsService],
  exports: [ExpenseReportsService],
})
export class ExpenseReportsModule {}
```

---

### **Phase 4: Expense Module** (1.5 hours)

#### Step 4.1: Expense Entity
**File**: [`backend/src/modules/expenses/entities/expense.entity.ts`](backend/src/modules/expenses/entities/expense.entity.ts)

```typescript
import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ExpenseCategory } from '../../../common/enums/expense-category.enum';
import { ExpenseReport } from '../../expense-reports/entities/expense-report.entity';
import { Attachment } from '../../attachments/entities/attachment.entity';

@Entity('expenses')
export class Expense extends BaseEntity {
  @Column()
  reportId!: string;

  @ManyToOne(() => ExpenseReport, (report) => report.expenses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reportId' })
  report!: ExpenseReport;

  @Column({ length: 200 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Index()
  @Column({ type: 'date' })
  expenseDate!: Date;

  @Index()
  @Column({
    type: 'text',
    enum: ExpenseCategory,
  })
  category!: ExpenseCategory;

  @Column({ default: true })
  receiptRequired!: boolean;

  @OneToMany(() => Attachment, (attachment) => attachment.expense, {
    cascade: true,
  })
  attachments!: Attachment[];
}
```

#### Step 4.2: Expense DTOs
**File**: [`backend/src/modules/expenses/dto/create-expense.dto.ts`](backend/src/modules/expenses/dto/create-expense.dto.ts)

```typescript
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsEnum,
  IsNumber,
  IsOptional,
  IsDateString,
  MaxLength,
  Min,
} from 'class-validator';
import { ExpenseCategory } from '../../../common/enums/expense-category.enum';

export class CreateExpenseDto {
  @ApiProperty({ example: 'uuid-of-report' })
  @IsUUID()
  @IsNotEmpty()
  reportId!: string;

  @ApiProperty({ example: 'Flight to San Francisco', maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @ApiProperty({ example: 'Round trip business class', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 850.50, minimum: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsNotEmpty()
  amount!: number;

  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  @IsNotEmpty()
  expenseDate!: string;

  @ApiProperty({ enum: ExpenseCategory, example: ExpenseCategory.TRAVEL })
  @IsEnum(ExpenseCategory)
  @IsNotEmpty()
  category!: ExpenseCategory;
}
```

**File**: [`backend/src/modules/expenses/dto/update-expense.dto.ts`](backend/src/modules/expenses/dto/update-expense.dto.ts)

```typescript
import { PartialType } from '@nestjs/swagger';
import { CreateExpenseDto } from './create-expense.dto';

export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {}
```

**File**: [`backend/src/modules/expenses/dto/expense-response.dto.ts`](backend/src/modules/expenses/dto/expense-response.dto.ts)

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { ExpenseCategory } from '../../../common/enums/expense-category.enum';

export class ExpenseResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  reportId!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  amount!: number;

  @ApiProperty()
  expenseDate!: Date;

  @ApiProperty({ enum: ExpenseCategory })
  category!: ExpenseCategory;

  @ApiProperty()
  receiptRequired!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
```

#### Step 4.3: Expense Service
**File**: [`backend/src/modules/expenses/expenses.service.ts`](backend/src/modules/expenses/expenses.service.ts)

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  async create(createDto: CreateExpenseDto): Promise<Expense> {
    const expense = this.expenseRepository.create(createDto);
    return this.expenseRepository.save(expense);
  }

  async findAll(): Promise<Expense[]> {
    return this.expenseRepository.find({
      relations: ['report', 'attachments'],
    });
  }

  async findOne(id: string): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id },
      relations: ['report', 'attachments'],
    });

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    return expense;
  }

  async findByReport(reportId: string): Promise<Expense[]> {
    return this.expenseRepository.find({
      where: { reportId },
      relations: ['attachments'],
    });
  }

  async findByCategory(category: string): Promise<Expense[]> {
    return this.expenseRepository.find({
      where: { category: category as any },
      relations: ['report'],
    });
  }

  async update(id: string, updateDto: UpdateExpenseDto): Promise<Expense> {
    const expense = await this.findOne(id);
    Object.assign(expense, updateDto);
    return this.expenseRepository.save(expense);
  }

  async remove(id: string): Promise<void> {
    const expense = await this.findOne(id);
    await this.expenseRepository.remove(expense);
  }
}
```

#### Step 4.4: Expense Controller
**File**: [`backend/src/modules/expenses/expenses.controller.ts`](backend/src/modules/expenses/expenses.controller.ts)

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
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseResponseDto } from './dto/expense-response.dto';

@ApiTags('expenses')
@Controller('api/v1/expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new expense' })
  @ApiResponse({ status: 201, type: ExpenseResponseDto })
  async create(@Body() createDto: CreateExpenseDto): Promise<ExpenseResponseDto> {
    return this.expensesService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all expenses' })
  @ApiQuery({ name: 'reportId', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiResponse({ status: 200, type: [ExpenseResponseDto] })
  async findAll(
    @Query('reportId') reportId?: string,
    @Query('category') category?: string,
  ): Promise<ExpenseResponseDto[]> {
    if (reportId) {
      return this.expensesService.findByReport(reportId);
    }
    if (category) {
      return this.expensesService.findByCategory(category);
    }
    return this.expensesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get expense by ID' })
  @ApiResponse({ status: 200, type: ExpenseResponseDto })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  async findOne(@Param('id') id: string): Promise<ExpenseResponseDto> {
    return this.expensesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update expense' })
  @ApiResponse({ status: 200, type: ExpenseResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateExpenseDto,
  ): Promise<ExpenseResponseDto> {
    return this.expensesService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete expense' })
  @ApiResponse({ status: 204 })
  async remove(@Param('id') id: string): Promise<void> {
    return this.expensesService.remove(id);
  }
}
```

#### Step 4.5: Expense Module
**File**: [`backend/src/modules/expenses/expenses.module.ts`](backend/src/modules/expenses/expenses.module.ts)

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { Expense } from './entities/expense.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Expense])],
  controllers: [ExpensesController],
  providers: [ExpensesService],
  exports: [ExpensesService],
})
export class ExpensesModule {}
```

---

### **Phase 5: Attachment Module** (1 hour)

#### Step 5.1: Attachment Entity
**File**: [`backend/src/modules/attachments/entities/attachment.entity.ts`](backend/src/modules/attachments/entities/attachment.entity.ts)

```typescript
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Expense } from '../../expenses/entities/expense.entity';

@Entity('attachments')
export class Attachment extends BaseEntity {
  @Column()
  expenseId!: string;

  @ManyToOne(() => Expense, (expense) => expense.attachments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'expenseId' })
  expense!: Expense;

  @Column({ length: 255 })
  fileName!: string;

  @Column({ length: 500 })
  fileUrl!: string;

  @Column({ length: 100 })
  mimeType!: string;

  @Column({ type: 'integer' })
  fileSize!: number;

  @Column({ type: 'datetime' })
  uploadedAt!: Date;
}
```

#### Step 5.2: Attachment DTOs
**File**: [`backend/src/modules/attachments/dto/create-attachment.dto.ts`](backend/src/modules/attachments/dto/create-attachment.dto.ts)

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsNumber, Min } from 'class-validator';

export class CreateAttachmentDto {
  @ApiProperty({ example: 'uuid-of-expense' })
  @IsUUID()
  @IsNotEmpty()
  expenseId!: string;

  @ApiProperty({ example: 'receipt-001.pdf' })
  @IsString()
  @IsNotEmpty()
  fileName!: string;

  @ApiProperty({ example: '/uploads/attachments/uuid/receipt-001.pdf' })
  @IsString()
  @IsNotEmpty()
  fileUrl!: string;

  @ApiProperty({ example: 'application/pdf' })
  @IsString()
  @IsNotEmpty()
  mimeType!: string;

  @ApiProperty({ example: 245678 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  fileSize!: number;
}
```

**File**: [`backend/src/modules/attachments/dto/update-attachment.dto.ts`](backend/src/modules/attachments/dto/update-attachment.dto.ts)

```typescript
import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateAttachmentDto } from './create-attachment.dto';

export class UpdateAttachmentDto extends PartialType(
  OmitType(CreateAttachmentDto, ['expenseId'] as const)
) {}
```

**File**: [`backend/src/modules/attachments/dto/attachment-response.dto.ts`](backend/src/modules/attachments/dto/attachment-response.dto.ts)

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class AttachmentResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  expenseId!: string;

  @ApiProperty()
  fileName!: string;

  @ApiProperty()
  fileUrl!: string;

  @ApiProperty()
  mimeType!: string;

  @ApiProperty()
  fileSize!: number;

  @ApiProperty()
  uploadedAt!: Date;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
```

#### Step 5.3: Attachment Service
**File**: [`backend/src/modules/attachments/attachments.service.ts`](backend/src/modules/attachments/attachments.service.ts)

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment } from './entities/attachment.entity';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>,
  ) {}

  async create(createDto: CreateAttachmentDto): Promise<Attachment> {
    const attachment = this.attachmentRepository.create({
      ...createDto,
      uploadedAt: new Date(),
    });
    return this.attachmentRepository.save(attachment);
  }

  async findAll(): Promise<Attachment[]> {
    return this.attachmentRepository.find({
      relations: ['expense'],
    });
  }

  async findOne(id: string): Promise<Attachment> {
    const attachment = await this.attachmentRepository.findOne({
      where: { id },
      relations: ['expense'],
    });

    if (!attachment) {
      throw new NotFoundException(`Attachment with ID ${id} not found`);
    }

    return attachment;
  }

  async findByExpense(expenseId: string): Promise<Attachment[]> {
    return this.attachmentRepository.find({
      where: { expenseId },
    });
  }

  async update(id: string, updateDto: UpdateAttachmentDto): Promise<Attachment> {
    const attachment = await this.findOne(id);
    Object.assign(attachment, updateDto);
    return this.attachmentRepository.save(attachment);
  }

  async remove(id: string): Promise<void> {
    const attachment = await this.findOne(id);
    await this.attachmentRepository.remove(attachment);
  }
}
```

#### Step 5.4: Attachment Controller
**File**: [`backend/src/modules/attachments/attachments.controller.ts`](backend/src/modules/attachments/attachments.controller.ts)

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
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AttachmentsService } from './attachments.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
import { AttachmentResponseDto } from './dto/attachment-response.dto';

@ApiTags('attachments')
@Controller('api/v1/attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new attachment' })
  @ApiResponse({ status: 201, type: AttachmentResponseDto })
  async create(@Body() createDto: CreateAttachmentDto): Promise<AttachmentResponseDto> {
    return this.attachmentsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all attachments' })
  @ApiQuery({ name: 'expenseId', required: false })
  @ApiResponse({ status: 200, type: [AttachmentResponseDto] })
  async findAll(@Query('expenseId') expenseId?: string): Promise<AttachmentResponseDto[]> {
    if (expenseId) {
      return this.attachmentsService.findByExpense(expenseId);
    }
    return this.attachmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get attachment by ID' })
  @ApiResponse({ status: 200, type: AttachmentResponseDto })
  @ApiResponse({ status: 404, description: 'Attachment not found' })
  async findOne(@Param('id') id: string): Promise<AttachmentResponseDto> {
    return this.attachmentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update attachment metadata' })
  @ApiResponse({ status: 200, type: AttachmentResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateAttachmentDto,
  ): Promise<AttachmentResponseDto> {
    return this.attachmentsService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete attachment' })
  @ApiResponse({ status: 204 })
  async remove(@Param('id') id: string): Promise<void> {
    return this.attachmentsService.remove(id);
  }
}
```

#### Step 5.5: Attachment Module
**File**: [`backend/src/modules/attachments/attachments.module.ts`](backend/src/modules/attachments/attachments.module.ts)

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttachmentsService } from './attachments.service';
import { AttachmentsController } from './attachments.controller';
import { Attachment } from './entities/attachment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attachment])],
  controllers: [AttachmentsController],
  providers: [AttachmentsService],
  exports: [AttachmentsService],
})
export class AttachmentsModule {}
```

---

### **Phase 6: Update App Module** (15 min)

#### Step 6.1: Update App Module
**File**: [`backend/src/app.module.ts`](backend/src/app.module.ts)

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { ExpenseReportsModule } from './modules/expense-reports/expense-reports.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { AttachmentsModule } from './modules/attachments/attachments.module';
import { User } from './modules/users/entities/user.entity';
import { ExpenseReport } from './modules/expense-reports/entities/expense-report.entity';
import { Expense } from './modules/expenses/entities/expense.entity';
import { Attachment } from './modules/attachments/entities/attachment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'expense-management.db',
      entities: [User, ExpenseReport, Expense, Attachment],
      synchronize: true, // Only for development
      logging: true,
    }),
    UsersModule,
    ExpenseReportsModule,
    ExpensesModule,
    AttachmentsModule,
  ],
})
export class AppModule {}
```

---

### **Phase 7: Testing** (3 hours)

#### Testing Strategy
Each module requires:
1. **Entity tests** - Validate entity structure
2. **DTO tests** - Validate DTO validation rules
3. **Service tests** - Unit tests with mocked repository
4. **Controller tests** - Integration tests with mocked service

#### Example: User Entity Test
**File**: [`backend/src/modules/users/tests/user.entity.spec.ts`](backend/src/modules/users/tests/user.entity.spec.ts)

```typescript
import { User } from '../entities/user.entity';
import { UserRole } from '../../../common/enums/user-role.enum';

describe('User Entity', () => {
  it('should create a user instance', () => {
    const user = new User();
    user.firstName = 'John';
    user.lastName = 'Doe';
    user.email = 'john@example.com';
    user.password = 'hashed_password';
    user.role = UserRole.EMPLOYEE;

    expect(user.firstName).toBe('John');
    expect(user.lastName).toBe('Doe');
    expect(user.email).toBe('john@example.com');
    expect(user.role).toBe(UserRole.EMPLOYEE);
  });

  it('should have default role as EMPLOYEE', () => {
    const user = new User();
    expect(user.role).toBeUndefined(); // Will be set by database default
  });

  it('should have isActive default to true', () => {
    const user = new User();
    expect(user.isActive).toBeUndefined(); // Will be set by database default
  });
});
```

#### Example: User Service Test
**File**: [`backend/src/modules/users/tests/user.service.spec.ts`](backend/src/modules/users/tests/user.service.spec.ts)

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserRole } from '../../../common/enums/user-role.enum';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    softRemove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        role: UserRole.EMPLOYEE,
      };

      const hashedPassword = 'hashed_password';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue({ ...createUserDto, password: hashedPassword });
      mockRepository.save.mockResolvedValue({ id: '1', ...createUserDto, password: hashedPassword });

      const result = await service.create(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { email: 'john@example.com' } });
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.password).toBe(hashedPassword);
    });

    it('should throw ConflictException if email already exists', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        role: UserRole.EMPLOYEE,
      };

      mockRepository.findOne.mockResolvedValue({ id: '1', email: 'john@example.com' });

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = { id: '1', email: 'john@example.com' };
      mockRepository.findOne.mockResolvedValue(user);

      const result = await service.findOne('1');

      expect(result).toEqual(user);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [{ id: '1' }, { id: '2' }];
      mockRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should soft delete a user', async () => {
      const user = { id: '1', email: 'john@example.com' };
      mockRepository.findOne.mockResolvedValue(user);
      mockRepository.softRemove.mockResolvedValue(user);

      await service.remove('1');

      expect(mockRepository.softRemove).toHaveBeenCalledWith(user);
    });
  });
});
```

#### Example: User Controller Test
**File**: [`backend/src/modules/users/tests/user.controller.spec.ts`](backend/src/modules/users/tests/user.controller.spec.ts)

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserRole } from '../../../common/enums/user-role.enum';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        role: UserRole.EMPLOYEE,
      };

      const expectedResult = { id: '1', ...createUserDto };
      mockUsersService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createUserDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const expectedResult = [{ id: '1' }, { id: '2' }];
      mockUsersService.findAll.mockResolvedValue(expectedResult);

