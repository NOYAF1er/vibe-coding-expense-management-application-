import { ApiProperty } from '@nestjs/swagger';
import { HelloResponse } from '@shared/types';

/**
 * Response DTO for Hello endpoint
 */
export class HelloResponseDto implements HelloResponse {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  id!: number;

  @ApiProperty({ example: 'Hello from NestJS!', description: 'Hello message' })
  message!: string;

  @ApiProperty({ example: '2026-01-13T15:45:00.000Z', description: 'Creation timestamp' })
  timestamp!: Date;
}
