import { BookOpen, Boxes, CodeXml, FileCode, LayoutDashboard, Network, TriangleAlert, type LucideIcon } from 'lucide-react';

export type ViewId = 'overview' | 'diagram' | 'types' | 'files' | 'issues' | 'source';

export interface NavigationItem {
  id: ViewId;
  label: string;
  icon: LucideIcon;
}

export interface NavigationGroup {
  heading: string;
  items: NavigationItem[];
}

export const NAVIGATION: NavigationGroup[] = [
  {
    heading: 'Workspace',
    items: [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
      { id: 'diagram', label: 'Diagram', icon: Network },
      { id: 'types', label: 'Types', icon: Boxes },
    ],
  },
  {
    heading: 'Source',
    items: [
      { id: 'files', label: 'Files', icon: FileCode },
      { id: 'issues', label: 'Issues', icon: TriangleAlert },
      { id: 'source', label: 'Nomnoml', icon: CodeXml },
    ],
  },
];

export const REPOSITORY_URL = 'https://github.com/AzarguNazari/PHP-To-UML';

export const RESOURCE_LINKS = [{ label: 'Documentation', href: `${REPOSITORY_URL}#readme`, icon: BookOpen }];
