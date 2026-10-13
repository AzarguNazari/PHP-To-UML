const RELATIONS = [
  { label: 'Extends', dashed: false, head: 'triangle' },
  { label: 'Implements', dashed: true, head: 'triangle' },
  { label: 'Uses trait', dashed: true, head: 'arrow' },
  { label: 'Association', dashed: false, head: 'arrow' },
] as const;

export function RelationLegend() {
  return (
    <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
      {RELATIONS.map((relation) => (
        <li key={relation.label} className="flex items-center gap-1.5">
          <svg width="26" height="10" viewBox="0 0 26 10" aria-hidden className="text-muted">
            <line x1="1" y1="5" x2="18" y2="5" stroke="currentColor" strokeWidth="1.25" strokeDasharray={relation.dashed ? '3 2' : undefined} />
            {relation.head === 'triangle' ? (
              <path d="M18 1 L25 5 L18 9 Z" fill="white" stroke="currentColor" strokeWidth="1.25" />
            ) : (
              <path d="M19 1 L25 5 L19 9" fill="none" stroke="currentColor" strokeWidth="1.25" />
            )}
          </svg>
          {relation.label}
        </li>
      ))}
    </ul>
  );
}
