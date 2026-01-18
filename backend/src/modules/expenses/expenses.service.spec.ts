import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { AttachmentsService } from './attachments.service';
import { Expense } from './entities/expense.entity';
import { ExpenseReportsService } from '../expense-reports/expense-reports.service';
import { ExpenseCategory } from '../../common/enums/expense-category.enum';

describe('ExpensesService', () => {
  let service: ExpensesService;
  let repository: Repository<Expense>;
  let attachmentsService: AttachmentsService;
  let expenseReportsService: ExpenseReportsService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockAttachmentsService = {
    uploadAttachment: jest.fn(),
  };

  const mockExpenseReportsService = {
    recalculateTotalAmount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        {
          provide: getRepositoryToken(Expense),
          useValue: mockRepository,
        },
        {
          provide: AttachmentsService,
          useValue: mockAttachmentsService,
        },
        {
          provide: ExpenseReportsService,
          useValue: mockExpenseReportsService,
        },
      ],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
    repository = module.get<Repository<Expense>>(getRepositoryToken(Expense));
    attachmentsService = module.get<AttachmentsService>(AttachmentsService);
    expenseReportsService = module.get<ExpenseReportsService>(ExpenseReportsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an expense', async () => {
      const createDto = {
        reportId: 'report-1',
        category: ExpenseCategory.TRAVEL,
        amount: 100,
        name: 'Travel expense',
        expenseDate: '2026-01-18',
      };

      const mockExpense = {
        id: 'expense-1',
        ...createDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockReturnValue(mockExpense);
      mockRepository.save.mockResolvedValue(mockExpense);
      mockExpenseReportsService.recalculateTotalAmount.mockResolvedValue(undefined);

      const result = await service.create(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalled();
      expect(mockExpenseReportsService.recalculateTotalAmount).toHaveBeenCalledWith('report-1');
      expect(result).toEqual(mockExpense);
    });
  });

  describe('createWithAttachment', () => {
    it('should create expense without file', async () => {
      const createDto = {
        reportId: 'report-1',
        category: ExpenseCategory.MEAL,
        amount: 50,
        name: 'Lunch',
        expenseDate: '2026-01-18',
      };

      const mockExpense = {
        id: 'expense-1',
        ...createDto,
        attachments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockReturnValue(mockExpense);
      mockRepository.save.mockResolvedValue(mockExpense);
      mockRepository.findOne.mockResolvedValue(mockExpense);
      mockExpenseReportsService.recalculateTotalAmount.mockResolvedValue(undefined);

      const result = await service.createWithAttachment(createDto);

      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockAttachmentsService.uploadAttachment).not.toHaveBeenCalled();
      expect(result).toEqual(mockExpense);
    });

    it('should create expense with file', async () => {
      const createDto = {
        reportId: 'report-1',
        category: ExpenseCategory.TRAVEL,
        amount: 150,
        name: 'Flight',
        expenseDate: '2026-01-18',
      };

      const mockFile = {
        originalname: 'ticket.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from('test'),
      } as Express.Multer.File;

      const mockExpense = {
        id: 'expense-1',
        ...createDto,
        attachments: [
          {
            id: 'attachment-1',
            fileName: 'ticket.pdf',
            mimeType: 'application/pdf',
            fileSize: 1024,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockReturnValue({ id: 'expense-1', ...createDto });
      mockRepository.save.mockResolvedValue({ id: 'expense-1', ...createDto });
      mockRepository.findOne.mockResolvedValue(mockExpense);
      mockExpenseReportsService.recalculateTotalAmount.mockResolvedValue(undefined);
      mockAttachmentsService.uploadAttachment.mockResolvedValue({
        id: 'attachment-1',
        fileName: 'ticket.pdf',
      });

      const result = await service.createWithAttachment(createDto, mockFile);

      expect(mockAttachmentsService.uploadAttachment).toHaveBeenCalledWith('expense-1', mockFile);
      expect(result.attachments).toHaveLength(1);
    });
  });

  describe('findAll', () => {
    it('should return all expenses without attachments', async () => {
      const mockExpenses = [
        {
          id: 'expense-1',
          name: 'Expense 1',
          amount: 100,
        },
        {
          id: 'expense-2',
          name: 'Expense 2',
          amount: 200,
        },
      ];

      mockRepository.find.mockResolvedValue(mockExpenses);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['report'],
      });
      expect(result).toEqual(mockExpenses);
    });
  });

  describe('findOne', () => {
    it('should return expense with attachments metadata', async () => {
      const mockExpense = {
        id: 'expense-1',
        name: 'Expense 1',
        attachments: [
          {
            id: 'attachment-1',
            fileName: 'receipt.pdf',
            mimeType: 'application/pdf',
            fileSize: 1024,
          },
        ],
      };

      mockRepository.findOne.mockResolvedValue(mockExpense);

      const result = await service.findOne('expense-1');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'expense-1' },
        relations: ['report', 'attachments'],
      });
      expect(result).toEqual(mockExpense);
      expect(result.attachments).toHaveLength(1);
    });

    it('should throw NotFoundException if expense not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByReport', () => {
    it('should return expenses without attachments', async () => {
      const mockExpenses = [
        { id: 'expense-1', reportId: 'report-1' },
        { id: 'expense-2', reportId: 'report-1' },
      ];

      mockRepository.find.mockResolvedValue(mockExpenses);

      const result = await service.findByReport('report-1');

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { reportId: 'report-1' },
      });
      expect(result).toEqual(mockExpenses);
    });
  });

  describe('update', () => {
    it('should update expense', async () => {
      const updateDto = {
        amount: 250,
        name: 'Updated expense',
      };

      const existingExpense = {
        id: 'expense-1',
        reportId: 'report-1',
        amount: 100,
        name: 'Old expense',
      };

      const updatedExpense = {
        ...existingExpense,
        ...updateDto,
      };

      mockRepository.findOne.mockResolvedValue(existingExpense);
      mockRepository.save.mockResolvedValue(updatedExpense);
      mockExpenseReportsService.recalculateTotalAmount.mockResolvedValue(undefined);

      const result = await service.update('expense-1', updateDto);

      expect(mockRepository.save).toHaveBeenCalled();
      expect(mockExpenseReportsService.recalculateTotalAmount).toHaveBeenCalledWith('report-1');
      expect(result).toEqual(updatedExpense);
    });
  });

  describe('updateWithAttachment', () => {
    it('should update expense without new file', async () => {
      const updateDto = {
        amount: 300,
      };

      const existingExpense = {
        id: 'expense-1',
        reportId: 'report-1',
        amount: 200,
      };

      mockRepository.findOne.mockResolvedValue(existingExpense);
      mockRepository.save.mockResolvedValue({ ...existingExpense, ...updateDto });
      mockExpenseReportsService.recalculateTotalAmount.mockResolvedValue(undefined);

      const result = await service.updateWithAttachment('expense-1', updateDto);

      expect(mockAttachmentsService.uploadAttachment).not.toHaveBeenCalled();
      expect(result.amount).toBe(300);
    });

    it('should update expense with new file', async () => {
      const updateDto = {
        amount: 350,
      };

      const mockFile = {
        originalname: 'new-receipt.pdf',
        mimetype: 'application/pdf',
        size: 2048,
        buffer: Buffer.from('test'),
      } as Express.Multer.File;

      const existingExpense = {
        id: 'expense-1',
        reportId: 'report-1',
        amount: 300,
      };

      const updatedExpense = {
        ...existingExpense,
        ...updateDto,
        attachments: [
          {
            id: 'attachment-2',
            fileName: 'new-receipt.pdf',
          },
        ],
      };

      mockRepository.findOne.mockResolvedValue(existingExpense);
      mockRepository.save.mockResolvedValue({ ...existingExpense, ...updateDto });
      mockExpenseReportsService.recalculateTotalAmount.mockResolvedValue(undefined);
      // Second call to findOne after update
      mockRepository.findOne.mockResolvedValueOnce(existingExpense).mockResolvedValueOnce(updatedExpense);
      mockAttachmentsService.uploadAttachment.mockResolvedValue({
        id: 'attachment-2',
        fileName: 'new-receipt.pdf',
      });

      const result = await service.updateWithAttachment('expense-1', updateDto, mockFile);

      expect(mockAttachmentsService.uploadAttachment).toHaveBeenCalledWith('expense-1', mockFile);
    });
  });

  describe('remove', () => {
    it('should delete expense', async () => {
      const mockExpense = {
        id: 'expense-1',
        reportId: 'report-1',
        name: 'Expense to delete',
      };

      mockRepository.findOne.mockResolvedValue(mockExpense);
      mockRepository.remove.mockResolvedValue(mockExpense);
      mockExpenseReportsService.recalculateTotalAmount.mockResolvedValue(undefined);

      await service.remove('expense-1');

      expect(mockRepository.remove).toHaveBeenCalledWith(mockExpense);
      expect(mockExpenseReportsService.recalculateTotalAmount).toHaveBeenCalledWith('report-1');
    });

    it('should throw NotFoundException if expense not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(NotFoundException);
    });
  });
});
