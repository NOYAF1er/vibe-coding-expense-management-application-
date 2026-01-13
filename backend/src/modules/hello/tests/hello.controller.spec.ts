import { Test, TestingModule } from '@nestjs/testing';
import { HelloController } from '../hello.controller';
import { HelloService } from '../hello.service';
import { HelloResponseDto } from '../dto/hello-response.dto';

describe('HelloController', () => {
  let controller: HelloController;
  let service: HelloService;

  const mockHelloService = {
    getHello: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HelloController],
      providers: [
        {
          provide: HelloService,
          useValue: mockHelloService,
        },
      ],
    }).compile();

    controller = module.get<HelloController>(HelloController);
    service = module.get<HelloService>(HelloService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have service injected', () => {
    expect(service).toBeDefined();
  });

  describe('getHello', () => {
    it('should return hello response from service', async () => {
      // Arrange
      const mockResponse: HelloResponseDto = {
        id: 1,
        message: 'Hello from NestJS!',
        timestamp: new Date('2026-01-13T15:45:00.000Z'),
      };

      mockHelloService.getHello.mockResolvedValue(mockResponse);

      // Act
      const result = await controller.getHello();

      // Assert
      expect(result).toEqual(mockResponse);
      expect(service.getHello).toHaveBeenCalled();
      expect(service.getHello).toHaveBeenCalledTimes(1);
    });

    it('should return correct response structure', async () => {
      // Arrange
      const mockResponse: HelloResponseDto = {
        id: 42,
        message: 'Test message',
        timestamp: new Date('2026-01-13T10:00:00.000Z'),
      };

      mockHelloService.getHello.mockResolvedValue(mockResponse);

      // Act
      const result = await controller.getHello();

      // Assert
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('timestamp');
      expect(result.id).toBe(42);
      expect(result.message).toBe('Test message');
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should handle service errors', async () => {
      // Arrange
      const serviceError = new Error('Service error');
      mockHelloService.getHello.mockRejectedValue(serviceError);

      // Act & Assert
      await expect(controller.getHello()).rejects.toThrow('Service error');
      expect(service.getHello).toHaveBeenCalledTimes(1);
    });

    it('should call service without parameters', async () => {
      // Arrange
      const mockResponse: HelloResponseDto = {
        id: 1,
        message: 'Hello from NestJS!',
        timestamp: new Date(),
      };

      mockHelloService.getHello.mockResolvedValue(mockResponse);

      // Act
      await controller.getHello();

      // Assert
      expect(service.getHello).toHaveBeenCalledWith();
    });

    it('should return promise that resolves to HelloResponseDto', async () => {
      // Arrange
      const mockResponse: HelloResponseDto = {
        id: 1,
        message: 'Hello from NestJS!',
        timestamp: new Date(),
      };

      mockHelloService.getHello.mockResolvedValue(mockResponse);

      // Act
      const result = controller.getHello();

      // Assert
      expect(result).toBeInstanceOf(Promise);
      await expect(result).resolves.toEqual(mockResponse);
    });

    it('should handle multiple consecutive calls', async () => {
      // Arrange
      const mockResponse1: HelloResponseDto = {
        id: 1,
        message: 'First call',
        timestamp: new Date('2026-01-13T10:00:00.000Z'),
      };

      const mockResponse2: HelloResponseDto = {
        id: 2,
        message: 'Second call',
        timestamp: new Date('2026-01-13T11:00:00.000Z'),
      };

      mockHelloService.getHello
        .mockResolvedValueOnce(mockResponse1)
        .mockResolvedValueOnce(mockResponse2);

      // Act
      const result1 = await controller.getHello();
      const result2 = await controller.getHello();

      // Assert
      expect(result1).toEqual(mockResponse1);
      expect(result2).toEqual(mockResponse2);
      expect(service.getHello).toHaveBeenCalledTimes(2);
    });
  });
});
