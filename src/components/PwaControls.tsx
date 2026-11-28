import React, { useEffect, useState } from 'react';
import { activatePwaUpdate } from '../pwa';

type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export function PwaControls() {
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [updateReady, setUpdateReady] = useState(false);
  const [installed, setInstalled] = useState(
    () => window.matchMedia('(display-mode: standalone)').matches ||
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
  );
  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPrompt(event as InstallPrompt);
    };
    const onInstalled = () => { setInstalled(true); setPrompt(null); setShowHelp(false); };
    const onUpdate = () => setUpdateReady(true);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    window.addEventListener('zeneelmelet-pwa-update-ready', onUpdate);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
      window.removeEventListener('zeneelmelet-pwa-update-ready', onUpdate);
    };
  }, []);
  const install = async () => {
    if (prompt) {
      // Native browser prompt runs only after direct user interaction.
      await prompt.prompt();
      await prompt.userChoice.catch(() => null);
      setPrompt(null);
    } else {
      setShowHelp(open => !open);
    }
  };
  if (installed && !updateReady) return null;
  const isAppleMobile = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  return (
    <div className="flex flex-col gap-2 text-xs" aria-label="Alkalmazás telepítése és frissítése">
      <div className="flex items-center gap-2 flex-wrap">
        {!installed && (
          <button type="button" className="underline underline-offset-4 font-semibold focus-visible:outline-2 focus-visible:outline-indigo-700"
            onClick={() => { void install(); }}>
            Alkalmazás telepítése
          </button>
        )}
        {updateReady && (
          <button type="button" className="rounded border border-indigo-700 px-3 py-1 font-bold text-indigo-800 focus-visible:outline-2 focus-visible:outline-indigo-700"
            onClick={activatePwaUpdate}>
            Új verzió elérhető – frissítés
          </button>
        )}
      </div>
      {showHelp && <p className="max-w-sm text-slate-700" role="status">
        {isAppleMobile
          ? 'iPhone/iPad: nyisd meg Safariban → Megosztás → Hozzáadás a Főképernyőhöz.'
          : 'Chrome/Edge: böngésző menüje → Alkalmazás telepítése (vagy a címsor telepítési ikonja).'}
        {' '}A tanulói eredmények szinkronizálása internetet és bejelentkezést igényel.
      </p>}
    </div>
  );
}
