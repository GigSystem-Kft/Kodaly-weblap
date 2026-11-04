import { randomBytes, randomUUID, createHash, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import type { Express, Request, Response, NextFunction } from 'express';
import mysql, { type Pool, type RowDataPacket } from 'mysql2/promise';

const scrypt = promisify(scryptCallback);
const COOKIE = 'zm_session';
const SESSION_DAYS = 7;
const MAX_PROGRESS_BYTES = 64_000;
let pool: Pool | undefined;

export interface AccountUser {
  id: string;
  email: string;
  displayName: string;
  role: 'student' | 'teacher';
}

function db(): Pool {
  if (!process.env.DB_HOST || !process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD) {
    throw new Error('Az adatbázis-kapcsolat nincs konfigurálva.');
  }
  return pool ??= mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 5,
    charset: 'utf8mb4',
    timezone: 'Z'
  });
}
const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');
function cookieToken(req: Request): string | null {
  const match = (req.headers.cookie || '').split(';').map(x => x.trim()).find(x => x.startsWith(COOKIE + '='));
  const token = match?.slice(COOKIE.length + 1);
  return token && /^[a-f0-9]{64}$/.test(token) ? token : null;
}
function sessionCookie(req: Request, token: string, maxAge: number) {
  const secure = process.env.NODE_ENV === 'production';
  return `${COOKIE}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}${secure ? '; Secure' : ''}`;
}
async function passwordDigest(password: string, salt = randomBytes(16).toString('hex')) {
  const result = await scrypt(password, Buffer.from(salt, 'hex'), 64) as Buffer;
  return `${salt}:${result.toString('hex')}`;
}
async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, digest] = stored.split(':');
  if (!salt || !digest || !/^[a-f0-9]{32}$/.test(salt) || !/^[a-f0-9]{128}$/.test(digest)) return false;
  const computed = await scrypt(password, Buffer.from(salt, 'hex'), 64) as Buffer;
  return timingSafeEqual(computed, Buffer.from(digest, 'hex'));
}
async function signedIn(req: Request): Promise<AccountUser | null> {
  const token = cookieToken(req);
  if (!token) return null;
  const [rows] = await db().execute<(RowDataPacket & { id: string; email: string; display_name: string; role: 'student' | 'teacher' })[]>(
    'SELECT u.id, u.email, u.display_name, u.role FROM zm_sessions s JOIN zm_users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > UTC_TIMESTAMP() LIMIT 1',
    [hashToken(token)]
  );
  const user = rows[0];
  return user ? { id: user.id, email: user.email, displayName: user.display_name, role: user.role } : null;
}
async function createSession(req: Request, res: Response, user: AccountUser) {
  const token = randomBytes(32).toString('hex');
  await db().execute(
    'INSERT INTO zm_sessions(token_hash,user_id,expires_at) VALUES(?,?,DATE_ADD(UTC_TIMESTAMP(),INTERVAL 7 DAY))',
    [hashToken(token), user.id]
  );
  res.setHeader('Set-Cookie', sessionCookie(req, token, SESSION_DAYS * 86400));
  return res.json({ user });
}
function appOrigin(req: Request) {
  const explicit = process.env.APP_ORIGIN;
  return explicit ? new URL(explicit).origin : `${req.protocol}://${req.get('host')}`;
}
function checkOrigin(req: Request, res: Response, next: NextFunction) {
  // Same-origin browser requests carry Origin; an explicit APP_ORIGIN is mandatory in production.
  const origin = req.get('origin');
  if ((origin && origin !== appOrigin(req)) || (!origin && process.env.NODE_ENV === 'production')) {
    res.status(403).json({ error: 'Érvénytelen kérésforrás.' });
    return;
  }
  next();
}
const attempts = new Map<string, { count: number; until: number }>();
function limitAuth(req: Request, res: Response, next: NextFunction) {
  const key = req.ip || 'unknown';
  const now = Date.now();
  if (attempts.size > 2000) {
    for (const [k, v] of attempts) if (v.until < now) attempts.delete(k);
  }
  let value = attempts.get(key);
  if (!value || value.until < now) value = { count: 0, until: now + 15 * 60_000 };
  value.count++;
  attempts.set(key, value);
  if (value.count > 20) { res.status(429).json({ error: 'Túl sok próbálkozás. Kérlek, próbáld újra később.' }); return; }
  next();
}
function asyncRoute(handler: (req: Request, res: Response) => Promise<unknown>) {
  return (req: Request, res: Response, next: NextFunction) => { handler(req, res).catch(next); };
}

