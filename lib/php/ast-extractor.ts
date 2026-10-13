import {
  addImport,
  createScope,
  isBuiltinType,
  qualify,
  resolveClassName,
  shortName,
  type NameScope,
} from './names.ts';
import type {
  ConstantModel,
  MethodModel,
  ParameterModel,
  PropertyModel,
  TypeKind,
  TypeModel,
  Visibility,
} from './types.ts';

interface AstNode {
  kind: string;
  loc?: { start: { line: number } } | null;
}

interface Identifier {
  name: string;
}

interface NameNode extends AstNode {
  name: string;
  resolution?: string;
}

interface TypeNode extends AstNode {
  name?: string | null;
  raw?: string;
  types?: TypeNode[];
}

interface ParameterNode extends AstNode {
  name: Identifier | string;
  type: TypeNode | null;
  nullable: boolean;
  variadic: boolean;
  byref: boolean;
  readonly: boolean;
  flags: number;
}

interface MethodNode extends AstNode {
  name: Identifier | string;
  visibility: string | null;
  isStatic: boolean;
  isAbstract: boolean;
  arguments: ParameterNode[];
  type: TypeNode | null;
  nullable: boolean;
}

interface PropertyNode extends AstNode {
  name: Identifier | string;
  type: TypeNode | null;
  nullable: boolean;
  readonly: boolean;
}

interface PropertyStatementNode extends AstNode {
  visibility: string | null;
  isStatic: boolean;
  properties: PropertyNode[];
}

interface ClassConstantNode extends AstNode {
  visibility: string | null;
  type: TypeNode | null;
  nullable: boolean;
  constants: { name: Identifier | string }[];
}

interface TraitUseNode extends AstNode {
  traits: NameNode[];
}

interface EnumCaseNode extends AstNode {
  name: Identifier | string;
}

interface DeclarationNode extends AstNode {
  name: Identifier | string | null;
  isAnonymous?: boolean;
  isAbstract?: boolean;
  isFinal?: boolean;
  isReadonly?: boolean;
  extends?: NameNode | NameNode[] | null;
  implements?: NameNode[] | null;
  body: AstNode[] | null;
}

interface NamespaceNode extends AstNode {
  name: string;
  children: AstNode[];
}

interface UseGroupNode extends AstNode {
  name: string | null;
  type: string | null;
  items: { name: string; alias: Identifier | null; type: string | null }[];
}

const DECLARATION_KINDS: Record<string, TypeKind> = {
  class: 'class',
  interface: 'interface',
  trait: 'trait',
  enum: 'enum',
};

const SKIPPED_KEYS = new Set(['loc', 'leadingComments', 'trailingComments', 'attrGroups']);

const PROMOTED_VISIBILITY: Record<number, Visibility> = {
  1: 'public',
  2: 'protected',
  4: 'private',
};

export function extractTypesFromAst(program: AstNode, file: string): TypeModel[] {
  const types: TypeModel[] = [];
  walk(program, createScope(), file, types);
  return types;
}

function walk(value: unknown, scope: NameScope, file: string, types: TypeModel[]): void {
  if (Array.isArray(value)) {
    for (const item of value) walk(item, scope, file, types);
    return;
  }
  if (!isNode(value)) return;

  if (value.kind === 'namespace') {
    const namespace = value as NamespaceNode;
    walk(namespace.children, createScope(namespace.name ?? ''), file, types);
    return;
  }

  if (value.kind === 'usegroup') {
    registerImports(value as UseGroupNode, scope);
    return;
  }

  const kind = DECLARATION_KINDS[value.kind];
  const declaration = value as DeclarationNode;
  if (kind && declaration.name && !declaration.isAnonymous) {
    types.push(buildType(declaration, kind, scope, file));
  }

  for (const [key, child] of Object.entries(value)) {
    if (!SKIPPED_KEYS.has(key) && child && typeof child === 'object') {
      walk(child, scope, file, types);
    }
  }
}

function isNode(value: unknown): value is AstNode {
  return typeof value === 'object' && value !== null && typeof (value as AstNode).kind === 'string';
}

function registerImports(group: UseGroupNode, scope: NameScope) {
  if (group.type && group.type !== 'class') return;
  for (const item of group.items) {
    if (item.type && item.type !== 'class') continue;
    const fullName = group.name ? `${group.name}\\${item.name}` : item.name;
    addImport(scope, fullName, item.alias?.name);
  }
}

