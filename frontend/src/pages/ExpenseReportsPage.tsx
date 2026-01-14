/**
 * ExpenseReportsPage
 * Main page displaying the list of expense reports
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { SearchInput } from '../components/SearchInput';
import { FilterButton } from '../components/FilterButton';
import { FilterChips } from '../components/FilterChips';
import { ExpenseReportCard } from '../components/ExpenseReportCard';
import { BottomNav } from '../components/BottomNav';
import { ExpenseReportListItem, ExpenseReportStatus, ExpenseCategory } from '../types/expense-report.types';

// Mock data matching the HTML design
const mockReports: ExpenseReportListItem[] = [
  {
    id: '1',
    title: 'Q4 Client On-site',
    date: '2023-10-26',
    totalAmount: 175.00,
    status: ExpenseReportStatus.SUBMITTED,
    categories: [ExpenseCategory.RESTAURANT, ExpenseCategory.FLIGHT],
  },
  {
    id: '2',
    title: 'October Office Supplies',
    date: '2023-10-24',
    totalAmount: 75.00,
    status: ExpenseReportStatus.VALIDATED,
    categories: [ExpenseCategory.SHOPPING_CART],
  },
  {
    id: '3',
    title: 'Team Offsite Event',
    date: '2023-10-22',
    totalAmount: 215.00,
    status: ExpenseReportStatus.PAID,
    categories: [ExpenseCategory.GROUPS, ExpenseCategory.LOCAL_PARKING],
  },
  {
    id: '4',
    title: 'Commute & Meals',
    date: '2023-10-21',
    totalAmount: 40.00,
    status: ExpenseReportStatus.CREATED,
    categories: [ExpenseCategory.LOCAL_PARKING, ExpenseCategory.RESTAURANT],
  },
];

export const ExpenseReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [reports] = useState<ExpenseReportListItem[]>(mockReports);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterChips, setFilterChips] = useState([
    { id: 'status', label: 'Status: Submitted' },
    { id: 'sort', label: 'Amount: High to Low' },
  ]);

  const handleAddClick = () => {
    navigate('/new-report');
  };

  const handleFilterClick = () => {
    console.log('Open filter modal');
  };

  const handleRemoveChip = (chipId: string) => {
    setFilterChips(filterChips.filter((chip) => chip.id !== chipId));
  };

  const handleReportClick = (reportId: string) => {
    console.log('View report:', reportId);
  };

  const filteredReports = reports.filter((report) =>
    report.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-background-light">
      <Header title="Expense Reports" onAddClick={handleAddClick} />

      <main className="flex-grow pb-24 bg-background-light">
        <div className="p-4 space-y-4">
          <SearchInput value={searchQuery} onChange={setSearchQuery} />

          <div className="flex items-center space-x-2">
            <FilterButton onClick={handleFilterClick} />
          </div>

          <FilterChips chips={filterChips} onRemove={handleRemoveChip} />
        </div>

        <div className="px-4 space-y-4">
          {loading && (
            <div className="text-center py-8 text-muted-light dark:text-muted-dark">
              Loading...
            </div>
          )}

          {error && (
            <div className="text-center py-8 text-red-500">
              {error}
            </div>
          )}

          {!loading && !error && filteredReports.length === 0 && (
            <div className="text-center py-8 text-muted-light dark:text-muted-dark">
              No expense reports found
            </div>
          )}

          {!loading &&
            !error &&
            filteredReports.map((report) => (
              <ExpenseReportCard
                key={report.id}
                report={report}
                onClick={() => handleReportClick(report.id)}
              />
            ))}
        </div>
      </main>

      <BottomNav activeTab="reports" />
    </div>
  );
};
