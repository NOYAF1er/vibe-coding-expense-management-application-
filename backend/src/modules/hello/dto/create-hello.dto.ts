import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { CreateHelloDto as ICreateHelloDto } from '@shared/types';

/**
 * DTO for creating a Hello entity
 */
export class CreateHelloDto implements ICreateHelloDto {
  @ApiProperty({
    example: 'Hello from NestJS!',
    description: 'Message content',
    minLength: 1,
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(500)
  message!: string;
}
