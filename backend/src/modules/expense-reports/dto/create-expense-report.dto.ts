import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MaxLength, IsDateString } from 'class-validator';

/**
 * DTO for creating a new expense report
 */
export class CreateExpenseReportDto {
  @ApiProperty({ example: 'uuid-of-user', description: 'User ID who owns this report' })
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @ApiProperty({ example: 'Business Trip to San Francisco', maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @ApiProperty({ example: '2024-01-15', description: 'Date of the expense report' })
  @IsDateString()
  @IsNotEmpty()
  reportDate!: string;
}
