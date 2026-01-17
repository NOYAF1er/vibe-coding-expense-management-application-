import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ExpenseStatus, ExpenseCategory, Expense } from '../types/expense-report.types';
import { expensesService } from '../services/expenses.service';
import { StatusBadge } from '../components/StatusBadge';

/**
 * Expense Details Page
 * Displays detailed information about a single expense with history timeline
 */
export function ExpenseDetailsPage() {
  const navigate = useNavigate();
  const { reportId, expenseId } = useParams<{ reportId: string; expenseId: string }>();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpense = async () => {
      if (!expenseId) {
        setError('Expense ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await expensesService.getById(expenseId);
        setExpense(data);
        setError(null);
      } catch (err) {
        setError('Failed to load expense details');
        console.error('Error fetching expense:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [expenseId]);

  // Generate history timeline based on expense status
  const getExpenseHistory = (expense: Expense) => {
    const history = [
      {
        status: 'Submitted',
        date: new Date(expense.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        icon: 'send',
      },
    ];

    if (expense.status === ExpenseStatus.REVIEWED || expense.status === ExpenseStatus.APPROVED || expense.status === ExpenseStatus.REJECTED) {
      history.unshift({
        status: 'Reviewed',
        date: new Date(expense.updatedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        icon: 'search',
      });
    }

    if (expense.status === ExpenseStatus.APPROVED) {
      history.unshift({
        status: 'Approved',
        date: new Date(expense.updatedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        icon: 'check',
      });
    }

    if (expense.status === ExpenseStatus.REJECTED) {
      history.unshift({
        status: 'Rejected',
        date: new Date(expense.updatedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        icon: 'x',
      });
    }

    return history;
  };

  const getCategoryLabel = (category: ExpenseCategory) => {
    switch (category) {
      case ExpenseCategory.TRAVEL:
        return 'Travel';
      case ExpenseCategory.MEAL:
        return 'Meal';
      case ExpenseCategory.HOTEL:
        return 'Hotel';
      case ExpenseCategory.TRANSPORT:
        return 'Transport';
      case ExpenseCategory.OFFICE_SUPPLIES:
        return 'Office Supplies';
      default:
        return category;
    }
  };

  const getHistoryIcon = (iconType: string, isActive: boolean) => {
    const iconClass = isActive
      ? 'relative h-8 w-8 flex items-center justify-center rounded-full bg-primary text-white'
      : 'relative h-8 w-8 flex items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300';

    switch (iconType) {
      case 'check':
        return (
          <div className={iconClass}>
            <svg fill="currentColor" height="16" viewBox="0 0 256 256" width="16" xmlns="http://www.w3.org/2000/svg">
              <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
            </svg>
          </div>
        );
      case 'search':
        return (
          <div className={iconClass}>
            <svg fill="currentColor" height="16" viewBox="0 0 256 256" width="16" xmlns="http://www.w3.org/2000/svg">
              <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
            </svg>
          </div>
        );
      case 'send':
        return (
          <div className={iconClass}>
            <svg fill="currentColor" height="16" viewBox="0 0 256 256" width="16" xmlns="http://www.w3.org/2000/svg">
              <path d="M227.32,28.68a16,16,0,0,0-15.66-4.08l-.15,0L19.57,82.84a16,16,0,0,0-2.42,29.84l85.62,40.55,40.55,85.62A15.86,15.86,0,0,0,157.74,248q.69,0,1.38-.06a15.88,15.88,0,0,0,14-11.51l58.2-191.94c0-.05,0-.1,0-.15A16,16,0,0,0,227.32,28.68ZM157.83,231.85l-.05.14L118.42,148.9l47.24-47.25a8,8,0,0,0-11.31-11.31L107.1,137.58,24,98.22l.14,0L216,40Z"></path>
            </svg>
          </div>
        );
      case 'x':
        return (
          <div className="relative h-8 w-8 flex items-center justify-center rounded-full bg-red-500 text-white">
            <svg fill="currentColor" height="16" viewBox="0 0 256 256" width="16" xmlns="http://www.w3.org/2000/svg">
              <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const handleEdit = () => {
    navigate(`/reports/${reportId}/edit-expense/${expenseId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-content-light dark:text-content-dark">
        <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
          <div className="flex items-center p-4">
            <button className="p-2 -ml-2" onClick={() => navigate(-1)}>
              <svg className="text-content-light dark:text-content-dark" fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
              </svg>
            </button>
            <h1 className="flex-1 text-lg font-bold text-center">Expense Details</h1>
            <div className="w-8"></div>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-subtle-light dark:text-subtle-dark">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !expense) {
    return (
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-content-light dark:text-content-dark">
        <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
          <div className="flex items-center p-4">
            <button className="p-2 -ml-2" onClick={() => navigate(-1)}>
              <svg className="text-content-light dark:text-content-dark" fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
              </svg>
            </button>
            <h1 className="flex-1 text-lg font-bold text-center">Expense Details</h1>
            <div className="w-8"></div>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500">{error || 'Expense not found'}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
            >
              Go Back
            </button>
          </div>
        </main>
      </div>
    );
  }

  const history = getExpenseHistory(expense);

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-content-light dark:text-content-dark">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
        <div className="flex items-center p-4">
          <button className="p-2 -ml-2" onClick={() => navigate(-1)}>
            <svg className="text-content-light dark:text-content-dark" fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
            </svg>
          </button>
          <h1 className="flex-1 text-lg font-bold text-center">Expense Details</h1>
          <div className="w-8"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Expense Summary Card */}
        <section className="bg-background-light dark:bg-background-dark rounded-lg p-4 border border-border-light dark:border-border-dark">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">${expense.amount.toFixed(2)}</h2>
              <p className="text-gray-500 dark:text-gray-400">{getCategoryLabel(expense.category)}</p>
            </div>
            <StatusBadge status={expense.status || ExpenseStatus.SUBMITTED} className="px-3 py-1.5 text-sm" />
          </div>
          <p className="mt-2 text-content-light dark:text-content-dark">{expense.description || expense.name}</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {new Date(expense.expenseDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </section>

        {/* History Section */}
        <section>
          <h3 className="text-lg font-bold mb-3 px-1">History</h3>
          <div className="flow-root">
            <ul className="-mb-8">
              {history.map((item, index) => (
                <li key={index}>
                  <div className={index !== history.length - 1 ? 'relative pb-8' : 'relative'}>
                    {index !== history.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="absolute left-4 top-8 -ml-px h-full w-0.5 bg-gray-300 dark:bg-gray-600"
                      ></span>
                    )}
                    <div className="relative flex items-start space-x-3">
                      <div>
                        {getHistoryIcon(item.icon, index === 0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div>
                          <p className="font-medium text-content-light dark:text-content-dark">{item.status}</p>
                          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{item.date}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-background-light dark:bg-background-dark border-t border-border-light dark:border-border-dark pt-4 px-4 pb-safe-bottom">
        <div className="flex items-center space-x-3 mb-4">
          <button
            onClick={handleEdit}
            className="w-full h-12 flex items-center justify-center rounded-lg bg-primary/20 dark:bg-primary/30 text-primary font-bold"
          >
            Edit
          </button>
          <button className="w-full h-12 flex items-center justify-center rounded-lg bg-primary text-white font-bold">
            Download PDF
          </button>
        </div>
        <nav className="flex justify-around items-start border-t border-border-light dark:border-border-dark pt-2">
          <a className="flex flex-col items-center gap-1 text-primary" href="/">
            <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm44-84a28,28,0,0,1-28,28h-8v16a8,8,0,0,1-16,0V152h-8a28,28,0,0,1,0-56h8V80a8,8,0,0,1,16,0v16h8A28,28,0,0,1,172,128Z"></path>
            </svg>
            <span className="text-xs font-medium">Expenses</span>
          </a>
          <a className="flex flex-col items-center gap-1 text-gray-500" href="/new-report">
            <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
            </svg>
            <span className="text-xs font-medium">Submit</span>
          </a>
          <a className="flex flex-col items-center gap-1 text-gray-500" href="/profile">
            <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
            </svg>
            <span className="text-xs font-medium">Profile</span>
          </a>
        </nav>
        <div className="h-safe-bottom"></div>
      </footer>
    </div>
  );
}
