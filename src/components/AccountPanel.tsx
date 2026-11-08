import { apiFetch } from '../api';
import React, { useEffect, useState } from 'react';
import { LogIn, LogOut, UserRoundPlus, Cloud, AlertCircle } from 'lucide-react';
import { pendingProgressKey, safeBrowserStorage } from '../pendingProgress';

export interface AccountUser {
  id: string;
  email: string;
  displayName: string;
  role: 'student' | 'teacher' | 'admin';
}

interface AccountPanelProps {
  user: AccountUser | null;
  onSignedIn: (user: AccountUser) => Promise<void>;
  onSignedOut: () => void;
  onImportLocal: () => void;
  syncError?: string;
  onRetrySync?: () => void;
  hasUnsavedProgress?: boolean;
}

export const AccountPanel: React.FC<AccountPanelProps> = ({
  user, onSignedIn, onSignedOut, onImportLocal, syncError, onRetrySync, hasUnsavedProgress = false
}) => {
  const [available, setAvailable] = useState(false);
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [mode, setMode] = useState<'login' | 'register' | 'reset-request' | 'reset' | 'resend-verification' | 'change-password' | 'delete-account'>('login');
  const [accountToken, setAccountToken] = useState('');
  const [success, setSuccess] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [invitationCode, setInvitationCode] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [invitationRequired, setInvitationRequired] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    // Prefer fragment tokens: they never reach HTTP server logs or referrer headers.
    const fragment = new URLSearchParams(url.hash.startsWith('#') ? url.hash.slice(1) : '');
    const token = fragment.get('token') || url.searchParams.get('token');
    const action = fragment.get('account') || url.searchParams.get('account');
    if (!token || !['verify', 'reset'].includes(action || '')) return;
    url.searchParams.delete('token');
    url.searchParams.delete('account');
    url.hash = '';
    window.history.replaceState(null, '', url.pathname + url.search + url.hash);
    if (action === 'reset') {
      setAccountToken(token);
      setMode('reset');
      setSuccess('Adj meg egy új jelszót a fiókodhoz.');
      return;
    }
    void (async () => {
      try {
        const response = await apiFetch('/api/auth/verify', {
          method: 'POST', headers: {'Content-Type':'application/json'},
          body: JSON.stringify({token})
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Nem sikerült a megerősítés.');
        setSuccess('Az e-mail-címedet megerősítettük. Most már bejelentkezhetsz.');
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : 'Nem sikerült a megerősítés.');
      }
    })();
  }, []);

  useEffect(() => {
    apiFetch('/api/auth/status', { credentials: 'same-origin' })
      .then(async response => {
        if (!response.ok) throw new Error('A szerver nem válaszolt.');
        const data = await response.json();
        setAvailable(data.available === true);
        setRegistrationEnabled(data.registrationEnabled !== false);
        setInvitationRequired(data.invitationRequired === true);
      })
      .catch(() => setAvailable(false))
      .finally(() => setLoadingStatus(false));
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    // Both password change and erasure can discard unsynced work. Explain
    // the consequence of the specific action before issuing a server request.
    if ((mode === 'change-password' || mode === 'delete-account') && hasUnsavedProgress && !window.confirm(
      'A legutóbbi tanulási eredményeid még nem kerültek a szerverre. ' +
      (mode === 'delete-account'
        ? 'A fiók törlése a függőben lévő helyi mentést is eltávolítja, ezért ezek az adatok elvesznek. '
        : 'A jelszó módosítása minden eszközön kijelentkeztethet, így ezek elveszhetnek. ') +
      'Biztosan folytatod?'
    )) return;
    if (mode === 'delete-account' && !window.confirm(
      'A fiók és minden szerveroldali tanulási eredmény véglegesen törlődik. ' +
      'Ez a művelet nem vonható vissza. Biztosan kéred a törlést?'
    )) return;
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      const route = mode === 'resend-verification' ? 'resend-verification' : mode === 'reset-request' ? 'reset-request'
        : mode === 'reset' ? 'reset' : mode === 'change-password' ? 'change-password' : mode === 'delete-account' ? 'delete-account' : mode;
      const payload = (mode === 'resend-verification' || mode === 'reset-request') ? { email }
        : mode === 'reset' ? { token: accountToken, password: newPassword }
        : mode === 'change-password' ? { currentPassword: password, newPassword }
        : mode === 'delete-account' ? { currentPassword: password, confirmation: deleteConfirmation }
        : { email, password, ...(mode === 'register' ? { displayName, invitationCode: invitationCode.trim() } : {}) };
      const response = await apiFetch(`/api/auth/${route}`, {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Nem sikerült a művelet.');
      setPassword('');
      setNewPassword('');
      setInvitationCode('');
      if (mode === 'register') {
        setSuccess(data.message || 'Ellenőrizd a postafiókodat és erősítsd meg az e-mail-címedet.');
        setMode('login');
      } else if (mode === 'resend-verification') {
        setSuccess(data.message || 'Ha a fiók megerősítésre vár, új levelet küldtünk.');
        setMode('login');
      } else if (mode === 'reset-request') {
        setSuccess(data.message || 'Ha létezik a fiók, küldtünk egy levelet.');
        setMode('login');
      } else if (mode === 'reset') {
        setAccountToken('');
        setSuccess('Az új jelszavadat mentettük. Jelentkezz be!');
        setMode('login');
      } else if (mode === 'change-password') {
        onSignedOut();
        setMode('login');
        setSuccess('A jelszavadat módosítottuk, minden eszközön kijelentkeztettünk. Jelentkezz be újra!');
      } else if (mode === 'delete-account') {
        // This browser may contain an offline snapshot of the deleted account.
        // Remove only that account's scoped pending data, not other users' data.
        try { safeBrowserStorage()?.removeItem(pendingProgressKey(user!.id)); } catch { /* storage may be blocked */ }
        setDeleteConfirmation('');
        onSignedOut();
        setMode('login');
        setSuccess('A fiókod törölve. Az ehhez az eszközhöz tartozó függőben lévő fiókmentést is eltávolítottuk.');
      } else {
        await onSignedIn(data.user as AccountUser);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Ismeretlen hiba.');
    } finally {
      setBusy(false);
    }
  };

  const exportPersonalData = async () => {
    if (!user || busy) return;
    if (hasUnsavedProgress) {
      setError('Az exportálás előtt várd meg a tanulási eredmények szerveroldali mentését, hogy ne maradjanak ki a legutóbbi változások.');
      return;
    }
    setBusy(true); setError(''); setSuccess('');
    try {
      const response = await apiFetch('/api/auth/export-data', {credentials:'same-origin'});
      if (!response.ok) throw new Error('A személyes adatok exportálása nem sikerült.');
      const payload = await response.json();
      if (payload?.format !== 'zeneelmeleti-muhely-personal-data-v1' ||
          payload?.profile?.id !== user.id)
        throw new Error('A kiszolgáló nem a megfelelő fiók adatait adta vissza.');
      const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json;charset=utf-8'});
      const href = URL.createObjectURL(blob);
      try {
        const anchor = document.createElement('a');
        anchor.href = href;
        anchor.download = 'zeneelmeleti-muhely-sajat-adataim-' + new Date().toISOString().slice(0,10) + '.json';
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
      } finally {
        URL.revokeObjectURL(href);
      }
      setSuccess('A személyes adataid JSON formátumban letöltésre kerültek.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Az exportálás nem sikerült.');
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    if (hasUnsavedProgress && !window.confirm(
      'A legutóbbi tanulási eredményeid még nem kerültek a szerverre. ' +
      'Ha most kijelentkezel, ezek elveszhetnek. Biztosan kijelentkezel?'
    )) return;
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
      {!user && syncError && <p role="alert" className="mb-3 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-950">{syncError}</p>}
      {loadingStatus ? (
        <p className="text-sm text-slate-500">Fiókszolgáltatás ellenőrzése…</p>
      ) : !available ? (
        <div className="flex gap-3 text-sm text-slate-600">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
          <p>A fiókrendszer fejlesztői előnézete elkészült, de ezen a szerveren még nincs beállítva a MySQL-kapcsolat. A helyi tanulási eredményeid továbbra is elérhetők. A szerveroldali regisztráció a beállítás után aktiválódik.</p>
        </div>
      ) : user && mode === 'delete-account' ? (
        <form className="grid gap-3 max-w-md" onSubmit={submit}>
          <h4 className="font-semibold text-rose-800">Fiók végleges törlése</h4>
          <p className="text-sm text-rose-800">
            Ez törli a fiókodat, a szerveren mentett tanulási eredményeidet, a munkameneteidet és a hozzájuk tartozó meghívókat.
            A korábbi, külön készített üzemeltetői biztonsági mentésekben az adatok átmenetileg még szerepelhetnek.
          </p>
          {hasUnsavedProgress && <p role="alert" className="text-sm font-semibold text-amber-800">Vannak még szinkronizálatlan eredményeid, amelyek törlődnek.</p>}
          <label className="text-sm">Jelenlegi jelszó
            <input required type="password" autoComplete="current-password" maxLength={128} value={password}
              onChange={e=>setPassword(e.target.value)} className="block w-full mt-1 rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          <label className="text-sm">A megerősítéshez írd be pontosan: FIÓKOM TÖRLÉSE
            <input required type="text" autoComplete="off" value={deleteConfirmation}
              onChange={e=>setDeleteConfirmation(e.target.value)} className="block w-full mt-1 rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}
          <button type="submit" disabled={busy || deleteConfirmation !== 'FIÓKOM TÖRLÉSE'}
            className="rounded-lg bg-rose-700 p-2 text-white disabled:opacity-50">
            {busy ? 'Törlés folyamatban…' : 'Fiókom és adataim végleges törlése'}
          </button>
          <button type="button" onClick={()=>{setMode('login');setPassword('');setDeleteConfirmation('');setError('');}}
            className="text-sm text-slate-600">Mégse</button>
        </form>
      ) : user && mode === 'change-password' ? (
        <form className="grid gap-3 max-w-md" onSubmit={submit}>
          <h4 className="font-semibold">Jelszó módosítása</h4>
          <label className="text-sm">Jelenlegi jelszó
            <input required type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full mt-1 rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          <label className="text-sm">Új jelszó (legalább 12 karakter)
            <input required type="password" autoComplete="new-password" minLength={12} maxLength={128} value={newPassword} onChange={e=>setNewPassword(e.target.value)} className="w-full mt-1 rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}
          <button type="submit" disabled={busy} className="bg-indigo-600 text-white rounded-lg p-2">{busy?'Mentés…':'Jelszó mentése és kijelentkezés'}</button>
          <button type="button" onClick={()=>setMode('login')} className="text-sm text-slate-600">Mégse</button>
        </form>
      ) : user ? (
        <div>
          <p className="text-sm text-slate-600">Bejelentkezve: <strong>{user.displayName}</strong> ({user.email})</p>
          <p className="text-sm text-emerald-700 mt-2">Az eredmények automatikusan mentésre kerülnek a saját fiókodba.</p>
          <p className="text-xs text-slate-600 mt-1">Kapcsolatszakadáskor a még nem szinkronizált eredmények ideiglenes másolata ezen a böngészőn, a fiókodhoz elkülönítve tárolódik. Közös gépen jelentkezz ki, és ügyelj a böngészőadatok védelmére.</p>
          {hasUnsavedProgress && <p role="status" className="text-sm font-semibold text-amber-800 mt-2">Mentés folyamatban – az utolsó változások még nem érkeztek meg a szerverre.</p>}
          {syncError && <div role="alert" className="mt-2 text-sm text-rose-700">
            <p>{syncError}</p>
            <button type="button" onClick={onRetrySync}
              className="mt-2 rounded-lg border border-rose-300 px-3 py-2 font-semibold hover:bg-rose-50">
              Eredmények mentésének újrapróbálása
            </button>
          </div>}
          {success && <p role="status" className="text-sm text-emerald-700 mt-2">{success}</p>}
          {error && <p role="alert" className="text-sm text-rose-700 mt-2">{error}</p>}
          <div className="flex flex-wrap gap-2 mt-4">
            <button type="button" onClick={onImportLocal} className="rounded-lg px-4 py-2 bg-indigo-600 text-white text-sm hover:bg-indigo-500">Korábbi helyi eredmények átvitele</button>
            <button type="button" disabled={busy || hasUnsavedProgress} onClick={()=>{void exportPersonalData();}}
              title={hasUnsavedProgress ? 'Az export előtt várd meg az eredmények szinkronizálását.' : undefined}
              className="rounded-lg px-4 py-2 border border-slate-300 text-slate-800 text-sm hover:bg-slate-100 disabled:opacity-50">
              Saját adataim exportálása (JSON)
            </button>
            <button type="button" onClick={() => {setMode('change-password');setError('');}} className="rounded-lg px-4 py-2 border border-indigo-300 text-indigo-700 text-sm hover:bg-indigo-50">Jelszó módosítása</button>
            <button type="button" disabled={busy} onClick={signOut} className="rounded-lg px-4 py-2 border border-slate-300 text-slate-700 text-sm hover:bg-slate-100 flex items-center gap-2"><LogOut className="w-4 h-4" />Kijelentkezés</button>
            {user.role !== 'admin' && (
              <button type="button" disabled={busy}
                onClick={()=>{setMode('delete-account');setPassword('');setDeleteConfirmation('');setError('');}}
                className="rounded-lg px-4 py-2 border border-rose-300 text-rose-800 text-sm hover:bg-rose-50">
                Fiók törlése
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-3">Az átvitel megtartja a teljesítéseket és a legjobb kvízeredményeket. A két XP-érték közül a nagyobbat őrzi meg, nem adja őket össze. A párhuzamos gyakorlások összes pontja utólag nem állítható helyre.</p>
        </div>
      ) : (
        <div>
          <div className="flex gap-2 mb-4">
            <button type="button" onClick={() => {setMode('login');setError('');}} className={`text-sm rounded-lg px-3 py-2 ${mode === 'login' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}>Bejelentkezés</button>
            <button type="button" disabled={!registrationEnabled} onClick={() => {setMode('register');setError('');}} className={`text-sm rounded-lg px-3 py-2 disabled:opacity-40 disabled:cursor-not-allowed ${mode === 'register' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}>Regisztráció</button>
          </div>
          {!registrationEnabled && <p className="text-sm text-amber-700 mb-3">A regisztráció jelenleg zárva van. A bejelentkezés meglévő fiókkal lehetséges.</p>}
          {registrationEnabled && invitationRequired && <p className="text-sm text-indigo-700 mb-3">Regisztráció csak személyre szóló, egyszer használható meghívókóddal lehetséges.</p>}
          {(mode === 'login' || mode === 'reset-request' || mode === 'resend-verification') && (
            <button type="button" onClick={() => {setMode(mode === 'login' ? 'reset-request' : 'login');setError('');}}
              className="text-sm text-indigo-700 underline mb-3">
              {mode === 'login' ? 'Elfelejtetted a jelszavad?' : 'Vissza a bejelentkezéshez'}
            </button>
          )}
          {mode === 'login' && (
            <button type="button" onClick={() => {setMode('resend-verification');setError('');}} className="text-sm text-indigo-700 underline block mb-3">
              Új megerősítő e-mail kérése
            </button>
          )}
          {success && <p role="status" className="text-sm text-emerald-700 mb-3">{success}</p>}
          <form onSubmit={submit} className="grid gap-3 max-w-md">
            {mode === 'register' && (
              <label className="text-sm">Név
                <input required minLength={2} maxLength={120} autoComplete="name" value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full mt-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900" />
              </label>
            )}
            {mode === 'register' && invitationRequired && (
              <label className="text-sm">Meghívókód
                <input required type="text" autoComplete="off" inputMode="text" minLength={64} maxLength={64} spellCheck={false}
                  value={invitationCode} onChange={e => setInvitationCode(e.target.value)}
                  placeholder="Az e-mailben kapott 64 karakteres kód"
                  className="w-full mt-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 font-mono text-sm" />
              </label>
            )}
            {mode !== 'reset' && (
              <label className="text-sm">E-mail-cím
                <input required type="email" maxLength={254} autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full mt-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900" />
              </label>
            )}
            {(mode === 'login' || mode === 'register') && (
              <label className="text-sm">Jelszó {mode === 'register' && <span className="text-slate-500">(legalább 12 karakter)</span>}
                <input required type="password" minLength={mode === 'register' ? 12 : undefined} maxLength={128} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full mt-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900" />
              </label>
            )}
            {mode === 'reset' && (
              <label className="text-sm">Új jelszó (legalább 12 karakter)
                <input required type="password" minLength={12} maxLength={128} autoComplete="new-password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full mt-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900" />
              </label>
            )}
            {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}
            <button disabled={busy} type="submit" className="flex items-center justify-center gap-2 rounded-lg px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60">
              {mode === 'register' ? <UserRoundPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              {busy ? 'Folyamatban…' : mode === 'register' ? 'Fiók létrehozása' : mode === 'resend-verification' ? 'Megerősítő levél újraküldése' : mode === 'reset-request' ? 'Helyreállító e-mail küldése' : mode === 'reset' ? 'Új jelszó mentése' : 'Bejelentkezés'}
            </button>
          </form>
          <p className="text-xs text-slate-500 mt-3">A fiók jelenleg csak hallgatói jogosultsággal jön létre. Az oktatói szerepkör külön engedélyezést igényel.</p>
        </div>
      )}
    </section>
  );
};
