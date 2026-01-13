import { HelloResponse } from '@shared/hello.types';

/**
 * API service for backend communication
 */
export class ApiService {
  private readonly baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
  }

  /**
   * Fetch hello message from backend
   */
  async getHello(): Promise<HelloResponse> {
    const response = await fetch(`${this.baseURL}/hello`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      ...data,
      timestamp: new Date(data.timestamp),
    };
  }
}

// Singleton instance
export const apiService = new ApiService();
