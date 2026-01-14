import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Demo page showing the Expense Report Details design
 * This matches the provided HTML mockup exactly
 */
export function ExpenseReportDetailsDemoPage() {
  const navigate = useNavigate();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState('Business Trip to SF');

  const handleBack = () => {
    navigate('/');
  };

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
  };

  const handleTitleSave = () => {
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditingTitle(false);
    } else if (e.key === 'Escape') {
      setTitle('Business Trip to SF');
      setIsEditingTitle(false);
    }
  };

  const handleSubmitReport = () => {
    console.log('Submit report');
  };

  const handleAddExpense = () => {
    console.log('Add expense');
  };

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
                    {title}
                  </h2>
                ) : (
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
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
              Created on 07/15/2024
            </p>
          </div>

          {/* Expenses List */}
          <div className="space-y-3">
            {/* Expense 1 - Flight */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full text-primary flex-shrink-0">
                  <span className="material-symbols-outlined">flight</span>
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-semibold text-content-light dark:text-content-dark">
                    Flight to SFO
                  </p>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">
                    $450.00
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                    Submitted
                  </span>
                </div>
              </div>
            </div>

            {/* Expense 2 - Hotel */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full text-primary flex-shrink-0">
                  <span className="material-symbols-outlined">hotel</span>
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-semibold text-content-light dark:text-content-dark">
                    Hotel Stay (3 nights)
                  </p>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">
                    $875.50
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    Accepted
                  </span>
                </div>
              </div>
            </div>

            {/* Expense 3 - Restaurant */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full text-primary flex-shrink-0">
                  <span className="material-symbols-outlined">restaurant</span>
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-semibold text-content-light dark:text-content-dark">
                    Team Dinner
                  </p>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">
                    $230.10
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                    Denied
                  </span>
                </div>
              </div>
            </div>

            {/* Expense 4 - Transport */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full text-primary flex-shrink-0">
                  <span className="material-symbols-outlined">local_taxi</span>
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-semibold text-content-light dark:text-content-dark">
                    Client Transport
                  </p>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">
                    $78.00
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    Accepted
                  </span>
                </div>
              </div>
            </div>
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
