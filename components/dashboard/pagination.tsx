'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatNumber } from '@/lib/utils';

export interface PageState<T> {
  rows: T[];
  page: number;
  pageCount: number;
  total: number;
  start: number;
  end: number;
  setPage: (page: number) => void;
}

export function usePagination<T>(items: T[], pageSize = 25): PageState<T> {
  const [requestedPage, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(requestedPage, pageCount - 1);
  const start = page * pageSize;
  const rows = items.slice(start, start + pageSize);
  return { rows, page, pageCount, total: items.length, start, end: start + rows.length, setPage };
}

export function Pagination<T>({ state }: { state: PageState<T> }) {
  const { page, pageCount, total, start, end, setPage } = state;
  return (
    <div className="flex items-center gap-1">
      <span className="px-1.5 text-xs whitespace-nowrap text-muted tabular-nums">
        {total === 0 ? '0' : `${formatNumber(start + 1)}–${formatNumber(end)}`} of {formatNumber(total)}
      </span>
      <Button variant="secondary" size="icon" onClick={() => setPage(page - 1)} disabled={page === 0} aria-label="Previous page">
        <ChevronLeft />
      </Button>
      <Button variant="secondary" size="icon" onClick={() => setPage(page + 1)} disabled={page >= pageCount - 1} aria-label="Next page">
        <ChevronRight />
      </Button>
    </div>
  );
}
