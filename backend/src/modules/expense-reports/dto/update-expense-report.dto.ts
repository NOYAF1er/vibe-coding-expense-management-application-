import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateExpenseReportDto } from './create-expense-report.dto';
import { ExpenseReportStatus } from '../../../common/enums/expense-report-status.enum';

/**
 * DTO for updating an expense report
 */
export class UpdateExpenseReportDto extends PartialType(CreateExpenseReportDto) {
  @ApiProperty({ enum: ExpenseReportStatus, required: false })
  @IsEnum(ExpenseReportStatus)
  @IsOptional()
  status?: ExpenseReportStatus;

  @ApiProperty({ required: false, description: 'Reason for rejection if status is REJECTED' })
  @IsString()
  @IsOptional()
  rejectionReason?: string;
}
