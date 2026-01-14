import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseReport } from './entities/expense-report.entity';
import { CreateExpenseReportDto } from './dto/create-expense-report.dto';
import { UpdateExpenseReportDto } from './dto/update-expense-report.dto';

/**
 * Service for managing expense reports
 */
@Injectable()
export class ExpenseReportsService {
  constructor(
    @InjectRepository(ExpenseReport)
    private readonly reportRepository: Repository<ExpenseReport>,
  ) {}

  /**
   * Create a new expense report
   */
  async create(createDto: CreateExpenseReportDto): Promise<ExpenseReport> {
    const report = this.reportRepository.create(createDto);
    return this.reportRepository.save(report);
  }

  /**
   * Find all expense reports
   */
  async findAll(): Promise<ExpenseReport[]> {
    return this.reportRepository.find({
      relations: ['user'],
    });
  }

  /**
   * Find one expense report by ID
   */
  async findOne(id: string): Promise<ExpenseReport> {
    const report = await this.reportRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!report) {
      throw new NotFoundException(`ExpenseReport with ID ${id} not found`);
    }

    return report;
  }

  /**
   * Find all reports by user ID
   */
  async findByUser(userId: string): Promise<ExpenseReport[]> {
    return this.reportRepository.find({
      where: { userId },
    });
  }

  /**
   * Update an expense report
   */
  async update(id: string, updateDto: UpdateExpenseReportDto): Promise<ExpenseReport> {
    const report = await this.findOne(id);
    Object.assign(report, updateDto);
    return this.reportRepository.save(report);
  }

  /**
   * Soft delete an expense report
   */
  async remove(id: string): Promise<void> {
    const report = await this.findOne(id);
    await this.reportRepository.softRemove(report);
  }

  /**
   * Calculate total amount from expenses (will be implemented after Expense entity)
   */
  async calculateTotal(id: string): Promise<number> {
    const report = await this.findOne(id);
    // For now, return the current total
    // This will be updated once Expense entity is created
    return Number(report.totalAmount);
  }
}
