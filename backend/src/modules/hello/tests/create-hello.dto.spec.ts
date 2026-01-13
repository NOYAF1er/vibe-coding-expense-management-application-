import { validate } from 'class-validator';
import { CreateHelloDto } from '../dto/create-hello.dto';

describe('CreateHelloDto', () => {
  it('should be defined', () => {
    expect(CreateHelloDto).toBeDefined();
  });

  it('should validate successfully with valid message', async () => {
    // Arrange
    const dto = new CreateHelloDto();
    dto.message = 'Hello from NestJS!';

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(0);
  });

  it('should fail validation when message is empty', async () => {
    // Arrange
    const dto = new CreateHelloDto();
    dto.message = '';

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('message');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation when message is not provided', async () => {
    // Arrange
    const dto = new CreateHelloDto();

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('message');
  });

  it('should fail validation when message is not a string', async () => {
    // Arrange
    const dto = new CreateHelloDto();
    (dto as any).message = 123; // Force non-string value

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('message');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should fail validation when message exceeds max length', async () => {
    // Arrange
    const dto = new CreateHelloDto();
    dto.message = 'a'.repeat(501); // 501 characters, exceeds max of 500

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('message');
    expect(errors[0].constraints).toHaveProperty('maxLength');
  });

  it('should validate successfully with message at max length', async () => {
    // Arrange
    const dto = new CreateHelloDto();
    dto.message = 'a'.repeat(500); // Exactly 500 characters

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(0);
  });

  it('should validate successfully with message at min length', async () => {
    // Arrange
    const dto = new CreateHelloDto();
    dto.message = 'a'; // 1 character

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(0);
  });

  it('should have correct property type', () => {
    // Arrange & Act
    const dto = new CreateHelloDto();
    dto.message = 'Test message';

    // Assert
    expect(typeof dto.message).toBe('string');
  });

  it('should match CreateHelloDto interface structure', () => {
    // Arrange & Act
    const dto = new CreateHelloDto();
    dto.message = 'Test';

    // Assert
    expect(dto).toHaveProperty('message');
  });

  it('should validate successfully with special characters', async () => {
    // Arrange
    const dto = new CreateHelloDto();
    dto.message = 'Hello! @#$%^&*() 123 世界';

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(0);
  });

  it('should validate successfully with whitespace in message', async () => {
    // Arrange
    const dto = new CreateHelloDto();
    dto.message = '  Hello from NestJS!  ';

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(0);
  });
});
