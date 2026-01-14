import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ExpenseReportStatus } from '../../../common/enums/expense-report-status.enum';
import { User } from '../../users/entities/user.entity';
import { Expense } from '../../expenses/entities/expense.entity';

/**
 * ExpenseReport entity representing a container for multiple expenses
 */
@Entity('expense_reports')
export class ExpenseReport extends BaseEntity {
  @Column()
  userId!: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ length: 200 })
  title!: string;

  @Index()
  @Column({ type: 'date' })
  reportDate!: Date;

  @Index()
  @Column({
    type: 'text',
    enum: ExpenseReportStatus,
    default: ExpenseReportStatus.DRAFT,
  })
  status!: ExpenseReportStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount!: number;

  @Column({ length: 3, default: 'EUR' })
  currency!: string;

  @Column({ nullable: true })
  reviewedBy?: string;

  @Column({ type: 'datetime', nullable: true })
  reviewedAt?: Date;

  @Column({ type: 'text', nullable: true })
  rejectionReason?: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Expense, (expense) => expense.report, { cascade: true })
  expenses?: Expense[];
}
