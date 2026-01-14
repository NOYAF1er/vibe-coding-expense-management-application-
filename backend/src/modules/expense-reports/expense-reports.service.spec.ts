import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseReportsService } from './expense-reports.service';
import { ExpenseReportsRepository } from './expense-reports.repository';
import { ExpenseReport } from './entities/expense-report.entity';
import { Expense } from '../expenses/entities/expense.entity';
import { ExpenseReportStatus } from '../../common/enums/expense-report-status.enum';
import { QueryExpenseReportsDto, SortBy, SortOrder } from './dto/query-expense-reports.dto';
import { CreateExpenseReportDto } from './dto/create-expense-report.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

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

  const mockExpenseRepository = {
    save: jest.fn(),
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
          provide: getRepositoryToken(Expense),
          useValue: mockExpenseRepository,
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
        data: mockReports.map(r => ({ ...r, categories: [] })),
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

      expect(result.data).toEqual(mockReports.map(r => ({ ...r, categories: [] })));
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

      expect(result.data).toEqual(mockReports.map(r => ({ ...r, categories: [] })));
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

      expect(result.data).toEqual(mockReports.map(r => ({ ...r, categories: [] })));
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

      expect(result.data).toEqual(mockReports.map(r => ({ ...r, categories: [] })));
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

      expect(result.data).toEqual(mockReports.map(r => ({ ...r, categories: [] })));
      expect(mockCustomRepository.findWithFilters).toHaveBeenCalledWith(
        queryDto,
      );
    });
  });

  describe('create', () => {
    it('should create a new expense report successfully', async () => {
      const createDto: CreateExpenseReportDto = {
        userId: '123e4567-e89b-12d3-a456-426614174001',
        title: 'Business Trip to Paris',
        reportDate: '2024-01-15',
      };

      const createdReport = {
        ...mockExpenseReport,
        ...createDto,
        reportDate: new Date(createDto.reportDate),
      };

      mockRepository.create.mockReturnValue(createdReport);
      mockRepository.save.mockResolvedValue(createdReport);

      const result = await service.create(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(createdReport);
      expect(result).toEqual(createdReport);
    });

    it('should create expense report with default values', async () => {
      const createDto: CreateExpenseReportDto = {
        userId: '123e4567-e89b-12d3-a456-426614174001',
        title: 'Q1 Expenses',
        reportDate: '2024-01-01',
      };

      const createdReport = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        ...createDto,
        reportDate: new Date(createDto.reportDate),
        status: ExpenseReportStatus.DRAFT,
        totalAmount: 0,
        currency: 'EUR',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockReturnValue(createdReport);
      mockRepository.save.mockResolvedValue(createdReport);

      const result = await service.create(createDto);

      expect(result.status).toBe(ExpenseReportStatus.DRAFT);
      expect(result.totalAmount).toBe(0);
      expect(result.currency).toBe('EUR');
    });

    it('should handle database errors during creation', async () => {
      const createDto: CreateExpenseReportDto = {
        userId: '123e4567-e89b-12d3-a456-426614174001',
        title: 'Test Report',
        reportDate: '2024-01-15',
      };

      mockRepository.create.mockReturnValue(createDto);
      mockRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createDto)).rejects.toThrow('Database error');
    });

    it('should handle foreign key constraint errors', async () => {
      const createDto: CreateExpenseReportDto = {
        userId: 'non-existent-user-id',
        title: 'Test Report',
        reportDate: '2024-01-15',
      };

      mockRepository.create.mockReturnValue(createDto);
      mockRepository.save.mockRejectedValue({
        code: 'SQLITE_CONSTRAINT',
        message: 'FOREIGN KEY constraint failed',
      });

      await expect(service.create(createDto)).rejects.toMatchObject({
        code: 'SQLITE_CONSTRAINT',
      });
    });
  });

  describe('findOne', () => {
    it('should return an expense report by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockExpenseReport);

      const result = await service.findOne(mockExpenseReport.id);

      expect(result).toEqual(mockExpenseReport);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockExpenseReport.id },
        relations: ['user'],
      });
    });

    it('should throw NotFoundException when report not found', async () => {
      const nonExistentId = 'non-existent-id';
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(nonExistentId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne(nonExistentId)).rejects.toThrow(
        `ExpenseReport with ID ${nonExistentId} not found`,
      );
    });
  });

  describe('submit', () => {
    it('should submit a draft expense report', async () => {
      const draftReport = {
        ...mockExpenseReport,
        status: ExpenseReportStatus.DRAFT,
      };

      const submittedReport = {
        ...draftReport,
        status: ExpenseReportStatus.SUBMITTED,
      };

      mockRepository.findOne.mockResolvedValue(draftReport);
      mockRepository.save.mockResolvedValue(submittedReport);

      const result = await service.submit(draftReport.id);

      expect(result.status).toBe(ExpenseReportStatus.SUBMITTED);
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: ExpenseReportStatus.SUBMITTED,
        }),
      );
    });

    it('should throw BadRequestException when report is not in DRAFT status', async () => {
      const submittedReport = {
        ...mockExpenseReport,
        status: ExpenseReportStatus.SUBMITTED,
      };

      mockRepository.findOne.mockResolvedValue(submittedReport);

      await expect(service.submit(submittedReport.id)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.submit(submittedReport.id)).rejects.toThrow(
        `Report cannot be submitted. Current status is ${ExpenseReportStatus.SUBMITTED}, but must be ${ExpenseReportStatus.DRAFT}`,
      );
    });

    it('should throw NotFoundException when report does not exist', async () => {
      const nonExistentId = 'non-existent-id';
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.submit(nonExistentId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
