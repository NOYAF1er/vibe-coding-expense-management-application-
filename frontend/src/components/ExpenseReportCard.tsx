/**
 * ExpenseReportCard Component
 * Displays a single expense report card
 */

import { ExpenseReportListItem, ExpenseCategory, ExpenseReportStatus } from '../types/expense-report.types';

interface ExpenseReportCardProps {
  report: ExpenseReportListItem;
  onClick?: () => void;
}

const categoryIcons: Record<ExpenseCategory, string> = {
  [ExpenseCategory.RESTAURANT]: 'restaurant',
  [ExpenseCategory.FLIGHT]: 'flight',
  [ExpenseCategory.SHOPPING_CART]: 'shopping_cart',
  [ExpenseCategory.GROUPS]: 'groups',
  [ExpenseCategory.LOCAL_PARKING]: 'local_parking',
  [ExpenseCategory.HOTEL]: 'hotel',
  [ExpenseCategory.TRANSPORT]: 'directions_car',
  [ExpenseCategory.OTHER]: 'more_horiz',
};

const statusColors: Record<ExpenseReportStatus, string> = {
  [ExpenseReportStatus.DRAFT]: 'status-created',
  [ExpenseReportStatus.SUBMITTED]: 'status-submitted',
  [ExpenseReportStatus.UNDER_REVIEW]: 'status-submitted',
  [ExpenseReportStatus.APPROVED]: 'status-validated',
  [ExpenseReportStatus.PAID]: 'status-paid',
  [ExpenseReportStatus.REJECTED]: 'status-denied',
};

const statusLabels: Record<ExpenseReportStatus, string> = {
  [ExpenseReportStatus.DRAFT]: 'Draft',
  [ExpenseReportStatus.SUBMITTED]: 'Submitted',
  [ExpenseReportStatus.UNDER_REVIEW]: 'Under Review',
  [ExpenseReportStatus.APPROVED]: 'Approved',
  [ExpenseReportStatus.PAID]: 'Paid',
  [ExpenseReportStatus.REJECTED]: 'Rejected',
};

export const ExpenseReportCard: React.FC<ExpenseReportCardProps> = ({ report, onClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatAmount = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div
      className="bg-white p-3.5 rounded-lg shadow-sm space-y-2.5 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-foreground-light font-semibold">
            {report.title}
          </p>
          <p className="text-sm text-gray-500">
            {formatDate(report.date)}
          </p>
        </div>
        <p className="text-lg font-bold text-primary">
          {formatAmount(report.totalAmount)}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {report.categories.map((category, index) => (
            <div
              key={`${category}-${index}`}
              className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10"
            >
              <span className="material-symbols-outlined text-primary text-base">
                {categoryIcons[category]}
              </span>
            </div>
          ))}
        </div>
        <p className={`text-xs font-medium ${statusColors[report.status]}`}>
          {statusLabels[report.status]}
        </p>
      </div>
    </div>
  );
};
