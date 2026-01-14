/**
 * Expense Report Types
 */

export enum ExpenseReportStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PAID = 'PAID',
  CREATED = 'CREATED',
  VALIDATED = 'VALIDATED',
}

export enum ExpenseCategory {
  RESTAURANT = 'RESTAURANT',
  FLIGHT = 'FLIGHT',
  SHOPPING_CART = 'SHOPPING_CART',
  GROUPS = 'GROUPS',
  LOCAL_PARKING = 'LOCAL_PARKING',
  HOTEL = 'HOTEL',
  TRANSPORT = 'TRANSPORT',
  OTHER = 'OTHER',
}

export interface Expense {
  id: string;
  category: ExpenseCategory;
  amount: number;
  description?: string;
}

export interface ExpenseReport {
  id: string;
  title: string;
  date: string;
  totalAmount: number;
  status: ExpenseReportStatus;
  expenses: Expense[];
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseReportListItem {
  id: string;
  title: string;
  date: string;
  totalAmount: number;
  status: ExpenseReportStatus;
  categories: ExpenseCategory[];
}
