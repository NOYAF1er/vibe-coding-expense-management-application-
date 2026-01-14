/**
 * Expense Report API Service
 */

import { ExpenseReport, ExpenseReportListItem, ExpenseReportDetails } from '../types/expense-report.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ExpenseReportService {
  private baseUrl = `${API_BASE_URL}/api/v1/expense-reports`;

  /**
   * Get all expense reports
   */
  async getAll(): Promise<ExpenseReportListItem[]> {
    const response = await fetch(this.baseUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch expense reports');
    }
    const data = await response.json();
    return data.data || [];
  }

  /**
   * Get a single expense report by ID
   */
  async getById(id: string): Promise<ExpenseReportDetails> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch expense report');
    }
    return response.json();
  }

  /**
   * Create a new expense report
   */
  async create(data: Partial<ExpenseReport>): Promise<ExpenseReportDetails> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create expense report');
    }
    return response.json();
  }

  /**
   * Update an expense report
   */
  async update(id: string, data: Partial<ExpenseReport>): Promise<ExpenseReportDetails> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update expense report');
    }
    return response.json();
  }

  /**
   * Delete an expense report
   */
  async delete(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete expense report');
    }
  }
}

export const expenseReportService = new ExpenseReportService();
