import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { Expense } from './entities/expense.entity';
import { ExpenseReportsModule } from '../expense-reports/expense-reports.module';

/**
 * Module for expense management
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Expense]),
    forwardRef(() => ExpenseReportsModule),
  ],
  controllers: [ExpensesController],
  providers: [ExpensesService],
  exports: [ExpensesService],
})
export class ExpensesModule {}
