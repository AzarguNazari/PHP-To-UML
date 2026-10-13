import { shortName } from '../php/names.ts';
import type { MethodModel, TypeModel, Visibility } from '../php/types.ts';
import { EXTERNAL_STYLE, KIND_STYLES } from './palette.ts';

export type DetailLevel = 'full' | 'public' | 'names';

export type RelationScope = 'all' | 'inheritance';

export interface DiagramOptions {
  namespace: string | null;
  focus: string | null;
  detail: DetailLevel;
  relations: RelationScope;
}

export interface DiagramSource {
  source: string;
  nodeCount: number;
  edgeCount: number;
}

type EdgeKind = 'extends' | 'implements' | 'uses' | 'association';

interface Edge {
  from: string;
  to: string;
  kind: EdgeKind;
}

const ARROWS: Record<EdgeKind, string> = {
  extends: '-:>',
  implements: '--:>',
  uses: '-->',
  association: '->',
};

const VISIBILITY_SYMBOLS: Record<Visibility, string> = {
  public: '+',
  protected: '#',
  private: '-',
};

const LARGE_GRAPH_NODES = 150;

export const DEFAULT_DIAGRAM_OPTIONS: DiagramOptions = {
  namespace: null,
  focus: null,
  detail: 'full',
  relations: 'all',
};

export function buildDiagram(types: TypeModel[], options: DiagramOptions): DiagramSource {
  const byId = new Map(types.map((type) => [type.id, type]));
  const visible = selectVisibleTypes(types, byId, options);
  const visibleIds = new Set(visible.map((type) => type.id));
  const edges = collectEdges(visible, visibleIds, options.relations);

  const referencedIds = new Set(edges.flatMap((edge) => [edge.from, edge.to]).filter((id) => !visibleIds.has(id)));
  const labels = createLabels([...visibleIds, ...referencedIds]);
  const nodeRef = (id: string) => `[<${styleName(byId.get(id))} id=${toNodeId(id)}>${escapeText(labels.get(id) ?? id)}]`;

  const lines = [
    ...directives(visible.length + referencedIds.size),
    ...visible.map((type) => renderNode(type, labels.get(type.id) ?? type.name, options.detail)),
    ...[...referencedIds].map(nodeRef),
    ...edges.map((edge) => `${nodeRef(edge.from)} ${ARROWS[edge.kind]} ${nodeRef(edge.to)}`),
  ];

  return {
    source: lines.join('\n'),
    nodeCount: visible.length + referencedIds.size,
    edgeCount: edges.length,
  };
}

export function escapeText(text: string): string {
  return text.replace(/[\\[\]|;]/g, '\\$&').replace(/\n/g, ' ');
}

function selectVisibleTypes(types: TypeModel[], byId: Map<string, TypeModel>, options: DiagramOptions): TypeModel[] {
  if (options.focus && byId.has(options.focus)) {
    const focus = options.focus;
    const neighbours = new Set([focus, ...relatedIds(byId.get(focus)!)]);
    for (const type of types) {
      if (relatedIds(type).includes(focus)) neighbours.add(type.id);
    }
    return types.filter((type) => neighbours.has(type.id));
  }

  if (options.namespace !== null) {
    const namespace = options.namespace;
    return types.filter((type) => type.namespace === namespace || type.namespace.startsWith(`${namespace}\\`));
  }

  return types;
}

function relatedIds(type: TypeModel): string[] {
  return [...type.extends, ...type.implements, ...type.traits, ...type.properties.flatMap((property) => property.references)];
}

