import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelloPage } from '../pages/HelloPage';

/**
 * Application router configuration
 */
export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HelloPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
