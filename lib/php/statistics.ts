import type { TypeKind, TypeModel } from './types.ts';

export interface NamespaceSummary {
  namespace: string;
  counts: Record<TypeKind, number>;
  total: number;
}

export function emptyKindCounts(): Record<TypeKind, number> {
  return { class: 0, interface: 0, trait: 0, enum: 0 };
}

export function countByKind(types: TypeModel[]): Record<TypeKind, number> {
  const counts = emptyKindCounts();
  for (const type of types) counts[type.kind]++;
  return counts;
}

export function summarizeNamespaces(types: TypeModel[]): NamespaceSummary[] {
  const summaries = new Map<string, NamespaceSummary>();
  for (const type of types) {
    const summary = summaries.get(type.namespace) ?? { namespace: type.namespace, counts: emptyKindCounts(), total: 0 };
    summary.counts[type.kind]++;
    summary.total++;
    summaries.set(type.namespace, summary);
  }
  return [...summaries.values()].sort((left, right) => right.total - left.total || left.namespace.localeCompare(right.namespace));
}

export function countRelationships(types: TypeModel[]): number {
  return types.reduce((sum, type) => sum + type.extends.length + type.implements.length + type.traits.length, 0);
}

export function namespaceLabel(namespace: string): string {
  return namespace || '(global)';
}
