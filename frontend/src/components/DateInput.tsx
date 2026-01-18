interface DateInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

/**
 * Reusable date input component with label
 */
export function DateInput({ id, label, value, onChange }: DateInputProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-sm font-medium text-text-light/80 dark:text-text-dark/80"
      >
        {label}
      </label>
      <input
        id={id}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#E8E8E8] dark:bg-subtle-dark border-none rounded-lg h-14 px-4 text-[#9CA3AF] dark:text-text-dark placeholder-[#9CA3AF] dark:placeholder-placeholder-dark focus:ring-2 focus:ring-primary focus:outline-none [color-scheme:light] dark:[color-scheme:dark]"
      />
    </div>
  );
}
