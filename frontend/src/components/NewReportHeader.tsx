interface NewReportHeaderProps {
  onClose: () => void;
}

/**
 * Header component for New Report screen
 */
export function NewReportHeader({ onClose }: NewReportHeaderProps) {
  return (
    <header className="p-4">
      <div className="flex items-center justify-between">
        <button 
          onClick={onClose}
          className="text-text-light dark:text-text-dark"
          aria-label="Close"
        >
          <svg 
            className="h-6 w-6" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M6 18L18 6M6 6l12 12" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-text-light dark:text-text-dark flex-grow text-center">
          New Report
        </h1>
        <div className="w-6"></div>
      </div>
    </header>
  );
}
