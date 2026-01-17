import { ExpenseStatus } from '../types/expense-report.types';

interface StatusBadgeProps {
  status: ExpenseStatus;
  className?: string;
}

/**
 * Get status badge classes based on expense status
 * Colors are standardized across the application
 */
const getStatusBadgeClasses = (status: ExpenseStatus): string => {
  const statusMap: Record<ExpenseStatus, string> = {
    [ExpenseStatus.SUBMITTED]:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    [ExpenseStatus.REVIEWED]:
      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    [ExpenseStatus.APPROVED]:
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    [ExpenseStatus.REJECTED]:
      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };
  return statusMap[status] || statusMap[ExpenseStatus.SUBMITTED];
};

/**
 * StatusBadge Component
 * Displays expense status with consistent styling
 */
export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(
        status
      )} ${className}`}
    >
      {status}
    </span>
  );
}
