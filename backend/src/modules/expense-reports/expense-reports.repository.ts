import { Injectable } from '@nestjs/common';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { ExpenseReport } from './entities/expense-report.entity';
import { QueryExpenseReportsDto } from './dto/query-expense-reports.dto';

/**
 * Repository for ExpenseReport with advanced query capabilities
 */
@Injectable()
export class ExpenseReportsRepository extends Repository<ExpenseReport> {
  constructor(private dataSource: DataSource) {
    super(ExpenseReport, dataSource.createEntityManager());
  }

  /**
   * Find expense reports with pagination, search, filters, and sorting
   */
  async findWithFilters(
    queryDto: QueryExpenseReportsDto,
  ): Promise<[ExpenseReport[], number]> {
    const { page = 1, limit = 10, search, status, minAmount, maxAmount, sortBy, order } = queryDto;

    const queryBuilder = this.createQueryBuilder('report');

    // Load expenses relation to get categories
    queryBuilder.leftJoinAndSelect('report.expenses', 'expense');

    // Apply search filter on title
    if (search) {
      queryBuilder.andWhere('report.title LIKE :search', {
        search: `%${search}%`,
      });
    }

    // Apply status filter
    if (status) {
      queryBuilder.andWhere('report.status = :status', { status });
    }

    // Apply minimum amount filter
    if (minAmount !== undefined) {
      queryBuilder.andWhere('report.totalAmount >= :minAmount', { minAmount });
    }

    // Apply maximum amount filter
    if (maxAmount !== undefined) {
      queryBuilder.andWhere('report.totalAmount <= :maxAmount', { maxAmount });
    }

    // Apply sorting
    const sortField = this.mapSortField(sortBy);
    queryBuilder.orderBy(sortField, order?.toUpperCase() as 'ASC' | 'DESC');

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Execute query and get total count
    return queryBuilder.getManyAndCount();
  }

  /**
   * Map sortBy field to actual database column
   */
  private mapSortField(sortBy?: string): string {
    const fieldMap: Record<string, string> = {
      reportDate: 'report.reportDate',
      totalAmount: 'report.totalAmount',
      createdAt: 'report.createdAt',
    };

    return fieldMap[sortBy || 'reportDate'] || 'report.reportDate';
  }
}
