import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from './api';

export type SiteStyle = {
  color: 'default' | 'indigo' | 'slate' | 'emerald' | 'burgundy';
  size: 'default' | 'small' | 'large';
  spacing: 'default' | 'compact' | 'relaxed';
};
export type SiteEntry = { text: string; style?: Partial<SiteStyle> };
export type SiteEntries = Record<string, SiteEntry>;

export const DEFAULT_SITE_STYLE: SiteStyle = {
  color: 'default', size: 'default', spacing: 'default'
};

const SiteContentContext = createContext<SiteEntries>({});

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<SiteEntries>({});
  useEffect(() => {
    let active = true;
    const update = () => {
      apiFetch('/api/content/published')
        .then(async response => {
          if (!response.ok) throw new Error('Public content unavailable');
          const payload = await response.json() as { entries?: SiteEntries };
          if (active && payload.entries && typeof payload.entries === 'object' &&
              !Array.isArray(payload.entries)) setEntries(payload.entries);
        })
        .catch(() => {
          // A temporary API outage cannot hide the bundled, validated lessons.
        });
    };
    update();
    window.addEventListener('site-content-published', update);
    return () => {
      active = false;
      window.removeEventListener('site-content-published', update);
    };
  }, []);
  return <SiteContentContext.Provider value={entries}>{children}</SiteContentContext.Provider>;
}

export function useSiteEntries(): SiteEntries {
  return useContext(SiteContentContext);
}

export function renderSiteInline(text: string): React.ReactNode {
  // Strictly text-only inline emphasis, with newlines. No HTML and no links.
  // JSX escapes all untrusted text, so user copy cannot insert scripts.
  return text.split(/(\*\*[^*\n]+\*\*|\*[^*\n]+\*|\n)/g).map((part, index) => {
    if (part === '\n') return <br key={index} />;
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4)
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2)
      return <em key={index}>{part.slice(1, -1)}</em>;
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

const colorClass: Record<SiteStyle['color'], string> = {
  default: '', indigo: 'text-indigo-700', slate: 'text-slate-700',
  emerald: 'text-emerald-800', burgundy: 'text-rose-900'
};
const sizeClass: Record<SiteStyle['size'], string> = {
  default: '', small: 'text-sm', large: 'text-lg'
};
const spacingClass: Record<SiteStyle['spacing'], string> = {
  default: '', compact: 'leading-tight', relaxed: 'leading-loose'
};

export function SiteText({
  id, fallback, previewEntry, className = ''
}: {
  id: string;
  fallback: string;
  previewEntry?: SiteEntry;
  className?: string;
}) {
  const entries = useSiteEntries();
  const entry = previewEntry ?? entries[id];
  const text = entry?.text ?? fallback;
  const style = { ...DEFAULT_SITE_STYLE, ...entry?.style };
  return <span className={[
    className, colorClass[style.color], sizeClass[style.size], spacingClass[style.spacing]
  ].filter(Boolean).join(' ')}>{renderSiteInline(text)}</span>;
}
