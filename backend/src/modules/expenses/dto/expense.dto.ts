import { ApiProperty, PartialType } from '@nestjs/swagger';
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
import { ExpenseStatus } from '../../../common/enums/expense-status.enum';

/**
 * DTO for creating a new expense
 */
export class CreateExpenseDto {
  @ApiProperty({ example: 'uuid-of-report', description: 'Report ID' })
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

/**
 * DTO for updating an expense
 */
export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {}

/**
 * DTO for expense response
 */
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

  @ApiProperty({ enum: ExpenseStatus })
  status!: ExpenseStatus;

  @ApiProperty()
  receiptRequired!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
