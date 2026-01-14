import { ApiProperty } from '@nestjs/swagger';
import { ExpenseReportStatus } from '../../../common/enums/expense-report-status.enum';
import { ExpenseCategory } from '../../../common/enums/expense-category.enum';

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

  @ApiProperty({
    type: [String],
    enum: ExpenseCategory,
    description: 'Unique categories from all expenses in this report',
    required: false
  })
  categories?: ExpenseCategory[];
}
