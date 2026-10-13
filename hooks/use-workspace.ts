'use client';

import { useMemo, useRef, useState } from 'react';
import type { ProjectModel } from '@/lib/php/types';
import { analyzerClient } from '@/lib/workspace/analyzer-client';
import { isDependencyPath, mergeFiles, type WorkspaceFile } from '@/lib/workspace/files';

export type AnalysisStatus =
  | { state: 'idle' }
  | { state: 'analyzing'; done: number; total: number }
  | { state: 'ready' }
  | { state: 'failed'; message: string };

export interface Workspace {
  files: WorkspaceFile[];
  analyzedFiles: WorkspaceFile[];
  dependencyFileCount: number;
  includeDependencies: boolean;
  project: ProjectModel | null;
  status: AnalysisStatus;
  addFiles: (files: WorkspaceFile[]) => void;
  clear: () => void;
  setIncludeDependencies: (include: boolean) => void;
}

function selectFiles(files: WorkspaceFile[], includeDependencies: boolean): WorkspaceFile[] {
  return includeDependencies ? files : files.filter((entry) => !isDependencyPath(entry.path));
}

export function useWorkspace(): Workspace {
  const [files, setFiles] = useState<WorkspaceFile[]>([]);
  const [includeDependencies, setIncludeDependenciesState] = useState(false);
  const [project, setProject] = useState<ProjectModel | null>(null);
  const [status, setStatus] = useState<AnalysisStatus>({ state: 'idle' });
  const latestRequest = useRef(0);

  const analyzedFiles = useMemo(() => selectFiles(files, includeDependencies), [files, includeDependencies]);
  const dependencyFileCount = files.length - selectFiles(files, false).length;

  const analyze = (nextFiles: WorkspaceFile[], include: boolean) => {
    const request = ++latestRequest.current;
    const isCurrent = () => request === latestRequest.current;
    const selected = selectFiles(nextFiles, include);

    if (selected.length === 0) {
      setProject(null);
      setStatus({ state: 'idle' });
      return;
    }

    setStatus({ state: 'analyzing', done: 0, total: selected.length });
    analyzerClient
      .analyze(selected, (done, total) => isCurrent() && setStatus({ state: 'analyzing', done, total }))
      .then((result) => {
        if (!isCurrent()) return;
        setProject(result);
        setStatus({ state: 'ready' });
      })
      .catch((error: Error) => isCurrent() && setStatus({ state: 'failed', message: error.message }));
  };

  return {
    files,
    analyzedFiles,
    dependencyFileCount,
    includeDependencies,
    project,
    status,
    addFiles: (added) => {
      if (added.length === 0) return;
      const nextFiles = mergeFiles(files, added);
      setFiles(nextFiles);
      analyze(nextFiles, includeDependencies);
    },
    clear: () => {
      setFiles([]);
      analyze([], includeDependencies);
    },
    setIncludeDependencies: (include) => {
      setIncludeDependenciesState(include);
      analyze(files, include);
    },
  };
}
