'use client';

import { useEffect, useMemo, useState } from 'react';
import { buildDiagram, type DiagramOptions, type DiagramSource } from '@/lib/diagram/nomnoml';
import type { TypeModel } from '@/lib/php/types';
import { analyzerClient } from '@/lib/workspace/analyzer-client';

interface LayoutResult {
  source: string;
  svg: string | null;
  error: string | null;
}

export interface DiagramState {
  diagram: DiagramSource;
  svg: string | null;
  error: string | null;
  isRendering: boolean;
}

export function useDiagram(types: TypeModel[], options: DiagramOptions, enabled: boolean): DiagramState {
  const diagram = useMemo(() => buildDiagram(types, options), [types, options]);
  const [result, setResult] = useState<LayoutResult | null>(null);
  const hasNodes = diagram.nodeCount > 0;

  useEffect(() => {
    if (!enabled || !hasNodes) return;
    let cancelled = false;
    analyzerClient
      .layout(diagram.source)
      .then((svg) => !cancelled && setResult({ source: diagram.source, svg, error: null }))
      .catch((error: Error) => !cancelled && setResult({ source: diagram.source, svg: null, error: error.message }));
    return () => {
      cancelled = true;
    };
  }, [diagram.source, enabled, hasNodes]);

  const current = result?.source === diagram.source ? result : null;

  return {
    diagram,
    svg: hasNodes ? (result?.svg ?? null) : null,
    error: current?.error ?? null,
    isRendering: enabled && hasNodes && current === null,
  };
}
