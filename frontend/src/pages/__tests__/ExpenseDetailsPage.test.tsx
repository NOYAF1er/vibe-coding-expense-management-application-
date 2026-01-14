import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ExpenseDetailsPage } from '../ExpenseDetailsPage';

// Mock useNavigate and useParams
const mockNavigate = vi.fn();
const mockParams = {
  reportId: 'test-report-id',
  expenseId: 'test-expense-id',
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockParams,
  };
});

describe('ExpenseDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <ExpenseDetailsPage />
      </BrowserRouter>
    );
  };

  describe('Header', () => {
    it('should render the page title', () => {
      renderComponent();
      expect(screen.getByText('Expense Details')).toBeInTheDocument();
    });

    it('should render back button', () => {
      renderComponent();
      const backButton = screen.getByRole('button', { name: '' });
      expect(backButton).toBeInTheDocument();
    });

    it('should navigate back when back button is clicked', () => {
      renderComponent();
      const backButton = screen.getByRole('button', { name: '' });
      backButton.click();
      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
  });

  describe('Expense Summary Card', () => {
    it('should display expense amount', () => {
      renderComponent();
      expect(screen.getByText('$125.00')).toBeInTheDocument();
    });

    it('should display expense category', () => {
      renderComponent();
      expect(screen.getByText('Travel')).toBeInTheDocument();
    });

    it('should display expense description', () => {
      renderComponent();
      expect(screen.getByText('Round-trip train ticket to the conference')).toBeInTheDocument();
    });

    it('should display expense date', () => {
      renderComponent();
      const dates = screen.getAllByText('July 15, 2024');
      expect(dates.length).toBeGreaterThan(0);
      expect(dates[0]).toBeInTheDocument();
    });

    it('should display expense status badge', () => {
      renderComponent();
      const approvedElements = screen.getAllByText('Approved');
      expect(approvedElements.length).toBe(2); // One in badge, one in history
      expect(approvedElements[0]).toBeInTheDocument();
    });
  });

  describe('History Section', () => {
    it('should render history section title', () => {
      renderComponent();
      expect(screen.getByText('History')).toBeInTheDocument();
    });

    it('should display all history items', () => {
      renderComponent();
      expect(screen.getAllByText('Approved')).toHaveLength(2); // One in badge, one in history
      expect(screen.getByText('Reviewed')).toBeInTheDocument();
      expect(screen.getByText('Submitted')).toBeInTheDocument();
    });

    it('should display dates for all history items', () => {
      renderComponent();
      expect(screen.getByText('July 16, 2024')).toBeInTheDocument();
      expect(screen.getAllByText('July 15, 2024')).toHaveLength(3); // Expense date + 2 history dates
    });

    it('should render history icons', () => {
      renderComponent();
      const historySection = screen.getByText('History').closest('section');
      expect(historySection).toBeInTheDocument();
      
      // Check for SVG icons
      const svgs = historySection?.querySelectorAll('svg');
      expect(svgs?.length).toBeGreaterThan(0);
    });
  });

  describe('Footer Actions', () => {
    it('should render Edit button', () => {
      renderComponent();
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    });

    it('should render Download PDF button', () => {
      renderComponent();
      expect(screen.getByRole('button', { name: 'Download PDF' })).toBeInTheDocument();
    });
  });

  describe('Bottom Navigation', () => {
    it('should render all navigation items', () => {
      renderComponent();
      expect(screen.getByText('Expenses')).toBeInTheDocument();
      expect(screen.getByText('Submit')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    it('should have correct navigation links', () => {
      renderComponent();
      const expensesLink = screen.getByText('Expenses').closest('a');
      const submitLink = screen.getByText('Submit').closest('a');
      const profileLink = screen.getByText('Profile').closest('a');

      expect(expensesLink).toHaveAttribute('href', '/');
      expect(submitLink).toHaveAttribute('href', '/new-report');
      expect(profileLink).toHaveAttribute('href', '/profile');
    });

    it('should highlight Expenses tab as active', () => {
      renderComponent();
      const expensesLink = screen.getByText('Expenses').closest('a');
      expect(expensesLink).toHaveClass('text-primary');
    });
  });

  describe('Status Styling', () => {
    it('should apply correct styles for Approved status', () => {
      renderComponent();
      const statusBadge = screen.getAllByText('Approved')[0];
      expect(statusBadge).toHaveClass('bg-primary/10', 'text-primary', 'border-primary/20');
    });
  });

  describe('Category Labels', () => {
    it('should display correct category label for TRAVEL', () => {
      renderComponent();
      expect(screen.getByText('Travel')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should render with proper layout classes', () => {
      const { container } = renderComponent();
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('flex', 'flex-col', 'min-h-screen');
    });

    it('should have sticky header', () => {
      renderComponent();
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('sticky', 'top-0');
    });

    it('should have sticky footer', () => {
      renderComponent();
      const footer = screen.getByRole('contentinfo');
      expect(footer).toHaveClass('sticky', 'bottom-0');
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic HTML structure', () => {
      renderComponent();
      expect(screen.getByRole('banner')).toBeInTheDocument(); // header
      expect(screen.getByRole('main')).toBeInTheDocument(); // main
      expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer
    });

    it('should have accessible navigation', () => {
      renderComponent();
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });
  });
});
