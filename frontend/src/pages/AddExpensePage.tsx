import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { expensesService } from '../services/expenses.service';
import { ExpenseCategory } from '../types/expense-report.types';
import { SuccessModal } from '../components/SuccessModal';

/**
 * AddExpensePage Component
 * Pixel-perfect implementation of the Add/Edit Expense screen
 */
export function AddExpensePage() {
  const navigate = useNavigate();
  const { reportId, expenseId } = useParams<{ reportId: string; expenseId?: string }>();
  
  // Form state
  const [category, setCategory] = useState<ExpenseCategory>(ExpenseCategory.TRAVEL);
  const [amount, setAmount] = useState('');
  const [expenseName, setExpenseName] = useState('');
  const [description, setDescription] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedExpenseId, setSavedExpenseId] = useState<string | null>(null);

  // Load expense data if editing
  useEffect(() => {
    const loadExpense = async () => {
      if (!expenseId) return;

      setIsLoading(true);
      try {
        const expense = await expensesService.getById(expenseId);
        setCategory(expense.category);
        setAmount(expense.amount.toString());
        setExpenseName(expense.name);
        setDescription(expense.description || '');
        setExpenseDate(new Date(expense.expenseDate).toISOString().split('T')[0]);
      } catch (error) {
        console.error('Failed to load expense:', error);
        alert('Failed to load expense. Please try again.');
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };

    loadExpense();
  }, [expenseId, navigate]);

  // Report date (read-only, from context)
  const reportDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });

  // Map display categories to backend enum
  const categoryOptions = [
    { label: 'Travel', value: ExpenseCategory.TRAVEL },
    { label: 'Food', value: ExpenseCategory.MEAL },
    { label: 'Supplies', value: ExpenseCategory.OFFICE_SUPPLIES },
    { label: 'Hotel', value: ExpenseCategory.HOTEL },
    { label: 'Transport', value: ExpenseCategory.TRANSPORT },
    { label: 'Other', value: ExpenseCategory.OTHER },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleAmountChange = (value: string) => {
    // Allow only numbers and decimal point
    const regex = /^\d*\.?\d{0,2}$/;
    if (value === '' || regex.test(value)) {
      setAmount(value);
    }
  };

  const isFormValid = () => {
    return category && amount && parseFloat(amount) > 0 && expenseDate && reportId;
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSave = async () => {
    if (!isFormValid() || !reportId) return;

    setIsSubmitting(true);
    try {
      let responseExpenseId: string;
      
      if (expenseId) {
        // Update existing expense
        await expensesService.update(expenseId, {
          category,
          amount: parseFloat(amount),
          name: expenseName || `${categoryOptions.find(c => c.value === category)?.label} Expense`,
          description: description || undefined,
          expenseDate,
        });
        responseExpenseId = expenseId;
      } else {
        // Create new expense
        const newExpense = await expensesService.create({
          reportId,
          category,
          amount: parseFloat(amount),
          name: expenseName || `${categoryOptions.find(c => c.value === category)?.label} Expense`,
          description: description || undefined,
          expenseDate,
        });
        responseExpenseId = newExpense.id;
      }
      
      // Show success modal
      setSavedExpenseId(responseExpenseId);
      setShowSuccessModal(true);
    } catch (error) {
      console.error(`Failed to ${expenseId ? 'update' : 'create'} expense:`, error);
      alert(`Failed to ${expenseId ? 'update' : 'create'} expense. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    if (reportId) {
      if (expenseId) {
        // After update: Navigate to expense details page
        navigate(`/reports/${reportId}/expenses/${savedExpenseId}`);
      } else {
        // After creation: Navigate to expense report details page
        navigate(`/reports/${reportId}`);
      }
    }
  };

  const formatExpenseDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background-light dark:bg-background-dark">
        <div className="text-foreground-light dark:text-foreground-dark">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen justify-between bg-background-light dark:bg-background-dark font-display">
      <div>
        {/* Header */}
        <header className="p-4 flex items-center">
          <button
            onClick={handleCancel}
            className="p-2 text-foreground-light dark:text-foreground-dark"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <h1 className="flex-1 text-center font-bold text-lg text-foreground-light dark:text-foreground-dark pr-8">
            {expenseId ? 'Edit Expense' : 'Add Expense'}
          </h1>
        </header>

        {/* Main Form */}
        <main className="px-4 space-y-6">
          {/* Category and Amount Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Category Select */}
            <div>
              <label 
                className="block text-sm font-medium text-foreground-light/80 dark:text-foreground-dark/80 mb-1" 
                htmlFor="category"
              >
                Category
              </label>
              <select
                className="form-select w-full bg-subtle-light dark:bg-subtle-dark border-none rounded-lg h-14 px-4 text-foreground-light dark:text-foreground-dark focus:ring-2 focus:ring-primary appearance-none bg-no-repeat bg-right pr-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1.5em 1.5em',
                }}
                id="category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount Input */}
            <div>
              <label 
                className="block text-sm font-medium text-foreground-light/80 dark:text-foreground-dark/80 mb-1" 
                htmlFor="amount"
              >
                Amount
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <span className="text-foreground-light/50 dark:text-foreground-dark/50">$</span>
                </div>
                <input
                  className="w-full bg-subtle-light dark:bg-subtle-dark border-none rounded-lg h-14 pl-8 pr-4 text-foreground-light dark:text-foreground-dark placeholder:text-foreground-light/50 dark:placeholder:text-foreground-dark/50 focus:ring-2 focus:ring-primary"
                  id="amount"
                  name="amount"
                  placeholder="0.00"
                  type="text"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Expense Name */}
          <div>
            <label 
              className="block text-sm font-medium text-foreground-light/80 dark:text-foreground-dark/80 mb-1" 
              htmlFor="expense-name"
            >
              Expense Name <span className="text-foreground-light/50 dark:text-foreground-dark/50">(Optional)</span>
            </label>
            <input
              className="w-full bg-subtle-light dark:bg-subtle-dark border-none rounded-lg h-14 px-4 text-foreground-light dark:text-foreground-dark placeholder:text-foreground-light/50 dark:placeholder:text-foreground-dark/50 focus:ring-2 focus:ring-primary"
              id="expense-name"
              name="expense-name"
              placeholder="e.g. Client Dinner"
              type="text"
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label 
              className="block text-sm font-medium text-foreground-light/80 dark:text-foreground-dark/80 mb-1" 
              htmlFor="description"
            >
              Description <span className="text-foreground-light/50 dark:text-foreground-dark/50">(Optional)</span>
            </label>
            <textarea
              className="w-full bg-subtle-light dark:bg-subtle-dark border-none rounded-lg p-4 text-foreground-light dark:text-foreground-dark placeholder:text-foreground-light/50 dark:placeholder:text-foreground-dark/50 focus:ring-2 focus:ring-primary resize-none"
              id="description"
              name="description"
              placeholder="A short description of the expense"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* File Upload */}
          <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-subtle-dark/30 dark:border-subtle-light/30 rounded-xl p-6 text-center bg-subtle-light/50 dark:bg-subtle-dark/50">
            <div className="bg-primary/20 dark:bg-primary/30 p-3 rounded-full mb-4">
              <span className="material-symbols-outlined text-primary text-3xl">cloud_upload</span>
            </div>
            <p className="font-semibold text-foreground-light dark:text-foreground-dark">
              Drag &amp; drop files here
            </p>
            <p className="text-sm text-foreground-light/60 dark:text-foreground-dark/60">
              or click to upload
            </p>
            <input
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              type="file"
              multiple
              onChange={handleFileChange}
              aria-label="Upload files"
            />
            {files.length > 0 && (
              <p className="mt-2 text-sm text-primary">
                {files.length} file{files.length > 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          {/* Date Information */}
          <div className="space-y-2 pt-2">
            {/* Report Date (Read-only) */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-subtle-light dark:bg-subtle-dark">
              <span className="text-foreground-light dark:text-foreground-dark">Report Date</span>
              <span className="text-foreground-light dark:text-foreground-dark font-medium">
                {reportDate}
              </span>
            </div>

            {/* Expense Date (Clickable) */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-subtle-light dark:bg-subtle-dark">
              <label htmlFor="expense-date" className="text-foreground-light dark:text-foreground-dark">
                Expense Date
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  id="expense-date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="text-primary font-medium bg-transparent border-none focus:outline-none cursor-pointer"
                  style={{ colorScheme: 'light' }}
                />
                <span className="material-symbols-outlined text-foreground-light/60 dark:text-foreground-dark/60 text-base">
                  arrow_forward_ios
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="p-4 bg-background-light dark:bg-background-dark">
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleCancel}
            className="w-full bg-subtle-light dark:bg-subtle-dark text-foreground-light dark:text-foreground-dark font-bold h-14 rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isFormValid() || isSubmitting}
            className="w-full bg-primary text-white font-bold h-14 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </footer>
      
      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleModalClose}
        title={expenseId ? "Updated Successfully" : "Created Successfully"}
        message={expenseId
          ? "Your expense has been updated successfully."
          : "Your expense has been created successfully."}
        buttonLabel="Done"
      />
    </div>
  );
}
