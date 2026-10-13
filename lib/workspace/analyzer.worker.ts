import nomnoml from 'nomnoml';
import { analyzeProject } from '../php/analyzer.ts';
import type { WorkerRequest, WorkerResponse } from './protocol.ts';

const PROGRESS_INTERVAL = 50;

const scope = self as unknown as { postMessage(message: WorkerResponse): void; onmessage: ((event: MessageEvent<WorkerRequest>) => void) | null };

scope.onmessage = async (event) => {
  const request = event.data;
  try {
    if (request.type === 'analyze') {
      const total = request.files.length;
      const sources = await Promise.all(
        request.files.map(async ({ path, file }) => ({ path, content: await file.text() })),
      );
      const project = analyzeProject(sources, (done) => {
        if (done % PROGRESS_INTERVAL === 0) scope.postMessage({ id: request.id, type: 'progress', done, total });
      });
      scope.postMessage({ id: request.id, type: 'analyzed', project });
    } else {
      scope.postMessage({ id: request.id, type: 'laidOut', svg: nomnoml.renderSvg(request.source) });
    }
  } catch (error) {
    scope.postMessage({ id: request.id, type: 'failed', message: error instanceof Error ? error.message : String(error) });
  }
};
