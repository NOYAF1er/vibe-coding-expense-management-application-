/**
 * ExpenseReportsPage
 * Main page displaying the list of expense reports
 */

import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { SearchInput } from '../components/SearchInput';
import { FilterButton } from '../components/FilterButton';
import { FilterChips } from '../components/FilterChips';
import { ExpenseReportCard } from '../components/ExpenseReportCard';
import { BottomNav } from '../components/BottomNav';
import {
  ExpenseReportListItem,
  ExpenseReportResponse,
  QueryExpenseReportsParams,
  SortBy,
  SortOrder,
} from '../types/expense-report.types';
import { useExpenseReports } from '../hooks/useExpenseReports';

/**
 * Transform backend response to list item format
 * Note: Backend doesn't return categories, so we use empty array for now
 * TODO: Fetch expenses for each report to get actual categories
 */
function transformToListItem(report: ExpenseReportResponse): ExpenseReportListItem {
  return {
    id: report.id,
    title: report.title,
    date: report.reportDate,
    totalAmount: report.totalAmount,
    status: report.status,
    categories: [], // TODO: Fetch from expenses
  };
}

export const ExpenseReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterChips, setFilterChips] = useState<Array<{ id: string; label: string }>>([
    { id: 'status-submitted', label: 'Status: Submitted' },
    { id: 'amount-high-low', label: 'Amount: High to Low' },
  ]);

  // Debounce search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Build query parameters from current state
  const queryParams = useMemo<QueryExpenseReportsParams>(() => {
    const params: QueryExpenseReportsParams = {
      page: 1,
      limit: 50,
      sortBy: SortBy.REPORT_DATE,
      order: SortOrder.DESC,
    };

    // Add search if present
    if (debouncedSearch) {
      params.search = debouncedSearch;
    }

    return params;
  }, [debouncedSearch]);

  // Fetch expense reports from backend
  const { reports, loading, error, meta } = useExpenseReports(queryParams);

  // Transform backend data to list items
  const listItems = useMemo<ExpenseReportListItem[]>(() => {
    return reports.map(transformToListItem);
  }, [reports]);

  const handleAddClick = () => {
    navigate('/new-report');
  };

  const handleFilterClick = () => {
    console.log('Open filter modal');
    // TODO: Implement filter modal
  };

  const handleRemoveChip = (chipId: string) => {
    setFilterChips(filterChips.filter((chip) => chip.id !== chipId));
  };

  const handleReportClick = (reportId: string) => {
    console.log('View report:', reportId);
    // TODO: Navigate to report detail page
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light">
      <Header title="Expense Reports" onAddClick={handleAddClick} />

      <main className="flex-grow pb-24 bg-background-light">
        <div className="p-4 space-y-4">
          <SearchInput value={searchQuery} onChange={setSearchQuery} />

          <div className="space-y-3">
            <FilterButton onClick={handleFilterClick} />
            {filterChips.length > 0 && (
              <FilterChips chips={filterChips} onRemove={handleRemoveChip} />
            )}
          </div>
        </div>

        <div className="px-4 space-y-4">
          {loading && (
            <div className="text-center py-8 text-muted-light dark:text-muted-dark">
              Loading expense reports...
            </div>
          )}

          {error && (
            <div className="text-center py-8 text-red-500">
              Error: {error}
            </div>
          )}

          {!loading && !error && listItems.length === 0 && (
            <div className="text-center py-8 text-muted-light dark:text-muted-dark">
              {searchQuery
                ? 'No expense reports found matching your search'
                : 'No expense reports found. Create your first report!'}
            </div>
          )}

          {!loading && !error && listItems.length > 0 && (
            <>
              {listItems.map((report) => (
                <ExpenseReportCard
                  key={report.id}
                  report={report}
                  onClick={() => handleReportClick(report.id)}
                />
              ))}
            </>
          )}
        </div>
      </main>

      <BottomNav activeTab="reports" />
    </div>
  );
};
