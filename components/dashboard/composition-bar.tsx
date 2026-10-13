'use client';

import { useState } from 'react';
import { KIND_ORDER, KIND_STYLES } from '@/lib/diagram/palette';
import type { TypeKind } from '@/lib/php/types';
import { cn, formatNumber, formatPercent } from '@/lib/utils';

export function CompositionBar({ counts }: { counts: Record<TypeKind, number> }) {
  const [hovered, setHovered] = useState<TypeKind | null>(null);
  const total = KIND_ORDER.reduce((sum, kind) => sum + counts[kind], 0);
  const segments = KIND_ORDER.filter((kind) => counts[kind] > 0);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="relative">
        <div className="flex h-3 gap-0.5" role="img" aria-label="Share of declared types by kind">
          {segments.map((kind) => (
            <span
              key={kind}
              onMouseEnter={() => setHovered(kind)}
              onMouseLeave={() => setHovered(null)}
              className={cn('h-full first:rounded-l-sm last:rounded-r-sm transition-opacity', hovered && hovered !== kind && 'opacity-40')}
              style={{ width: formatPercent(counts[kind], total), backgroundColor: KIND_STYLES[kind].mark, minWidth: 4 }}
            />
          ))}
        </div>
        {hovered && (
          <span className="absolute -top-8 left-0 rounded-sm border bg-panel px-2 py-1 text-xs whitespace-nowrap">
            <span className="font-semibold">{KIND_STYLES[hovered].pluralLabel}</span> · {formatNumber(counts[hovered])} (
            {formatPercent(counts[hovered], total)})
          </span>
        )}
      </div>
      <table className="w-full text-[13px]">
        <tbody>
          {KIND_ORDER.map((kind) => (
            <tr
              key={kind}
              onMouseEnter={() => setHovered(kind)}
              onMouseLeave={() => setHovered(null)}
              className={cn('border-b last:border-b-0', hovered === kind && 'bg-hover')}
            >
              <td className="py-2">
                <span className="flex items-center gap-2">
                  <span className="size-2.5 rounded-sm" style={{ backgroundColor: KIND_STYLES[kind].mark }} aria-hidden />
                  {KIND_STYLES[kind].pluralLabel}
                </span>
              </td>
              <td className="py-2 text-right font-semibold tabular-nums">{formatNumber(counts[kind])}</td>
              <td className="w-14 py-2 text-right text-muted tabular-nums">{formatPercent(counts[kind], total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
