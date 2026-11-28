import React, { useEffect, useMemo, useRef, useState } from 'react';
import { apiFetch } from '../api';
import {
  DEFAULT_SITE_STYLE, SiteText,
  type SiteEntries, type SiteEntry, type SiteStyle
} from '../siteContent';
import { EDITABLE_SITE_FIELDS } from '../siteContentCatalog';

type HistoryEntry = {
  revision: number;
  at: string | null;
  entries: SiteEntries;
};
type EditorSnapshot = {
  revision: number;
  draft: SiteEntries;
  published: SiteEntries;
  history: HistoryEntry[];
  updatedAt: string | null;
  publishedAt: string | null;
};

const selectClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-indigo-600';
const buttonClass = 'rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600';

export function SiteContentEditor() {
  const [snapshot, setSnapshot] = useState<EditorSnapshot | null>(null);
  const [draft, setDraft] = useState<SiteEntries>({});
  const [selectedId, setSelectedId] = useState('home.title');
  const [filter, setFilter] = useState('');
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [rollbackRevision, setRollbackRevision] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const reload = async () => {
    const response = await apiFetch('/api/admin/site-content');
    const data = await response.json() as EditorSnapshot & { error?: string };
    if (!response.ok) throw new Error(data.error || 'A szövegszerkesztő nem tölthető be.');
    setSnapshot(data);
    setDraft(data.draft);
    setDirty(false);
  };
  useEffect(() => {
    let active = true;
    apiFetch('/api/admin/site-content')
      .then(async response => {
        const data = await response.json() as EditorSnapshot & { error?: string };
        if (!response.ok) throw new Error(data.error || 'A szerkesztő nem érhető el.');
        if (active) {
          setSnapshot(data);
          setDraft(data.draft);
        }
      })
      .catch(cause => {
        if (active) setError(cause instanceof Error ? cause.message : 'Szerkesztőhiba');
      });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const fields = useMemo(() => EDITABLE_SITE_FIELDS.filter(field =>
    (field.section + ' ' + field.label + ' ' + field.fallback)
      .toLocaleLowerCase('hu-HU').includes(filter.toLocaleLowerCase('hu-HU'))
  ), [filter]);
  const selected = EDITABLE_SITE_FIELDS.find(field => field.id === selectedId)
    ?? EDITABLE_SITE_FIELDS[0];
  const entry: SiteEntry = draft[selected.id] ?? {
    text: selected.fallback, style: DEFAULT_SITE_STYLE
  };
  const displayEntry: SiteEntry = {
    text: entry.text, style: { ...DEFAULT_SITE_STYLE, ...entry.style }
  };
  const style = displayEntry.style as SiteStyle;
  const published = snapshot?.published[selected.id];
  const updatedInDraft = JSON.stringify(draft[selected.id] ?? null) !==
    JSON.stringify(snapshot?.published[selected.id] ?? null);
  const groups = fields.reduce<Record<string, typeof fields>>((acc, field) => {
    (acc[field.section] ??= []).push(field);
    return acc;
  }, {});

  const updateEntry = (patch: Partial<SiteEntry>) => {
    setDraft(current => ({
      ...current,
      [selected.id]: { ...displayEntry, ...patch }
    }));
    setDirty(true);
    setNotice('');
  };
  const updateStyle = (name: keyof SiteStyle, value: string) => {
    updateEntry({
      style: { ...style, [name]: value } as SiteStyle
    });
  };
  const surroundSelection = (marker: string) => {
    const el = inputRef.current;
    const start = el?.selectionStart ?? entry.text.length;
    const end = el?.selectionEnd ?? entry.text.length;
    const selectedText = entry.text.slice(start, end) || 'kiemelt szöveg';
    updateEntry({ text: entry.text.slice(0, start) + marker +
      selectedText + marker + entry.text.slice(end) });
    requestAnimationFrame(() => {
      if (!el) return;
      el.focus();
      el.setSelectionRange(start + marker.length, start + marker.length + selectedText.length);
    });
  };
  const request = async (action: 'save' | 'publish' | 'rollback', selectedVersion?: number) => {
    if (!snapshot) return;
    if (action === 'publish' && dirty) {
      setError('Előbb mentsd el a vázlatot!');
      return;
    }
    if (action === 'publish' && !window.confirm(
      'Közzéteszed a vázlatot? Ettől kezdve a hallgatók is ezt a szöveget látják.'
    )) return;
    if (action === 'rollback' && !window.confirm(
      'Visszaállítod és azonnal közzéteszed a korábbi változatot?'
    )) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await apiFetch('/api/admin/site-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action, revision: snapshot.revision,
          ...(action === 'save' ? { draft } : {}),
          ...(action === 'rollback' ? { rollbackRevision: selectedVersion } : {})
        })
      });
      const result = await response.json() as { message?: string; error?: string };
      if (!response.ok) throw new Error(result.error || 'A szerkesztés nem sikerült.');
      await reload();
      setNotice(result.message || 'Mentve.');
      if (action !== 'save') {
        window.dispatchEvent(new Event('site-content-published'));
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Ismeretlen hiba.');
    } finally {
      setBusy(false);
    }
  };

  return <section className="rounded-2xl border border-indigo-200 bg-white p-5 sm:p-7 mb-6" aria-label="Tananyag- és szövegszerkesztő">
    <h3 className="font-serif-cormorant text-2xl font-bold mb-1">Tananyag- és szövegszerkesztő</h3>
    <p className="text-sm text-slate-600 mb-4">
      Címsorok, bekezdések, menüfeliratok és alapvető formázások javítása kódírás nélkül.
      A vázlatot kizárólag az admin látja; csak a külön közzétett változat lesz nyilvános.
      A kérdések, helyes válaszok, tanulói eredmények és a Tanársegéd forrásindexe nem változik.
    </p>
    {!snapshot && !error && <p role="status">A szerkesztő betöltése…</p>}
    {error && <p className="text-red-800 text-sm my-3" role="alert">{error}</p>}
    {notice && <p className="text-emerald-800 text-sm my-3" role="status">{notice}</p>}
    {snapshot && <>
      <div className="flex flex-wrap gap-3 justify-between items-center text-xs text-slate-600 mb-4">
        <span>Szövegverzió: {snapshot.revision} · Közzétéve: {snapshot.publishedAt || 'még nem történt'}</span>
        {dirty && <span className="font-bold text-amber-800" role="status">Nem mentett változtatások</span>}
      </div>
      <label className="block text-sm font-semibold mb-2">
        Keresés a szerkeszthető szövegekben
        <input value={filter} onChange={event => setFilter(event.target.value)}
          className={selectClass + ' mt-1'} placeholder="Pl. ritmus, fejezet, címsor" />
      </label>
      <label className="block text-sm font-semibold mb-4">
        Szerkesztendő szöveg
        <select value={selected.id} onChange={event => setSelectedId(event.target.value)}
          className={selectClass + ' mt-1'}>
          {Object.entries(groups).map(([group, items]) =>
            <optgroup key={group} label={group}>
              {items.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
            </optgroup>
          )}
          {!fields.some(item => item.id === selected.id) &&
            <option value={selected.id}>{selected.section}: {selected.label}</option>}
        </select>
      </label>
      <label className="block text-sm font-semibold mb-2">
        {selected.section} – {selected.label}
        <textarea ref={inputRef} value={entry.text}
          rows={selected.id.endsWith('.title') ? 3 : 6}
          maxLength={5500}
          onChange={event => updateEntry({ text: event.target.value })}
          className={selectClass + ' mt-1 font-normal leading-relaxed'}
          spellCheck={true} />
      </label>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button type="button" className={buttonClass + ' border border-slate-300'} disabled={busy}
          onClick={() => surroundSelection('**')}>Félkövér kijelölés</button>
        <button type="button" className={buttonClass + ' border border-slate-300'} disabled={busy}
          onClick={() => surroundSelection('*')}>Dőlt kijelölés</button>
        <button type="button" className={buttonClass + ' border border-slate-300'}
          disabled={busy || !draft[selected.id]}
          onClick={() => {
            setDraft(prev => { const changed = { ...prev }; delete changed[selected.id]; return changed; });
            setDirty(true);
          }}>Eredeti szöveg visszaállítása</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <label className="text-sm font-medium">Szövegszín
          <select className={selectClass + ' mt-1'} value={style.color}
            onChange={event => updateStyle('color', event.target.value)}>
            <option value="default">Alapértelmezett</option>
            <option value="slate">Sötétszürke</option>
            <option value="indigo">Kék</option>
            <option value="emerald">Zöld</option>
            <option value="burgundy">Bordó</option>
          </select>
        </label>
        <label className="text-sm font-medium">Betűméret
          <select className={selectClass + ' mt-1'} value={style.size}
            onChange={event => updateStyle('size', event.target.value)}>
            <option value="default">Alapértelmezett</option>
            <option value="small">Kisebb</option>
            <option value="large">Nagyobb</option>
          </select>
        </label>
        <label className="text-sm font-medium">Sorköz
          <select className={selectClass + ' mt-1'} value={style.spacing}
            onChange={event => updateStyle('spacing', event.target.value)}>
            <option value="default">Alapértelmezett</option>
            <option value="compact">Szűk</option>
            <option value="relaxed">Tág</option>
          </select>
        </label>
      </div>
      <div className="border border-slate-200 rounded-xl bg-slate-50 p-4 mb-4">
        <h4 className="text-sm font-bold text-slate-800 mb-2">Előnézet – csak neked látható</h4>
        <p className="text-slate-800 text-base whitespace-pre-wrap">
          <SiteText id={selected.id} fallback={selected.fallback} previewEntry={displayEntry}/>
        </p>
        <p className="text-xs text-slate-600 mt-3">{updatedInDraft ? 'Eltér a közzétett változattól.' : 'Jelenleg megegyezik a közzétett változattal.'}
          {published && <> A közzétett szöveg: „{published.text.slice(0, 130)}{published.text.length > 130 ? '…' : ''}”</>}
        </p>
      </div>
      <div className="flex flex-wrap gap-3 items-center mb-5">
        <button className={buttonClass + ' bg-indigo-700 text-white'}
          type="button" disabled={busy || !dirty} onClick={() => void request('save')}>Vázlat mentése</button>
        <button className={buttonClass + ' bg-emerald-700 text-white'}
          type="button" disabled={busy || dirty} onClick={() => void request('publish')}>Vázlat közzététele</button>
        <span className="text-xs text-slate-600">
          Először mentsd a vázlatot, majd külön tedd közzé!
        </span>
      </div>
      <details className="border-t border-slate-200 pt-4">
        <summary className="font-semibold text-sm cursor-pointer">Korábbi közzétett változat visszaállítása</summary>
        <p className="text-xs text-slate-600 my-2">Legfeljebb az utolsó tíz publikálás állítható vissza. A visszaállítás azonnal nyilvános lesz.</p>
        {snapshot.history.length === 0 ? <p className="text-sm">Még nincs korábbi közzétett változat.</p> :
          <div className="flex flex-wrap gap-2 items-end">
            <label className="text-sm flex-1 min-w-48">Változat
              <select className={selectClass + ' mt-1'} value={rollbackRevision}
                onChange={event => setRollbackRevision(event.target.value)}>
                <option value="">Válassz korábbi változatot</option>
                {[...snapshot.history].reverse().map(item =>
                  <option key={item.revision} value={item.revision}>
                    {item.revision}. változat ({item.at || 'eredeti állapot'})
                  </option>
                )}
              </select>
            </label>
            <button type="button" className={buttonClass + ' border border-amber-500 text-amber-900'}
              disabled={busy || dirty || rollbackRevision === ''}
              onClick={() => void request('rollback', Number(rollbackRevision))}>Visszaállítás és közzététel</button>
          </div>}
      </details>
    </>}
  </section>;
}
