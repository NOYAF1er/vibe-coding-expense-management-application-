import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelloPage } from '../pages/HelloPage';
import { ExpenseReportsPage } from '../pages/ExpenseReportsPage';
import { NewReportPage } from '../pages/NewReportPage';
import { ExpenseReportDetailsPage } from '../pages/ExpenseReportDetailsPage';
import { ExpenseReportDetailsDemoPage } from '../pages/ExpenseReportDetailsDemoPage';
import { AddExpensePage } from '../pages/AddExpensePage';
import { ExpenseDetailsPage } from '../pages/ExpenseDetailsPage';

/**
 * Application router configuration
 */
export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ExpenseReportsPage />} />
        <Route path="/new-report" element={<NewReportPage />} />
        <Route path="/reports/:id" element={<ExpenseReportDetailsPage />} />
        <Route path="/reports/:reportId/add-expense" element={<AddExpensePage />} />
        <Route path="/reports/:reportId/edit-expense/:expenseId" element={<AddExpensePage />} />
        <Route path="/reports/:reportId/expenses/:expenseId" element={<ExpenseDetailsPage />} />
        <Route path="/demo/report-details" element={<ExpenseReportDetailsDemoPage />} />
        <Route path="/hello" element={<HelloPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
