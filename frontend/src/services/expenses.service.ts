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
   * Create a new expense with optional file attachment
   */
  async create(data: Partial<Expense>, file?: File): Promise<Expense> {
    const formData = new FormData();
    
    // Add expense data
    if (data.reportId) formData.append('reportId', data.reportId);
    if (data.category) formData.append('category', data.category);
    if (data.amount !== undefined) formData.append('amount', data.amount.toString());
    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.expenseDate) formData.append('expenseDate', data.expenseDate);
    
    // Add file if provided
    if (file) {
      formData.append('file', file);
    }
    
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      body: formData, // No Content-Type header, browser sets it with boundary
    });
    if (!response.ok) {
      throw new Error('Failed to create expense');
    }
    return response.json();
  }

  /**
   * Update an expense with optional new file attachment
   */
  async update(id: string, data: Partial<Expense>, file?: File): Promise<Expense> {
    const formData = new FormData();
    
    // Add expense data
    if (data.reportId) formData.append('reportId', data.reportId);
    if (data.category) formData.append('category', data.category);
    if (data.amount !== undefined) formData.append('amount', data.amount.toString());
    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.expenseDate) formData.append('expenseDate', data.expenseDate);
    
    // Add file if provided
    if (file) {
      formData.append('file', file);
    }
    
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      body: formData, // No Content-Type header, browser sets it with boundary
    });
    if (!response.ok) {
      throw new Error('Failed to update expense');
    }
    return response.json();
  }

  /**
   * Download attachment file
   */
  async downloadAttachment(attachmentId: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/attachments/${attachmentId}/download`);
    if (!response.ok) {
      throw new Error('Failed to download attachment');
    }
    return response.blob();
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
