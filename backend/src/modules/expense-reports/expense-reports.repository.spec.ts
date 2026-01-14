import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { ExpenseReportsRepository } from './expense-reports.repository';
import { ExpenseReport } from './entities/expense-report.entity';
import { ExpenseReportStatus } from '../../common/enums/expense-report-status.enum';
import { QueryExpenseReportsDto, SortBy, SortOrder } from './dto/query-expense-reports.dto';

describe('ExpenseReportsRepository', () => {
  let repository: ExpenseReportsRepository;
  let dataSource: DataSource;

  const mockQueryBuilder = {
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  };

  const mockDataSource = {
    createEntityManager: jest.fn().mockReturnValue({}),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpenseReportsRepository,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    repository = module.get<ExpenseReportsRepository>(ExpenseReportsRepository);
    dataSource = module.get<DataSource>(DataSource);

    // Mock createQueryBuilder on repository instance
    jest.spyOn(repository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findWithFilters', () => {
    it('should apply search filter correctly', async () => {
      const queryDto: QueryExpenseReportsDto = {
        page: 1,
        limit: 10,
        search: 'Client',
      };

      const mockResults: [ExpenseReport[], number] = [[], 0];
      mockQueryBuilder.getManyAndCount.mockResolvedValue(mockResults);

      await repository.findWithFilters(queryDto);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'report.title LIKE :search',
        { search: '%Client%' },
      );
    });

    it('should apply status filter correctly', async () => {
      const queryDto: QueryExpenseReportsDto = {
        page: 1,
        limit: 10,
        status: ExpenseReportStatus.SUBMITTED,
      };

      const mockResults: [ExpenseReport[], number] = [[], 0];
      mockQueryBuilder.getManyAndCount.mockResolvedValue(mockResults);

      await repository.findWithFilters(queryDto);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'report.status = :status',
        { status: ExpenseReportStatus.SUBMITTED },
      );
    });

    it('should apply minAmount filter correctly', async () => {
      const queryDto: QueryExpenseReportsDto = {
        page: 1,
        limit: 10,
        minAmount: 50,
      };

      const mockResults: [ExpenseReport[], number] = [[], 0];
      mockQueryBuilder.getManyAndCount.mockResolvedValue(mockResults);

      await repository.findWithFilters(queryDto);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'report.totalAmount >= :minAmount',
        { minAmount: 50 },
      );
    });

    it('should apply maxAmount filter correctly', async () => {
      const queryDto: QueryExpenseReportsDto = {
        page: 1,
        limit: 10,
        maxAmount: 500,
      };

      const mockResults: [ExpenseReport[], number] = [[], 0];
      mockQueryBuilder.getManyAndCount.mockResolvedValue(mockResults);

      await repository.findWithFilters(queryDto);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'report.totalAmount <= :maxAmount',
        { maxAmount: 500 },
      );
    });

    it('should apply sorting by reportDate descending', async () => {
      const queryDto: QueryExpenseReportsDto = {
        page: 1,
        limit: 10,
        sortBy: SortBy.REPORT_DATE,
        order: SortOrder.DESC,
      };

      const mockResults: [ExpenseReport[], number] = [[], 0];
      mockQueryBuilder.getManyAndCount.mockResolvedValue(mockResults);

      await repository.findWithFilters(queryDto);

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'report.reportDate',
        'DESC',
      );
    });

    it('should apply sorting by totalAmount ascending', async () => {
      const queryDto: QueryExpenseReportsDto = {
        page: 1,
        limit: 10,
        sortBy: SortBy.TOTAL_AMOUNT,
        order: SortOrder.ASC,
      };

      const mockResults: [ExpenseReport[], number] = [[], 0];
      mockQueryBuilder.getManyAndCount.mockResolvedValue(mockResults);

      await repository.findWithFilters(queryDto);

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'report.totalAmount',
        'ASC',
      );
    });

    it('should apply pagination correctly', async () => {
      const queryDto: QueryExpenseReportsDto = {
        page: 2,
        limit: 10,
      };

      const mockResults: [ExpenseReport[], number] = [[], 0];
      mockQueryBuilder.getManyAndCount.mockResolvedValue(mockResults);

      await repository.findWithFilters(queryDto);

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
    });

    it('should apply multiple filters simultaneously', async () => {
      const queryDto: QueryExpenseReportsDto = {
        page: 1,
        limit: 10,
        search: 'Client',
        status: ExpenseReportStatus.SUBMITTED,
        minAmount: 100,
        maxAmount: 200,
      };

      const mockResults: [ExpenseReport[], number] = [[], 0];
      mockQueryBuilder.getManyAndCount.mockResolvedValue(mockResults);

      await repository.findWithFilters(queryDto);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(4);
    });

    it('should return results from query builder', async () => {
      const queryDto: QueryExpenseReportsDto = {
        page: 1,
        limit: 10,
      };

      const mockReport = {
        id: '123',
        title: 'Test Report',
      } as ExpenseReport;

      const mockResults: [ExpenseReport[], number] = [[mockReport], 1];
      mockQueryBuilder.getManyAndCount.mockResolvedValue(mockResults);

      const result = await repository.findWithFilters(queryDto);

      expect(result).toEqual(mockResults);
      expect(result[0]).toHaveLength(1);
      expect(result[1]).toBe(1);
    });
  });
});
