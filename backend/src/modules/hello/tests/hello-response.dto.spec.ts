import { HelloResponseDto } from '../dto/hello-response.dto';

describe('HelloResponseDto', () => {
  it('should be defined', () => {
    expect(HelloResponseDto).toBeDefined();
  });

  it('should create instance with all required properties', () => {
    // Arrange & Act
    const dto = new HelloResponseDto();
    dto.id = 1;
    dto.message = 'Hello from NestJS!';
    dto.timestamp = new Date('2026-01-13T15:45:00.000Z');

    // Assert
    expect(dto.id).toBe(1);
    expect(dto.message).toBe('Hello from NestJS!');
    expect(dto.timestamp).toBeInstanceOf(Date);
  });

  it('should have correct property types', () => {
    // Arrange & Act
    const dto = new HelloResponseDto();
    dto.id = 42;
    dto.message = 'Test message';
    dto.timestamp = new Date();

    // Assert
    expect(typeof dto.id).toBe('number');
    expect(typeof dto.message).toBe('string');
    expect(dto.timestamp).toBeInstanceOf(Date);
  });

  it('should allow setting properties individually', () => {
    // Arrange
    const dto = new HelloResponseDto();

    // Act
    dto.id = 100;
    dto.message = 'Individual property test';
    dto.timestamp = new Date('2026-01-13T12:00:00.000Z');

    // Assert
    expect(dto.id).toBe(100);
    expect(dto.message).toBe('Individual property test');
    expect(dto.timestamp.toISOString()).toBe('2026-01-13T12:00:00.000Z');
  });

  it('should match HelloResponse interface structure', () => {
    // Arrange & Act
    const dto = new HelloResponseDto();
    dto.id = 1;
    dto.message = 'Test';
    dto.timestamp = new Date();

    // Assert
    expect(dto).toHaveProperty('id');
    expect(dto).toHaveProperty('message');
    expect(dto).toHaveProperty('timestamp');
  });
});
