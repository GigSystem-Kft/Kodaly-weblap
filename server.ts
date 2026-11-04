import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { readFileSync, readdirSync, existsSync } from 'fs';

dotenv.config({ path: ['.env.local', '.env'] });

const NOTES_TEXT = readFileSync(resolve(process.cwd(), 'server-data/jegyzet.txt'), 'utf-8');
const SOURCES_DIR = resolve(process.cwd(), 'server-data/forrasok');

interface Chunk { source: string; label: string; text: string; terms: Map<string, number>; }

const normalize = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const tokenize = (s: string) => normalize(s).match(/[a-z0-9]{3,}/g) ?? [];
// Hungarian is agglutinative: compare word prefixes so inflected forms still match.
const stem = (w: string) => w.slice(0, 6);

function splitSource(file: string, raw: string): Chunk[] {
  const pageParts = raw.split(/^-{3}\s*(\d+)\.\s*oldal\s*-{3}\s*$/m);
  const pieces: { label: string; text: string }[] = [];
  if (pageParts.length > 1) {
    for (let i = 1; i < pageParts.length; i += 2) {
      pieces.push({ label: `${pageParts[i]}. oldal`, text: pageParts[i + 1] });
    }
  } else {
    let n = 0;
    let buf = '';
    for (const para of raw.split(/\n\s*\n/)) {
      buf += `${para}\n\n`;
      if (buf.length > 1500) { pieces.push({ label: `rész ${++n}`, text: buf }); buf = ''; }
    }
    if (buf.trim()) pieces.push({ label: `rész ${++n}`, text: buf });
  }
  return pieces
    .map((p) => ({ ...p, text: p.text.trim() }))
    .filter((p) => p.text.length > 40)
    .map((p) => {
      const terms = new Map<string, number>();
      for (const w of tokenize(p.text)) {
        const s = stem(w);
        terms.set(s, (terms.get(s) ?? 0) + 1);
      }
      return { source: file, label: p.label, text: p.text, terms };
    });
}

const CHUNKS: Chunk[] = existsSync(SOURCES_DIR)
  ? readdirSync(SOURCES_DIR)
      .filter((f) => /\.(txt|md)$/i.test(f) && !f.startsWith('_'))
      .sort()
      .flatMap((f) => splitSource(f, readFileSync(resolve(SOURCES_DIR, f), 'utf-8')))
  : [];

const DOC_FREQ = new Map<string, number>();
for (const c of CHUNKS) for (const t of c.terms.keys()) DOC_FREQ.set(t, (DOC_FREQ.get(t) ?? 0) + 1);

