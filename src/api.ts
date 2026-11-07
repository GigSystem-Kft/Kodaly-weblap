/** Use direct PHP script URLs on CloudPanel; retain Express routes for local dev. */
export function apiUrl(path: string): string {
  if (!import.meta.env.VITE_PHP_API) return path;
  if (!path.startsWith('/api/')) throw new Error('Érvénytelen API útvonal');
  const url = new URL(path, 'https://zeneelmelet.digitaliskottatar.hu');
  const route = url.pathname.slice('/api/'.length);
  const params = new URLSearchParams(url.search);
  params.set('route', route);
  return '/api/index.php?' + params.toString();
}

export function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  const headers = new Headers(options?.headers);
  // Non-simple request header ensures cross-site browser forms cannot mutate cookie sessions.
  if (options?.method && !['GET', 'HEAD'].includes(options.method.toUpperCase())) {
    headers.set('X-Requested-With', 'XMLHttpRequest');
  }
  return fetch(apiUrl(path), { ...options, headers, credentials: 'same-origin' });
}
