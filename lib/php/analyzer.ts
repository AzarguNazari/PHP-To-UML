import { Engine } from 'php-parser';
import { extractTypesFromAst } from './ast-extractor.ts';
import { scanTypesFromTokens, type RawToken } from './token-scanner.ts';
import type { FileExtraction, FileReport, ParseIssue, ProjectModel, SourceFile, TypeModel } from './types.ts';

export const MAX_FILE_BYTES = 5 * 1024 * 1024;

const SHORT_OPEN_TAG = /<\?(?!php|=|xml)/i;

interface ParserError {
  message: string;
  line?: number;
}

type ParsedProgram = Parameters<typeof extractTypesFromAst>[0] & { errors?: ParserError[] };

const engines = new Map<boolean, Engine>();

function engineFor(shortTags: boolean): Engine {
  let engine = engines.get(shortTags);
  if (!engine) {
    engine = new Engine({
      parser: { php8: true, version: '8.3', suppressErrors: true, extractDoc: false },
      ast: { withPositions: true },
      lexer: { short_tags: shortTags },
    });
    engines.set(shortTags, engine);
  }
  return engine;
}

export function extractFile(source: SourceFile): FileExtraction {
  if (source.content.length > MAX_FILE_BYTES) {
    return {
      types: [],
      issues: [{ file: source.path, message: 'Skipped: file is larger than 5 MB', severity: 'warning' }],
      status: 'skipped',
    };
  }

  const engine = engineFor(SHORT_OPEN_TAG.test(source.content));

  try {
    const program = engine.parseCode(source.content, source.path) as unknown as ParsedProgram;
    const errors = program.errors ?? [];
    if (errors.length === 0) {
      return { types: extractTypesFromAst(program, source.path), issues: [], status: 'parsed' };
    }
    return recoverFromTokens(engine, source, errors[0], errors.length, extractTypesFromAst(program, source.path));
  } catch (error) {
    return recoverFromTokens(engine, source, error as ParserError, 1, []);
  }
}

function recoverFromTokens(
  engine: Engine,
  source: SourceFile,
  error: ParserError,
  errorCount: number,
  astTypes: TypeModel[],
): FileExtraction {
  const issue = toIssue(source.path, error);
  const detail = errorCount > 1 ? ` (${errorCount} parser errors)` : '';
  try {
    const scanned = scanTypesFromTokens(engine.tokenGetAll(source.content) as RawToken[], source.path);
    const scannedIds = new Set(scanned.map((type) => type.id));
    return {
      types: [...scanned, ...astTypes.filter((type) => !scannedIds.has(type.id))],
      issues: [{ ...issue, message: `${issue.message}${detail}. Declarations were read from tokens`, severity: 'warning' }],
      status: 'recovered',
    };
  } catch {
    return { types: astTypes, issues: [{ ...issue, message: `${issue.message}${detail}` }], status: 'skipped' };
  }
}

export function analyzeProject(sources: SourceFile[], onProgress?: (done: number) => void): ProjectModel {
  const typesById = new Map<string, TypeModel>();
  const files: FileReport[] = [];
  const issues: ParseIssue[] = [];

  sources.forEach((source, index) => {
    const extraction = extractFile(source);
    issues.push(...extraction.issues);

    for (const type of extraction.types) {
      const existing = typesById.get(type.id);
      if (existing) {
        issues.push({
          file: type.file,
          line: type.line,
          message: `Duplicate declaration of ${type.id}; the one in ${existing.file} is used`,
          severity: 'warning',
        });
      } else {
        typesById.set(type.id, type);
      }
    }

    files.push({ path: source.path, size: source.content.length, typeCount: extraction.types.length, status: extraction.status });
    onProgress?.(index + 1);
  });

  const types = [...typesById.values()].sort((left, right) => left.id.localeCompare(right.id));
  const namespaces = [...new Set(types.map((type) => type.namespace))].sort((left, right) => left.localeCompare(right));

  return { types, files, issues, namespaces };
}

function toIssue(file: string, error: ParserError): ParseIssue {
  if (typeof error?.line !== 'number' && !(error instanceof SyntaxError)) {
    return { file, message: 'The parser stopped on syntax it does not support', severity: 'error' };
  }
  const message = String(error?.message ?? error)
    .replace(/^Parse Error\s*:\s*/i, '')
    .replace(/\s+on line \d+$/i, '');
  return { file, line: error?.line, message: capitalize(message), severity: 'error' };
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
