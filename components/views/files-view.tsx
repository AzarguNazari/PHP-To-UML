'use client';

import { FileCode } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DataTable, type Column } from '@/components/dashboard/data-table';
import { EmptyState } from '@/components/dashboard/empty-state';
import { PageHeader } from '@/components/dashboard/page-header';
import { Pagination, usePagination } from '@/components/dashboard/pagination';
import { Panel } from '@/components/dashboard/panel';
import { SearchField } from '@/components/dashboard/search-field';
import { SelectField, type SelectOption } from '@/components/dashboard/select-field';
import { FileStatusBadge } from '@/components/dashboard/status-badge';
import type { FileReport, FileStatus, ProjectModel } from '@/lib/php/types';
import { formatBytes, formatNumber } from '@/lib/utils';

type StatusFilter = FileStatus | 'all';

const STATUS_OPTIONS: SelectOption<StatusFilter>[] = [
  { value: 'all', label: 'All' },
  { value: 'parsed', label: 'Parsed' },
  { value: 'recovered', label: 'Recovered' },
  { value: 'skipped', label: 'Skipped' },
];

const COLUMNS: Column<FileReport>[] = [
  { key: 'path', header: 'Path', className: 'max-w-[36rem] truncate font-mono text-xs', render: (file) => <span title={file.path}>{file.path}</span> },
  { key: 'types', header: 'Types', align: 'right', className: 'font-semibold', render: (file) => formatNumber(file.typeCount) },
  { key: 'size', header: 'Size', align: 'right', className: 'text-muted', render: (file) => formatBytes(file.size) },
  { key: 'status', header: 'Status', render: (file) => <FileStatusBadge status={file.status} /> },
];

export function FilesView({ project }: { project: ProjectModel | null }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const files = project?.files;

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return (files ?? []).filter((file) => (status === 'all' || file.status === status) && (!needle || file.path.toLowerCase().includes(needle)));
  }, [files, query, status]);
  const pagination = usePagination(filtered);

  return (
    <>
      <PageHeader
        title="Files"
        description="Parse status of every PHP file in the workspace. Recovered files used syntax the parser does not fully support."
        actions={
          <>
            <SearchField label="Search paths" value={query} onChange={(value) => {
                setQuery(value);
                pagination.setPage(0);
              }}
            />
            <SelectField label="Status" value={status} options={STATUS_OPTIONS} onChange={(value) => {
                setStatus(value);
                pagination.setPage(0);
              }}
            />
            <Pagination state={pagination} />
          </>
        }
      />
      <Panel>
        {project ? (
          <DataTable columns={COLUMNS} rows={pagination.rows} rowKey={(file) => file.path} emptyMessage="No files match the current filters" />
        ) : (
          <EmptyState icon={FileCode} title="No codebase loaded" description="Import a PHP project to see its files." />
        )}
      </Panel>
    </>
  );
}
