import { describe, it, expect, afterAll } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { NewReportPage } from '../NewReportPage';

/**
 * Integration tests for NewReportPage
 * These tests verify the complete flow including real API calls
 */
describe('NewReportPage - Integration Tests', () => {
  const API_BASE_URL = 'http://localhost:3000';
  let createdReportId: string | null = null;

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <NewReportPage />
      </BrowserRouter>
    );
  };

  afterAll(async () => {
    // Cleanup: Delete the created report if it exists
    if (createdReportId) {
      try {
        await fetch(`${API_BASE_URL}/api/v1/expense-reports/${createdReportId}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Failed to cleanup test report:', error);
      }
    }
  });

  it('should create a report and persist it to the database', async () => {
    renderComponent();

    // Fill in the form
    const purposeInput = screen.getByLabelText('Purpose');
    const dateInput = screen.getByLabelText('Date');
    const createButton = screen.getByText('Create Report');

    const testTitle = `Integration Test Report ${Date.now()}`;
    const testDate = '2026-01-20';

    fireEvent.change(purposeInput, { target: { value: testTitle } });
    fireEvent.change(dateInput, { target: { value: testDate } });

    // Submit the form
    fireEvent.click(createButton);

    // Wait for the API call to complete
    await waitFor(
      async () => {
        // Verify the report was created by fetching all reports
        const response = await fetch(`${API_BASE_URL}/api/v1/expense-reports`);
        const data = await response.json();

        // Find our created report
        const createdReport = data.data.find((report: any) => report.title === testTitle);

        expect(createdReport).toBeDefined();
        expect(createdReport.title).toBe(testTitle);
        expect(createdReport.reportDate).toBe(testDate);
        expect(createdReport.status).toBe('DRAFT');
        expect(createdReport.totalAmount).toBe(0);

        // Store the ID for cleanup
        createdReportId = createdReport.id;
      },
      { timeout: 5000 }
    );
  });

  it('should verify report persists after page reload', async () => {
    // Create a report
    const testTitle = `Persistence Test ${Date.now()}`;
    const testDate = '2026-01-21';

    const createResponse = await fetch(`${API_BASE_URL}/api/v1/expense-reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: '46535c2f-b439-45f5-b707-fefb90b66304',
        title: testTitle,
        reportDate: testDate,
      }),
    });

    const createdReport = await createResponse.json();
    createdReportId = createdReport.id;

    // Verify it persists by fetching it again
    const fetchResponse = await fetch(
      `${API_BASE_URL}/api/v1/expense-reports/${createdReportId}`
    );
    const fetchedReport = await fetchResponse.json();

    expect(fetchedReport.id).toBe(createdReportId);
    expect(fetchedReport.title).toBe(testTitle);
    expect(fetchedReport.reportDate).toBe(testDate);
  });

  it('should handle concurrent report creation', async () => {
    const reports = [
      { title: 'Concurrent Test 1', reportDate: '2026-01-22' },
      { title: 'Concurrent Test 2', reportDate: '2026-01-23' },
      { title: 'Concurrent Test 3', reportDate: '2026-01-24' },
    ];

    // Create multiple reports concurrently
    const createPromises = reports.map((report) =>
      fetch(`${API_BASE_URL}/api/v1/expense-reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: '46535c2f-b439-45f5-b707-fefb90b66304',
          ...report,
        }),
      }).then((res) => res.json())
    );

    const createdReports = await Promise.all(createPromises);

    // Verify all reports were created
    expect(createdReports).toHaveLength(3);
    createdReports.forEach((report, index) => {
      expect(report.title).toBe(reports[index].title);
      expect(report.reportDate).toBe(reports[index].reportDate);
    });

    // Cleanup
    await Promise.all(
      createdReports.map((report) =>
        fetch(`${API_BASE_URL}/api/v1/expense-reports/${report.id}`, {
          method: 'DELETE',
        })
      )
    );
  });
});
