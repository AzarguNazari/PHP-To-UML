export interface WorkspaceFile {
  path: string;
  file: File;
}

export const PHP_EXTENSIONS = ['php', 'php3', 'php4', 'php5', 'php7', 'php8', 'phtml', 'inc', 'module', 'install', 'theme'];

export const ACCEPTED_FILE_TYPES = PHP_EXTENSIONS.map((extension) => `.${extension}`).join(',');

const ALWAYS_EXCLUDED_DIRECTORIES = new Set(['.git', '.svn', '.hg', '.idea', '.vscode', 'node_modules']);

const DEPENDENCY_DIRECTORIES = new Set(['vendor']);

const PHP_FILE = new RegExp(`\\.(${PHP_EXTENSIONS.join('|')})$`, 'i');

export function isPhpPath(path: string): boolean {
  return PHP_FILE.test(path);
}

export function isDependencyPath(path: string): boolean {
  return path.split('/').some((segment) => DEPENDENCY_DIRECTORIES.has(segment));
}

function isExcludedPath(path: string): boolean {
  return path.split('/').some((segment) => ALWAYS_EXCLUDED_DIRECTORIES.has(segment));
}

export function fromFileList(files: FileList | File[]): WorkspaceFile[] {
  return Array.from(files)
    .map((file) => ({ path: file.webkitRelativePath || file.name, file }))
    .filter((entry) => isPhpPath(entry.path) && !isExcludedPath(entry.path));
}

export async function fromDataTransfer(dataTransfer: DataTransfer): Promise<WorkspaceFile[]> {
  const entries = Array.from(dataTransfer.items)
    .map((item) => item.webkitGetAsEntry?.())
    .filter((entry): entry is FileSystemEntry => Boolean(entry));

  if (entries.length === 0) return fromFileList(dataTransfer.files);

  const nested = await Promise.all(entries.map((entry) => readEntry(entry)));
  return nested.flat().filter((entry) => isPhpPath(entry.path));
}

async function readEntry(entry: FileSystemEntry): Promise<WorkspaceFile[]> {
  const path = entry.fullPath.replace(/^\//, '');
  if (isExcludedPath(path)) return [];

  if (entry.isFile) {
    const file = await new Promise<File>((resolve, reject) => (entry as FileSystemFileEntry).file(resolve, reject));
    return [{ path, file }];
  }

  const children = await readDirectory(entry as FileSystemDirectoryEntry);
  const nested = await Promise.all(children.map((child) => readEntry(child)));
  return nested.flat();
}

async function readDirectory(directory: FileSystemDirectoryEntry): Promise<FileSystemEntry[]> {
  const reader = directory.createReader();
  const entries: FileSystemEntry[] = [];
  for (;;) {
    const batch = await new Promise<FileSystemEntry[]>((resolve, reject) => reader.readEntries(resolve, reject));
    if (batch.length === 0) return entries;
    entries.push(...batch);
  }
}

export function mergeFiles(current: WorkspaceFile[], added: WorkspaceFile[]): WorkspaceFile[] {
  const byPath = new Map(current.map((entry) => [entry.path, entry]));
  for (const entry of added) byPath.set(entry.path, entry);
  return [...byPath.values()].sort((left, right) => left.path.localeCompare(right.path));
}
