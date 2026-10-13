import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface SelectFieldProps<T extends string> {
  label: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  className?: string;
}

export function SelectField<T extends string>({ label, value, options, onChange, className }: SelectFieldProps<T>) {
  return (
    <label className={cn('relative flex h-8 items-center rounded-md border bg-panel text-[13px] hover:bg-hover', className)}>
      <span className="pl-2.5 text-[11px] font-semibold tracking-wider whitespace-nowrap text-subtle uppercase">{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="h-full min-w-0 flex-1 cursor-pointer appearance-none truncate bg-transparent pr-7 pl-2 font-medium text-ink outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 size-3.5 text-muted" aria-hidden />
    </label>
  );
}
