import { Search } from 'lucide-react';

interface SearchFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function SearchField({ label, value, onChange }: SearchFieldProps) {
  return (
    <label className="flex h-8 w-full items-center gap-2 rounded-md border bg-panel px-2.5 text-[13px] focus-within:border-primary sm:w-56">
      <Search className="size-3.5 shrink-0 text-subtle" aria-hidden />
      <span className="sr-only">{label}</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={label}
        className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-subtle"
      />
    </label>
  );
}
