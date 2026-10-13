'use client';

import { Crosshair, Download, LoaderCircle, Network, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DiagramCanvas } from '@/components/dashboard/diagram-canvas';
import { EmptyState } from '@/components/dashboard/empty-state';
import { KindLegend } from '@/components/dashboard/kind-badge';
import { PageHeader } from '@/components/dashboard/page-header';
import { Panel } from '@/components/dashboard/panel';
import { RelationLegend } from '@/components/dashboard/relation-legend';
import { SelectField, type SelectOption } from '@/components/dashboard/select-field';
import { Button } from '@/components/ui/button';
import { useDiagram } from '@/hooks/use-diagram';
import type { DetailLevel, DiagramOptions, RelationScope } from '@/lib/diagram/nomnoml';
import { namespaceLabel } from '@/lib/php/statistics';
import type { ProjectModel } from '@/lib/php/types';
import { formatNumber } from '@/lib/utils';
import { downloadSvgAsPng, downloadText } from '@/lib/workspace/export';

const ALL_NAMESPACES = '*';

const LARGE_DIAGRAM_NODES = 300;

const DETAIL_OPTIONS: SelectOption<DetailLevel>[] = [
  { value: 'full', label: 'All members' },
  { value: 'public', label: 'Public members' },
  { value: 'names', label: 'Names only' },
];

const RELATION_OPTIONS: SelectOption<RelationScope>[] = [
  { value: 'all', label: 'All' },
  { value: 'inheritance', label: 'Inheritance only' },
];

interface DiagramViewProps {
  project: ProjectModel | null;
  options: DiagramOptions;
  onOptionsChange: (options: DiagramOptions) => void;
  onImport: () => void;
}

export function DiagramView({ project, options, onOptionsChange, onImport }: DiagramViewProps) {
  if (!project || project.types.length === 0) {
    return (
      <>
        <PageHeader title="Diagram" />
        <Panel>
          <EmptyState
            icon={Network}
            title={project ? 'No types found' : 'No codebase loaded'}
            description={
              project
                ? 'The analyzed files do not declare any classes, interfaces, traits or enums.'
                : 'Import a PHP project to generate its UML class diagram.'
            }
            action={!project && <Button onClick={onImport}>Import codebase</Button>}
          />
        </Panel>
      </>
    );
  }
  return <DiagramWorkspace project={project} options={options} onOptionsChange={onOptionsChange} />;
}

function DiagramWorkspace({ project, options, onOptionsChange }: Omit<DiagramViewProps, 'onImport'> & { project: ProjectModel }) {
  const { diagram, svg, error, isRendering } = useDiagram(project.types, options, true);
  const [exportError, setExportError] = useState<string | null>(null);
  const namespaceOptions = useMemo(() => buildNamespaceOptions(project.namespaces), [project.namespaces]);
  const focusType = options.focus ? project.types.find((type) => type.id === options.focus) : undefined;

  const exportPng = async () => {
    if (!svg) return;
    setExportError(null);
    try {
      await downloadSvgAsPng(svg, 'php-architect-diagram.png');
    } catch (cause) {
      setExportError((cause as Error).message);
    }
  };

  return (
    <>
      <PageHeader
        title="Diagram"
        description={`${formatNumber(diagram.nodeCount)} types · ${formatNumber(diagram.edgeCount)} relationships`}
        actions={
          <>
            {focusType ? (
              <span className="flex h-8 items-center gap-2 rounded-md border bg-primary-soft pr-1 pl-2.5 text-[13px] text-primary">
                <Crosshair className="size-3.5" aria-hidden />
                <span className="max-w-56 truncate font-medium">{focusType.name}</span>
                <Button variant="ghost" size="icon-sm" onClick={() => onOptionsChange({ ...options, focus: null })} aria-label="Clear focus">
                  <X />
                </Button>
              </span>
            ) : (
              <SelectField
                label="Namespace"
                value={options.namespace ?? ALL_NAMESPACES}
                options={namespaceOptions}
                onChange={(value) => onOptionsChange({ ...options, namespace: value === ALL_NAMESPACES ? null : value })}
                className="max-w-80"
              />
            )}
            <SelectField label="Detail" value={options.detail} options={DETAIL_OPTIONS} onChange={(detail) => onOptionsChange({ ...options, detail })} />
            <SelectField
              label="Relations"
              value={options.relations}
              options={RELATION_OPTIONS}
              onChange={(relations) => onOptionsChange({ ...options, relations })}
            />
          </>
        }
      />
      <Panel
        actions={
          <>
            <Button variant="secondary" size="sm" disabled={!svg} onClick={() => svg && downloadText(svg, 'php-architect-diagram.svg', 'image/svg+xml')}>
              <Download aria-hidden />
              SVG
            </Button>
            <Button variant="secondary" size="sm" disabled={!svg} onClick={exportPng}>
              <Download aria-hidden />
              PNG
            </Button>
          </>
        }
        title="Class diagram"
      >
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b px-4 py-2.5">
          <KindLegend showExternal />
          <RelationLegend />
        </div>
        {diagram.nodeCount > LARGE_DIAGRAM_NODES && options.detail !== 'names' && (
          <p className="border-b bg-warning-soft px-4 py-2 text-[13px] text-warning">
            This diagram has {formatNumber(diagram.nodeCount)} types. Choose a namespace or the “Names only” detail level for a faster, more readable layout.
          </p>
        )}
        {(error || exportError) && <p className="border-b bg-danger-soft px-4 py-2 text-[13px] text-danger">{error ?? exportError}</p>}
        <div className="relative">
          {diagram.nodeCount === 0 ? (
            <EmptyState
              icon={Network}
              title="Nothing to draw"
              description="No types match the selected namespace."
              action={
                <Button variant="secondary" onClick={() => onOptionsChange({ ...options, namespace: null, focus: null })}>
                  Show all namespaces
                </Button>
              }
            />
          ) : svg ? (
            <DiagramCanvas svg={svg} />
          ) : (
            <div className="h-[calc(100vh-15rem)] min-h-[420px] bg-canvas" />
          )}
          {isRendering && (
            <div className="absolute inset-0 flex items-center justify-center bg-canvas/70">
              <span className="flex items-center gap-2 rounded-md border bg-panel px-3 py-2 text-[13px] text-muted">
                <LoaderCircle className="size-4 animate-spin text-primary" aria-hidden />
                Laying out {formatNumber(diagram.nodeCount)} types
              </span>
            </div>
          )}
        </div>
      </Panel>
    </>
  );
}

function buildNamespaceOptions(namespaces: string[]): SelectOption<string>[] {
  const scopes = new Set<string>();
  for (const namespace of namespaces) {
    if (namespace === '') scopes.add('');
    const segments = namespace.split('\\').filter(Boolean);
    segments.forEach((_, index) => scopes.add(segments.slice(0, index + 1).join('\\')));
  }
  return [
    { value: ALL_NAMESPACES, label: 'All namespaces' },
    ...[...scopes].sort((left, right) => left.localeCompare(right)).map((scope) => ({ value: scope, label: namespaceLabel(scope) })),
  ];
}