function buildType(node: DeclarationNode, kind: TypeKind, scope: NameScope, file: string): TypeModel {
  const name = identifierName(node.name);
  const type: TypeModel = {
    id: qualify(scope.namespace, name),
    name,
    namespace: scope.namespace,
    kind,
    isAbstract: Boolean(node.isAbstract),
    isFinal: Boolean(node.isFinal),
    isReadonly: Boolean(node.isReadonly),
    extends: toNameList(node.extends).map((parent) => resolveClassName(scope, parent.name)),
    implements: toNameList(node.implements).map((contract) => resolveClassName(scope, contract.name)),
    traits: [],
    cases: [],
    constants: [],
    properties: [],
    methods: [],
    file,
    line: node.loc?.start.line,
    isPartial: false,
  };

  for (const member of node.body ?? []) {
    addMember(type, member, scope);
  }

  return type;
}

function addMember(type: TypeModel, member: AstNode, scope: NameScope) {
  switch (member.kind) {
    case 'propertystatement':
      type.properties.push(...toProperties(member as PropertyStatementNode, type, scope));
      break;
    case 'classconstant':
      type.constants.push(...toConstants(member as ClassConstantNode));
      break;
    case 'traituse':
      type.traits.push(...(member as TraitUseNode).traits.map((trait) => resolveClassName(scope, trait.name)));
      break;
    case 'enumcase':
      type.cases.push(identifierName((member as EnumCaseNode).name));
      break;
    case 'method': {
      const method = member as MethodNode;
      type.methods.push(toMethod(method));
      if (identifierName(method.name).toLowerCase() === '__construct') {
        type.properties.push(...toPromotedProperties(method, scope));
      }
      break;
    }
  }
}

function toProperties(statement: PropertyStatementNode, type: TypeModel, scope: NameScope): PropertyModel[] {
  return statement.properties.map((property) => ({
    name: identifierName(property.name),
    visibility: toVisibility(statement.visibility),
    type: formatType(property.type, property.nullable),
    isStatic: Boolean(statement.isStatic),
    isReadonly: Boolean(property.readonly || type.isReadonly),
    references: collectReferences(property.type, scope),
  }));
}

function toPromotedProperties(method: MethodNode, scope: NameScope): PropertyModel[] {
  return method.arguments
    .filter((parameter) => parameter.flags > 0 || parameter.readonly)
    .map((parameter) => ({
      name: identifierName(parameter.name),
      visibility: PROMOTED_VISIBILITY[parameter.flags] ?? 'public',
      type: formatType(parameter.type, parameter.nullable),
      isStatic: false,
      isReadonly: Boolean(parameter.readonly),
      references: collectReferences(parameter.type, scope),
    }));
}

function toConstants(statement: ClassConstantNode): ConstantModel[] {
  return statement.constants.map((constant) => ({
    name: identifierName(constant.name),
    visibility: toVisibility(statement.visibility),
    type: formatType(statement.type, statement.nullable),
  }));
}

function toMethod(method: MethodNode): MethodModel {
  return {
    name: identifierName(method.name),
    visibility: toVisibility(method.visibility),
    isStatic: Boolean(method.isStatic),
    isAbstract: Boolean(method.isAbstract),
    parameters: method.arguments.map(toParameter),
    returnType: formatType(method.type, method.nullable),
  };
}

function toParameter(parameter: ParameterNode): ParameterModel {
  return {
    name: identifierName(parameter.name),
    type: formatType(parameter.type, parameter.nullable),
    isVariadic: Boolean(parameter.variadic),
    isByRef: Boolean(parameter.byref),
  };
}

function toVisibility(value: string | null | undefined): Visibility {
  return value === 'protected' || value === 'private' ? value : 'public';
}

function toNameList(value: NameNode | NameNode[] | null | undefined): NameNode[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function identifierName(value: Identifier | string | null): string {
  if (!value) return '';
  return typeof value === 'string' ? value : value.name;
}

function formatType(node: TypeNode | null, nullable: boolean): string | undefined {
  if (!node) return undefined;
  const text = typeText(node);
  return nullable && !text.startsWith('?') ? `?${text}` : text;
}

function typeText(node: TypeNode): string {
  switch (node.kind) {
    case 'uniontype':
      return (node.types ?? [])
        .map((member) => (member.kind === 'intersectiontype' ? `(${typeText(member)})` : typeText(member)))
        .join('|');
    case 'intersectiontype':
      return (node.types ?? []).map(typeText).join('&');
    case 'name':
      return shortName(node.name ?? '');
    default:
      return node.raw ?? node.name ?? node.kind;
  }
}

function collectReferences(node: TypeNode | null, scope: NameScope): string[] {
  if (!node) return [];
  if (node.types) return node.types.flatMap((member) => collectReferences(member, scope));
  if (node.kind !== 'name' || !node.name || isBuiltinType(node.name)) return [];
  return [resolveClassName(scope, node.name)];
}
