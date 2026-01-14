import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseReport } from './entities/expense-report.entity';
import { CreateExpenseReportDto } from './dto/create-expense-report.dto';
import { UpdateExpenseReportDto } from './dto/update-expense-report.dto';
import { QueryExpenseReportsDto } from './dto/query-expense-reports.dto';
import { PaginatedExpenseReportsDto } from './dto/paginated-expense-reports.dto';
import { ExpenseReportsRepository } from './expense-reports.repository';

/**
 * Service for managing expense reports
 */
@Injectable()
export class ExpenseReportsService {
  constructor(
    @InjectRepository(ExpenseReport)
    private readonly reportRepository: Repository<ExpenseReport>,
    private readonly expenseReportsRepository: ExpenseReportsRepository,
  ) {}

  /**
   * Create a new expense report
   */
  async create(createDto: CreateExpenseReportDto): Promise<ExpenseReport> {
    const report = this.reportRepository.create(createDto);
    return this.reportRepository.save(report);
  }

  /**
   * Find all expense reports (deprecated - use findAllPaginated instead)
   */
  async findAll(): Promise<ExpenseReport[]> {
    return this.reportRepository.find({
      relations: ['user'],
    });
  }

  /**
   * Find expense reports with pagination, search, filters, and sorting
   */
  async findAllPaginated(
    queryDto: QueryExpenseReportsDto,
  ): Promise<PaginatedExpenseReportsDto> {
    const [data, total] = await this.expenseReportsRepository.findWithFilters(queryDto);

    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
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
