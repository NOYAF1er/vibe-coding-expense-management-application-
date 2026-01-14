import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UserRole } from '../../../common/enums/user-role.enum';

/**
 * DTO for user response (excludes password)
 */
export class UserResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty()
  email!: string;

  @Exclude()
  password?: string;

  @ApiProperty({ enum: UserRole })
  role!: UserRole;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty({ required: false })
  lastLoginAt?: Date;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
