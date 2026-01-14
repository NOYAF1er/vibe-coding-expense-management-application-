import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseReportsService } from './expense-reports.service';
import { ExpenseReportsRepository } from './expense-reports.repository';
import { ExpenseReport } from './entities/expense-report.entity';
import { ExpenseReportStatus } from '../../common/enums/expense-report-status.enum';
import { QueryExpenseReportsDto, SortBy, SortOrder } from './dto/query-expense-reports.dto';

describe('ExpenseReportsService', () => {
  let service: ExpenseReportsService;
  let repository: Repository<ExpenseReport>;
  let customRepository: ExpenseReportsRepository;

  const mockExpenseReport: ExpenseReport = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: '123e4567-e89b-12d3-a456-426614174001',
    title: 'Q4 Client On-site',
    reportDate: new Date('2023-10-26'),
    status: ExpenseReportStatus.SUBMITTED,
    totalAmount: 175.0,
    currency: 'EUR',
    createdAt: new Date('2023-10-26'),
    updatedAt: new Date('2023-10-26'),
  } as ExpenseReport;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    softRemove: jest.fn(),
  };

  const mockCustomRepository = {
    findWithFilters: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpenseReportsService,
        {
          provide: getRepositoryToken(ExpenseReport),
          useValue: mockRepository,
        },
        {
          provide: ExpenseReportsRepository,
          useValue: mockCustomRepository,
        },
      ],
    }).compile();

    service = module.get<ExpenseReportsService>(ExpenseReportsService);
    repository = module.get<Repository<ExpenseReport>>(
      getRepositoryToken(ExpenseReport),
    );
    customRepository = module.get<ExpenseReportsRepository>(
      ExpenseReportsRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllPaginated', () => {
    it('should return paginated expense reports with default parameters', async () => {
      const queryDto: QueryExpenseReportsDto = {
        page: 1,
        limit: 10,
      };

      const mockReports = [mockExpenseReport];
      const mockTotal = 1;

      mockCustomRepository.findWithFilters.mockResolvedValue([
        mockReports,
        mockTotal,
      ]);

      const result = await service.findAllPaginated(queryDto);

      expect(result).toEqual({
        data: mockReports,
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      });
      expect(mockCustomRepository.findWithFilters).toHaveBeenCalledWith(
        queryDto,
      );
    });

    it('should return paginated expense reports with search filter', async () => {
      const queryDto: QueryExpenseReportsDto = {
        page: 1,
        limit: 10,
        search: 'Client',
      };

      const mockReports = [mockExpenseReport];
      const mockTotal = 1;

      mockCustomRepository.findWithFilters.mockResolvedValue([
        mockReports,
        mockTotal,
      ]);

      const result = await service.findAllPaginated(queryDto);

      expect(result.data).toEqual(mockReports);
      expect(result.meta.total).toBe(1);
      expect(mockCustomRepository.findWithFilters).toHaveBeenCalledWith(
        queryDto,
      );
    });

    it('should return paginated expense reports with status filter', async () => {
      const queryDto: QueryExpenseReportsDto = {
        page: 1,
        limit: 10,
        status: ExpenseReportStatus.SUBMITTED,
      };

      const mockReports = [mockExpenseReport];
      const mockTotal = 1;

      mockCustomRepository.findWithFilters.mockResolvedValue([
        mockReports,
        mockTotal,
      ]);

      const result = await service.findAllPaginated(queryDto);

      expect(result.data).toEqual(mockReports);
      expect(result.meta.total).toBe(1);
      expect(mockCustomRepository.findWithFilters).toHaveBeenCalledWith(
        queryDto,
      );
    });

    it('should return paginated expense reports with amount range filter', async () => {
      const queryDto: QueryExpenseReportsDto = {
        page: 1,
        limit: 10,
        minAmount: 50,
        maxAmount: 500,
      };

      const mockReports = [mockExpenseReport];
      const mockTotal = 1;

      mockCustomRepository.findWithFilters.mockResolvedValue([
        mockReports,
        mockTotal,
      ]);

      const result = await service.findAllPaginated(queryDto);

      expect(result.data).toEqual(mockReports);
      expect(result.meta.total).toBe(1);
      expect(mockCustomRepository.findWithFilters).toHaveBeenCalledWith(
        queryDto,
      );
    });

    it('should return paginated expense reports sorted by totalAmount ascending', async () => {
      const queryDto: QueryExpenseReportsDto = {
        page: 1,
        limit: 10,
        sortBy: SortBy.TOTAL_AMOUNT,
        order: SortOrder.ASC,
      };

      const mockReports = [mockExpenseReport];
      const mockTotal = 1;

      mockCustomRepository.findWithFilters.mockResolvedValue([
        mockReports,
        mockTotal,
      ]);

      const result = await service.findAllPaginated(queryDto);

      expect(result.data).toEqual(mockReports);
      expect(mockCustomRepository.findWithFilters).toHaveBeenCalledWith(
        queryDto,
      );
    });

    it('should calculate correct total pages', async () => {
      const queryDto: QueryExpenseReportsDto = {
        page: 1,
        limit: 10,
      };

      const mockReports = Array(25).fill(mockExpenseReport);
      const mockTotal = 25;

      mockCustomRepository.findWithFilters.mockResolvedValue([
        mockReports.slice(0, 10),
        mockTotal,
      ]);

      const result = await service.findAllPaginated(queryDto);

      expect(result.meta.totalPages).toBe(3);
      expect(result.meta.total).toBe(25);
    });

    it('should handle empty results', async () => {
      const queryDto: QueryExpenseReportsDto = {
        page: 1,
        limit: 10,
      };

      mockCustomRepository.findWithFilters.mockResolvedValue([[], 0]);

      const result = await service.findAllPaginated(queryDto);

      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
      expect(result.meta.totalPages).toBe(0);
    });

    it('should handle pagination on second page', async () => {
      const queryDto: QueryExpenseReportsDto = {
        page: 2,
        limit: 10,
      };

      const mockReports = [mockExpenseReport];
      const mockTotal = 15;

      mockCustomRepository.findWithFilters.mockResolvedValue([
        mockReports,
        mockTotal,
      ]);

      const result = await service.findAllPaginated(queryDto);

      expect(result.meta.page).toBe(2);
      expect(result.meta.totalPages).toBe(2);
    });

    it('should apply multiple filters simultaneously', async () => {
      const queryDto: QueryExpenseReportsDto = {
        page: 1,
        limit: 10,
        search: 'Client',
        status: ExpenseReportStatus.SUBMITTED,
        minAmount: 100,
        maxAmount: 200,
        sortBy: SortBy.REPORT_DATE,
        order: SortOrder.DESC,
      };

      const mockReports = [mockExpenseReport];
      const mockTotal = 1;

      mockCustomRepository.findWithFilters.mockResolvedValue([
        mockReports,
        mockTotal,
      ]);

      const result = await service.findAllPaginated(queryDto);

      expect(result.data).toEqual(mockReports);
      expect(mockCustomRepository.findWithFilters).toHaveBeenCalledWith(
        queryDto,
      );
    });
  });
});
