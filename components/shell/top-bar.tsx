import { BookOpen, Github, Layers, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { REPOSITORY_URL } from './navigation';

export function TopBar() {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b bg-panel px-4">
      <div className="flex items-center gap-2.5">
        <span className="flex size-7 items-center justify-center rounded-md bg-primary text-white">
          <Layers className="size-4" aria-hidden />
        </span>
        <span className="text-sm font-semibold tracking-tight">PHP Architect</span>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" asChild>
          <a href={`${REPOSITORY_URL}#readme`} target="_blank" rel="noreferrer" aria-label="Documentation">
            <BookOpen />
          </a>
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <a href={REPOSITORY_URL} target="_blank" rel="noreferrer" aria-label="Source code on GitHub">
            <Github />
          </a>
        </Button>
        <span
          className="ml-2 flex size-7 items-center justify-center rounded-full border bg-active text-muted"
          title="Local workspace: files are analyzed in your browser and never uploaded"
          aria-label="Local workspace"
          role="img"
        >
          <UserRound className="size-4" aria-hidden />
        </span>
      </div>
    </header>
  );
}
