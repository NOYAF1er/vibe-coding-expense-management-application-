import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { HelloModule } from './modules/hello/hello.module';
import { UsersModule } from './modules/users/users.module';
import { ExpenseReportsModule } from './modules/expense-reports/expense-reports.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { AuthModule } from './modules/auth/auth.module';

/**
 * Root application module
 */
@Module({
  imports: [
    // Configuration module for environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
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
    AuthModule,
  ],
})
export class AppModule {}
