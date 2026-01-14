import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { expenseReportService } from '../services/expense-report.service';
import { expensesService } from '../services/expenses.service';
import {
  ExpenseReportDetails,
  Expense,
  ExpenseCategory,
  ExpenseStatus,
} from '../types/expense-report.types';

/**
 * Get icon name for expense category
 */
const getCategoryIcon = (category: ExpenseCategory): string => {
  const iconMap: Record<string, string> = {
    FLIGHT: 'flight',
    TRAVEL: 'flight',
    HOTEL: 'hotel',
    MEAL: 'restaurant',
    RESTAURANT: 'restaurant',
    TRANSPORT: 'local_taxi',
    LOCAL_PARKING: 'local_parking',
    OFFICE_SUPPLIES: 'shopping_cart',
    SHOPPING_CART: 'shopping_cart',
    GROUPS: 'groups',
    OTHER: 'receipt',
  };
  return iconMap[category] || 'receipt';
};

/**
 * Get status badge classes
 */
const getStatusBadgeClasses = (status: ExpenseStatus): string => {
  const statusMap: Record<ExpenseStatus, string> = {
    [ExpenseStatus.SUBMITTED]:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    [ExpenseStatus.ACCEPTED]:
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    [ExpenseStatus.DENIED]:
      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };
  return statusMap[status] || statusMap[ExpenseStatus.SUBMITTED];
};

/**
 * Assign status to expenses based on report status
 */
const assignExpenseStatus = (expenses: Expense[], reportStatus: string): Expense[] => {
  return expenses.map((expense, index) => {
    // Mock status assignment for demo purposes
    // In real app, this would come from backend
    let status: ExpenseStatus;
    if (index === 0) {
      status = ExpenseStatus.SUBMITTED;
    } else if (index === 2) {
      status = ExpenseStatus.DENIED;
    } else {
      status = ExpenseStatus.ACCEPTED;
    }
    return { ...expense, status };
  });
};

/**
 * Format date to MM/DD/YYYY
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

/**
 * Expense Report Details Page
 */
export function ExpenseReportDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<ExpenseReportDetails | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch report details
        const reportData = await expenseReportService.getById(id);
        setReport(reportData);
        setEditedTitle(reportData.title);

        // Fetch expenses for this report
        const expensesData = await expensesService.getByReportId(id);
        const expensesWithStatus = assignExpenseStatus(expensesData, reportData.status);
        setExpenses(expensesWithStatus);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load report details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
  };

  const handleTitleSave = async () => {
    if (!id || !editedTitle.trim()) {
      setIsEditingTitle(false);
      return;
    }

    try {
      const updatedReport = await expenseReportService.update(id, {
        title: editedTitle.trim(),
      });
      setReport(updatedReport);
      setIsEditingTitle(false);
    } catch (err) {
      console.error('Failed to update title:', err);
      // Revert to original title on error
      if (report) {
        setEditedTitle(report.title);
      }
      setIsEditingTitle(false);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      if (report) {
        setEditedTitle(report.title);
      }
      setIsEditingTitle(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleSubmitReport = () => {
    // TODO: Implement submit report functionality
    console.log('Submit report:', id);
  };

  const handleAddExpense = () => {
    // TODO: Implement add expense functionality
    console.log('Add expense to report:', id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-content-light dark:text-content-dark">Loading...</div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-red-600 dark:text-red-400">
          {error || 'Report not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="font-display bg-background-light dark:bg-background-dark min-h-screen">
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-4 bg-background-light dark:bg-background-dark sticky top-0 z-10">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="p-2 -ml-2 text-content-light dark:text-content-dark"
            >
              <span className="material-symbols-outlined">arrow_back_ios_new</span>
            </button>
            <h1 className="text-lg font-bold text-center flex-grow text-content-light dark:text-content-dark">
              Expense Report Details
            </h1>
            <div className="w-8"></div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow px-4 pb-40">
          {/* Report Title Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <div className="flex-grow">
                {!isEditingTitle ? (
                  <h2 className="text-2xl font-bold text-content-light dark:text-content-dark">
                    {report.title}
                  </h2>
                ) : (
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onBlur={handleTitleSave}
                    onKeyDown={handleTitleKeyDown}
                    className="text-2xl font-bold text-content-light dark:text-content-dark bg-transparent border-0 focus:ring-0 p-0 w-full focus:outline-2 focus:outline-primary rounded px-1"
                    autoFocus
                  />
                )}
              </div>
              <button
                onClick={handleTitleEdit}
                className="p-1 text-subtle-light dark:text-subtle-dark hover:text-primary dark:hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-base">edit</span>
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Created on {formatDate(report.createdAt)}
            </p>
          </div>

          {/* Expenses List */}
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="bg-surface-light dark:bg-surface-dark rounded-lg p-4"
              >
                <div className="flex items-center gap-4">
                  {/* Category Icon */}
                  <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full text-primary flex-shrink-0">
                    <span className="material-symbols-outlined">
                      {getCategoryIcon(expense.category)}
                    </span>
                  </div>

                  {/* Expense Details */}
                  <div className="flex-grow min-w-0">
                    <p className="font-semibold text-content-light dark:text-content-dark">
                      {expense.name}
                    </p>
                    <p className="text-sm text-subtle-light dark:text-subtle-dark">
                      ${expense.amount.toFixed(2)}
                    </p>
                  </div>

                  {/* Status Badge */}
                  {expense.status && (
                    <div className="text-right flex-shrink-0">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(
                          expense.status
                        )}`}
                      >
                        {expense.status}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="fixed bottom-0 left-0 right-0 p-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm max-w-md mx-auto">
          <div className="space-y-3">
            <button
              onClick={handleSubmitReport}
              className="w-full flex items-center justify-center gap-2 h-12 px-6 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined">send</span>
              <span>Submit Report</span>
            </button>
            <button
              onClick={handleAddExpense}
              className="w-full flex items-center justify-center gap-2 h-12 px-6 bg-surface-light dark:bg-surface-dark text-primary dark:text-primary font-bold rounded-lg border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-surface-dark/80 transition-colors"
            >
              <span className="material-symbols-outlined">add_circle</span>
              <span>Add Expense</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
