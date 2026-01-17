import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseReport } from './entities/expense-report.entity';
import { Expense } from '../expenses/entities/expense.entity';
import { CreateExpenseReportDto } from './dto/create-expense-report.dto';
import { UpdateExpenseReportDto } from './dto/update-expense-report.dto';
import { QueryExpenseReportsDto } from './dto/query-expense-reports.dto';
import { PaginatedExpenseReportsDto } from './dto/paginated-expense-reports.dto';
import { ExpenseReportResponseDto } from './dto/expense-report-response.dto';
import { ExpenseReportsRepository } from './expense-reports.repository';
import { ExpenseReportStatus } from '../../common/enums/expense-report-status.enum';
import { ExpenseStatus } from '../../common/enums/expense-status.enum';
import { ExpenseCategory } from '../../common/enums/expense-category.enum';

/**
 * Service for managing expense reports
 */
@Injectable()
export class ExpenseReportsService {
  constructor(
    @InjectRepository(ExpenseReport)
    private readonly reportRepository: Repository<ExpenseReport>,
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
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

    // Transform data to include categories
    const transformedData = data.map(report => this.transformReportWithCategories(report));

    return {
      data: transformedData,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Transform expense report to include unique categories from expenses
   */
  private transformReportWithCategories(report: ExpenseReport): any {
    const categories = report.expenses
      ? Array.from(new Set(report.expenses.map(expense => expense.category)))
      : [];

    return {
      ...report,
      categories,
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
   * Calculate total amount from expenses, excluding REJECTED expenses
   */
  async calculateTotal(id: string): Promise<number> {
    const result = await this.expenseRepository
      .createQueryBuilder('expense')
      .select('COALESCE(SUM(expense.amount), 0)', 'total')
      .where('expense.reportId = :id', { id })
      .andWhere('expense.status != :rejectedStatus', {
        rejectedStatus: ExpenseStatus.REJECTED
      })
      .getRawOne();
    
    return Number(result.total);
  }

  /**
   * Recalculate and update the total amount for a report
   */
  async recalculateTotalAmount(reportId: string): Promise<ExpenseReport> {
    const newTotal = await this.calculateTotal(reportId);
    const report = await this.findOne(reportId);
    report.totalAmount = newTotal;
    return this.reportRepository.save(report);
  }

  /**
   * Submit an expense report (change status from DRAFT to SUBMITTED)
   * All expenses are already in SUBMITTED status by default
   */
  async submit(id: string): Promise<ExpenseReport> {
    const report = await this.findOne(id);
    
    if (report.status !== ExpenseReportStatus.DRAFT) {
      throw new BadRequestException(
        `Report cannot be submitted. Current status is ${report.status}, but must be ${ExpenseReportStatus.DRAFT}`
      );
    }

    // Update report status
    report.status = ExpenseReportStatus.SUBMITTED;
    return this.reportRepository.save(report);
  }
}
