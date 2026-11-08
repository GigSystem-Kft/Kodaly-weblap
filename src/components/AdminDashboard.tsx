import React, { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '../api';

type User = { id: string; email: string; display_name: string; role: string; created_at: string; email_verified_at: string | null };
type Invite = { id: string; email: string; created_at: string; expires_at: string; used_at: string | null };
type TutorSource = { id: string; title: string; createdAt: string; size: number };
type Coverage = {generatedAt:string; indexChunks:number; indexedCharacters:number;
 sources:{source:string;chunks:number;characters:number;kind:string}[];
 omitted:{file:string;reason:string}[];missing:string[];limitations:string[]};

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [sources, setSources] = useState<TutorSource[]>([]);
  const [coverage, setCoverage] = useState<Coverage | null>(null);
  const [coverageOrigin, setCoverageOrigin] = useState<'live' | 'static' | null>(null);
  const [staticCoverage, setStaticCoverage] = useState<Coverage | null>(null);
  const [coverageError, setCoverageError] = useState('');
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceTitle, setSourceTitle] = useState('');
  const [search, setSearch] = useState('');
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async (query = '') => {
    setError('');
    const [u, i, sourceResponse] = await Promise.all([
      apiFetch('/api/admin/users?q=' + encodeURIComponent(query)),
      apiFetch('/api/admin/invitations'),
      apiFetch('/api/admin/sources')
    ]);
    if (!u.ok || !i.ok || !sourceResponse.ok) throw new Error('Nem sikerült betölteni az adminisztrációs adatokat.');
    setUsers((await u.json()).users);
    setInvites((await i.json()).invitations);
    setSources((await sourceResponse.json()).sources);
  }, []);

  useEffect(() => {
    void load().catch(e => setError(e instanceof Error ? e.message : 'Betöltési hiba.'));
    let cancelled = false;
    const readCoverage = async () => {
      // Compare independent datasets, never silently label a static
      // build-time report as the live PHP index.
      const [live, stat] = await Promise.allSettled([
        apiFetch('/api/admin/source-coverage').then(async response => {
          if (!response.ok) throw new Error('A PHP-forrásjelentés nem érhető el.');
          return await response.json() as Coverage;
        }),
        fetch('/source-inventory.json', {cache:'no-store'}).then(async response => {
          if (!response.ok) throw new Error('A statikus forrásleltár nem érhető el.');
          return await response.json() as Coverage;
        })
      ]);
      if (cancelled) return;
      const liveReport = live.status === 'fulfilled' ? live.value : null;
      const staticReport = stat.status === 'fulfilled' ? stat.value : null;
      setStaticCoverage(staticReport);
      setCoverage(liveReport ?? staticReport);
      setCoverageOrigin(liveReport ? 'live' : staticReport ? 'static' : null);
      if (!liveReport && !staticReport) {
        setCoverageError('Sem az élő PHP-jelentés, sem a statikus forrásleltár nem érhető el.');
      } else {
        setCoverageError('');
      }
    };
    void readCoverage();
    return () => { cancelled = true; };
  }, [load]);

  const liveSourceNames = new Set(coverageOrigin === 'live' ? coverage?.sources.map(item => item.source) : []);
  const staticSourceNames = new Set(staticCoverage?.sources.map(item => item.source) ?? []);
  const staticOnly = coverageOrigin === 'live'
    ? (staticCoverage?.sources ?? []).filter(item => !liveSourceNames.has(item.source))
    : [];
  const liveOnly = coverageOrigin === 'live'
    ? (coverage?.sources ?? []).filter(item => !staticSourceNames.has(item.source))
    : [];

  const uploadSource = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!sourceFile || !sourceTitle.trim() || busy) return;
    setError(''); setMessage(''); setBusy(true);
    try {
      if (sourceFile.size > 300000 || !/\.(txt|md)$/i.test(sourceFile.name)) {
        throw new Error('Csak legfeljebb 300 KB méretű .txt vagy .md fájlt tölthetsz fel.');
      }
      const data = new FormData();
      data.append('file', sourceFile);
      data.append('title', sourceTitle.trim());
      const response = await apiFetch('/api/admin/source-upload', { method: 'POST', body: data });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Nem sikerült feltölteni a forrást.');
      setSourceFile(null); setSourceTitle('');
      const chooser = document.getElementById('tutor-source-file') as HTMLInputElement | null;
      if (chooser) chooser.value = '';
      setMessage('Forrás feltöltve. A Tanársegéd azonnal kereshet benne.');
      await load(search);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Feltöltési hiba.');
    } finally { setBusy(false); }
  };

  const action = async (route: string, payload: object, success: string) => {
    setBusy(true); setError(''); setMessage('');
    try {
      const response = await apiFetch('/api/admin/' + route, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'A művelet sikertelen.');
      setMessage(result.message || success);
      await load(search);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Váratlan hiba.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-5 py-8 text-slate-900">
      <h2 className="font-serif-cormorant text-3xl font-semibold mb-2">Felhasználók és meghívók</h2>
      <p className="text-sm text-slate-600 mb-5">Az adminisztráció kizárólag jogosult fiókkal érhető el. A meghívókat a rendszer automatikusan e-mailben küldi.</p>
      {message && <p role="status" className="mb-3 text-sm text-emerald-700">{message}</p>}
      {error && <p role="alert" className="mb-3 text-sm text-red-700">{error}</p>}
      <form className="rounded-xl border bg-white p-5 mb-6 flex flex-wrap gap-3 items-end"
        onSubmit={e => { e.preventDefault(); if (email.trim()) void action('invite', { email: email.trim() }, 'Meghívó elküldve.').then(() => setEmail('')); }}>
        <label className="text-sm flex-1 min-w-56">Új hallgató meghívása
          <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="hallgato@pelda.hu" maxLength={254}
            className="block w-full mt-1 rounded-lg border border-slate-300 p-2" />
        </label>
        <button disabled={busy} className="rounded-lg bg-indigo-600 text-white px-4 py-2 disabled:opacity-50">Meghívó küldése</button>
      </form>
      <div className="rounded-xl border bg-white p-5 mb-6">
        <h3 className="font-bold mb-3">Felhasználók</h3>
        <form onSubmit={e => {e.preventDefault();void load(search).catch(err=>setError(err.message));}} className="flex gap-2 mb-4">
          <input aria-label="Felhasználó keresése" value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Név vagy e-mail keresése" className="flex-1 border rounded-lg px-3 py-2" />
          <button className="border rounded-lg px-4 py-2">Keresés</button>
        </form>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead><tr className="text-left border-b"><th className="py-2">Név</th><th>E-mail</th><th>Jogosultság</th><th>Visszaigazolva</th></tr></thead>
            <tbody>{users.map(u => <tr key={u.id} className="border-b">
              <td className="py-3 pr-3">{u.display_name}</td><td className="pr-3">{u.email}</td>
              <td className="pr-3">
                {u.role === 'admin' ? <strong>Admin</strong> :
                  <select aria-label={u.email + ' jogosultsága'} disabled={busy} value={u.role}
                    onChange={e=>void action('set-role',{userId:u.id,role:e.target.value},'Jogosultság módosítva.')}>
                    <option value="student">Hallgató</option><option value="teacher">Oktató</option>
                  </select>}
              </td><td>{u.email_verified_at ? 'Igen' : 'Nem'}</td>
            </tr>)}</tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 mt-3">Maximum 100 találat; további kereséshez szűkítsd a keresőkifejezést. Admin jogot itt nem lehet kiosztani.</p>
      </div>
      <section className="rounded-xl border bg-white p-5 mb-6" aria-label="Forráslefedettség">
        <h3 className="font-bold text-lg mb-2">Tanársegéd – forráslefedettségi ellenőrzés</h3>
        <p className="text-sm text-slate-600 mb-4">Elsősorban az éppen futó PHP Tanársegéd keresőindexének élő kimutatása (helyi fejlesztéskor csomagjelentés). A számláló nem jelenti azt, hogy az AI minden kérdésre helyesen válaszol.</p>
        {coverageError && <p role="alert" className="text-red-700 text-sm">{coverageError}</p>}
        {!coverage && !coverageError && <p className="text-sm">A forrásjegyzék betöltése...</p>}
        {coverage && <>
          {coverageOrigin === 'live' ? (
            <p role="status" className="mb-3 text-sm font-semibold text-emerald-800">Élő PHP keresőindex – a kiszolgáló ténylegesen használt szövegrészletei.</p>
          ) : (
            <p role="alert" className="mb-3 text-sm font-semibold text-amber-800">
              Az élő PHP keresőindex nem érhető el. Az alábbi számok kizárólag a buildkor létrehozott statikus forrásleltárból származnak, és nem bizonyítják a szerver aktuális tartalmát.
            </p>
          )}
          {coverageOrigin === 'live' && staticCoverage && (
            <div className="mb-4 rounded-lg border border-slate-200 p-3 text-sm">
              <p className="font-semibold mb-1">Élő PHP és statikus csomagjelentés összehasonlítása</p>
              <p>PHP: {coverage.sources.length} forráscsoport, {coverage.indexChunks} szövegrész · Csomag: {staticCoverage.sources.length} forráscsoport, {staticCoverage.indexChunks} szövegrész.</p>
              {((coverage.indexChunks !== staticCoverage.indexChunks || liveOnly.length > 0 || staticOnly.length > 0)) && (
                <p className="mt-1 text-amber-800">A két jelentés eltér. Más adatforrások és indexelési szabályok is okozhatják az eltérést; ez önmagában nem bizonyít adatvesztést.</p>
              )}
              {(staticOnly.length > 0 || liveOnly.length > 0) && (
                <details className="mt-2">
                  <summary className="cursor-pointer font-semibold">Forráscsoport-eltérések (csak név alapján)</summary>
                  <p className="mt-2">Csak a csomagleltárban ({staticOnly.length}): {staticOnly.map(item => item.source).join('; ') || 'nincs'}</p>
                  <p className="mt-2">Csak az élő PHP-indexben ({liveOnly.length}): {liveOnly.map(item => item.source).join('; ') || 'nincs'}</p>
                </details>
              )}
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
            <div className="rounded-lg bg-indigo-50 p-3"><strong className="block text-xl">{coverage.sources.length}</strong>Indexelt forráscsoport</div>
            <div className="rounded-lg bg-indigo-50 p-3"><strong className="block text-xl">{coverage.indexChunks}</strong>Indexelt szövegrész</div>
            <div className="rounded-lg bg-indigo-50 p-3"><strong className="block text-xl">{Math.round(coverage.indexedCharacters/1000)} ezer</strong>Karakter</div>
            <div className="rounded-lg bg-indigo-50 p-3"><strong className="block text-xl">{sources.length}</strong>Külön feltöltött forrás (PHP)</div>
          </div>
          <p className="text-xs text-slate-500 mb-3">Jelentés készült: {coverage.generatedAt}. Mérés: {coverageOrigin === 'live' ? 'élő PHP' : 'statikus csomag'}. A külön feltöltött források csak az élő PHP-jelentésbe kerülnek be.</p>
          <details className="mb-3"><summary className="cursor-pointer font-semibold">Indexelt dokumentumok – részletes bontás</summary>
            <div className="overflow-x-auto mt-2"><table className="w-full text-xs">
              <thead><tr className="border-b text-left"><th className="p-2">Forrás</th><th className="p-2">Részlet</th><th className="p-2">Karakter</th></tr></thead>
              <tbody>{coverage.sources.map((item,i)=><tr key={i} className="border-b"><td className="p-2 break-all">{item.source}</td><td className="p-2">{item.chunks}</td><td className="p-2">{item.characters.toLocaleString('hu-HU')}</td></tr>)}</tbody>
            </table></div></details>
          {coverage.missing.length>0 && <div className="text-red-800 text-sm mb-3"><strong>Hiányzó kötelező fájlok:</strong> {coverage.missing.join(', ')}</div>}
          <details className="mb-3" open={coverage.omitted.length>0}><summary className="cursor-pointer font-semibold">Nem indexelt fájlok ({coverage.omitted.length})</summary>
            {coverage.omitted.map(item=><p key={item.file} className="text-sm mt-2"><strong>{item.file}</strong> – {item.reason}</p>)}
          </details>
          <details><summary className="cursor-pointer font-semibold">A jelentés korlátai</summary>
            <ul className="list-disc pl-6 text-sm mt-2 space-y-1">{coverage.limitations.map(item=><li key={item}>{item}</li>)}</ul>
          </details>
        </>}
      </section>
      <section className="rounded-xl border bg-white p-5 mb-6" aria-label="Tanársegéd tudásforrásai">
        <h3 className="font-bold mb-2">Tanársegéd – további források</h3>
        <p className="text-sm text-slate-600 mb-4">
          Ellenőrzött UTF-8 szövegeket tölthetsz fel, amelyeket a helyi kereső azonnal használ.
          PDF-et és automatikus OCR-átiratot előbb szakmailag ellenőrizni és szöveggé alakítani kell.
        </p>
        <form onSubmit={uploadSource} className="grid gap-3 mb-5">
          <label className="text-sm">Forrás címe
            <input value={sourceTitle} onChange={e=>setSourceTitle(e.target.value)}
              required maxLength={120} placeholder="Szerző – cím, kiadás" className="block w-full mt-1 p-2 rounded-lg border border-slate-300" />
          </label>
          <label className="text-sm">Szövegfájl (.txt vagy .md, legfeljebb 300 KB)
            <input id="tutor-source-file" type="file" accept=".txt,.md,text/plain,text/markdown"
              required onChange={e=>setSourceFile(e.target.files?.[0] ?? null)}
              className="block w-full mt-1 rounded-lg border border-slate-300 p-2" />
          </label>
          <div><button disabled={busy || !sourceFile || !sourceTitle.trim()}
            className="rounded-lg bg-indigo-600 text-white px-4 py-2 disabled:opacity-50">Forrás feltöltése</button></div>
        </form>
        {sources.length === 0 && <p className="text-sm text-slate-500">Még nincs külön feltöltött forrás.</p>}
        {sources.map(source => (
          <div key={source.id} className="flex flex-wrap items-center justify-between gap-2 py-3 border-t text-sm">
            <div><strong>{source.title}</strong><p className="text-xs text-slate-500">{(source.size / 1024).toFixed(1)} KB · {source.createdAt}</p></div>
            <button type="button" disabled={busy} className="text-red-700 underline disabled:opacity-50"
              onClick={() => {
                if (window.confirm('Biztosan eltávolítod ezt a forrást a Tanársegédből?')) {
                  void action('source-delete',{id:source.id},'Forrás eltávolítva.');
                }
              }}>Eltávolítás</button>
          </div>
        ))}
        <p className="text-xs text-slate-500 mt-3">
          Az anyagok a webgyökéren kívül tárolódnak; a feltöltött források nem válnak nyilvánosan letölthetővé.
        </p>
      </section>
      <div className="rounded-xl border bg-white p-5">
        <h3 className="font-bold mb-3">Meghívók</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead><tr className="text-left border-b"><th className="py-2">E-mail</th><th>Létrehozva</th><th>Lejárat</th><th>Állapot</th><th></th></tr></thead>
            <tbody>{invites.map(inv => <tr className="border-b" key={inv.id}>
              <td className="py-3 pr-3">{inv.email}</td><td className="pr-3">{inv.created_at}</td>
              <td className="pr-3">{inv.expires_at}</td>
              <td className="pr-3">{inv.used_at ? 'Felhasznált' : new Date(inv.expires_at.replace(' ','T')+'Z').getTime() < Date.now() ? 'Lejárt' : 'Függőben'}</td>
              <td>{!inv.used_at && <button type="button" disabled={busy} className="text-red-700 underline disabled:opacity-40"
                onClick={() => {if(window.confirm('Visszavonod ezt a meghívót?')) void action('revoke-invite',{id:inv.id},'Meghívó visszavonva.');}}>
                  Visszavonás</button>}</td>
            </tr>)}</tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
