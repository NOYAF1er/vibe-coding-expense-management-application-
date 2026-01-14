/**
 * Custom hook for fetching and managing expense reports
 */

import { useState, useEffect, useCallback } from 'react';
import {
  PaginatedExpenseReports,
  QueryExpenseReportsParams,
  ExpenseReportResponse,
} from '../types/expense-report.types';
import { fetchExpenseReports } from '../services/expenseReports.api';

interface UseExpenseReportsResult {
  reports: ExpenseReportResponse[];
  loading: boolean;
  error: string | null;
  meta: PaginatedExpenseReports['meta'] | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch expense reports with pagination, search, and filters
 */
export function useExpenseReports(
  params: QueryExpenseReportsParams = {}
): UseExpenseReportsResult {
  const [reports, setReports] = useState<ExpenseReportResponse[]>([]);
  const [meta, setMeta] = useState<PaginatedExpenseReports['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchExpenseReports(params);
      setReports(data.data);
      setMeta(data.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch expense reports');
      setReports([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    reports,
    loading,
    error,
    meta,
    refetch: fetchData,
  };
}
