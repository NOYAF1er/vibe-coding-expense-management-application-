import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ApiService } from '../api.service';

describe('ApiService', () => {
  let apiService: ApiService;

  beforeEach(() => {
    apiService = new ApiService();
    global.fetch = vi.fn();
  });

  describe('getHello', () => {
    it('should fetch hello data successfully', async () => {
      const mockResponse = {
        id: 1,
        message: 'Hello from NestJS!',
        timestamp: '2026-01-13T15:45:00.000Z',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiService.getHello();

      expect(result).toEqual({
        id: 1,
        message: 'Hello from NestJS!',
        timestamp: new Date('2026-01-13T15:45:00.000Z'),
      });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/hello')
      );
    });

    it('should throw error on failed request', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(apiService.getHello()).rejects.toThrow('HTTP error! status: 500');
    });

    it('should handle network errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      await expect(apiService.getHello()).rejects.toThrow('Network error');
    });
  });
});
