import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

/**
 * Hello entity for database persistence
 */
@Entity('hello')
export class HelloEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  message!: string;

  @CreateDateColumn()
  timestamp!: Date;
}
