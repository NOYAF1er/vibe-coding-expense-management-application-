import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto';
import { ExpenseReportsService } from '../expense-reports/expense-reports.service';

/**
 * Service for managing expenses
 */
@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @Inject(forwardRef(() => ExpenseReportsService))
    private readonly expenseReportsService: ExpenseReportsService,
  ) {}

  async create(createDto: CreateExpenseDto): Promise<Expense> {
    const expense = this.expenseRepository.create(createDto);
    const savedExpense = await this.expenseRepository.save(expense);
    
    // Recalculate report total amount
    if (this.expenseReportsService) {
      await this.expenseReportsService.recalculateTotalAmount(savedExpense.reportId);
    }
    
    return savedExpense;
  }

  async findAll(): Promise<Expense[]> {
    return this.expenseRepository.find({ relations: ['report'] });
  }

  async findOne(id: string): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id },
      relations: ['report'],
    });
    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
    return expense;
  }

  async findByReport(reportId: string): Promise<Expense[]> {
    return this.expenseRepository.find({ where: { reportId } });
  }

  async update(id: string, updateDto: UpdateExpenseDto): Promise<Expense> {
    const expense = await this.findOne(id);
    const reportId = expense.reportId;
    Object.assign(expense, updateDto);
    const updatedExpense = await this.expenseRepository.save(expense);
    
    // Recalculate report total amount (status or amount may have changed)
    if (this.expenseReportsService) {
      await this.expenseReportsService.recalculateTotalAmount(reportId);
    }
    
    return updatedExpense;
  }

  async remove(id: string): Promise<void> {
    const expense = await this.findOne(id);
    const reportId = expense.reportId;
    await this.expenseRepository.remove(expense);
    
    // Recalculate report total amount
    if (this.expenseReportsService) {
      await this.expenseReportsService.recalculateTotalAmount(reportId);
    }
  }
}
