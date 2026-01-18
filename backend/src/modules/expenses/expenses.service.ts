import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto';
import { ExpenseReportsService } from '../expense-reports/expense-reports.service';
import { AttachmentsService } from './attachments.service';

/**
 * Service for managing expenses with attachment support
 */
@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @Inject(forwardRef(() => ExpenseReportsService))
    private readonly expenseReportsService: ExpenseReportsService,
    private readonly attachmentsService: AttachmentsService,
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

  /**
   * Create expense with optional file attachment
   * Returns expense with attachment metadata (no BLOB)
   */
  async createWithAttachment(
    createDto: CreateExpenseDto,
    file?: Express.Multer.File,
  ): Promise<Expense> {
    // Create expense first
    const expense = await this.create(createDto);

    // If file provided, upload it
    if (file) {
      await this.attachmentsService.uploadAttachment(expense.id, file);
    }

    // Return expense with attachments metadata (no BLOB)
    return this.findOne(expense.id);
  }

  async findAll(): Promise<Expense[]> {
    // NO attachments metadata in list view for performance
    return this.expenseRepository.find({
      relations: ['report']
    });
  }

  async findOne(id: string): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id },
      relations: ['report', 'attachments'], // Load attachments metadata (no BLOB) ONLY here
    });
    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
    return expense;
  }

  async findByReport(reportId: string): Promise<Expense[]> {
    // NO attachments metadata in list view for performance
    return this.expenseRepository.find({
      where: { reportId }
    });
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

  /**
   * Update expense with optional new file attachment
   * Returns expense with attachment metadata (no BLOB)
   */
  async updateWithAttachment(
    id: string,
    updateDto: UpdateExpenseDto,
    file?: Express.Multer.File,
  ): Promise<Expense> {
    // Update expense first
    const expense = await this.update(id, updateDto);

    // If file provided, upload it
    if (file) {
      await this.attachmentsService.uploadAttachment(expense.id, file);
    }

    // Return expense with attachments metadata (no BLOB)
    return this.findOne(expense.id);
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
