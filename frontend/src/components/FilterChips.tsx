/**
 * FilterChips Component
 * Displays active filter chips with remove functionality
 */

interface FilterChip {
  id: string;
  label: string;
}

interface FilterChipsProps {
  chips: FilterChip[];
  onRemove: (id: string) => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({ chips, onRemove }) => {
  if (chips.length === 0) return null;

  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2 -mx-4 px-4">
      {chips.map((chip) => (
        <div
          key={chip.id}
          className="flex items-center gap-1 bg-primary text-white text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
        >
          <span>{chip.label}</span>
          <button
            onClick={() => onRemove(chip.id)}
            className="text-white/80 hover:text-white"
            aria-label={`Remove ${chip.label} filter`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="18" x2="6" y1="6" y2="18"></line>
              <line x1="6" x2="18" y1="6" y2="18"></line>
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};
