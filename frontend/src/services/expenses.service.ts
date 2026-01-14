/**
 * Expenses API Service
 */

import { Expense } from '../types/expense-report.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ExpensesService {
  private baseUrl = `${API_BASE_URL}/api/v1/expenses`;

  /**
   * Get all expenses for a specific report
   */
  async getByReportId(reportId: string): Promise<Expense[]> {
    const response = await fetch(`${this.baseUrl}?reportId=${reportId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch expenses');
    }
    return response.json();
  }

  /**
   * Get a single expense by ID
   */
  async getById(id: string): Promise<Expense> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch expense');
    }
    return response.json();
  }

  /**
   * Create a new expense
   */
  async create(data: Partial<Expense>): Promise<Expense> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create expense');
    }
    return response.json();
  }

  /**
   * Update an expense
   */
  async update(id: string, data: Partial<Expense>): Promise<Expense> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update expense');
    }
    return response.json();
  }

  /**
   * Delete an expense
   */
  async delete(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete expense');
    }
  }
}

export const expensesService = new ExpensesService();
