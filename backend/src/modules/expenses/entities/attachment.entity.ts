import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Expense } from './expense.entity';

/**
 * Attachment entity for storing file metadata and BLOB data
 * BLOB is stored with lazy loading to prevent automatic loading
 */
@Entity('attachments')
export class Attachment extends BaseEntity {
  @Column()
  expenseId!: string;

  @ManyToOne(() => Expense, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'expenseId' })
  expense!: Expense;

  @Column({ length: 255 })
  fileName!: string;

  @Column({ length: 100 })
  mimeType!: string;

  @Column({ type: 'integer' })
  fileSize!: number;

  @Index()
  @Column({ type: 'datetime' })
  uploadedAt!: Date;

  /**
   * BLOB column with lazy loading
   * This will NOT be loaded by default in any query
   * Must be explicitly loaded using QueryBuilder with addSelect
   */
  @Column({
    type: 'blob',
    nullable: false,
    select: false, // Critical: prevents automatic loading
  })
  fileData!: Buffer;
}
