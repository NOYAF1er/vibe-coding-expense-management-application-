/**
 * ExpenseReportsPage
 * Main page displaying the list of expense reports with search, filters, and sorting
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
  ExpenseReportStatus,
} from '../types/expense-report.types';
import { useExpenseReports } from '../hooks/useExpenseReports';

/**
 * Filter chip type
 */
interface FilterChip {
  id: string;
  label: string;
  type: 'status' | 'sort';
  value?: string;
}

/**
 * Transform backend response to list item format
 */
function transformToListItem(report: ExpenseReportResponse): ExpenseReportListItem {
  return {
    id: report.id,
    title: report.title,
    date: report.reportDate,
    totalAmount: report.totalAmount,
    status: report.status,
    categories: report.categories || [],
  };
}

/**
 * Get human-readable label for status
 */
function getStatusLabel(status: ExpenseReportStatus): string {
  const labels: Record<ExpenseReportStatus, string> = {
    [ExpenseReportStatus.DRAFT]: 'Draft',
    [ExpenseReportStatus.SUBMITTED]: 'Submitted',
    [ExpenseReportStatus.UNDER_REVIEW]: 'Under Review',
    [ExpenseReportStatus.APPROVED]: 'Approved',
    [ExpenseReportStatus.REJECTED]: 'Rejected',
    [ExpenseReportStatus.PAID]: 'Paid',
  };
  return labels[status];
}

export const ExpenseReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ExpenseReportStatus | undefined>(undefined);
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.REPORT_DATE);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC);

  // Debounce search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Build filter chips from current state
  const filterChips = useMemo<FilterChip[]>(() => {
    const chips: FilterChip[] = [];

    // Add status filter chip
    if (selectedStatus) {
      chips.push({
        id: `status-${selectedStatus}`,
        label: `Status: ${getStatusLabel(selectedStatus)}`,
        type: 'status',
        value: selectedStatus,
      });
    }

    // Add sort chip
    const sortLabel =
      sortBy === SortBy.TOTAL_AMOUNT
        ? sortOrder === SortOrder.DESC
          ? 'Amount: High to Low'
          : 'Amount: Low to High'
        : sortOrder === SortOrder.DESC
        ? 'Date: Newest First'
        : 'Date: Oldest First';

    chips.push({
      id: `sort-${sortBy}-${sortOrder}`,
      label: sortLabel,
      type: 'sort',
    });

    return chips;
  }, [selectedStatus, sortBy, sortOrder]);

  // Build query parameters from current state
  const queryParams = useMemo<QueryExpenseReportsParams>(() => {
    const params: QueryExpenseReportsParams = {
      page: 1,
      limit: 50,
      sortBy,
      order: sortOrder,
    };

    // Add search if present
    if (debouncedSearch) {
      params.search = debouncedSearch;
    }

    // Add status filter if selected
    if (selectedStatus) {
      params.status = selectedStatus;
    }

    return params;
  }, [debouncedSearch, selectedStatus, sortBy, sortOrder]);

  // Fetch expense reports from backend
  const { reports, loading, error } = useExpenseReports(queryParams);

  // Transform backend data to list items
  const listItems = useMemo<ExpenseReportListItem[]>(() => {
    return reports.map(transformToListItem);
  }, [reports]);

  const handleAddClick = () => {
    navigate('/new-report');
  };

  const handleFilterClick = () => {
    // Cycle through filter options
    // For now, implement a simple cycling through status filters and sort options
    
    // If no status filter, add SUBMITTED
    if (!selectedStatus) {
      setSelectedStatus(ExpenseReportStatus.SUBMITTED);
      return;
    }

    // If SUBMITTED, change to APPROVED
    if (selectedStatus === ExpenseReportStatus.SUBMITTED) {
      setSelectedStatus(ExpenseReportStatus.APPROVED);
      return;
    }

    // If APPROVED, change to DRAFT
    if (selectedStatus === ExpenseReportStatus.APPROVED) {
      setSelectedStatus(ExpenseReportStatus.DRAFT);
      return;
    }

    // If DRAFT, remove status filter and toggle sort
    if (selectedStatus === ExpenseReportStatus.DRAFT) {
      setSelectedStatus(undefined);
      
      // Toggle sort
      if (sortBy === SortBy.REPORT_DATE && sortOrder === SortOrder.DESC) {
        setSortBy(SortBy.TOTAL_AMOUNT);
        setSortOrder(SortOrder.DESC);
      } else if (sortBy === SortBy.TOTAL_AMOUNT && sortOrder === SortOrder.DESC) {
        setSortBy(SortBy.TOTAL_AMOUNT);
        setSortOrder(SortOrder.ASC);
      } else if (sortBy === SortBy.TOTAL_AMOUNT && sortOrder === SortOrder.ASC) {
        setSortBy(SortBy.REPORT_DATE);
        setSortOrder(SortOrder.ASC);
      } else {
        setSortBy(SortBy.REPORT_DATE);
        setSortOrder(SortOrder.DESC);
      }
      return;
    }

    // Default: remove status filter
    setSelectedStatus(undefined);
  };

  const handleRemoveChip = (chipId: string) => {
    const chip = filterChips.find((c) => c.id === chipId);
    if (!chip) return;

    if (chip.type === 'status') {
      setSelectedStatus(undefined);
    } else if (chip.type === 'sort') {
      // Reset to default sort
      setSortBy(SortBy.REPORT_DATE);
      setSortOrder(SortOrder.DESC);
    }
  };

  const handleReportClick = (reportId: string) => {
    navigate(`/reports/${reportId}`);
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
