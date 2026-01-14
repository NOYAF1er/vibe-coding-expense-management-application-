import { ApiProperty } from '@nestjs/swagger';
import { ExpenseReportStatus } from '../../../common/enums/expense-report-status.enum';

/**
 * DTO for expense report response
 */
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
