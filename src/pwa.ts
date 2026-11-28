/** Secure, no-push PWA registration. User accepts updates explicitly. */
let registration: ServiceWorkerRegistration | null = null;
let activationRequested = false;

export function activatePwaUpdate(): void {
  if (!registration?.waiting) return;
  activationRequested = true;
  registration.waiting.postMessage({ type: 'SKIP_WAITING' });
}

export function registerPwa(): void {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
  if (!window.isSecureContext) return;

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (activationRequested) window.location.reload();
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).then(reg => {
      registration = reg;
      const notify = () => {
        if (reg.waiting && navigator.serviceWorker.controller) {
          window.dispatchEvent(new Event('zeneelmelet-pwa-update-ready'));
        }
      };
      notify();
      reg.addEventListener('updatefound', () => {
        const installing = reg.installing;
        if (!installing) return;
        installing.addEventListener('statechange', () => {
          if (installing.state === 'installed') notify();
        });
      });
      // One network check per fresh page visit, no background polling.
      void reg.update().catch(() => undefined);
    }).catch(() => {
      // Registration failure must never break regular web learning.
    });
  }, { once: true });
}