function collectEdges(visible: TypeModel[], visibleIds: Set<string>, relations: RelationScope): Edge[] {
  const edges = new Map<string, Edge>();
  const add = (from: string, to: string, kind: EdgeKind) => {
    const key = `${from}\u0000${to}`;
    if (from !== to && !edges.has(key)) edges.set(key, { from, to, kind });
  };

  for (const type of visible) {
    type.extends.forEach((parent) => add(type.id, parent, 'extends'));
    type.implements.forEach((contract) => add(type.id, contract, 'implements'));
    type.traits.forEach((trait) => add(type.id, trait, 'uses'));
  }

  if (relations === 'all') {
    for (const type of visible) {
      for (const property of type.properties) {
        property.references.filter((id) => visibleIds.has(id)).forEach((id) => add(type.id, id, 'association'));
      }
    }
  }

  return [...edges.values()];
}

function createLabels(ids: string[]): Map<string, string> {
  const counts = new Map<string, number>();
  for (const id of ids) {
    const name = shortName(id).toLowerCase();
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return new Map(ids.map((id) => [id, (counts.get(shortName(id).toLowerCase()) ?? 0) > 1 ? id : shortName(id)]));
}

function directives(nodeCount: number): string[] {
  const kindStyles = Object.entries(KIND_STYLES).map(
    ([kind, style]) => `#.${kind}: visual=class fill=${style.fill} title=bold`,
  );
  return [
    '#font: Helvetica',
    '#fontSize: 12',
    '#leading: 1.4',
    '#lineWidth: 1',
    '#stroke: #475569',
    '#fill: #ffffff',
    '#background: #ffffff',
    '#padding: 8',
    '#spacing: 48',
    '#edgeMargin: 4',
    '#arrowSize: 0.8',
    '#direction: down',
    `#ranker: ${nodeCount > LARGE_GRAPH_NODES ? 'longest-path' : 'network-simplex'}`,
    ...kindStyles,
    `#.abstractclass: visual=class fill=${KIND_STYLES.class.fill} title=bold,italic`,
    `#.external: visual=class fill=${EXTERNAL_STYLE.fill} dashed title=italic`,
  ];
}

function styleName(type: TypeModel | undefined): string {
  if (!type) return 'external';
  return type.kind === 'class' && type.isAbstract ? 'abstractclass' : type.kind;
}

function toNodeId(id: string): string {
  return id.replace(/[\s>]/g, '_');
}

function renderNode(type: TypeModel, label: string, detail: DetailLevel): string {
  const header = `<${styleName(type)} id=${toNodeId(type.id)}>${escapeText(label)}`;
  if (detail === 'names') return `[${header}]`;

  const include = (visibility: Visibility) => detail === 'full' || visibility === 'public';
  const fields = [
    ...type.cases.map((name) => `case ${name}`),
    ...type.constants.filter((constant) => include(constant.visibility)).map(
      (constant) => `${VISIBILITY_SYMBOLS[constant.visibility]}const ${constant.name}${constant.type ? `: ${constant.type}` : ''}`,
    ),
    ...type.properties.filter((property) => include(property.visibility)).map(
      (property) =>
        `${VISIBILITY_SYMBOLS[property.visibility]}${property.isStatic ? 'static ' : ''}${property.isReadonly ? 'readonly ' : ''}${property.name}${property.type ? `: ${property.type}` : ''}`,
    ),
  ];
  const methods = type.methods.filter((method) => include(method.visibility)).map(formatMethod);

  const compartments = [header, fields.map(escapeText).join(';'), methods.map(escapeText).join(';')];
  while (compartments.length > 1 && compartments[compartments.length - 1] === '') compartments.pop();
  return `[${compartments.join('|')}]`;
}

function formatMethod(method: MethodModel): string {
  const parameters = method.parameters
    .map((parameter) => {
      const prefix = `${parameter.isByRef ? '&' : ''}${parameter.isVariadic ? '...' : ''}`;
      return `${prefix}${parameter.name}${parameter.type ? `: ${parameter.type}` : ''}`;
    })
    .join(', ');
  const modifiers = `${method.isAbstract ? 'abstract ' : ''}${method.isStatic ? 'static ' : ''}`;
  return `${VISIBILITY_SYMBOLS[method.visibility]}${modifiers}${method.name}(${parameters})${method.returnType ? `: ${method.returnType}` : ''}`;
}
