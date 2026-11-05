import React, { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '../api';

type User = { id: string; email: string; display_name: string; role: string; created_at: string; email_verified_at: string | null };
type Invite = { id: string; email: string; created_at: string; expires_at: string; used_at: string | null };

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [search, setSearch] = useState('');
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async (query = '') => {
    setError('');
    const [u, i] = await Promise.all([
      apiFetch('/api/admin/users?q=' + encodeURIComponent(query)),
      apiFetch('/api/admin/invitations')
    ]);
    if (!u.ok || !i.ok) throw new Error('Nem sikerült betölteni az adminisztrációs adatokat.');
    setUsers((await u.json()).users);
    setInvites((await i.json()).invitations);
  }, []);

  useEffect(() => {
    void load().catch(e => setError(e instanceof Error ? e.message : 'Betöltési hiba.'));
  }, [load]);

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
