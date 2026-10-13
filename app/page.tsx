'use client';

import { useState } from 'react';
import { MobileNavigation, Sidebar } from '@/components/shell/sidebar';
import type { ViewId } from '@/components/shell/navigation';
import { TopBar } from '@/components/shell/top-bar';
import { DiagramView } from '@/components/views/diagram-view';
import { FilesView } from '@/components/views/files-view';
import { IssuesView } from '@/components/views/issues-view';
import { OverviewView } from '@/components/views/overview-view';
import { SourceView } from '@/components/views/source-view';
import { TypesView } from '@/components/views/types-view';
import { useWorkspace } from '@/hooks/use-workspace';
import { DEFAULT_DIAGRAM_OPTIONS, type DiagramOptions } from '@/lib/diagram/nomnoml';

export default function HomePage() {
  const workspace = useWorkspace();
  const [view, setView] = useState<ViewId>('overview');
  const [diagramOptions, setDiagramOptions] = useState<DiagramOptions>(DEFAULT_DIAGRAM_OPTIONS);
  const { project } = workspace;

  const openDiagram = (changes: Partial<DiagramOptions>) => {
    setDiagramOptions((current) => ({ ...current, ...changes }));
    setView('diagram');
  };

  return (
    <div className="flex h-screen flex-col">
      <TopBar />
      <MobileNavigation activeView={view} onNavigate={setView} />
      <div className="flex min-h-0 flex-1">
        <Sidebar
          activeView={view}
          onNavigate={setView}
          counts={{ types: project?.types.length, files: project?.files.length, issues: project?.issues.length }}
        />
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-8">
            {view === 'overview' && (
              <OverviewView workspace={workspace} onOpenDiagram={(namespace) => openDiagram({ namespace, focus: null })} />
            )}
            {view === 'diagram' && (
              <DiagramView project={project} options={diagramOptions} onOptionsChange={setDiagramOptions} onImport={() => setView('overview')} />
            )}
            {view === 'types' && <TypesView project={project} onFocus={(focus) => openDiagram({ focus })} />}
            {view === 'files' && <FilesView project={project} />}
            {view === 'issues' && <IssuesView project={project} />}
            {view === 'source' && <SourceView project={project} options={diagramOptions} />}
          </div>
        </main>
      </div>
    </div>
  );
}
