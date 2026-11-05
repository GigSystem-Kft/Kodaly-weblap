import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { knowledgeContext, knowledgeStatus, localKnowledgeReply } from './server-knowledge';
import { installAccountRoutes } from './server-auth';

dotenv.config({ path: ['.env.local', '.env'] });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function startServer() {
  const app = express();
  // CloudPanel nginx operates as a local reverse proxy; only trust local forwarded addresses.
  app.set('trust proxy', 'loopback');
  app.use(express.json({ limit: '100kb' }));
  installAccountRoutes(app);
  app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'zeneelmeleti-muhely' }));

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
    res.json({ mode: ai ? 'gemini' : 'fallback', knowledge: knowledgeStatus() });
  });

  // API endpoint for chatbot
  app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Írj be egy kérdést.' });
    }

    if (!ai) {
      return res.json({ reply: localKnowledgeReply(message), mode: 'fallback' });
    }

    const indexedContext = knowledgeContext(message);
    const systemInstruction = `Te egy szakmailag pontos, segítőkész magyar nyelvű zeneelméleti tanársegéd vagy.
A válaszokat elsősorban a kereséssel kiválasztott, alább megadott forrásrészletek alapján állítsd össze.
A források között a Zeneelméleti Műhely leckéi, Bartáné Góhér Edit zenei jegyzete, Kesztler Zenei alapismeretek című anyaga és a NAT 2020 1–4. osztályos ének-zene tankönyvek vannak.
A válaszban nevezz meg legalább egy konkrét forrást, lehetőleg leckecímmel vagy oldalszámmal.
Ha a kapott részletekből nem állapítható meg a válasz, mondd el ezt; ne találj ki idézetet, tankönyvoldalt, hangzó példát vagy adatot.
A források szövegének egy része gépi kinyerésből származik, lehetnek benne hibák; a szakmailag ellentmondásos adatot ne ismételd ellenőrzés nélkül.
A kapcsolódó kottaképekhez a Bartáné-jegyzet létező 1–64. oldalaira [[kep:N]] jelöléssel hivatkozhatsz, de csak akkor, ha a megadott jegyzetrészletben valóban szerepel a szükséges oldalszám.
Válaszolj érthetően, magyarul, és ahol segít, adj rövid lépésenkénti magyarázatot vagy gyakorlati példát. Ne használj LaTeX-et.

KIKERESETT FORRÁSRÉSZLETEK:
${indexedContext || 'Ehhez a kérdéshez nem találtam biztosan releváns részletet.'}`;

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

  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('API request failed:', error);
    if (!res.headersSent) res.status(503).json({ error: 'A szerveroldali szolgáltatás átmenetileg nem érhető el.' });
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

  const port = Number(process.env.PORT || 3000);
  const host = process.env.HOST || '127.0.0.1';
  app.listen(port, host, () => {
    console.log(`Server running on http://${host}:${port}`);
  });
}

startServer();
