import type { ProjectModel } from '../php/types.ts';
import type { WorkspaceFile } from './files.ts';
import type { WorkerRequest, WorkerResponse } from './protocol.ts';

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

interface PendingRequest {
  resolve: (response: WorkerResponse) => void;
  reject: (error: Error) => void;
  onProgress?: (done: number, total: number) => void;
}

class AnalyzerClient {
  private worker: Worker | null = null;
  private nextId = 1;
  private pending = new Map<number, PendingRequest>();

  analyze(files: WorkspaceFile[], onProgress?: (done: number, total: number) => void): Promise<ProjectModel> {
    return this.send({ type: 'analyze', files }, onProgress).then((response) => {
      if (response.type !== 'analyzed') throw new Error('Unexpected analyzer response');
      return response.project;
    });
  }

  layout(source: string): Promise<string> {
    return this.send({ type: 'layout', source }).then((response) => {
      if (response.type !== 'laidOut') throw new Error('Unexpected layout response');
      return response.svg;
    });
  }

  private send(
    request: DistributiveOmit<WorkerRequest, 'id'>,
    onProgress?: (done: number, total: number) => void,
  ): Promise<WorkerResponse> {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject, onProgress });
      this.getWorker().postMessage({ ...request, id } as WorkerRequest);
    });
  }

  private getWorker(): Worker {
    if (!this.worker) {
      this.worker = new Worker(new URL('./analyzer.worker.ts', import.meta.url));
      this.worker.onmessage = (event: MessageEvent<WorkerResponse>) => this.handle(event.data);
      this.worker.onerror = (event) => this.failAll(new Error(event.message || 'The analyzer stopped unexpectedly'));
    }
    return this.worker;
  }

  private handle(response: WorkerResponse) {
    const request = this.pending.get(response.id);
    if (!request) return;
    if (response.type === 'progress') {
      request.onProgress?.(response.done, response.total);
      return;
    }
    this.pending.delete(response.id);
    if (response.type === 'failed') request.reject(new Error(response.message));
    else request.resolve(response);
  }

  private failAll(error: Error) {
    this.pending.forEach((request) => request.reject(error));
    this.pending.clear();
    this.worker?.terminate();
    this.worker = null;
  }
}

export const analyzerClient = new AnalyzerClient();
