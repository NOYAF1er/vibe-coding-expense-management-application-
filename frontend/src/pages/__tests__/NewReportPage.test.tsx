import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { NewReportPage } from '../NewReportPage';
import * as expenseReportsApi from '../../services/expenseReports.api';

// Mock the API
vi.mock('../../services/expenseReports.api');

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('NewReportPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <NewReportPage />
      </BrowserRouter>
    );
  };

  it('should render the page with all elements', () => {
    renderComponent();

    expect(screen.getByText('New Report')).toBeInTheDocument();
    expect(screen.getByLabelText('Purpose')).toBeInTheDocument();
    expect(screen.getByLabelText('Date')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Create Report')).toBeInTheDocument();
  });

  it('should have Create Report button disabled when fields are empty', () => {
    renderComponent();

    const createButton = screen.getByText('Create Report');
    expect(createButton).toBeDisabled();
  });

  it('should enable Create Report button when both fields are filled', () => {
    renderComponent();

    const purposeInput = screen.getByLabelText('Purpose');
    const dateInput = screen.getByLabelText('Date');
    const createButton = screen.getByText('Create Report');

    fireEvent.change(purposeInput, { target: { value: 'Test Report' } });
    fireEvent.change(dateInput, { target: { value: '2026-01-15' } });

    expect(createButton).not.toBeDisabled();
  });

  it('should call API and navigate on successful form submission', async () => {
    const mockResponse = {
      id: '123',
      title: 'Test Report',
      reportDate: '2026-01-15',
      totalAmount: 0,
      status: 'DRAFT',
      createdAt: '2026-01-14T14:00:00.000Z',
      updatedAt: '2026-01-14T14:00:00.000Z',
    };

    vi.mocked(expenseReportsApi.createExpenseReport).mockResolvedValue(mockResponse);

    renderComponent();

    const purposeInput = screen.getByLabelText('Purpose');
    const dateInput = screen.getByLabelText('Date');
    const createButton = screen.getByText('Create Report');

    fireEvent.change(purposeInput, { target: { value: 'Test Report' } });
    fireEvent.change(dateInput, { target: { value: '2026-01-15' } });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(expenseReportsApi.createExpenseReport).toHaveBeenCalledWith({
        title: 'Test Report',
        reportDate: '2026-01-15',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should navigate back when Cancel button is clicked', () => {
    renderComponent();

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should navigate back when close (X) button is clicked', () => {
    renderComponent();

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should handle API error gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(expenseReportsApi.createExpenseReport).mockRejectedValue(new Error('API Error'));

    renderComponent();

    const purposeInput = screen.getByLabelText('Purpose');
    const dateInput = screen.getByLabelText('Date');
    const createButton = screen.getByText('Create Report');

    fireEvent.change(purposeInput, { target: { value: 'Test Report' } });
    fireEvent.change(dateInput, { target: { value: '2026-01-15' } });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
});
