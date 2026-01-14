/**
 * Expense Report Types
 * Aligned with backend DTOs
 */

export enum ExpenseReportStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PAID = 'PAID',
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
  TRAVEL = 'TRAVEL',
  MEAL = 'MEAL',
  OFFICE_SUPPLIES = 'OFFICE_SUPPLIES',
}

export enum SortBy {
  REPORT_DATE = 'reportDate',
  TOTAL_AMOUNT = 'totalAmount',
  CREATED_AT = 'createdAt',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

/**
 * Expense status for individual expenses
 */
export enum ExpenseStatus {
  SUBMITTED = 'Submitted',
  REVIEWED = 'Reviewed',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

export interface Expense {
  id: string;
  reportId: string;
  name: string;
  description?: string;
  amount: number;
  expenseDate: string;
  category: ExpenseCategory;
  receiptRequired: boolean;
  createdAt: string;
  updatedAt: string;
  status?: ExpenseStatus;
}

/**
 * Backend response structure for expense report
 */
export interface ExpenseReportResponse {
  id: string;
  userId: string;
  title: string;
  reportDate: string;
  status: ExpenseReportStatus;
  totalAmount: number;
  currency: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  categories?: ExpenseCategory[];
}

/**
 * Paginated response metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated expense reports response
 */
export interface PaginatedExpenseReports {
  data: ExpenseReportResponse[];
  meta: PaginationMeta;
}

/**
 * Query parameters for fetching expense reports
 */
export interface QueryExpenseReportsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ExpenseReportStatus;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: SortBy;
  order?: SortOrder;
}

/**
 * Full expense report with expenses
 */
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

/**
 * Expense report details with expenses
 */
export interface ExpenseReportDetails extends ExpenseReportResponse {
  expenses?: Expense[];
}

/**
 * Simplified expense report for list display
 */
export interface ExpenseReportListItem {
  id: string;
  title: string;
  date: string;
  totalAmount: number;
  status: ExpenseReportStatus;
  categories: ExpenseCategory[];
}
