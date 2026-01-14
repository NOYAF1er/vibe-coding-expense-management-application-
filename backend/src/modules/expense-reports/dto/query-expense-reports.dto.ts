import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsInt, Min, Max, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ExpenseReportStatus } from '../../../common/enums/expense-report-status.enum';

/**
 * Enum for sorting fields
 */
export enum SortBy {
  REPORT_DATE = 'reportDate',
  TOTAL_AMOUNT = 'totalAmount',
  CREATED_AT = 'createdAt',
}

/**
 * Enum for sort order
 */
export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

/**
 * DTO for querying expense reports with pagination, search, filters, and sorting
 */
export class QueryExpenseReportsDto {
  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    minimum: 1,
    default: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    minimum: 1,
    maximum: 100,
    default: 10,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Search term for title field',
    example: 'Client',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: ExpenseReportStatus,
    example: ExpenseReportStatus.SUBMITTED,
  })
  @IsOptional()
  @IsEnum(ExpenseReportStatus)
  status?: ExpenseReportStatus;

  @ApiPropertyOptional({
    description: 'Filter by minimum amount',
    minimum: 0,
    example: 50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minAmount?: number;

  @ApiPropertyOptional({
    description: 'Filter by maximum amount',
    minimum: 0,
    example: 500,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxAmount?: number;

  @ApiPropertyOptional({
    description: 'Field to sort by',
    enum: SortBy,
    default: SortBy.REPORT_DATE,
    example: SortBy.TOTAL_AMOUNT,
  })
  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy = SortBy.REPORT_DATE;

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: SortOrder,
    default: SortOrder.DESC,
    example: SortOrder.ASC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder = SortOrder.DESC;
}
