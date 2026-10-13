'use client';

import { Boxes, Crosshair } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DataTable, type Column } from '@/components/dashboard/data-table';
import { EmptyState } from '@/components/dashboard/empty-state';
import { KindBadge } from '@/components/dashboard/kind-badge';
import { PageHeader } from '@/components/dashboard/page-header';
import { Pagination, usePagination } from '@/components/dashboard/pagination';
import { Panel } from '@/components/dashboard/panel';
import { SearchField } from '@/components/dashboard/search-field';
import { SelectField, type SelectOption } from '@/components/dashboard/select-field';
import { Button } from '@/components/ui/button';
import { KIND_ORDER, KIND_STYLES } from '@/lib/diagram/palette';
import { shortName } from '@/lib/php/names';
import { namespaceLabel } from '@/lib/php/statistics';
import type { ProjectModel, TypeKind, TypeModel } from '@/lib/php/types';
import { formatNumber } from '@/lib/utils';

type KindFilter = TypeKind | 'all';

const KIND_OPTIONS: SelectOption<KindFilter>[] = [
  { value: 'all', label: 'All kinds' },
  ...KIND_ORDER.map((kind) => ({ value: kind, label: KIND_STYLES[kind].pluralLabel })),
];

interface TypesViewProps {
  project: ProjectModel | null;
  onFocus: (typeId: string) => void;
}

export function TypesView({ project, onFocus }: TypesViewProps) {
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<KindFilter>('all');
  const types = project?.types;

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return (types ?? []).filter(
      (type) => (kind === 'all' || type.kind === kind) && (!needle || type.id.toLowerCase().includes(needle) || type.file.toLowerCase().includes(needle)),
    );
  }, [types, query, kind]);
  const pagination = usePagination(filtered);

  const columns: Column<TypeModel>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (type) => (
        <span className="flex items-center gap-2">
          <span className="font-semibold">{type.name}</span>
          {modifierLabels(type).map((label) => (
            <span key={label} className="text-[11px] text-subtle">
              {label}
            </span>
          ))}
        </span>
      ),
    },
    { key: 'kind', header: 'Kind', render: (type) => <KindBadge kind={type.kind} /> },
    { key: 'namespace', header: 'Namespace', className: 'max-w-64 truncate font-mono text-xs text-muted', render: (type) => namespaceLabel(type.namespace) },
    { key: 'properties', header: 'Props', align: 'right', render: (type) => formatNumber(type.properties.length + type.constants.length + type.cases.length) },
    { key: 'methods', header: 'Methods', align: 'right', render: (type) => formatNumber(type.methods.length) },
    {
      key: 'parent',
      header: 'Extends',
      className: 'max-w-48 truncate text-muted',
      render: (type) => (type.extends.length > 0 ? type.extends.map(shortName).join(', ') : '—'),
    },
    {
      key: 'file',
      header: 'File',
      className: 'max-w-72 truncate font-mono text-xs text-muted',
      render: (type) => (
        <span title={type.file}>
          {type.file}
          {type.line ? `:${type.line}` : ''}
        </span>
      ),
    },
    {
      key: 'focus',
      header: '',
      align: 'right',
      render: (type) => (
        <Button variant="ghost" size="sm" onClick={() => onFocus(type.id)} aria-label={`Show ${type.name} in diagram`}>
          <Crosshair aria-hidden />
          Focus
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Types"
        description="Every class, interface, trait and enum declared in the workspace."
        actions={
          <>
            <SearchField label="Search types or files" value={query} onChange={(value) => {
                setQuery(value);
                pagination.setPage(0);
              }}
            />
            <SelectField label="Kind" value={kind} options={KIND_OPTIONS} onChange={(value) => {
                setKind(value);
                pagination.setPage(0);
              }}
            />
            <Pagination state={pagination} />
          </>
        }
      />
      <Panel>
        {project ? (
          <DataTable columns={columns} rows={pagination.rows} rowKey={(type) => type.id} emptyMessage="No types match the current filters" />
        ) : (
          <EmptyState icon={Boxes} title="No codebase loaded" description="Import a PHP project to list its types." />
        )}
      </Panel>
    </>
  );
}

function modifierLabels(type: TypeModel): string[] {
  return [
    type.isAbstract && 'abstract',
    type.isFinal && 'final',
    type.isReadonly && 'readonly',
    type.isPartial && 'from tokens',
  ].filter((label): label is string => Boolean(label));
}
