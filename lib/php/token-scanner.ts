import { addImport, createScope, isBuiltinType, qualify, resolveClassName, shortName, type NameScope } from './names.ts';
import type { ParameterModel, PropertyModel, TypeKind, TypeModel, Visibility } from './types.ts';

export type RawToken = string | [string, string, number];

interface Token {
  type: string;
  text: string;
  line: number;
}

interface OpenType {
  model: TypeModel;
  depth: number;
}

const IGNORED_TOKENS = new Set(['T_WHITESPACE', 'T_COMMENT', 'T_DOC_COMMENT', 'T_OPEN_TAG', 'T_CLOSE_TAG', 'T_INLINE_HTML']);

const DECLARATION_TOKENS: Record<string, TypeKind> = {
  T_CLASS: 'class',
  T_INTERFACE: 'interface',
  T_TRAIT: 'trait',
  T_ENUM: 'enum',
};

const NAME_TOKENS = new Set(['T_STRING', 'T_NAME_QUALIFIED', 'T_NAME_FULLY_QUALIFIED', 'T_NAME_RELATIVE']);

const OPENING_BRACES = new Set(['{', 'T_CURLY_OPEN', 'T_DOLLAR_OPEN_CURLY_BRACES']);

const MEMBER_MODIFIERS = new Set(['T_PUBLIC', 'T_PROTECTED', 'T_PRIVATE', 'T_STATIC', 'T_ABSTRACT', 'T_FINAL', 'T_VAR', 'T_READ_ONLY']);

const VISIBILITY_TOKENS: Record<string, Visibility> = {
  T_PUBLIC: 'public',
  T_PROTECTED: 'protected',
  T_PRIVATE: 'private',
};

export function scanTypesFromTokens(rawTokens: RawToken[], file: string): TypeModel[] {
  const tokens = normalize(rawTokens);
  const types: TypeModel[] = [];
  let scope = createScope();
  let depth = 0;
  let namespaceDepth = 0;
  let openType: OpenType | null = null;
  let statementStart = 0;

  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index];

    if (OPENING_BRACES.has(token.type)) {
      depth++;
      if (openType && depth === openType.depth) statementStart = index + 1;
      continue;
    }

    if (token.type === '}') {
      depth--;
      if (openType && depth < openType.depth) openType = null;
      if (openType && depth === openType.depth) statementStart = index + 1;
      continue;
    }

    if (openType && depth === openType.depth) {
      if (token.type === ';') {
        statementStart = index + 1;
        continue;
      }
      index = scanMember(tokens, index, statementStart, openType.model, scope);
      continue;
    }

    if (token.type === 'T_NAMESPACE' && NAME_TOKENS.has(tokens[index + 1]?.type ?? '')) {
      scope = createScope(tokens[index + 1].text);
      namespaceDepth = tokens[index + 2]?.type === '{' ? depth + 1 : depth;
      continue;
    }

    if (token.type === 'T_USE' && depth === namespaceDepth && !openType) {
      index = scanImports(tokens, index + 1, scope);
      continue;
    }

    const kind = DECLARATION_TOKENS[token.type];
    if (kind && isNamedDeclaration(tokens, index)) {
      const model = createModel(tokens, index, kind, scope, file);
      index = scanHeritage(tokens, index + 2, model, scope);
      types.push(model);
      if (!openType && tokens[index]?.type === '{') {
        depth++;
        openType = { model, depth };
        statementStart = index + 1;
      } else if (tokens[index]?.type === '{') {
        depth++;
      }
    }
  }

  return types;
}

function normalize(rawTokens: RawToken[]): Token[] {
  const tokens: Token[] = [];
  let line = 1;
  for (const raw of rawTokens) {
    const token = typeof raw === 'string' ? { type: raw, text: raw, line } : { type: raw[0], text: raw[1], line: raw[2] };
    line = token.line;
    if (!IGNORED_TOKENS.has(token.type)) tokens.push(token);
  }
  return tokens;
}

function isNamedDeclaration(tokens: Token[], index: number): boolean {
  const previous = tokens[index - 1]?.type;
  return previous !== 'T_DOUBLE_COLON' && previous !== 'T_NEW' && tokens[index + 1]?.type === 'T_STRING';
}

