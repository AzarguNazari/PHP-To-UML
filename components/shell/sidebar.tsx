import { ExternalLink } from 'lucide-react';
import { cn, formatNumber } from '@/lib/utils';
import { NAVIGATION, RESOURCE_LINKS, type ViewId } from './navigation';

interface SidebarProps {
  activeView: ViewId;
  counts: Partial<Record<ViewId, number>>;
  onNavigate: (view: ViewId) => void;
}

const itemClass = 'flex h-8 w-full items-center gap-2.5 rounded-md px-2.5 text-[11px] font-semibold tracking-wider uppercase transition-colors';

export function Sidebar({ activeView, counts, onNavigate }: SidebarProps) {
  return (
    <nav aria-label="Main" className="hidden w-56 shrink-0 flex-col gap-6 overflow-y-auto border-r bg-panel px-3 py-5 md:flex">
      {NAVIGATION.map((group) => (
        <div key={group.heading} className="flex flex-col gap-0.5">
          <p className="px-2.5 pb-1.5 text-[10px] font-medium tracking-wider text-subtle uppercase">{group.heading}</p>
          {group.items.map((item) => {
            const isActive = item.id === activeView;
            const count = counts[item.id];
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(itemClass, isActive ? 'bg-active text-ink' : 'text-muted hover:bg-hover hover:text-ink')}
              >
                <item.icon className="size-4" strokeWidth={1.75} aria-hidden />
                <span className="flex-1 text-left">{item.label}</span>
                {count !== undefined && count > 0 && (
                  <span className="text-[11px] font-medium tracking-normal text-subtle tabular-nums">{formatNumber(count)}</span>
                )}
              </button>
            );
          })}
        </div>
      ))}
      <div className="mt-auto flex flex-col gap-0.5">
        <p className="px-2.5 pb-1.5 text-[10px] font-medium tracking-wider text-subtle uppercase">Resources</p>
        {RESOURCE_LINKS.map((link) => (
          <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className={cn(itemClass, 'text-muted hover:bg-hover hover:text-ink')}>
            <link.icon className="size-4" strokeWidth={1.75} aria-hidden />
            <span className="flex-1">{link.label}</span>
            <ExternalLink className="size-3 text-subtle" aria-hidden />
          </a>
        ))}
      </div>
    </nav>
  );
}

export function MobileNavigation({ activeView, onNavigate }: Omit<SidebarProps, 'counts'>) {
  return (
    <nav aria-label="Main" className="flex shrink-0 gap-1 overflow-x-auto border-b bg-panel px-3 py-2 md:hidden">
      {NAVIGATION.flatMap((group) => group.items).map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onNavigate(item.id)}
          aria-current={item.id === activeView ? 'page' : undefined}
          className={cn(
            'flex h-8 shrink-0 items-center gap-2 rounded-md px-2.5 text-[11px] font-semibold tracking-wider uppercase',
            item.id === activeView ? 'bg-active text-ink' : 'text-muted',
          )}
        >
          <item.icon className="size-4" strokeWidth={1.75} aria-hidden />
          {item.label}
        </button>
      ))}
    </nav>
  );
}
