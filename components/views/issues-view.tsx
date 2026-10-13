'use client';

import { CircleCheck } from 'lucide-react';
import { DataTable, type Column } from '@/components/dashboard/data-table';
import { EmptyState } from '@/components/dashboard/empty-state';
import { PageHeader } from '@/components/dashboard/page-header';
import { Pagination, usePagination } from '@/components/dashboard/pagination';
import { Panel } from '@/components/dashboard/panel';
import { SeverityBadge } from '@/components/dashboard/status-badge';
import type { ParseIssue, ProjectModel } from '@/lib/php/types';

const COLUMNS: Column<ParseIssue>[] = [
  { key: 'severity', header: 'Severity', render: (issue) => <SeverityBadge severity={issue.severity} /> },
  { key: 'file', header: 'File', className: 'max-w-80 truncate font-mono text-xs', render: (issue) => <span title={issue.file}>{issue.file}</span> },
  { key: 'line', header: 'Line', align: 'right', className: 'text-muted', render: (issue) => issue.line ?? '—' },
  { key: 'message', header: 'Message', className: 'min-w-80 text-muted', render: (issue) => issue.message },
];

export function IssuesView({ project }: { project: ProjectModel | null }) {
  const issues = project?.issues ?? [];
  const pagination = usePagination(issues);

  return (
    <>
      <PageHeader
        title="Issues"
        description="Syntax the parser could not read and duplicate declarations. Affected types are still included in the diagram."
        actions={<Pagination state={pagination} />}
      />
      <Panel>
        {issues.length === 0 ? (
          <EmptyState
            icon={CircleCheck}
            title={project ? 'No issues' : 'No codebase loaded'}
            description={project ? 'Every file was parsed without problems.' : 'Import a PHP project to check it for parser issues.'}
          />
        ) : (
          <DataTable columns={COLUMNS} rows={pagination.rows} rowKey={(issue) => `${issue.file}:${issue.line}:${issue.message}`} emptyMessage="No issues" />
        )}
      </Panel>
    </>
  );
}