export function installAccountRoutes(app: Express) {
  app.use('/api/auth', (_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store'); next();
  });

  app.get('/api/auth/status', (_req, res) => {
    res.json({ available: !!(process.env.DB_HOST && process.env.DB_NAME && process.env.DB_USER && process.env.DB_PASSWORD) });
  });
  app.get('/api/auth/me', asyncRoute(async (req, res) => {
    res.json({ user: await signedIn(req) });
  }));

  app.post('/api/auth/register', checkOrigin, limitAuth, asyncRoute(async (req, res) => {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const displayName = typeof req.body?.displayName === 'string' ? req.body.displayName.trim() : '';
    const password = req.body?.password;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || displayName.length < 2 || displayName.length > 120 ||
        typeof password !== 'string' || password.length < 12 || password.length > 128) {
      return res.status(400).json({ error: 'Adj meg érvényes e-mail-címet, nevet (2–120 karakter) és legalább 12 karakteres jelszót.' });
    }
    const user: AccountUser = { id: randomUUID(), email, displayName, role: 'student' };
    try {
      await db().execute(
        'INSERT INTO zm_users(id,email,display_name,password_hash,role) VALUES(?,?,?,?,?)',
        [user.id, email, displayName, await passwordDigest(password), user.role]
      );
    } catch (error) {
      if ((error as { code?: string }).code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Ezzel az e-mail-címmel már létezik fiók.' });
      }
      throw error;
    }
    return createSession(req, res, user);
  }));

  app.post('/api/auth/login', checkOrigin, limitAuth, asyncRoute(async (req, res) => {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = req.body?.password;
    if (email.length > 254 || typeof password !== 'string' || password.length > 128) {
      return res.status(400).json({ error: 'Érvénytelen adatok.' });
    }
    const [rows] = await db().execute<(RowDataPacket & { id: string; email: string; display_name: string; role: 'student' | 'teacher'; password_hash: string })[]>(
      'SELECT id,email,display_name,role,password_hash FROM zm_users WHERE email = ? LIMIT 1', [email]
    );
    const existing = rows[0];
    if (!existing || !(await verifyPassword(password, existing.password_hash))) {
      return res.status(401).json({ error: 'Hibás e-mail-cím vagy jelszó.' });
    }
    return createSession(req, res, {
      id: existing.id, email: existing.email, displayName: existing.display_name, role: existing.role
    });
  }));

  app.post('/api/auth/logout', checkOrigin, asyncRoute(async (req, res) => {
    const token = cookieToken(req);
    if (token) await db().execute('DELETE FROM zm_sessions WHERE token_hash = ?', [hashToken(token)]);
    res.setHeader('Set-Cookie', sessionCookie(req, '', 0));
    res.json({ success: true });
  }));

  app.get('/api/progress', asyncRoute(async (req, res) => {
    const user = await signedIn(req);
    if (!user) return res.status(401).json({ error: 'Bejelentkezés szükséges.' });
    const [rows] = await db().execute<(RowDataPacket & { progress_json: string | object })[]>(
      'SELECT progress_json FROM zm_progress WHERE user_id = ? LIMIT 1', [user.id]
    );
    const stored = rows[0]?.progress_json;
    res.json({ progress: typeof stored === 'string' ? JSON.parse(stored) : stored ?? null });
  }));

  app.put('/api/progress', checkOrigin, asyncRoute(async (req, res) => {
    const user = await signedIn(req);
    if (!user) return res.status(401).json({ error: 'Bejelentkezés szükséges.' });
    const progress = req.body?.progress;
    if (!progress || typeof progress !== 'object' || Array.isArray(progress) ||
      !Array.isArray(progress.completedChapters) || !Array.isArray(progress.flashcardsMastered) ||
      typeof progress.quizScores !== 'object' || !progress.quizScores ||
      JSON.stringify(progress).length > MAX_PROGRESS_BYTES) {
      return res.status(400).json({ error: 'Érvénytelen tanulási adatok.' });
    }
    // Client progress is for personal learning only, NOT authoritative exam certification.
    await db().execute(
      'INSERT INTO zm_progress(user_id,progress_json) VALUES(?,?) ON DUPLICATE KEY UPDATE progress_json=VALUES(progress_json)',
      [user.id, JSON.stringify(progress)]
    );
    res.json({ success: true });
  }));

  app.use('/api/auth', (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Authentication error:', err);
    res.status(503).json({ error: 'A fiókszolgáltatás átmenetileg nem érhető el.' });
  });
}
