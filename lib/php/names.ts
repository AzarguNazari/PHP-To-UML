const BUILTIN_TYPES = new Set([
  'array',
  'bool',
  'boolean',
  'callable',
  'double',
  'false',
  'float',
  'int',
  'integer',
  'iterable',
  'mixed',
  'never',
  'null',
  'object',
  'parent',
  'resource',
  'self',
  'static',
  'string',
  'true',
  'void',
]);

export interface NameScope {
  namespace: string;
  imports: Map<string, string>;
}

export function createScope(namespace = ''): NameScope {
  return { namespace: trimLeadingSeparator(namespace), imports: new Map() };
}

export function addImport(scope: NameScope, fullName: string, alias?: string | null) {
  const target = trimLeadingSeparator(fullName);
  scope.imports.set((alias || shortName(target)).toLowerCase(), target);
}

export function isBuiltinType(name: string): boolean {
  return BUILTIN_TYPES.has(name.toLowerCase());
}

export function resolveClassName(scope: NameScope, rawName: string): string {
  if (rawName.startsWith('\\')) return rawName.slice(1);

  if (/^namespace\\/i.test(rawName)) {
    return qualify(scope.namespace, rawName.slice('namespace\\'.length));
  }

  const [head, ...rest] = rawName.split('\\');
  const imported = scope.imports.get(head.toLowerCase());
  if (imported) return [imported, ...rest].join('\\');

  return qualify(scope.namespace, rawName);
}

export function qualify(namespace: string, name: string): string {
  return namespace ? `${namespace}\\${name}` : name;
}

export function shortName(fullName: string): string {
  return fullName.slice(fullName.lastIndexOf('\\') + 1);
}

export function namespaceOf(fullName: string): string {
  const index = fullName.lastIndexOf('\\');
  return index === -1 ? '' : fullName.slice(0, index);
}

export function trimLeadingSeparator(name: string): string {
  return name.startsWith('\\') ? name.slice(1) : name;
}
