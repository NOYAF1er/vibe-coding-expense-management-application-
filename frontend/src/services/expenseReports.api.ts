/**
 * Expense Reports API Service
 * Handles API calls for expense report operations
 */

import {
  PaginatedExpenseReports,
  QueryExpenseReportsParams,
  ExpenseReportResponse,
} from '../types/expense-report.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// TODO: Replace with actual user ID from authentication
const MOCK_USER_ID = '31196f2f-06e6-4e8f-b953-a8122bb4135e';

export interface CreateExpenseReportPayload {
  title: string;
  reportDate: string;
}

/**
 * Build query string from parameters
 */
function buildQueryString(params: QueryExpenseReportsParams): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Fetch expense reports with pagination, search, and filters
 */
export async function fetchExpenseReports(
  params: QueryExpenseReportsParams = {}
): Promise<PaginatedExpenseReports> {
  const queryString = buildQueryString(params);
  const response = await fetch(
    `${API_BASE_URL}/api/v1/expense-reports${queryString}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch expense reports');
  }

  return response.json();
}

/**
 * Fetch a single expense report by ID
 */
export async function fetchExpenseReportById(
  id: string
): Promise<ExpenseReportResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/expense-reports/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch expense report');
  }

  return response.json();
}

/**
 * Fetch all expense reports for a specific user
 */
export async function fetchUserExpenseReports(
  userId: string = MOCK_USER_ID
): Promise<ExpenseReportResponse[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/expense-reports/user/${userId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch user expense reports');
  }

  return response.json();
}

/**
 * Create a new expense report
 */
export async function createExpenseReport(
  payload: CreateExpenseReportPayload
): Promise<ExpenseReportResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/expense-reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: MOCK_USER_ID,
      title: payload.title,
      reportDate: payload.reportDate,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create expense report');
  }

  return response.json();
}