function retrieve(query: string, limit = 6, maxChars = 14000): Chunk[] {
  const q = [...new Set(tokenize(query).map(stem))];
  if (!q.length || !CHUNKS.length) return [];
  const scored = CHUNKS.map((c) => {
    let score = 0;
    for (const t of q) {
      const tf = c.terms.get(t);
      if (tf) score += (1 + Math.log(tf)) * Math.log(1 + CHUNKS.length / (DOC_FREQ.get(t) ?? 1));
    }
    return { c, score };
  }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score);
  const picked: Chunk[] = [];
  let total = 0;
  for (const { c } of scored) {
    if (picked.length >= limit || total + c.text.length > maxChars) continue;
    picked.push(c);
    total += c.text.length;
  }
  return picked;
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function startServer() {
  const app = express();
  app.use(express.json());

  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  const ai = apiKey ? new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  }) : null;

  app.get('/api/chat/status', (_req, res) => {
    res.json({ mode: ai ? 'gemini' : 'fallback' });
  });

  // Intelligent fallback music theory knowledge base
  function getKnowledgeBaseReply(msg: string): string {
    const lower = msg.toLowerCase();
    if (lower.includes('g-dúr') || lower.includes('gdúr') || (lower.includes('g') && lower.includes('előjegyzés'))) {
      return 'A G-dúr hangsorban **1 kereszt (#)** az előjegyzés, mégpedig a **Fisz**. Mivel a dúr hangsor szerkezete 2 egész, 1 fél, 3 egész és 1 fél lépésből áll (n2+n2+k2+n2+n2+n2+k2), a 7. hangot (F) fel kell emelnünk Fisz-re. Szolmizálva a G hang a dó!';
    }
    if (lower.includes('d-dúr') || lower.includes('ddúr') || lower.includes('d-dúrban')) {
      return 'A D-dúr hangsorban **2 kereszt (#)** az előjegyzés: a **Fisz** és a **Cisz**. Így biztosítható a dúr hangsor alapszerkezete D kezdőhangról indulva.';
    }
    if (lower.includes('f-dúr') || lower.includes('fdúr') || lower.includes('f-dúrban')) {
      return 'Az F-dúr hangsorban **1 bé (b)** az előjegyzés: az **Esz** (vagy B hang rendszertől függően F-dúrban a B-t és Esz-t érinti). Bartáné Góhér Edit jegyzete alapján az F hangra épülő dúr hangsor 4. hangját szállítjuk le.';
    }
    if (lower.includes('ritmus') || lower.includes('tá') || lower.includes('ti-ti') || lower.includes('szinkópa')) {
      return 'A ritmus a zenében a hangok sorának időbeli rendje, egymáshoz való időértékviszonya [Böhm, 2000]. Legfontosabb értékeink: egész (tá-á-á-á), fél (tá-á), negyed (tá), nyolcad pár (ti-ti). A szinkópa [TI-TÁ-TI] két nyolcad értékből és egy középső negyed értékből áll.';
    }
    if (lower.includes('szolmizáció') || lower.includes('dó') || lower.includes('ré') || lower.includes('mi')) {
      return 'A szolmizáció nem a hangok abszolút magasságát, hanem egy hangnemen belüli funkciót és relatív magasságot jelöl (dó, ré, mi, fá, szó, lá, ti). Kodály Zoltán elve szerint „könnyebb félhang nélkül tisztán énekelni”, ezért a kisgyermekeknek félhang nélküli dallamokat (pentatónia, hexachord) tanítunk.';
    }
    if (lower.includes('furulya') || lower.includes('ujjrend')) {
      return 'A segédanyagban használt hangszer szoprán furulya, germán hangolású. Új hang indításakor „tü” hangzóval fújjuk meg hosszan vagy röviden. A lyukakat lazán, de pontosan fedjük be a ujjpárnákkal. Bal kéz van felül, jobb kéz alul.';
    }
    if (lower.includes('hangköz') || lower.includes('intervallum') || lower.includes('terc') || lower.includes('kvint')) {
      return 'A hangköz vagy intervallum két hang egymástól való távolsága. Legfontosabbak: prím (t1, azonos hangok), szekund (k2, n2), terc (k3, n3), kvart (t4), kvint (t5, tiszta konszonáns hangköz), szext, szeptim és oktáv.';
    }
    return `Zeneelmélet Tanársegéd vagyok (Bartáné Góhér Edit 2013-as egyetemi jegyzete alapján). Örömmel segítek elmagyarázni a ritmust, szolmizációt, hangközöket, dúr-moll hangsorokat vagy a furulyázást. Kérlek, kérdezz konkrétan a témák valamelyikéről (pl. „Mi a G-dúr előjegyzése?”, „Hogyan épül fel a szinkópa?”)!`;
  }

  // API endpoint for chatbot
  app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Írj be egy kérdést.' });
    }

    if (!ai) {
      return res.json({ reply: getKnowledgeBaseReply(message), mode: 'fallback' });
    }

    const extra = retrieve(message)
      .map((c) => `=== ${c.source}, ${c.label} ===\n${c.text}`)
      .join('\n\n');
    const systemInstruction = `Te egy barátságos, türelmes és szakmailag precíz zeneelmélet tanársegéd vagy egyetemi hallgatók számára. A tudásod forrásai: (1) Bartáné Góhér Edit: Zenei ismeretek, alapozó készségfejlesztés, furulyagyakorlatok (2013) jegyzete, (2) Kesztler: Zenei alapismeretek, (3) az 1–4. osztályos NAT 2020 Ének-zene tankönyvek (a kérdéshez kikeresett részletei a KIEGÉSZÍTŐ FORRÁSOK között).

Szabályok:
- Kizárólag a fenti források (jegyzet és kiegészítő források, köztük az 1–4. osztályos tankönyvek) alapján válaszolj. Ha a kérdés általános iskolai ének-zenéről, daltanításról, dalokról vagy tankönyvi anyagról szól, elsősorban a kiegészítő forrásokból válaszolj, és add meg a tankönyv számát (évfolyam) és az oldalt. A fogalmakat, szabályokat, ujjrendet, jelöléseket és példákat a jegyzet szerint add meg, és ahol lehet, idézz belőle szó szerint idézőjelben, a szakasz címének megjelölésével.
- A jegyzet germán hangolású szoprán furulyát használ; ettől ne térj el, és ne említs barokk fogást, ha a jegyzet nem teszi.
- Csak akkor mondd, hogy a források nem tárgyalják, ha sem a jegyzetben, sem a kiegészítő forrásokban nincs válasz, és ne találj ki részleteket. Ha általános zenei tudással egészíted ki, jelöld egyértelműen.
- A jegyzet szövege oldalakra van bontva ([OLDAL N] jelölés). Amikor egy válaszhoz a jegyzet oldalán ábra, kotta, ujjrend-rajz vagy táblázat tartozik, szúrd be a sor végére a [[kep:N]] jelölést (N az oldalszám); az oldal ezt képként jeleníti meg a válasz alatt. Használj minél több szemléltető képet: egy válaszban akár 1-4 releváns oldalt is megjelölhetsz, kifejezetten az ábrát tartalmazó oldalakat részesítsd előnyben. A jelölést csak létező oldalszámmal (1-64) használd. Említsd meg szövegben is, hogy melyik oldalon találja a hallgató.
- Válaszolj magyarul, tömören. Ne köszönj minden válasz elején. Ne használj LaTeX-et vagy dollárjeles képleteket (ütemmutató: 2/4). Csak egyszerű Markdownt használj (félkövér, felsorolás).

A JEGYZET TELJES SZÖVEGE:
${NOTES_TEXT}${extra ? `\n\nKIEGÉSZÍTŐ FORRÁSOK – a kérdéshez kikeresett részletek (OCR-ból származnak, ezért lehetnek benne félreolvasott szavak; hivatkozz a fájlnévre és oldalra, ha belőlük idézel; ezekhez ne használj [[kep:N]] jelölést):\n${extra}` : ''}`;

    // Overloaded (5xx/429) or slow models fall through to the next one.
    const models = ['gemini-3.6-flash', 'gemini-3.5-flash-lite', 'gemini-3.8-flash'];
    let lastError: unknown;

    for (const model of models) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: message,
          config: { systemInstruction, abortSignal: AbortSignal.timeout(20000) },
        });
        if (response.text) {
          return res.json({ reply: response.text, mode: 'gemini' });
        }
        console.error(`Gemini API returned an empty response (${model}).`);
      } catch (error) {
        console.error(`Gemini API call failed (${model}):`, error);
        lastError = error;
        const status = typeof error === 'object' && error !== null && 'status' in error &&
          typeof error.status === 'number' ? error.status : null;
        if (status !== null && status >= 400 && status < 500 && status !== 429 && status !== 404) break;
      }
    }

    {
      const error = lastError;
      if (error === undefined) {
        return res.status(502).json({ error: 'A Gemini nem adott választ. Próbáld újra később.' });
      }
      if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
        return res.status(504).json({ error: 'A Gemini túl lassan válaszol. Próbáld újra később.' });
      }
      const status = typeof error === 'object' && error !== null && 'status' in error &&
        typeof error.status === 'number' ? error.status : null;
      let errorMessage = 'Nem sikerült kapcsolódni a Geminihez. Nézd meg a szerver termináljában a részleteket.';

      if (status === 401 || status === 403) {
        errorMessage = `A Google elutasította az API-kulcsot vagy a hozzáférést (HTTP ${status}). Ellenőrizd a kulcsot és a Gemini API hozzáférést.`;
      } else if (status === 404) {
        errorMessage = 'A Gemini modell nem található vagy nem érhető el ehhez a kulcshoz (HTTP 404).';
      } else if (status === 429) {
        errorMessage = 'Elfogyott a Gemini API kvótája vagy túl sok kérés érkezett (HTTP 429).';
      } else if (status !== null && status >= 500) {
        errorMessage = `A Google Gemini szolgáltatása átmenetileg hibát jelez (HTTP ${status}). Próbáld újra később.`;
      } else if (status !== null) {
        errorMessage = `A Gemini API elutasította a kérést (HTTP ${status}). Nézd meg a szerver termináljában a részleteket.`;
      }

      return res.status(502).json({
        error: errorMessage,
      });
    }
  });

  // Vite middleware for development
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(resolve(__dirname, 'dist')));
    app.get('*', (_, res) => {
      res.sendFile(resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

startServer();
