import { apiFetch } from '../api';
import React, { useEffect, useState } from 'react';
import { LogIn, LogOut, UserRoundPlus, Cloud, AlertCircle } from 'lucide-react';

export interface AccountUser {
  id: string;
  email: string;
  displayName: string;
  role: 'student' | 'teacher';
}

interface AccountPanelProps {
  user: AccountUser | null;
  onSignedIn: (user: AccountUser) => Promise<void>;
  onSignedOut: () => void;
  onImportLocal: () => void;
  syncError?: string;
}

export const AccountPanel: React.FC<AccountPanelProps> = ({
  user, onSignedIn, onSignedOut, onImportLocal, syncError
}) => {
  const [available, setAvailable] = useState(false);
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    apiFetch('/api/auth/status', { credentials: 'same-origin' })
      .then(async response => {
        if (!response.ok) throw new Error('A szerver nem válaszolt.');
        const data = await response.json();
        setAvailable(data.available === true);
        setRegistrationEnabled(data.registrationEnabled !== false);
      })
      .catch(() => setAvailable(false))
      .finally(() => setLoadingStatus(false));
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const response = await apiFetch(`/api/auth/${mode}`, {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, ...(mode === 'register' ? { displayName } : {}) })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Nem sikerült a bejelentkezés.');
      setPassword('');
      await onSignedIn(data.user as AccountUser);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Ismeretlen hiba.');
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    setBusy(true);
    setError('');
    try {
      const response = await apiFetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
      if (!response.ok) throw new Error('Nem sikerült a kijelentkezés.');
      onSignedOut();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Kijelentkezési hiba.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white text-slate-900 p-6 mb-8">
      <div className="flex items-center gap-2 mb-3">
        <Cloud className="w-5 h-5 text-indigo-600" />
        <h3 className="font-bold text-lg">Hallgatói fiók</h3>
      </div>
      {loadingStatus ? (
        <p className="text-sm text-slate-500">Fiókszolgáltatás ellenőrzése…</p>
      ) : !available ? (
        <div className="flex gap-3 text-sm text-slate-600">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
          <p>A fiókrendszer fejlesztői előnézete elkészült, de ezen a szerveren még nincs beállítva a MySQL-kapcsolat. A helyi tanulási eredményeid továbbra is elérhetők. A szerveroldali regisztráció a beállítás után aktiválódik.</p>
        </div>
      ) : user ? (
        <div>
          <p className="text-sm text-slate-600">Bejelentkezve: <strong>{user.displayName}</strong> ({user.email})</p>
          <p className="text-sm text-emerald-700 mt-2">Az eredmények automatikusan mentésre kerülnek a saját fiókodba.</p>
          {syncError && <p role="alert" className="text-sm text-rose-600 mt-2">{syncError}</p>}
          <div className="flex flex-wrap gap-2 mt-4">
            <button type="button" onClick={onImportLocal} className="rounded-lg px-4 py-2 bg-indigo-600 text-white text-sm hover:bg-indigo-500">Korábbi helyi eredmények átvitele</button>
            <button type="button" disabled={busy} onClick={signOut} className="rounded-lg px-4 py-2 border border-slate-300 text-slate-700 text-sm hover:bg-slate-100 flex items-center gap-2"><LogOut className="w-4 h-4" />Kijelentkezés</button>
          </div>
          <p className="text-xs text-slate-500 mt-3">Az átvitel a jelenlegi böngészőben tárolt eredményeket egyesíti a fiók adataival. Nem töröl korábbi teljesítéseket.</p>
        </div>
      ) : (
        <div>
          <div className="flex gap-2 mb-4">
            <button type="button" onClick={() => {setMode('login');setError('');}} className={`text-sm rounded-lg px-3 py-2 ${mode === 'login' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}>Bejelentkezés</button>
            <button type="button" disabled={!registrationEnabled} onClick={() => {setMode('register');setError('');}} className={`text-sm rounded-lg px-3 py-2 disabled:opacity-40 disabled:cursor-not-allowed ${mode === 'register' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}>Regisztráció</button>
          </div>
          {!registrationEnabled && <p className="text-sm text-amber-700 mb-3">A nyilvános regisztrációt még nem nyitottuk meg. A bejelentkezés meglévő fiókkal lehetséges.</p>}
          <form onSubmit={submit} className="grid gap-3 max-w-md">
            {mode === 'register' && (
              <label className="text-sm">Név
                <input required minLength={2} maxLength={120} autoComplete="name" value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full mt-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900" />
              </label>
            )}
            <label className="text-sm">E-mail-cím
              <input required type="email" maxLength={254} autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full mt-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900" />
            </label>
            <label className="text-sm">Jelszó {mode === 'register' && <span className="text-slate-500">(legalább 12 karakter)</span>}
              <input required type="password" minLength={mode === 'register' ? 12 : undefined} maxLength={128} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full mt-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900" />
            </label>
            {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}
            <button disabled={busy} type="submit" className="flex items-center justify-center gap-2 rounded-lg px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60">
              {mode === 'register' ? <UserRoundPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              {busy ? 'Folyamatban…' : mode === 'register' ? 'Fiók létrehozása' : 'Bejelentkezés'}
            </button>
          </form>
          <p className="text-xs text-slate-500 mt-3">A fiók jelenleg csak hallgatói jogosultsággal jön létre. Az oktatói szerepkör külön engedélyezést igényel.</p>
        </div>
      )}
    </section>
  );
};
