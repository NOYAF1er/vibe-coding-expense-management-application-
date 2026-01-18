import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { Expense } from './entities/expense.entity';
import { Attachment } from './entities/attachment.entity';
import { AttachmentsService } from './attachments.service';
import { ExpenseReportsModule } from '../expense-reports/expense-reports.module';

/**
 * Module for expense management with file attachments
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Expense, Attachment]),
    forwardRef(() => ExpenseReportsModule),
  ],
  controllers: [ExpensesController],
  providers: [ExpensesService, AttachmentsService],
  exports: [ExpensesService, AttachmentsService],
})
export class ExpensesModule {}
