import type { ProjectModel } from '../php/types.ts';
import type { WorkspaceFile } from './files.ts';

export type WorkerRequest =
  | { id: number; type: 'analyze'; files: WorkspaceFile[] }
  | { id: number; type: 'layout'; source: string };

export type WorkerResponse =
  | { id: number; type: 'progress'; done: number; total: number }
  | { id: number; type: 'analyzed'; project: ProjectModel }
  | { id: number; type: 'laidOut'; svg: string }
  | { id: number; type: 'failed'; message: string };
