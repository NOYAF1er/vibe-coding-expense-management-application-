/**
 * Expense Reports API Service
 * Handles API calls for expense report operations
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// TODO: Replace with actual user ID from authentication
const MOCK_USER_ID = '46535c2f-b439-45f5-b707-fefb90b66304';

export interface CreateExpenseReportPayload {
  title: string;
  reportDate: string;
}

export interface ExpenseReportResponse {
  id: string;
  title: string;
  reportDate: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
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
