import { HelloEntity } from '../hello.entity';

describe('HelloEntity', () => {
  it('should be defined', () => {
    expect(HelloEntity).toBeDefined();
  });

  it('should create instance with all properties', () => {
    // Arrange & Act
    const entity = new HelloEntity();
    entity.id = 1;
    entity.message = 'Hello from NestJS!';
    entity.timestamp = new Date('2026-01-13T15:45:00.000Z');

    // Assert
    expect(entity.id).toBe(1);
    expect(entity.message).toBe('Hello from NestJS!');
    expect(entity.timestamp).toBeInstanceOf(Date);
  });

  it('should have correct property types', () => {
    // Arrange & Act
    const entity = new HelloEntity();
    entity.id = 42;
    entity.message = 'Test message';
    entity.timestamp = new Date();

    // Assert
    expect(typeof entity.id).toBe('number');
    expect(typeof entity.message).toBe('string');
    expect(entity.timestamp).toBeInstanceOf(Date);
  });

  it('should allow setting id property', () => {
    // Arrange
    const entity = new HelloEntity();

    // Act
    entity.id = 100;

    // Assert
    expect(entity.id).toBe(100);
  });

  it('should allow setting message property', () => {
    // Arrange
    const entity = new HelloEntity();

    // Act
    entity.message = 'Custom message';

    // Assert
    expect(entity.message).toBe('Custom message');
  });

  it('should allow setting timestamp property', () => {
    // Arrange
    const entity = new HelloEntity();
    const testDate = new Date('2026-01-13T12:00:00.000Z');

    // Act
    entity.timestamp = testDate;

    // Assert
    expect(entity.timestamp).toBe(testDate);
    expect(entity.timestamp.toISOString()).toBe('2026-01-13T12:00:00.000Z');
  });

  it('should have all required properties', () => {
    // Arrange & Act
    const entity = new HelloEntity();
    entity.id = 1;
    entity.message = 'Test';
    entity.timestamp = new Date();

    // Assert
    expect(entity).toHaveProperty('id');
    expect(entity).toHaveProperty('message');
    expect(entity).toHaveProperty('timestamp');
  });

  it('should allow long messages', () => {
    // Arrange
    const entity = new HelloEntity();
    const longMessage = 'a'.repeat(1000);

    // Act
    entity.message = longMessage;

    // Assert
    expect(entity.message).toBe(longMessage);
    expect(entity.message.length).toBe(1000);
  });

  it('should handle special characters in message', () => {
    // Arrange
    const entity = new HelloEntity();
    const specialMessage = 'Hello! @#$%^&*() 123 世界 🚀';

    // Act
    entity.message = specialMessage;

    // Assert
    expect(entity.message).toBe(specialMessage);
  });

  it('should handle different timestamp values', () => {
    // Arrange
    const entity = new HelloEntity();
    const pastDate = new Date('2020-01-01T00:00:00.000Z');
    const futureDate = new Date('2030-12-31T23:59:59.999Z');

    // Act & Assert - Past date
    entity.timestamp = pastDate;
    expect(entity.timestamp).toBe(pastDate);

    // Act & Assert - Future date
    entity.timestamp = futureDate;
    expect(entity.timestamp).toBe(futureDate);
  });

  it('should create multiple independent instances', () => {
    // Arrange & Act
    const entity1 = new HelloEntity();
    entity1.id = 1;
    entity1.message = 'First';
    entity1.timestamp = new Date('2026-01-13T10:00:00.000Z');

    const entity2 = new HelloEntity();
    entity2.id = 2;
    entity2.message = 'Second';
    entity2.timestamp = new Date('2026-01-13T11:00:00.000Z');

    // Assert
    expect(entity1.id).not.toBe(entity2.id);
    expect(entity1.message).not.toBe(entity2.message);
    expect(entity1.timestamp).not.toBe(entity2.timestamp);
  });
});
