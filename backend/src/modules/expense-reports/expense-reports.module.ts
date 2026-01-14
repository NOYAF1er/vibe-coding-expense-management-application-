import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseReportsService } from './expense-reports.service';
import { ExpenseReportsController } from './expense-reports.controller';
import { ExpenseReport } from './entities/expense-report.entity';
import { Expense } from '../expenses/entities/expense.entity';
import { ExpenseReportsRepository } from './expense-reports.repository';

/**
 * Module for expense report management
 */
@Module({
  imports: [TypeOrmModule.forFeature([ExpenseReport, Expense])],
  controllers: [ExpenseReportsController],
  providers: [ExpenseReportsService, ExpenseReportsRepository],
  exports: [ExpenseReportsService],
})
export class ExpenseReportsModule {}
