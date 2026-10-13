import { CircleCheck, CircleSlash, TriangleAlert } from 'lucide-react';
import type { FileStatus, IssueSeverity } from '@/lib/php/types';
import { cn } from '@/lib/utils';

const FILE_STATUS = {
  parsed: { label: 'Parsed', icon: CircleCheck, className: 'text-success' },
  recovered: { label: 'Recovered', icon: TriangleAlert, className: 'text-warning' },
  skipped: { label: 'Skipped', icon: CircleSlash, className: 'text-danger' },
} satisfies Record<FileStatus, unknown>;

const SEVERITY = {
  warning: { label: 'Warning', icon: TriangleAlert, className: 'text-warning' },
  error: { label: 'Error', icon: CircleSlash, className: 'text-danger' },
} satisfies Record<IssueSeverity, unknown>;

function StatusLabel({ label, icon: Icon, className }: { label: string; icon: typeof CircleCheck; className: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium', className)}>
      <Icon className="size-3.5" aria-hidden />
      {label}
    </span>
  );
}

export function FileStatusBadge({ status }: { status: FileStatus }) {
  return <StatusLabel {...FILE_STATUS[status]} />;
}

export function SeverityBadge({ severity }: { severity: IssueSeverity }) {
  return <StatusLabel {...SEVERITY[severity]} />;
}
