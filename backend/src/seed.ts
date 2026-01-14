import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './modules/users/entities/user.entity';
import { ExpenseReport } from './modules/expense-reports/entities/expense-report.entity';
import { Expense } from './modules/expenses/entities/expense.entity';
import { UserRole } from './common/enums/user-role.enum';
import { ExpenseReportStatus } from './common/enums/expense-report-status.enum';
import { ExpenseCategory } from './common/enums/expense-category.enum';

/**
 * Seed script to populate the database with sample data
 */
const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DATABASE_PATH || './database.sqlite',
  entities: [User, ExpenseReport, Expense],
  synchronize: true,
});

async function seed() {
  console.log('🌱 Starting database seeding...\n');

  await AppDataSource.initialize();
  console.log('✅ Database connection established\n');

  const userRepository = AppDataSource.getRepository(User);
  const reportRepository = AppDataSource.getRepository(ExpenseReport);
  const expenseRepository = AppDataSource.getRepository(Expense);

  // Create user
  console.log('👤 Creating user...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user = userRepository.create({
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    password: hashedPassword,
    role: UserRole.EMPLOYEE,
    isActive: true,
  });

  await userRepository.save(user);
  console.log(`✅ User created: ${user.firstName} ${user.lastName} (${user.email})`);
  console.log(`   ID: ${user.id}\n`);

  // Create first expense report
  console.log('📋 Creating first expense report...');
  const report1 = reportRepository.create({
    userId: user.id,
    title: 'Déplacement professionnel à Paris',
    reportDate: new Date('2024-01-15'),
    status: ExpenseReportStatus.SUBMITTED,
    totalAmount: 0, // Will be calculated
    currency: 'EUR',
  });

  await reportRepository.save(report1);
  console.log(`✅ Report 1 created: ${report1.title}`);
  console.log(`   ID: ${report1.id}`);
  console.log(`   Status: ${report1.status}\n`);

  // Create second expense report
  console.log('📋 Creating second expense report...');
  const report2 = reportRepository.create({
    userId: user.id,
    title: 'Formation à Lyon',
    reportDate: new Date('2024-01-22'),
    status: ExpenseReportStatus.DRAFT,
    totalAmount: 0, // Will be calculated
    currency: 'EUR',
  });

  await reportRepository.save(report2);
  console.log(`✅ Report 2 created: ${report2.title}`);
  console.log(`   ID: ${report2.id}`);
  console.log(`   Status: ${report2.status}\n`);

  // Create expenses for report 1
  console.log('💰 Creating expenses for report 1...');
  
  const expense1 = expenseRepository.create({
    reportId: report1.id,
    name: 'Billet de train Paris',
    description: 'Aller-retour Paris Gare de Lyon',
    amount: 125.50,
    expenseDate: new Date('2024-01-15'),
    category: ExpenseCategory.TRAVEL,
    receiptRequired: true,
  });

  const expense2 = expenseRepository.create({
    reportId: report1.id,
    name: 'Déjeuner client',
    description: 'Restaurant Le Bistrot',
    amount: 85.00,
    expenseDate: new Date('2024-01-15'),
    category: ExpenseCategory.MEAL,
    receiptRequired: true,
  });

  await expenseRepository.save([expense1, expense2]);
  console.log(`✅ Expense 1: ${expense1.name} - ${expense1.amount}€`);
  console.log(`✅ Expense 2: ${expense2.name} - ${expense2.amount}€\n`);

  // Create expenses for report 2
  console.log('💰 Creating expenses for report 2...');
  
  const expense3 = expenseRepository.create({
    reportId: report2.id,
    name: 'Hôtel Lyon Centre',
    description: '2 nuits - Hôtel Mercure',
    amount: 240.00,
    expenseDate: new Date('2024-01-22'),
    category: ExpenseCategory.HOTEL,
    receiptRequired: true,
  });

  const expense4 = expenseRepository.create({
    reportId: report2.id,
    name: 'Taxi aéroport',
    description: 'Trajet aéroport - hôtel',
    amount: 45.00,
    expenseDate: new Date('2024-01-22'),
    category: ExpenseCategory.TRANSPORT,
    receiptRequired: true,
  });

  await expenseRepository.save([expense3, expense4]);
  console.log(`✅ Expense 3: ${expense3.name} - ${expense3.amount}€`);
  console.log(`✅ Expense 4: ${expense4.name} - ${expense4.amount}€\n`);

  // Update report totals
  console.log('🔄 Updating report totals...');
  report1.totalAmount = Number(expense1.amount) + Number(expense2.amount);
  report2.totalAmount = Number(expense3.amount) + Number(expense4.amount);
  
  await reportRepository.save([report1, report2]);
  console.log(`✅ Report 1 total: ${report1.totalAmount}€`);
  console.log(`✅ Report 2 total: ${report2.totalAmount}€\n`);

  // Summary
  console.log('📊 SUMMARY');
  console.log('═══════════════════════════════════════');
  console.log(`👤 Users created: 1`);
  console.log(`   - ${user.firstName} ${user.lastName} (${user.email})`);
  console.log(`   - Password: password123`);
  console.log(`\n📋 Expense Reports created: 2`);
  console.log(`   1. ${report1.title} - ${report1.totalAmount}€ (${report1.status})`);
  console.log(`   2. ${report2.title} - ${report2.totalAmount}€ (${report2.status})`);
  console.log(`\n💰 Expenses created: 4`);
  console.log(`   - ${expense1.name}: ${expense1.amount}€ (${expense1.category})`);
  console.log(`   - ${expense2.name}: ${expense2.amount}€ (${expense2.category})`);
  console.log(`   - ${expense3.name}: ${expense3.amount}€ (${expense3.category})`);
  console.log(`   - ${expense4.name}: ${expense4.amount}€ (${expense4.category})`);
  console.log(`\n💵 Total expenses: ${report1.totalAmount + report2.totalAmount}€`);
  console.log('═══════════════════════════════════════\n');

  console.log('🎉 Database seeding completed successfully!');
  console.log('🌐 Access Swagger UI: http://localhost:3000/api/docs\n');

  await AppDataSource.destroy();
}

seed().catch((error) => {
  console.error('❌ Error seeding database:', error);
  process.exit(1);
});
