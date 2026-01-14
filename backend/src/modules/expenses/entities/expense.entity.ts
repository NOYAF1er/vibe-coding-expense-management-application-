import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ExpenseCategory } from '../../../common/enums/expense-category.enum';
import { ExpenseStatus } from '../../../common/enums/expense-status.enum';
import { ExpenseReport } from '../../expense-reports/entities/expense-report.entity';

/**
 * Expense entity representing an individual expense item
 */
@Entity('expenses')
export class Expense extends BaseEntity {
  @Column()
  reportId!: string;

  @ManyToOne(() => ExpenseReport, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reportId' })
  report!: ExpenseReport;

  @Column({ length: 200 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Index()
  @Column({ type: 'date' })
  expenseDate!: Date;

  @Index()
  @Column({
    type: 'text',
    enum: ExpenseCategory,
  })
  category!: ExpenseCategory;

  @Index()
  @Column({
    type: 'text',
    enum: ExpenseStatus,
    default: ExpenseStatus.SUBMITTED,
  })
  status!: ExpenseStatus;

  @Column({ default: true })
  receiptRequired!: boolean;

  // Relation will be added after Attachment entity is created
  // @OneToMany(() => Attachment, (attachment) => attachment.expense, { cascade: true })
  // attachments!: Attachment[];
}