function createModel(tokens: Token[], index: number, kind: TypeKind, scope: NameScope, file: string): TypeModel {
  const modifiers = new Set<string>();
  for (let cursor = index - 1; cursor >= 0 && ['T_ABSTRACT', 'T_FINAL', 'T_READ_ONLY'].includes(tokens[cursor].type); cursor--) {
    modifiers.add(tokens[cursor].type);
  }
  const name = tokens[index + 1].text;
  return {
    id: qualify(scope.namespace, name),
    name,
    namespace: scope.namespace,
    kind,
    isAbstract: modifiers.has('T_ABSTRACT'),
    isFinal: modifiers.has('T_FINAL'),
    isReadonly: modifiers.has('T_READ_ONLY'),
    extends: [],
    implements: [],
    traits: [],
    cases: [],
    constants: [],
    properties: [],
    methods: [],
    file,
    line: tokens[index].line,
    isPartial: true,
  };
}

function scanHeritage(tokens: Token[], index: number, model: TypeModel, scope: NameScope): number {
  let target: string[] | null = null;
  for (; index < tokens.length && tokens[index].type !== '{' && tokens[index].type !== ';'; index++) {
    const token = tokens[index];
    if (token.type === 'T_EXTENDS') target = model.extends;
    else if (token.type === 'T_IMPLEMENTS') target = model.implements;
    else if (token.type === ':') target = null;
    else if (target && NAME_TOKENS.has(token.type)) target.push(resolveClassName(scope, token.text));
  }
  return index;
}

function scanImports(tokens: Token[], index: number, scope: NameScope): number {
  const kindToken = tokens[index]?.type;
  if (kindToken === 'T_FUNCTION' || kindToken === 'T_CONST') return skipTo(tokens, index, ';');

  let prefix = '';
  let name = '';
  let alias: string | null = null;
  const commit = () => {
    if (name) addImport(scope, prefix + name, alias);
    name = '';
    alias = null;
  };

  for (; index < tokens.length && tokens[index].type !== ';'; index++) {
    const token = tokens[index];
    if (token.type === '{') {
      prefix = name.endsWith('\\') ? name : `${name}\\`;
      name = '';
    } else if (token.type === 'T_NS_SEPARATOR') {
      name += '\\';
    } else if (token.type === 'T_AS') {
      alias = tokens[++index]?.text ?? null;
    } else if (token.type === ',' || token.type === '}') {
      commit();
    } else if (NAME_TOKENS.has(token.type)) {
      name += token.text;
    }
  }
  commit();
  return index;
}

function scanMember(tokens: Token[], index: number, statementStart: number, model: TypeModel, scope: NameScope): number {
  const token = tokens[index];

  if (token.type === 'T_USE') {
    for (index++; index < tokens.length && tokens[index].type !== ';' && tokens[index].type !== '{'; index++) {
      if (NAME_TOKENS.has(tokens[index].type)) model.traits.push(resolveClassName(scope, tokens[index].text));
    }
    return index - 1;
  }

  if (token.type === 'T_CASE' && tokens[index + 1]) {
    model.cases.push(tokens[index + 1].text);
    return skipTo(tokens, index, ';') - 1;
  }

  if (token.type === 'T_CONST') {
    const modifiers = collectModifiers(tokens, statementStart, index);
    const end = skipTo(tokens, index, ';');
    for (let cursor = index + 1; cursor < end; cursor++) {
      if (tokens[cursor + 1]?.type === '=' && tokens[cursor].type !== '=') {
        model.constants.push({ name: tokens[cursor].text, visibility: modifiers.visibility });
      }
    }
    return end - 1;
  }

  if (token.type === 'T_FUNCTION') {
    return scanMethod(tokens, index, statementStart, model, scope);
  }

  if (token.type === 'T_VARIABLE') {
    const modifiers = collectModifiers(tokens, statementStart, index);
    if (modifiers.count > 0) {
      const typeTokens = tokens.slice(modifiers.end, index);
      const previousIsComma = tokens[index - 1]?.type === ',';
      model.properties.push({
        name: token.text.slice(1),
        visibility: modifiers.visibility,
        type: previousIsComma ? undefined : joinType(typeTokens),
        isStatic: modifiers.isStatic,
        isReadonly: modifiers.isReadonly || model.isReadonly,
        references: previousIsComma ? [] : collectReferences(typeTokens, scope),
      });
    }
    return skipToAny(tokens, index, [',', ';', '{', '=']) - 1;
  }

  return index;
}

