import { EXTERNAL_STYLE, KIND_STYLES } from '@/lib/diagram/palette';
import type { TypeKind } from '@/lib/php/types';

export function KindBadge({ kind }: { kind: TypeKind }) {
  const style = KIND_STYLES[kind];
  return (
    <span
      className="inline-flex h-5 items-center rounded-sm px-1.5 text-[11px] font-semibold tracking-wide uppercase"
      style={{ backgroundColor: style.fill, color: style.ink }}
    >
      {style.label}
    </span>
  );
}

export function KindLegend({ showExternal = false }: { showExternal?: boolean }) {
  const entries = [
    ...Object.values(KIND_STYLES).map((style) => ({ label: style.label, fill: style.fill, border: style.mark })),
    ...(showExternal ? [{ label: EXTERNAL_STYLE.label, fill: EXTERNAL_STYLE.fill, border: EXTERNAL_STYLE.mark }] : []),
  ];
  return (
    <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
      {entries.map((entry) => (
        <li key={entry.label} className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm border" style={{ backgroundColor: entry.fill, borderColor: entry.border }} aria-hidden />
          {entry.label}
        </li>
      ))}
    </ul>
  );
}
