import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { AttachmentsService } from './attachments.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto';
import { ExpenseCategory } from '../../common/enums/expense-category.enum';
import { ExpenseStatus } from '../../common/enums/expense-status.enum';
import { NotFoundException } from '@nestjs/common';

describe('ExpensesController', () => {
  let controller: ExpensesController;
  let expensesService: ExpensesService;
  let attachmentsService: AttachmentsService;

  const mockExpense = {
    id: 'expense-1',
    reportId: 'report-1',
    name: 'Test Expense',
    description: 'Test Description',
    amount: 100.50,
    expenseDate: new Date('2026-01-18'),
    category: ExpenseCategory.TRAVEL,
    status: ExpenseStatus.SUBMITTED,
    receiptRequired: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    attachments: [],
  };

  const mockExpensesService = {
    createWithAttachment: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByReport: jest.fn(),
    updateWithAttachment: jest.fn(),
    remove: jest.fn(),
  };

  const mockAttachmentsService = {
    downloadAttachment: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpensesController],
      providers: [
        {
          provide: ExpensesService,
          useValue: mockExpensesService,
        },
        {
          provide: AttachmentsService,
          useValue: mockAttachmentsService,
        },
      ],
    }).compile();

    controller = module.get<ExpensesController>(ExpensesController);
    expensesService = module.get<ExpensesService>(ExpensesService);
    attachmentsService = module.get<AttachmentsService>(AttachmentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an expense without file', async () => {
      const createDto: CreateExpenseDto = {
        reportId: 'report-1',
        name: 'Test Expense',
        amount: 100.50,
        expenseDate: '2026-01-18',
        category: ExpenseCategory.TRAVEL,
      };

      mockExpensesService.createWithAttachment.mockResolvedValue(mockExpense);

      const result = await controller.create(createDto);

      expect(expensesService.createWithAttachment).toHaveBeenCalledWith(createDto, undefined);
      expect(result).toEqual(mockExpense);
    });

    it('should create an expense with file', async () => {
      const createDto: CreateExpenseDto = {
        reportId: 'report-1',
        name: 'Test Expense',
        amount: 100.50,
        expenseDate: '2026-01-18',
        category: ExpenseCategory.TRAVEL,
      };

      const mockFile = {
        originalname: 'receipt.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from('test'),
      } as Express.Multer.File;

      const expenseWithAttachment = {
        ...mockExpense,
        attachments: [
          {
            id: 'attachment-1',
            fileName: 'receipt.pdf',
            mimeType: 'application/pdf',
            fileSize: 1024,
          },
        ],
      };

      mockExpensesService.createWithAttachment.mockResolvedValue(expenseWithAttachment);

      const result = await controller.create(createDto, mockFile);

      expect(expensesService.createWithAttachment).toHaveBeenCalledWith(createDto, mockFile);
      expect(result).toEqual(expenseWithAttachment);
    });
  });

  describe('findAll', () => {
    it('should return all expenses', async () => {
      const mockExpenses = [mockExpense];
      mockExpensesService.findAll.mockResolvedValue(mockExpenses);

      const result = await controller.findAll();

      expect(expensesService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockExpenses);
    });

    it('should return expenses filtered by reportId', async () => {
      const mockExpenses = [mockExpense];
      mockExpensesService.findByReport.mockResolvedValue(mockExpenses);

      const result = await controller.findAll('report-1');

      expect(expensesService.findByReport).toHaveBeenCalledWith('report-1');
      expect(result).toEqual(mockExpenses);
    });
  });

  describe('findOne', () => {
    it('should return a single expense', async () => {
      mockExpensesService.findOne.mockResolvedValue(mockExpense);

      const result = await controller.findOne('expense-1');

      expect(expensesService.findOne).toHaveBeenCalledWith('expense-1');
      expect(result).toEqual(mockExpense);
    });

    it('should throw NotFoundException when expense not found', async () => {
      mockExpensesService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an expense without file', async () => {
      const updateDto: UpdateExpenseDto = {
        name: 'Updated Expense',
        amount: 200.00,
      };

      const updatedExpense = {
        ...mockExpense,
        ...updateDto,
      };

      mockExpensesService.updateWithAttachment.mockResolvedValue(updatedExpense);

      const result = await controller.update('expense-1', updateDto);

      expect(expensesService.updateWithAttachment).toHaveBeenCalledWith('expense-1', updateDto, undefined);
      expect(result).toEqual(updatedExpense);
    });

    it('should update an expense with file', async () => {
      const updateDto: UpdateExpenseDto = {
        amount: 250.00,
      };

      const mockFile = {
        originalname: 'new-receipt.pdf',
        mimetype: 'application/pdf',
        size: 2048,
        buffer: Buffer.from('test'),
      } as Express.Multer.File;

      const updatedExpense = {
        ...mockExpense,
        ...updateDto,
        attachments: [
          {
            id: 'attachment-2',
            fileName: 'new-receipt.pdf',
            mimeType: 'application/pdf',
            fileSize: 2048,
          },
        ],
      };

      mockExpensesService.updateWithAttachment.mockResolvedValue(updatedExpense);

      const result = await controller.update('expense-1', updateDto, mockFile);

      expect(expensesService.updateWithAttachment).toHaveBeenCalledWith('expense-1', updateDto, mockFile);
      expect(result).toEqual(updatedExpense);
    });
  });

  describe('remove', () => {
    it('should delete an expense', async () => {
      mockExpensesService.remove.mockResolvedValue(undefined);

      await controller.remove('expense-1');

      expect(expensesService.remove).toHaveBeenCalledWith('expense-1');
    });

    it('should throw NotFoundException when expense not found', async () => {
      mockExpensesService.remove.mockRejectedValue(new NotFoundException());

      await expect(controller.remove('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('downloadAttachment', () => {
    it('should download an attachment', async () => {
      const mockAttachmentData = {
        fileName: 'receipt.pdf',
        mimeType: 'application/pdf',
        fileData: Buffer.from('test-file-data'),
      };

      mockAttachmentsService.downloadAttachment.mockResolvedValue(mockAttachmentData);

      const mockResponse = {
        set: jest.fn(),
      };

      const result = await controller.downloadAttachment('attachment-1', mockResponse as any);

      expect(attachmentsService.downloadAttachment).toHaveBeenCalledWith('attachment-1');
      expect(mockResponse.set).toHaveBeenCalledWith({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="receipt.pdf"',
      });
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when attachment not found', async () => {
      mockAttachmentsService.downloadAttachment.mockRejectedValue(new NotFoundException());

      const mockResponse = {
        set: jest.fn(),
      };

      await expect(controller.downloadAttachment('non-existent', mockResponse as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteAttachment', () => {
    it('should delete an attachment', async () => {
      mockAttachmentsService.remove.mockResolvedValue(undefined);

      await controller.deleteAttachment('attachment-1');

      expect(attachmentsService.remove).toHaveBeenCalledWith('attachment-1');
    });

    it('should throw NotFoundException when attachment not found', async () => {
      mockAttachmentsService.remove.mockRejectedValue(new NotFoundException());

      await expect(controller.deleteAttachment('non-existent')).rejects.toThrow(NotFoundException);
    });
  });
});
