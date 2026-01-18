import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createExpenseReport } from '../expenseReports.api';

describe('expenseReports.api', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('createExpenseReport', () => {
    it('should create an expense report successfully', async () => {
      const mockResponse = {
        id: '123',
        title: 'Test Report',
        reportDate: '2026-01-15',
        totalAmount: 0,
        status: 'DRAFT',
        createdAt: '2026-01-14T14:00:00.000Z',
        updatedAt: '2026-01-14T14:00:00.000Z',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const payload = {
        title: 'Test Report',
        reportDate: '2026-01-15',
      };

      const result = await createExpenseReport(payload);

      const fetchCall = (global.fetch as any).mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/v1/expense-reports',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );

      expect(requestBody.userId).toBe('6de5bed6-d35b-4f8a-9235-0dfd2a1ed99b');
      expect(requestBody.title).toBe('Test Report');
      // Verify that reportDate is converted to ISO string format
      expect(requestBody.reportDate).toBe(new Date('2026-01-15').toISOString());

      expect(result).toEqual(mockResponse);
    });

    it('should throw an error when API call fails', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      const payload = {
        title: 'Test Report',
        reportDate: '2026-01-15',
      };

      await expect(createExpenseReport(payload)).rejects.toThrow(
        'Failed to create expense report'
      );
    });

    it('should include userId in the request payload', async () => {
      const mockResponse = {
        id: '123',
        title: 'Test Report',
        reportDate: '2026-01-15',
        totalAmount: 0,
        status: 'DRAFT',
        createdAt: '2026-01-14T14:00:00.000Z',
        updatedAt: '2026-01-14T14:00:00.000Z',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const payload = {
        title: 'Test Report',
        reportDate: '2026-01-15',
      };

      await createExpenseReport(payload);

      const fetchCall = (global.fetch as any).mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);

      expect(requestBody).toHaveProperty('userId');
      expect(requestBody.userId).toBe('6de5bed6-d35b-4f8a-9235-0dfd2a1ed99b');
      expect(requestBody.title).toBe('Test Report');
      // Verify that reportDate is converted to ISO string format
      expect(requestBody.reportDate).toBe(new Date('2026-01-15').toISOString());
    });

    it('should use correct API endpoint', async () => {
      const mockResponse = {
        id: '123',
        title: 'Test Report',
        reportDate: '2026-01-15',
        totalAmount: 0,
        status: 'DRAFT',
        createdAt: '2026-01-14T14:00:00.000Z',
        updatedAt: '2026-01-14T14:00:00.000Z',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const payload = {
        title: 'Test Report',
        reportDate: '2026-01-15',
      };

      await createExpenseReport(payload);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/expense-reports'),
        expect.any(Object)
      );
    });
  });
});
