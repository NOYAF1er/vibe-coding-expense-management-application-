import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelloModule } from './modules/hello/hello.module';
import { UsersModule } from './modules/users/users.module';
import { ExpenseReportsModule } from './modules/expense-reports/expense-reports.module';
import { ExpensesModule } from './modules/expenses/expenses.module';

/**
 * Root application module
 */
@Module({
  imports: [
    // TypeORM configuration for SQLite
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_PATH || './database.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production', // Auto-sync in development
      logging: process.env.NODE_ENV === 'development',
    }),
    HelloModule,
    UsersModule,
    ExpenseReportsModule,
    ExpensesModule,
  ],
})
export class AppModule {}
