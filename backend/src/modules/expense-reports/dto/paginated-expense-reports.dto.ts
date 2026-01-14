import { ApiProperty } from '@nestjs/swagger';
import { ExpenseReportResponseDto } from './expense-report-response.dto';

/**
 * Metadata for paginated response
 */
export class PaginationMetaDto {
  @ApiProperty({ description: 'Current page number', example: 1 })
  page!: number;

  @ApiProperty({ description: 'Number of items per page', example: 10 })
  limit!: number;

  @ApiProperty({ description: 'Total number of items', example: 42 })
  total!: number;

  @ApiProperty({ description: 'Total number of pages', example: 5 })
  totalPages!: number;
}

/**
 * DTO for paginated expense reports response
 */
export class PaginatedExpenseReportsDto {
  @ApiProperty({
    description: 'Array of expense reports',
    type: [ExpenseReportResponseDto],
  })
  data!: ExpenseReportResponseDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMetaDto,
  })
  meta!: PaginationMetaDto;
}
