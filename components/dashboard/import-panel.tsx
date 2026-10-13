'use client';

import { FolderOpen, Files, LoaderCircle, Upload } from 'lucide-react';
import { useCallback, useState, type DragEvent } from 'react';
import { Button } from '@/components/ui/button';
import type { Workspace } from '@/hooks/use-workspace';
import { cn, formatNumber, formatPercent } from '@/lib/utils';
import { ACCEPTED_FILE_TYPES, fromDataTransfer, fromFileList } from '@/lib/workspace/files';

export function ImportPanel({ workspace }: { workspace: Workspace }) {
  const [isDragging, setIsDragging] = useState(false);
  const { addFiles, status, files, dependencyFileCount, includeDependencies } = workspace;

  const folderInput = useCallback((input: HTMLInputElement | null) => {
    input?.setAttribute('webkitdirectory', '');
  }, []);

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    addFiles(await fromDataTransfer(event.dataTransfer));
  };

  return (
    <section className="rounded-md border bg-panel">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'm-3 flex flex-col items-start gap-4 rounded-md border border-dashed px-5 py-5 sm:flex-row sm:items-center',
          isDragging ? 'border-primary bg-primary-soft' : 'bg-canvas/60',
        )}
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md border bg-panel text-muted">
          <Upload className="size-5" strokeWidth={1.75} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Import a PHP codebase</p>
          <p className="mt-0.5 text-[13px] text-muted">
            Drop a project folder here or choose files. Everything is analyzed in your browser; no code is uploaded.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" asChild>
            <label className="cursor-pointer">
              <Files aria-hidden />
              Choose files
              <input
                type="file"
                multiple
                accept={ACCEPTED_FILE_TYPES}
                className="sr-only"
                onChange={(event) => {
                  addFiles(fromFileList(event.target.files ?? []));
                  event.target.value = '';
                }}
              />
            </label>
          </Button>
          <Button asChild>
            <label className="cursor-pointer">
              <FolderOpen aria-hidden />
              Choose folder
              <input
                ref={folderInput}
                type="file"
                multiple
                className="sr-only"
                onChange={(event) => {
                  addFiles(fromFileList(event.target.files ?? []));
                  event.target.value = '';
                }}
              />
            </label>
          </Button>
        </div>
      </div>

      {(files.length > 0 || status.state === 'failed') && (
        <div className="flex flex-col gap-3 border-t px-4 py-3 text-[13px] sm:flex-row sm:items-center sm:justify-between">
          <AnalysisSummary workspace={workspace} />
          <div className="flex flex-wrap items-center gap-3">
            {dependencyFileCount > 0 && (
              <label className="flex cursor-pointer items-center gap-2 text-muted">
                <input
                  type="checkbox"
                  checked={includeDependencies}
                  onChange={(event) => workspace.setIncludeDependencies(event.target.checked)}
                  className="size-3.5 accent-primary"
                />
                Include vendor/ ({formatNumber(dependencyFileCount)} files)
              </label>
            )}
            <Button variant="secondary" size="sm" onClick={workspace.clear}>
              Clear workspace
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

function AnalysisSummary({ workspace }: { workspace: Workspace }) {
  const { status, analyzedFiles, files } = workspace;

  if (status.state === 'analyzing') {
    return (
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <LoaderCircle className="size-4 shrink-0 animate-spin text-primary" aria-hidden />
        <span className="whitespace-nowrap text-muted">
          Analyzing {formatNumber(status.done)} of {formatNumber(status.total)} files
        </span>
        <span className="h-1.5 max-w-60 flex-1 overflow-hidden rounded-full bg-active">
          <span className="block h-full bg-primary" style={{ width: formatPercent(status.done, status.total) }} />
        </span>
      </div>
    );
  }

  if (status.state === 'failed') {
    return <p className="text-danger">Analysis failed: {status.message}</p>;
  }

  if (analyzedFiles.length === 0) {
    return <p className="text-muted">{formatNumber(files.length)} files are in vendor/ and excluded. Include them to analyze.</p>;
  }

  return (
    <p className="text-muted">
      <span className="font-semibold text-ink">{formatNumber(analyzedFiles.length)}</span> PHP files in the workspace
    </p>
  );
}
