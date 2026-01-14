/**
 * Header Component
 * Displays the page title and add button
 */

interface HeaderProps {
  title: string;
  onAddClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onAddClick }) => {
  return (
    <header className="sticky top-0 bg-background-light backdrop-blur-sm z-10">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-200">
        <div className="w-8"></div>
        <h1 className="text-lg font-bold text-foreground-light">
          {title}
        </h1>
        <button
          onClick={onAddClick}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors"
          aria-label="Add new expense report"
        >
          <svg
            className="text-primary"
            fill="none"
            height="20"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="12" x2="12" y1="5" y2="19"></line>
            <line x1="5" x2="19" y1="12" y2="12"></line>
          </svg>
        </button>
      </div>
    </header>
  );
};
