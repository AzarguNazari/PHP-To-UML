'use client';

import { Check, CodeXml, Copy, Download } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EmptyState } from '@/components/dashboard/empty-state';
import { PageHeader } from '@/components/dashboard/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Button } from '@/components/ui/button';
import { buildDiagram, type DiagramOptions } from '@/lib/diagram/nomnoml';
import type { ProjectModel } from '@/lib/php/types';
import { formatNumber } from '@/lib/utils';
import { downloadText } from '@/lib/workspace/export';

export function SourceView({ project, options }: { project: ProjectModel | null; options: DiagramOptions }) {
  const [copied, setCopied] = useState(false);
  const diagram = useMemo(() => (project ? buildDiagram(project.types, options) : null), [project, options]);

  const copy = async () => {
    if (!diagram) return;
    await navigator.clipboard.writeText(diagram.source);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <PageHeader
        title="Nomnoml"
        description="Diagram source for the current diagram filters. Paste it into nomnoml.com or keep it with your documentation."
        actions={
          diagram && (
            <>
              <Button variant="secondary" onClick={copy}>
                {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
              <Button onClick={() => downloadText(diagram.source, 'php-architect-diagram.nomnoml', 'text/plain')}>
                <Download aria-hidden />
                Download
              </Button>
            </>
          )
        }
      />
      <Panel title={diagram ? `${formatNumber(diagram.source.split('\n').length)} lines` : undefined}>
        {diagram ? (
          <pre className="max-h-[calc(100vh-14rem)] overflow-auto p-4 font-mono text-xs leading-relaxed text-ink">{diagram.source}</pre>
        ) : (
          <EmptyState icon={CodeXml} title="No codebase loaded" description="Import a PHP project to generate nomnoml source." />
        )}
      </Panel>
    </>
  );
}
