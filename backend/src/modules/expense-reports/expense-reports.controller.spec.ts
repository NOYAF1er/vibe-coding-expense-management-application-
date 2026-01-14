import { Test, TestingModule } from '@nestjs/testing';
import { ExpenseReportsController } from './expense-reports.controller';
import { ExpenseReportsService } from './expense-reports.service';
import { ExpenseReportStatus } from '../../common/enums/expense-report-status.enum';
import { QueryExpenseReportsDto, SortBy, SortOrder } from './dto/query-expense-reports.dto';
import { PaginatedExpenseReportsDto } from './dto/paginated-expense-reports.dto';

describe('ExpenseReportsController', () => {
  let controller: ExpenseReportsController;
  let service: ExpenseReportsService;

  const mockExpenseReport = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: '123e4567-e89b-12d3-a456-426614174001',
    title: 'Q4 Client On-site',
    reportDate: new Date('2023-10-26'),
    status: ExpenseReportStatus.SUBMITTED,
    totalAmount: 175.0,
    currency: 'EUR',
    createdAt: new Date('2023-10-26'),
    updatedAt: new Date('2023-10-26'),
  };

  const mockService = {
    findAllPaginated: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    findByUser: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    calculateTotal: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpenseReportsController],
      providers: [
        {
          provide: ExpenseReportsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ExpenseReportsController>(ExpenseReportsController);
    service = module.get<ExpenseReportsService>(ExpenseReportsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated expense reports with default parameters', async () => {
      const queryDto: QueryExpenseReportsDto = {
        page: 1,
        limit: 10,
      };

      const mockResponse: PaginatedExpenseReportsDto = {
        data: [mockExpenseReport],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      };

      mockService.findAllPaginated.mockResolvedValue(mockResponse);

      const result = await controller.findAll(queryDto);

      expect(result).toEqual(mockResponse);
      expect(service.findAllPaginated).toHaveBeenCalledWith(queryDto);
    });

    it('should return paginated expense reports with search parameter', async () => {
      const queryDto: QueryExpenseReportsDto = {
        page: 1,
        limit: 10,
        search: 'Client',
      };

      const mockResponse: PaginatedExpenseReportsDto = {
        data: [mockExpenseReport],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      };

      mockService.findAllPaginated.mockResolvedValue(mockResponse);

      const result = await controller.findAll(queryDto);

      expect(result).toEqual(mockResponse);
      expect(service.findAllPaginated).toHaveBeenCalledWith(queryDto);
    });

    it('should return paginated expense reports with status filter', async () => {
      const queryDto: QueryExpenseReportsDto = {
        page: 1,
        limit: 10,
        status: ExpenseReportStatus.SUBMITTED,
      };

      const mockResponse: PaginatedExpenseReportsDto = {
        data: [mockExpenseReport],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      };

      mockService.findAllPaginated.mockResolvedValue(mockResponse);

      const result = await controller.findAll(queryDto);

      expect(result).toEqual(mockResponse);
      expect(service.findAllPaginated).toHaveBeenCalledWith(queryDto);
    });

    it('should return paginated expense reports with amount filters', async () => {
      const queryDto: QueryExpenseReportsDto = {
        page: 1,
        limit: 10,
        minAmount: 50,
        maxAmount: 500,
      };

      const mockResponse: PaginatedExpenseReportsDto = {
        data: [mockExpenseReport],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      };

      mockService.findAllPaginated.mockResolvedValue(mockResponse);

      const result = await controller.findAll(queryDto);

      expect(result).toEqual(mockResponse);
      expect(service.findAllPaginated).toHaveBeenCalledWith(queryDto);
    });

    it('should return paginated expense reports with sorting', async () => {
      const queryDto: QueryExpenseReportsDto = {
        page: 1,
        limit: 10,
        sortBy: SortBy.TOTAL_AMOUNT,
        order: SortOrder.ASC,
      };

      const mockResponse: PaginatedExpenseReportsDto = {
        data: [mockExpenseReport],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      };

      mockService.findAllPaginated.mockResolvedValue(mockResponse);

      const result = await controller.findAll(queryDto);

      expect(result).toEqual(mockResponse);
      expect(service.findAllPaginated).toHaveBeenCalledWith(queryDto);
    });

    it('should return paginated expense reports with all filters combined', async () => {
      const queryDto: QueryExpenseReportsDto = {
        page: 2,
        limit: 20,
        search: 'Office',
        status: ExpenseReportStatus.APPROVED,
        minAmount: 100,
        maxAmount: 1000,
        sortBy: SortBy.REPORT_DATE,
        order: SortOrder.DESC,
      };

      const mockResponse: PaginatedExpenseReportsDto = {
        data: [mockExpenseReport],
        meta: {
          page: 2,
          limit: 20,
          total: 25,
          totalPages: 2,
        },
      };

      mockService.findAllPaginated.mockResolvedValue(mockResponse);

      const result = await controller.findAll(queryDto);

      expect(result).toEqual(mockResponse);
      expect(service.findAllPaginated).toHaveBeenCalledWith(queryDto);
    });

    it('should return empty results when no reports match filters', async () => {
      const queryDto: QueryExpenseReportsDto = {
        page: 1,
        limit: 10,
        search: 'NonExistent',
      };

      const mockResponse: PaginatedExpenseReportsDto = {
        data: [],
        meta: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      };

      mockService.findAllPaginated.mockResolvedValue(mockResponse);

      const result = await controller.findAll(queryDto);

      expect(result).toEqual(mockResponse);
      expect(result.data).toHaveLength(0);
    });

    it('should handle pagination on different pages', async () => {
      const queryDto: QueryExpenseReportsDto = {
        page: 3,
        limit: 10,
      };

      const mockResponse: PaginatedExpenseReportsDto = {
        data: [mockExpenseReport],
        meta: {
          page: 3,
          limit: 10,
          total: 25,
          totalPages: 3,
        },
      };

      mockService.findAllPaginated.mockResolvedValue(mockResponse);

      const result = await controller.findAll(queryDto);

      expect(result.meta.page).toBe(3);
      expect(result.meta.totalPages).toBe(3);
    });
  });
});
