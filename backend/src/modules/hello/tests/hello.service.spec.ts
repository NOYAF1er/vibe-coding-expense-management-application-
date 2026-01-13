import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HelloService } from '../hello.service';
import { HelloEntity } from '../hello.entity';

describe('HelloService', () => {
  let service: HelloService;
  let repository: Repository<HelloEntity>;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HelloService,
        {
          provide: getRepositoryToken(HelloEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<HelloService>(HelloService);
    repository = module.get<Repository<HelloEntity>>(getRepositoryToken(HelloEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have repository injected', () => {
    expect(repository).toBeDefined();
  });

  describe('getHello', () => {
    it('should return existing hello message from database', async () => {
      // Arrange
      const mockHello: HelloEntity = {
        id: 1,
        message: 'Hello from NestJS!',
        timestamp: new Date('2026-01-13T15:45:00.000Z'),
      };

      mockRepository.findOne.mockResolvedValue(mockHello);

      // Act
      const result = await service.getHello();

      // Assert
      expect(result).toEqual({
        id: 1,
        message: 'Hello from NestJS!',
        timestamp: new Date('2026-01-13T15:45:00.000Z'),
      });
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: {},
        order: { id: 'DESC' },
      });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should create new hello message if none exists', async () => {
      // Arrange
      const mockHello: HelloEntity = {
        id: 1,
        message: 'Hello from NestJS!',
        timestamp: new Date('2026-01-13T15:45:00.000Z'),
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockHello);
      mockRepository.save.mockResolvedValue(mockHello);

      // Act
      const result = await service.getHello();

      // Assert
      expect(result).toEqual({
        id: 1,
        message: 'Hello from NestJS!',
        timestamp: new Date('2026-01-13T15:45:00.000Z'),
      });
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: {},
        order: { id: 'DESC' },
      });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.create).toHaveBeenCalledWith({
        message: 'Hello from NestJS!',
      });
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledWith(mockHello);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should return correct response structure', async () => {
      // Arrange
      const mockHello: HelloEntity = {
        id: 42,
        message: 'Test message',
        timestamp: new Date('2026-01-13T10:00:00.000Z'),
      };

      mockRepository.findOne.mockResolvedValue(mockHello);

      // Act
      const result = await service.getHello();

      // Assert
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.id).toBe('number');
      expect(typeof result.message).toBe('string');
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const dbError = new Error('Database connection failed');
      mockRepository.findOne.mockRejectedValue(dbError);

      // Act & Assert
      await expect(service.getHello()).rejects.toThrow('Database connection failed');
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should handle save errors when creating new message', async () => {
      // Arrange
      const mockHello: HelloEntity = {
        id: 1,
        message: 'Hello from NestJS!',
        timestamp: new Date(),
      };
      const saveError = new Error('Failed to save entity');

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockHello);
      mockRepository.save.mockRejectedValue(saveError);

      // Act & Assert
      await expect(service.getHello()).rejects.toThrow('Failed to save entity');
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should use correct query parameters for findOne', async () => {
      // Arrange
      const mockHello: HelloEntity = {
        id: 5,
        message: 'Latest message',
        timestamp: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(mockHello);

      // Act
      await service.getHello();

      // Assert
      expect(mockRepository.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {},
          order: { id: 'DESC' },
        }),
      );
    });
  });
});
