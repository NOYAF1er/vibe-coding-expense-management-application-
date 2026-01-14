/**
 * FilterButton Component
 * Button to open filter and sort modal
 */

interface FilterButtonProps {
  onClick: () => void;
}

export const FilterButton: React.FC<FilterButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary whitespace-nowrap"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="4" x2="20" y1="21" y2="21"></line>
        <line x1="4" x2="20" y1="14" y2="14"></line>
        <line x1="4" x2="20" y1="7" y2="7"></line>
        <circle cx="7" cy="21" r="1" fill="currentColor"></circle>
        <circle cx="14" cy="14" r="1" fill="currentColor"></circle>
        <circle cx="17" cy="7" r="1" fill="currentColor"></circle>
      </svg>
      Filter & Sort
    </button>
  );
};
