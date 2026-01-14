import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseReportsService } from './expense-reports.service';
import { ExpenseReportsController } from './expense-reports.controller';
import { ExpenseReport } from './entities/expense-report.entity';

/**
 * Module for expense report management
 */
@Module({
  imports: [TypeOrmModule.forFeature([ExpenseReport])],
  controllers: [ExpenseReportsController],
  providers: [ExpenseReportsService],
  exports: [ExpenseReportsService],
})
export class ExpenseReportsModule {}
