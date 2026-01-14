import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelloPage } from '../pages/HelloPage';
import { ExpenseReportsPage } from '../pages/ExpenseReportsPage';
import { NewReportPage } from '../pages/NewReportPage';
import { ExpenseReportDetailsPage } from '../pages/ExpenseReportDetailsPage';
import { ExpenseReportDetailsDemoPage } from '../pages/ExpenseReportDetailsDemoPage';

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
        <Route path="/demo/report-details" element={<ExpenseReportDetailsDemoPage />} />
        <Route path="/hello" element={<HelloPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
