/**
 * SearchInput Component
 * Search input field with icon
 */

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search reports...',
}) => {
  return (
    <div className="relative">
      <input
        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white text-foreground-light border border-gray-200 focus:ring-primary focus:border-primary placeholder:text-muted-light"
        placeholder={placeholder}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="10" cy="10" r="7"></circle>
          <path d="m21 21-6-6"></path>
        </svg>
      </div>
    </div>
  );
};
