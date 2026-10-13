'use client';

import { Network } from 'lucide-react';
import { useMemo } from 'react';
import { CompositionBar } from '@/components/dashboard/composition-bar';
import { DataTable, type Column } from '@/components/dashboard/data-table';
import { ImportPanel } from '@/components/dashboard/import-panel';
import { PageHeader } from '@/components/dashboard/page-header';
import { Pagination, usePagination } from '@/components/dashboard/pagination';
import { Panel } from '@/components/dashboard/panel';
import { StatCard } from '@/components/dashboard/stat-card';
import { Button } from '@/components/ui/button';
import type { Workspace } from '@/hooks/use-workspace';
import { KIND_ORDER, KIND_STYLES } from '@/lib/diagram/palette';
import { countByKind, countRelationships, namespaceLabel, summarizeNamespaces, type NamespaceSummary } from '@/lib/php/statistics';
import type { ProjectModel } from '@/lib/php/types';
import { formatNumber } from '@/lib/utils';

interface OverviewViewProps {
  workspace: Workspace;
  onOpenDiagram: (namespace: string | null) => void;
}

export function OverviewView({ workspace, onOpenDiagram }: OverviewViewProps) {
  const { project } = workspace;
  return (
    <>
      <PageHeader
        title="Overview"
        description="Generate UML class diagrams from any PHP codebase, from PHP 5 scripts to modern PHP 8 projects."
        actions={
          project && (
            <Button onClick={() => onOpenDiagram(null)}>
              <Network aria-hidden />
              Open diagram
            </Button>
          )
        }
      />
      <div className="flex flex-col gap-5">
        <ImportPanel workspace={workspace} />
        {project && <ProjectSummary project={project} onOpenDiagram={onOpenDiagram} />}
      </div>
    </>
  );
}

function ProjectSummary({ project, onOpenDiagram }: { project: ProjectModel; onOpenDiagram: (namespace: string) => void }) {
  const counts = useMemo(() => countByKind(project.types), [project.types]);
  const namespaces = useMemo(() => summarizeNamespaces(project.types), [project.types]);
  const relationships = useMemo(() => countRelationships(project.types), [project.types]);
  const recoveredFiles = project.files.filter((file) => file.status !== 'parsed').length;
  const pagination = usePagination(namespaces, 10);

  const columns: Column<NamespaceSummary>[] = [
    {
      key: 'namespace',
      header: 'Namespace',
      className: 'max-w-80 truncate font-mono text-xs',
      render: (row) => namespaceLabel(row.namespace),
    },
    ...KIND_ORDER.map<Column<NamespaceSummary>>((kind) => ({
      key: kind,
      header: KIND_STYLES[kind].pluralLabel,
      align: 'right',
      className: 'text-muted',
      render: (row) => formatNumber(row.counts[kind]),
    })),
    { key: 'total', header: 'Total', align: 'right', className: 'font-semibold', render: (row) => formatNumber(row.total) },
    {
      key: 'action',
      header: '',
      align: 'right',
      render: (row) => (
        <Button variant="ghost" size="sm" onClick={() => onOpenDiagram(row.namespace)} aria-label={`Open diagram for ${namespaceLabel(row.namespace)}`}>
          Diagram
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard label="Files" value={project.files.length} detail={`${formatNumber(recoveredFiles)} recovered or skipped`} />
        <StatCard label="Types" value={project.types.length} detail="Classes, interfaces, traits, enums" />
        <StatCard label="Namespaces" value={project.namespaces.length} />
        <StatCard label="Relationships" value={relationships} detail="Extends, implements, uses" />
        <StatCard label="Issues" value={project.issues.length} detail="Parser warnings and errors" />
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Panel title="Type composition">
          <CompositionBar counts={counts} />
        </Panel>
        <Panel title="Namespaces" actions={<Pagination state={pagination} />} className="lg:col-span-2">
          <DataTable columns={columns} rows={pagination.rows} rowKey={(row) => row.namespace} emptyMessage="No types were found" />
        </Panel>
      </div>
    </>
  );
}
