import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { Attachment } from './entities/attachment.entity';

describe('AttachmentsService', () => {
  let service: AttachmentsService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttachmentsService,
        {
          provide: getRepositoryToken(Attachment),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AttachmentsService>(AttachmentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadAttachment', () => {
    it('should upload a valid file', async () => {
      const mockFile: Express.Multer.File = {
        originalname: 'receipt.pdf',
        mimetype: 'application/pdf',
        size: 1024 * 512, // 512KB
        buffer: Buffer.from('test'),
        fieldname: 'file',
        encoding: '7bit',
        stream: null as any,
        destination: '',
        filename: '',
        path: '',
      };

      const mockAttachment = {
        id: 'test-id',
        expenseId: 'expense-1',
        fileName: 'receipt.pdf',
        mimeType: 'application/pdf',
        fileSize: 1024 * 512,
        uploadedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockReturnValue(mockAttachment);
      mockRepository.save.mockResolvedValue({ ...mockAttachment, fileData: Buffer.from('test') });

      const result = await service.uploadAttachment('expense-1', mockFile);

      expect(mockRepository.create).toHaveBeenCalledWith({
        expenseId: 'expense-1',
        fileName: 'receipt.pdf',
        mimeType: 'application/pdf',
        fileSize: 1024 * 512,
        uploadedAt: expect.any(Date),
        fileData: expect.any(Buffer),
      });
      expect(result).not.toHaveProperty('fileData');
      expect(result.fileName).toBe('receipt.pdf');
    });

    it('should reject file exceeding size limit', async () => {
      const mockFile: Express.Multer.File = {
        originalname: 'large.pdf',
        mimetype: 'application/pdf',
        size: 6 * 1024 * 1024, // 6MB (exceeds 5MB limit)
        buffer: Buffer.from('test'),
        fieldname: 'file',
        encoding: '7bit',
        stream: null as any,
        destination: '',
        filename: '',
        path: '',
      };

      await expect(service.uploadAttachment('expense-1', mockFile)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.uploadAttachment('expense-1', mockFile)).rejects.toThrow(
        'File size exceeds maximum allowed size of 5MB',
      );
    });

    it('should reject invalid MIME type', async () => {
      const mockFile: Express.Multer.File = {
        originalname: 'virus.exe',
        mimetype: 'application/x-msdownload',
        size: 1024,
        buffer: Buffer.from('test'),
        fieldname: 'file',
        encoding: '7bit',
        stream: null as any,
        destination: '',
        filename: '',
        path: '',
      };

      await expect(service.uploadAttachment('expense-1', mockFile)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.uploadAttachment('expense-1', mockFile)).rejects.toThrow(
        /File type.*is not allowed/,
      );
    });
  });

  describe('findOne', () => {
    it('should return attachment without BLOB', async () => {
      const mockAttachment = {
        id: 'test-id',
        expenseId: 'expense-1',
        fileName: 'receipt.pdf',
        mimeType: 'application/pdf',
        fileSize: 1024,
        uploadedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        // Note: fileData is NOT included
      };

      mockRepository.findOne.mockResolvedValue(mockAttachment);

      const result = await service.findOne('test-id');

      expect(result).not.toHaveProperty('fileData');
      expect(result.fileName).toBe('receipt.pdf');
    });

    it('should throw NotFoundException if attachment not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByExpense', () => {
    it('should return attachments without BLOBs', async () => {
      const mockAttachments = [
        {
          id: 'test-id-1',
          expenseId: 'expense-1',
          fileName: 'receipt1.pdf',
          mimeType: 'application/pdf',
          fileSize: 1024,
          uploadedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'test-id-2',
          expenseId: 'expense-1',
          fileName: 'receipt2.jpg',
          mimeType: 'image/jpeg',
          fileSize: 2048,
          uploadedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockRepository.find.mockResolvedValue(mockAttachments);

      const result = await service.findByExpense('expense-1');

      expect(result).toHaveLength(2);
      expect(result[0]).not.toHaveProperty('fileData');
      expect(result[1]).not.toHaveProperty('fileData');
    });
  });

  describe('downloadAttachment - EXPLICIT BLOB LOADING', () => {
    it('should load BLOB data explicitly', async () => {
      const mockAttachment = {
        id: 'test-id',
        fileName: 'receipt.pdf',
        mimeType: 'application/pdf',
        fileData: Buffer.from('test-blob-data'),
      };

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockAttachment),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.downloadAttachment('test-id');

      // Verify that addSelect was called to explicitly load BLOB
      expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith('attachment.fileData');
      expect(result.fileData).toBeInstanceOf(Buffer);
      expect(result.fileName).toBe('receipt.pdf');
    });

    it('should throw NotFoundException if attachment not found', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await expect(service.downloadAttachment('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete attachment', async () => {
      const mockAttachment = {
        id: 'test-id',
        fileName: 'receipt.pdf',
      };

      mockRepository.findOne.mockResolvedValue(mockAttachment);
      mockRepository.remove.mockResolvedValue(mockAttachment);

      await service.remove('test-id');

      expect(mockRepository.remove).toHaveBeenCalledWith(mockAttachment);
    });

    it('should throw NotFoundException if attachment not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(NotFoundException);
    });
  });
});
