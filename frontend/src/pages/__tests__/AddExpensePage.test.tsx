import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import { AddExpensePage } from '../AddExpensePage';
import { expensesService } from '../../services/expenses.service';
import { ExpenseCategory } from '../../types/expense-report.types';

// Mock the expenses service
vi.mock('../../services/expenses.service', () => ({
  expensesService: {
    create: vi.fn(),
  },
}));

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ reportId: 'test-report-id' }),
  };
});

describe('AddExpensePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={['/reports/test-report-id/add-expense']}>
        <Routes>
          <Route path="/reports/:reportId/add-expense" element={<AddExpensePage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  describe('Rendering', () => {
    it('should render the page title', () => {
      renderComponent();
      expect(screen.getByText('Add Expense')).toBeInTheDocument();
    });

    it('should render all form fields', () => {
      renderComponent();
      
      expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Expense Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Upload files/i)).toBeInTheDocument();
    });

    it('should render category dropdown with all options', () => {
      renderComponent();
      
      const categorySelect = screen.getByLabelText(/Category/i) as HTMLSelectElement;
      expect(categorySelect).toBeInTheDocument();
      
      const options = Array.from(categorySelect.options).map(opt => opt.textContent);
      expect(options).toContain('Travel');
      expect(options).toContain('Food');
      expect(options).toContain('Supplies');
      expect(options).toContain('Hotel');
      expect(options).toContain('Transport');
      expect(options).toContain('Other');
    });

    it('should render Cancel and Save buttons', () => {
      renderComponent();
      
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
    });

    it('should render close button in header', () => {
      renderComponent();
      
      const closeButton = screen.getByLabelText(/Close/i);
      expect(closeButton).toBeInTheDocument();
    });

    it('should render date fields', () => {
      renderComponent();
      
      expect(screen.getByText('Report Date')).toBeInTheDocument();
      expect(screen.getByText('Expense Date')).toBeInTheDocument();
    });

    it('should render file upload area', () => {
      renderComponent();
      
      expect(screen.getByText('Drag & drop files here')).toBeInTheDocument();
      expect(screen.getByText('or click to upload')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should disable Save button when amount is empty', () => {
      renderComponent();
      
      const saveButton = screen.getByRole('button', { name: /Save/i });
      expect(saveButton).toBeDisabled();
    });

    it('should enable Save button when required fields are filled', () => {
      renderComponent();
      
      const amountInput = screen.getByPlaceholderText('0.00');
      fireEvent.change(amountInput, { target: { value: '100.50' } });
      
      const saveButton = screen.getByRole('button', { name: /Save/i });
      expect(saveButton).not.toBeDisabled();
    });

    it('should validate amount format (only numbers and decimals)', () => {
      renderComponent();
      
      const amountInput = screen.getByPlaceholderText('0.00') as HTMLInputElement;
      
      // Valid inputs
      fireEvent.change(amountInput, { target: { value: '100' } });
      expect(amountInput.value).toBe('100');
      
      fireEvent.change(amountInput, { target: { value: '100.50' } });
      expect(amountInput.value).toBe('100.50');
      
      fireEvent.change(amountInput, { target: { value: '0.99' } });
      expect(amountInput.value).toBe('0.99');
    });

    it('should reject invalid amount formats', () => {
      renderComponent();
      
      const amountInput = screen.getByPlaceholderText('0.00') as HTMLInputElement;
      
      // Set initial valid value
      fireEvent.change(amountInput, { target: { value: '100' } });
      expect(amountInput.value).toBe('100');
      
      // Try invalid input - should not change
      fireEvent.change(amountInput, { target: { value: 'abc' } });
      expect(amountInput.value).toBe('100');
      
      // Try more than 2 decimal places
      fireEvent.change(amountInput, { target: { value: '100.999' } });
      expect(amountInput.value).toBe('100');
    });

    it('should allow clearing the amount field', () => {
      renderComponent();
      
      const amountInput = screen.getByPlaceholderText('0.00') as HTMLInputElement;
      
      fireEvent.change(amountInput, { target: { value: '100' } });
      expect(amountInput.value).toBe('100');
      
      fireEvent.change(amountInput, { target: { value: '' } });
      expect(amountInput.value).toBe('');
    });
  });

  describe('Form Interactions', () => {
    it('should update category when selected', () => {
      renderComponent();
      
      const categorySelect = screen.getByLabelText(/Category/i) as HTMLSelectElement;
      
      fireEvent.change(categorySelect, { target: { value: ExpenseCategory.MEAL } });
      expect(categorySelect.value).toBe(ExpenseCategory.MEAL);
    });

    it('should update expense name when typed', () => {
      renderComponent();
      
      const nameInput = screen.getByPlaceholderText('e.g. Client Dinner') as HTMLInputElement;
      
      fireEvent.change(nameInput, { target: { value: 'Business Lunch' } });
      expect(nameInput.value).toBe('Business Lunch');
    });

    it('should update description when typed', () => {
      renderComponent();
      
      const descriptionInput = screen.getByPlaceholderText('A short description of the expense') as HTMLTextAreaElement;
      
      fireEvent.change(descriptionInput, { target: { value: 'Meeting with client' } });
      expect(descriptionInput.value).toBe('Meeting with client');
    });

    it('should update expense date when changed', () => {
      renderComponent();
      
      const dateInput = screen.getByDisplayValue(/\d{4}-\d{2}-\d{2}/) as HTMLInputElement;
      
      fireEvent.change(dateInput, { target: { value: '2024-10-25' } });
      expect(dateInput.value).toBe('2024-10-25');
    });

    it('should handle file selection', () => {
      renderComponent();
      
      const fileInput = screen.getByLabelText(/Upload files/i) as HTMLInputElement;
      
      const file = new File(['receipt'], 'receipt.pdf', { type: 'application/pdf' });
      fireEvent.change(fileInput, { target: { files: [file] } });
      
      expect(screen.getByText('1 file selected')).toBeInTheDocument();
    });

    it('should handle multiple file selection', () => {
      renderComponent();
      
      const fileInput = screen.getByLabelText(/Upload files/i) as HTMLInputElement;
      
      const file1 = new File(['receipt1'], 'receipt1.pdf', { type: 'application/pdf' });
      const file2 = new File(['receipt2'], 'receipt2.pdf', { type: 'application/pdf' });
      fireEvent.change(fileInput, { target: { files: [file1, file2] } });
      
      expect(screen.getByText('2 files selected')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should navigate back when Cancel button is clicked', () => {
      renderComponent();
      
      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      fireEvent.click(cancelButton);
      
      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

    it('should navigate back when close button is clicked', () => {
      renderComponent();
      
      const closeButton = screen.getByLabelText(/Close/i);
      fireEvent.click(closeButton);
      
      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid data', async () => {
      const mockExpense = {
        id: 'expense-1',
        reportId: 'test-report-id',
        category: ExpenseCategory.TRAVEL,
        amount: 150.75,
        name: 'Travel Expense',
        expenseDate: '2024-10-24',
        receiptRequired: true,
        createdAt: '2024-10-24T00:00:00Z',
        updatedAt: '2024-10-24T00:00:00Z',
      };

      vi.mocked(expensesService.create).mockResolvedValue(mockExpense);

      renderComponent();
      
      // Fill required fields
      const categorySelect = screen.getByLabelText(/Category/i);
      fireEvent.change(categorySelect, { target: { value: ExpenseCategory.TRAVEL } });
      
      const amountInput = screen.getByPlaceholderText('0.00');
      fireEvent.change(amountInput, { target: { value: '150.75' } });
      
      // Click Save
      const saveButton = screen.getByRole('button', { name: /Save/i });
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(expensesService.create).toHaveBeenCalledWith({
          reportId: 'test-report-id',
          category: ExpenseCategory.TRAVEL,
          amount: 150.75,
          name: 'Travel Expense',
          description: undefined,
          expenseDate: expect.any(String),
        });
      });
      
      expect(mockNavigate).toHaveBeenCalledWith('/reports/test-report-id');
    });

    it('should submit form with all fields filled', async () => {
      const mockExpense = {
        id: 'expense-1',
        reportId: 'test-report-id',
        category: ExpenseCategory.MEAL,
        amount: 75.50,
        name: 'Client Dinner',
        description: 'Dinner with client',
        expenseDate: '2024-10-24',
        receiptRequired: true,
        createdAt: '2024-10-24T00:00:00Z',
        updatedAt: '2024-10-24T00:00:00Z',
      };

      vi.mocked(expensesService.create).mockResolvedValue(mockExpense);

      renderComponent();
      
      // Fill all fields
      const categorySelect = screen.getByLabelText(/Category/i);
      fireEvent.change(categorySelect, { target: { value: ExpenseCategory.MEAL } });
      
      const amountInput = screen.getByPlaceholderText('0.00');
      fireEvent.change(amountInput, { target: { value: '75.50' } });
      
      const nameInput = screen.getByPlaceholderText('e.g. Client Dinner');
      fireEvent.change(nameInput, { target: { value: 'Client Dinner' } });
      
      const descriptionInput = screen.getByPlaceholderText('A short description of the expense');
      fireEvent.change(descriptionInput, { target: { value: 'Dinner with client' } });
      
      const dateInput = screen.getByDisplayValue(/\d{4}-\d{2}-\d{2}/);
      fireEvent.change(dateInput, { target: { value: '2024-10-24' } });
      
      // Click Save
      const saveButton = screen.getByRole('button', { name: /Save/i });
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(expensesService.create).toHaveBeenCalledWith({
          reportId: 'test-report-id',
          category: ExpenseCategory.MEAL,
          amount: 75.50,
          name: 'Client Dinner',
          description: 'Dinner with client',
          expenseDate: '2024-10-24',
        });
      });
      
      expect(mockNavigate).toHaveBeenCalledWith('/reports/test-report-id');
    });

    it('should show loading state during submission', async () => {
      vi.mocked(expensesService.create).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      renderComponent();
      
      const amountInput = screen.getByPlaceholderText('0.00');
      fireEvent.change(amountInput, { target: { value: '100' } });
      
      const saveButton = screen.getByRole('button', { name: /Save/i });
      fireEvent.click(saveButton);
      
      expect(screen.getByText('Saving...')).toBeInTheDocument();
      expect(saveButton).toBeDisabled();
    });

    it('should handle submission error', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      
      vi.mocked(expensesService.create).mockRejectedValue(new Error('Network error'));

      renderComponent();
      
      const amountInput = screen.getByPlaceholderText('0.00');
      fireEvent.change(amountInput, { target: { value: '100' } });
      
      const saveButton = screen.getByRole('button', { name: /Save/i });
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Failed to create expense. Please try again.');
      });
      
      expect(mockNavigate).not.toHaveBeenCalled();
      
      consoleErrorSpy.mockRestore();
      alertSpy.mockRestore();
    });

    it('should not submit when form is invalid', () => {
      renderComponent();
      
      const saveButton = screen.getByRole('button', { name: /Save/i });
      
      // Try to click save without filling required fields
      fireEvent.click(saveButton);
      
      expect(expensesService.create).not.toHaveBeenCalled();
    });

    it('should use default name when expense name is not provided', async () => {
      const mockExpense = {
        id: 'expense-1',
        reportId: 'test-report-id',
        category: ExpenseCategory.HOTEL,
        amount: 200,
        name: 'Hotel Expense',
        expenseDate: '2024-10-24',
        receiptRequired: true,
        createdAt: '2024-10-24T00:00:00Z',
        updatedAt: '2024-10-24T00:00:00Z',
      };

      vi.mocked(expensesService.create).mockResolvedValue(mockExpense);

      renderComponent();
      
      const categorySelect = screen.getByLabelText(/Category/i);
      fireEvent.change(categorySelect, { target: { value: ExpenseCategory.HOTEL } });
      
      const amountInput = screen.getByPlaceholderText('0.00');
      fireEvent.change(amountInput, { target: { value: '200' } });
      
      const saveButton = screen.getByRole('button', { name: /Save/i });
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(expensesService.create).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Hotel Expense',
          })
        );
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for all form inputs', () => {
      renderComponent();
      
      expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Expense Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Upload files/i)).toBeInTheDocument();
    });

    it('should have aria-label for close button', () => {
      renderComponent();
      
      const closeButton = screen.getByLabelText('Close');
      expect(closeButton).toBeInTheDocument();
    });

    it('should disable buttons appropriately', () => {
      renderComponent();
      
      const saveButton = screen.getByRole('button', { name: /Save/i });
      expect(saveButton).toBeDisabled();
      
      const amountInput = screen.getByPlaceholderText('0.00');
      fireEvent.change(amountInput, { target: { value: '100' } });
      
      expect(saveButton).not.toBeDisabled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero amount', () => {
      renderComponent();
      
      const amountInput = screen.getByPlaceholderText('0.00');
      fireEvent.change(amountInput, { target: { value: '0' } });
      
      const saveButton = screen.getByRole('button', { name: /Save/i });
      expect(saveButton).toBeDisabled(); // Zero amount should not be valid
    });

    it('should handle very large amounts', () => {
      renderComponent();
      
      const amountInput = screen.getByPlaceholderText('0.00') as HTMLInputElement;
      fireEvent.change(amountInput, { target: { value: '999999.99' } });
      
      expect(amountInput.value).toBe('999999.99');
    });

    it('should handle decimal amounts correctly', () => {
      renderComponent();
      
      const amountInput = screen.getByPlaceholderText('0.00') as HTMLInputElement;
      
      fireEvent.change(amountInput, { target: { value: '10.5' } });
      expect(amountInput.value).toBe('10.5');
      
      fireEvent.change(amountInput, { target: { value: '10.50' } });
      expect(amountInput.value).toBe('10.50');
    });

    it('should handle empty file selection', () => {
      renderComponent();
      
      const fileInput = screen.getByLabelText(/Upload files/i) as HTMLInputElement;
      
      // Simulate selecting files then clearing
      const file = new File(['receipt'], 'receipt.pdf', { type: 'application/pdf' });
      fireEvent.change(fileInput, { target: { files: [file] } });
      expect(screen.getByText('1 file selected')).toBeInTheDocument();
      
      // Clear files
      fireEvent.change(fileInput, { target: { files: [] } });
      expect(screen.queryByText('1 file selected')).not.toBeInTheDocument();
    });
  });
});
