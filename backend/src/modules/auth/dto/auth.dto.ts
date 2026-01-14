import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../../../common/enums/user-role.enum';

/**
 * DTO for user login
 */
export class LoginDto {
  @ApiProperty({ example: 'jean.dupont@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'password123', minLength: 8 })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;
}

/**
 * DTO for user registration
 */
export class RegisterDto {
  @ApiProperty({ example: 'John', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName!: string;

  @ApiProperty({ example: 'Doe', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName!: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email!: string;

  @ApiProperty({ example: 'SecurePass123!', minLength: 8 })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  @ApiProperty({ enum: UserRole, default: UserRole.EMPLOYEE, required: false })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}

/**
 * DTO for authentication response
 */
export class AuthResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  accessToken!: string;

  @ApiProperty({ description: 'User information' })
  user!: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

/**
 * DTO for forgot password request
 */
export class ForgotPasswordDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}
