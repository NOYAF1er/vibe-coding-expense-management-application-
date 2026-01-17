import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import { ExpenseDetailsPage } from '../ExpenseDetailsPage';
import { expensesService } from '../../services/expenses.service';
import { ExpenseCategory, ExpenseStatus } from '../../types/expense-report.types';

// Mock the expenses service
vi.mock('../../services/expenses.service', () => ({
  expensesService: {
    getById: vi.fn(),
  },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('ExpenseDetailsPage', () => {
  const mockExpense = {
    id: 'f49238ae-b1a3-4615-a7aa-99c63893d44b',
    reportId: '3efdc5df-6994-4c40-86c4-2f9f2b14c8b3',
    name: 'Billet de train Paris',
    description: 'Aller-retour Paris Gare de Lyon',
    amount: 125.5,
    expenseDate: '2024-01-15',
    category: ExpenseCategory.TRAVEL,
    status: ExpenseStatus.APPROVED,
    receiptRequired: true,
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-16T14:30:00.000Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    vi.mocked(expensesService.getById).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(
      <MemoryRouter initialEntries={['/reports/123/expenses/456']}>
        <Routes>
          <Route path="/reports/:reportId/expenses/:expenseId" element={<ExpenseDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render expense details when data is loaded', async () => {
    vi.mocked(expensesService.getById).mockResolvedValue(mockExpense);

    render(
      <MemoryRouter initialEntries={['/reports/123/expenses/f49238ae-b1a3-4615-a7aa-99c63893d44b']}>
        <Routes>
          <Route path="/reports/:reportId/expenses/:expenseId" element={<ExpenseDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('$125.50')).toBeInTheDocument();
    });

    expect(screen.getByText('Travel')).toBeInTheDocument();
    expect(screen.getByText('Aller-retour Paris Gare de Lyon')).toBeInTheDocument();
    expect(screen.getAllByText('January 15, 2024').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Approved').length).toBeGreaterThan(0);
  });

  it('should render error state when expense fetch fails', async () => {
    vi.mocked(expensesService.getById).mockRejectedValue(new Error('Failed to fetch'));

    render(
      <MemoryRouter initialEntries={['/reports/123/expenses/456']}>
        <Routes>
          <Route path="/reports/:reportId/expenses/:expenseId" element={<ExpenseDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load expense details')).toBeInTheDocument();
    });

    expect(screen.getByText('Go Back')).toBeInTheDocument();
  });

  it('should display correct category label', async () => {
    const expenseWithMeal = { ...mockExpense, category: ExpenseCategory.MEAL };
    vi.mocked(expensesService.getById).mockResolvedValue(expenseWithMeal);

    render(
      <MemoryRouter initialEntries={['/reports/123/expenses/456']}>
        <Routes>
          <Route path="/reports/:reportId/expenses/:expenseId" element={<ExpenseDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Meal')).toBeInTheDocument();
    });
  });

  it('should display history timeline for approved expense', async () => {
    vi.mocked(expensesService.getById).mockResolvedValue(mockExpense);

    render(
      <MemoryRouter initialEntries={['/reports/123/expenses/456']}>
        <Routes>
          <Route path="/reports/:reportId/expenses/:expenseId" element={<ExpenseDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('History')).toBeInTheDocument();
    });

    // Should show all three statuses for approved expense
    expect(screen.getAllByText('Approved').length).toBeGreaterThan(0);
    expect(screen.getByText('Reviewed')).toBeInTheDocument();
    expect(screen.getByText('Submitted')).toBeInTheDocument();
  });

  it('should display history timeline for submitted expense', async () => {
    const submittedExpense = { ...mockExpense, status: ExpenseStatus.SUBMITTED };
    vi.mocked(expensesService.getById).mockResolvedValue(submittedExpense);

    render(
      <MemoryRouter initialEntries={['/reports/123/expenses/456']}>
        <Routes>
          <Route path="/reports/:reportId/expenses/:expenseId" element={<ExpenseDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('History')).toBeInTheDocument();
    });

    // Should only show submitted status
    expect(screen.getAllByText('Submitted').length).toBeGreaterThan(0);
    expect(screen.queryByText('Reviewed')).not.toBeInTheDocument();
    expect(screen.queryByText('Approved')).not.toBeInTheDocument();
  });

  it('should call navigate when back button is clicked', async () => {
    vi.mocked(expensesService.getById).mockResolvedValue(mockExpense);

    render(
      <MemoryRouter initialEntries={['/reports/123/expenses/456']}>
        <Routes>
          <Route path="/reports/:reportId/expenses/:expenseId" element={<ExpenseDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('$125.50')).toBeInTheDocument();
    });

    const backButton = screen.getAllByRole('button')[0];
    backButton.click();

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('should navigate to edit page when Edit button is clicked', async () => {
    vi.mocked(expensesService.getById).mockResolvedValue(mockExpense);

    render(
      <MemoryRouter initialEntries={['/reports/123/expenses/f49238ae-b1a3-4615-a7aa-99c63893d44b']}>
        <Routes>
          <Route path="/reports/:reportId/expenses/:expenseId" element={<ExpenseDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    const editButton = screen.getByText('Edit');
    editButton.click();

    expect(mockNavigate).toHaveBeenCalledWith('/reports/123/edit-expense/f49238ae-b1a3-4615-a7aa-99c63893d44b');
  });

  it('should use expense name when description is not available', async () => {
    const expenseWithoutDescription = { ...mockExpense, description: undefined };
    vi.mocked(expensesService.getById).mockResolvedValue(expenseWithoutDescription);

    render(
      <MemoryRouter initialEntries={['/reports/123/expenses/456']}>
        <Routes>
          <Route path="/reports/:reportId/expenses/:expenseId" element={<ExpenseDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Billet de train Paris')).toBeInTheDocument();
    });
  });

  it('should display correct status badge styling for different statuses', async () => {
    const rejectedExpense = { ...mockExpense, status: ExpenseStatus.REJECTED };
    vi.mocked(expensesService.getById).mockResolvedValue(rejectedExpense);

    render(
      <MemoryRouter initialEntries={['/reports/123/expenses/456']}>
        <Routes>
          <Route path="/reports/:reportId/expenses/:expenseId" element={<ExpenseDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByText('Rejected').length).toBeGreaterThan(0);
    });
  });

  it('should handle missing expenseId parameter', async () => {
    render(
      <MemoryRouter initialEntries={['/reports/123/expenses/']}>
        <Routes>
          <Route path="/reports/:reportId/expenses/:expenseId?" element={<ExpenseDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Expense ID is required')).toBeInTheDocument();
    });
  });

  it('should format dates correctly', async () => {
    vi.mocked(expensesService.getById).mockResolvedValue(mockExpense);

    render(
      <MemoryRouter initialEntries={['/reports/123/expenses/456']}>
        <Routes>
          <Route path="/reports/:reportId/expenses/:expenseId" element={<ExpenseDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      // Check expense date format - there will be multiple instances
      expect(screen.getAllByText('January 15, 2024').length).toBeGreaterThan(0);
    });
  });
});
