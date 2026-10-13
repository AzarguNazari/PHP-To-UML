export type TypeKind = 'class' | 'interface' | 'trait' | 'enum';

export type Visibility = 'public' | 'protected' | 'private';

export interface ConstantModel {
  name: string;
  visibility: Visibility;
  type?: string;
}

export interface PropertyModel {
  name: string;
  visibility: Visibility;
  type?: string;
  isStatic: boolean;
  isReadonly: boolean;
  references: string[];
}

export interface ParameterModel {
  name: string;
  type?: string;
  isVariadic: boolean;
  isByRef: boolean;
}

export interface MethodModel {
  name: string;
  visibility: Visibility;
  isStatic: boolean;
  isAbstract: boolean;
  parameters: ParameterModel[];
  returnType?: string;
}

export interface TypeModel {
  id: string;
  name: string;
  namespace: string;
  kind: TypeKind;
  isAbstract: boolean;
  isFinal: boolean;
  isReadonly: boolean;
  extends: string[];
  implements: string[];
  traits: string[];
  cases: string[];
  constants: ConstantModel[];
  properties: PropertyModel[];
  methods: MethodModel[];
  file: string;
  line?: number;
  isPartial: boolean;
}

export type IssueSeverity = 'error' | 'warning';

export interface ParseIssue {
  file: string;
  line?: number;
  message: string;
  severity: IssueSeverity;
}

export type FileStatus = 'parsed' | 'recovered' | 'skipped';

export interface FileReport {
  path: string;
  size: number;
  typeCount: number;
  status: FileStatus;
}

export interface SourceFile {
  path: string;
  content: string;
}

export interface FileExtraction {
  types: TypeModel[];
  issues: ParseIssue[];
  status: FileStatus;
}

export interface ProjectModel {
  types: TypeModel[];
  files: FileReport[];
  issues: ParseIssue[];
  namespaces: string[];
}