function scanMethod(tokens: Token[], index: number, statementStart: number, model: TypeModel, scope: NameScope): number {
  const modifiers = collectModifiers(tokens, statementStart, index);
  let cursor = index + 1;
  if (tokens[cursor]?.type === '&') cursor++;
  const name = tokens[cursor]?.text;
  if (!name || tokens[cursor + 1]?.type !== '(') return index;

  const { segments, end } = scanParameterSegments(tokens, cursor + 1);
  const parameters = segments.map(toParameter).filter((parameter): parameter is ParameterModel => parameter !== null);
  if (name.toLowerCase() === '__construct') {
    model.properties.push(...segments.flatMap((segment) => toPromotedProperty(segment, scope)));
  }
  let returnType: string | undefined;
  let next = end + 1;
  if (tokens[next]?.type === ':') {
    const start = next + 1;
    next = skipToAny(tokens, start, ['{', ';']);
    returnType = joinType(tokens.slice(start, next));
  } else {
    next = skipToAny(tokens, next, ['{', ';']);
  }

  model.methods.push({
    name,
    visibility: modifiers.visibility,
    isStatic: modifiers.isStatic,
    isAbstract: modifiers.isAbstract,
    parameters,
    returnType,
  });
  return next - 1;
}

function scanParameterSegments(tokens: Token[], openIndex: number): { segments: Token[][]; end: number } {
  const segments: Token[][] = [[]];
  let nesting = 0;
  let index = openIndex + 1;

  for (; index < tokens.length; index++) {
    const token = tokens[index];
    if (token.type === '(' || token.type === '[' || token.type === 'T_ATTRIBUTE') nesting++;
    if (token.type === ')' || token.type === ']') {
      if (nesting === 0) break;
      nesting--;
      continue;
    }
    if (nesting === 0 && token.type === ',') segments.push([]);
    else if (nesting === 0) segments[segments.length - 1].push(token);
  }
  return { segments, end: index };
}

function toPromotedProperty(segment: Token[], scope: NameScope): PropertyModel[] {
  const variableIndex = segment.findIndex((token) => token.type === 'T_VARIABLE');
  if (variableIndex === -1) return [];
  const modifiers = collectModifiers(segment, 0, variableIndex);
  if (modifiers.count === 0) return [];
  const typeTokens = segment.slice(modifiers.end, variableIndex);
  return [
    {
      name: segment[variableIndex].text.slice(1),
      visibility: modifiers.visibility,
      type: joinType(typeTokens),
      isStatic: false,
      isReadonly: modifiers.isReadonly,
      references: collectReferences(typeTokens, scope),
    },
  ];
}

function toParameter(segment: Token[]): ParameterModel | null {
  const variableIndex = segment.findIndex((token) => token.type === 'T_VARIABLE');
  if (variableIndex === -1) return null;
  let end = variableIndex;
  const isVariadic = segment[end - 1]?.type === 'T_ELLIPSIS';
  if (isVariadic) end--;
  const isByRef = segment[end - 1]?.text === '&';
  if (isByRef) end--;
  return {
    name: segment[variableIndex].text.slice(1),
    type: joinType(segment.slice(0, end).filter((token) => !MEMBER_MODIFIERS.has(token.type))),
    isVariadic,
    isByRef,
  };
}

function collectModifiers(tokens: Token[], start: number, end: number) {
  let visibility: Visibility = 'public';
  let count = 0;
  let isStatic = false;
  let isAbstract = false;
  let isReadonly = false;
  let index = skipAttributes(tokens, start);
  for (; index < end && MEMBER_MODIFIERS.has(tokens[index].type); index++) {
    const type = tokens[index].type;
    visibility = VISIBILITY_TOKENS[type] ?? visibility;
    isStatic ||= type === 'T_STATIC';
    isAbstract ||= type === 'T_ABSTRACT';
    isReadonly ||= type === 'T_READ_ONLY';
    count++;
  }
  return { visibility, count, end: index, isStatic, isAbstract, isReadonly };
}

function skipAttributes(tokens: Token[], index: number): number {
  while (tokens[index]?.type === 'T_ATTRIBUTE') {
    let nesting = 1;
    for (index++; index < tokens.length && nesting > 0; index++) {
      if (tokens[index].type === '[' || tokens[index].type === 'T_ATTRIBUTE') nesting++;
      if (tokens[index].type === ']') nesting--;
    }
  }
  return index;
}

function joinType(tokens: Token[]): string | undefined {
  const text = tokens.map((token) => (NAME_TOKENS.has(token.type) ? shortName(token.text) : token.text)).join('');
  return text || undefined;
}

function collectReferences(typeTokens: Token[], scope: NameScope): string[] {
  return typeTokens
    .filter((token) => NAME_TOKENS.has(token.type) && !isBuiltinType(token.text))
    .map((token) => resolveClassName(scope, token.text));
}

function skipTo(tokens: Token[], index: number, type: string): number {
  return skipToAny(tokens, index, [type]);
}

function skipToAny(tokens: Token[], index: number, types: string[]): number {
  while (index < tokens.length && !types.includes(tokens[index].type)) index++;
  return index;
}
