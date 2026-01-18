interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  buttonLabel?: string;
}

/**
 * Success Modal Component
 * Reusable success confirmation modal for expense reports and expenses
 */
export function SuccessModal({
  isOpen,
  onClose,
  title = 'Submitted Successfully',
  message = 'Your expense report has been created and is now pending review.',
  buttonLabel = 'Done'
}: SuccessModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background-light dark:bg-background-dark rounded-xl shadow-lg p-8 w-11/12 max-w-sm text-center">
        {/* Success Icon */}
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-primary mb-6">
          <svg
            className="h-12 w-12 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 13l4 4L19 7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-2">
          {title}
        </h2>

        {/* Description */}
        <p className="text-text-light/80 dark:text-text-dark/80 mb-8">
          {message}
        </p>

        {/* Done Button */}
        <button
          onClick={onClose}
          className="w-full bg-primary text-white font-bold h-14 rounded-lg flex items-center justify-center transition-opacity hover:opacity-90"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
