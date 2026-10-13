import { formatNumber } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: number;
  detail?: string;
  swatch?: string;
}

export function StatCard({ label, value, detail, swatch }: StatCardProps) {
  return (
    <div className="rounded-md border bg-panel px-4 py-3.5">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-muted uppercase">
        {swatch && <span className="size-2 rounded-full" style={{ backgroundColor: swatch }} aria-hidden />}
        {label}
      </p>
      <p className="mt-1.5 text-2xl font-bold tracking-tight tabular-nums">{formatNumber(value)}</p>
      {detail && <p className="mt-0.5 text-xs text-muted">{detail}</p>}
    </div>
  );
}
