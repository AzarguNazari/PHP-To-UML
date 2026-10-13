'use client';

import { Maximize, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { Button } from '@/components/ui/button';

interface Size {
  width: number;
  height: number;
}

function svgSize(svg: string): Size {
  const match = svg.match(/<svg[^>]*\swidth="([\d.]+)"[^>]*\sheight="([\d.]+)"/);
  return match ? { width: Number(match[1]), height: Number(match[2]) } : { width: 1, height: 1 };
}

function useElementSize() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<Size | null>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize((current) => (current && current.width === width && current.height === height ? current : { width, height }));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return { ref, size };
}

export function DiagramCanvas({ svg }: { svg: string }) {
  const { ref, size } = useElementSize();
  const diagramSize = svgSize(svg);
  const fitScale = size
    ? Math.min(1, (size.width - 48) / diagramSize.width, (size.height - 48) / diagramSize.height)
    : 1;
  const initialScale = Math.max(0.02, fitScale);

  return (
    <div ref={ref} className="relative h-[calc(100vh-15rem)] min-h-[420px] overflow-hidden bg-canvas">
      {size && (
        <TransformWrapper key={svg} initialScale={initialScale} minScale={0.02} maxScale={4} centerOnInit limitToBounds={false}>
          {({ zoomIn, zoomOut, resetTransform, centerView }) => (
            <>
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-md border bg-panel p-0.5">
                <Button variant="ghost" size="icon-sm" onClick={() => zoomIn()} aria-label="Zoom in">
                  <ZoomIn />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => zoomOut()} aria-label="Zoom out">
                  <ZoomOut />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => centerView(initialScale)} aria-label="Fit to screen">
                  <Maximize />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => resetTransform()} aria-label="Reset zoom">
                  <RotateCcw />
                </Button>
              </div>
              <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
                <div
                  className="cursor-grab rounded-md border bg-panel p-4 active:cursor-grabbing"
                  dangerouslySetInnerHTML={{ __html: svg }}
                />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      )}
      <p className="pointer-events-none absolute bottom-3 left-3 text-[11px] font-medium tracking-wider text-subtle uppercase">
        Drag to pan · scroll to zoom
      </p>
    </div>
  );
}
