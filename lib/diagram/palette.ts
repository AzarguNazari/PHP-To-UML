import type { TypeKind } from '../php/types.ts';

export interface KindStyle {
  label: string;
  pluralLabel: string;
  fill: string;
  ink: string;
  mark: string;
}

export const KIND_ORDER: TypeKind[] = ['class', 'interface', 'trait', 'enum'];

export const KIND_STYLES: Record<TypeKind, KindStyle> = {
  class: { label: 'Class', pluralLabel: 'Classes', fill: '#f1f5f9', ink: '#334155', mark: '#64748b' },
  interface: { label: 'Interface', pluralLabel: 'Interfaces', fill: '#e0f2fe', ink: '#075985', mark: '#38bdf8' },
  trait: { label: 'Trait', pluralLabel: 'Traits', fill: '#fef9c3', ink: '#854d0e', mark: '#ca8a04' },
  enum: { label: 'Enum', pluralLabel: 'Enums', fill: '#fce7f3', ink: '#9d174d', mark: '#ec4899' },
};

export const EXTERNAL_STYLE = { label: 'External', fill: '#ffffff', ink: '#64748b', mark: '#cbd5e1' };
