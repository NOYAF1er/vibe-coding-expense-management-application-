import { Entity, Column, DeleteDateColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { UserRole } from '../../../common/enums/user-role.enum';

/**
 * User entity representing application users
 */
@Entity('users')
export class User extends BaseEntity {
  @Column({ length: 100 })
  firstName!: string;

  @Column({ length: 100 })
  lastName!: string;

  @Index()
  @Column({ unique: true, length: 255 })
  email!: string;

  @Column({ length: 255, nullable: true })
  password?: string; // Hashed password (nullable for OAuth users)

  @Index()
  @Column({
    type: 'text',
    enum: UserRole,
    default: UserRole.EMPLOYEE,
  })
  role!: UserRole;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: 'datetime', nullable: true })
  lastLoginAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  // Relation will be added after ExpenseReport entity is created
  // @OneToMany(() => ExpenseReport, (report) => report.user, { cascade: ['remove'] })
  // expenseReports!: ExpenseReport[];
}
