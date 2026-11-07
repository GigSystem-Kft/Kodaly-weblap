import { apiFetch } from '../api';
import { TUTOR_VISUALS } from '../data/tutorVisuals';
import { KnowledgeCoveragePanel } from './KnowledgeCoveragePanel';
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { MessageSquare, Send, Bot, User, Sparkles, X, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
  visuals?: string[];
  generatedImage?: string;
}

const PAGE_IMG = (n: number) => `/assets/jegyzet/oldal-${n}.jpg`;

const splitPages = (text: string) => {
  const pages: number[] = [];
  const clean = text.replace(/\[\[\s*kep:\s*(\d+)\s*\]\]/gi, (_, n) => {
    const p = Number(n);
    if (p >= 1 && p <= 64 && !pages.includes(p)) pages.push(p);
    return '';
  });
  return { clean, pages };
};

type AiMode = 'checking' | 'gemini' | 'fallback' | 'error';

export const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [zoomPage, setZoomPage] = useState<number | null>(null);
  const [zoomVisual, setZoomVisual] = useState<string | null>(null);
  const [zoomGenerated, setZoomGenerated] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: 'Üdvözöllek! Én a Zeneelmélet Tanársegéd vagyok. Ha bármilyen kérdésed van a ritmusról, szolmizációról, hangközökről, hangsorokról vagy a furulyázásról, kérdezz bátran!'
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [aiMode, setAiMode] = useState<AiMode>('checking');
  const [knowledgeSummary, setKnowledgeSummary] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    apiFetch('/api/chat/status')
      .then(async (res) => {
        if (!res.ok) throw new Error('Chat status request failed');
        const data = await res.json();
        setAiMode(data.mode === 'gemini' ? 'gemini' : 'fallback');
        if (data.knowledge) setKnowledgeSummary(`${data.knowledge.indexedSources} forrás, ${data.knowledge.lessonChunks} tananyagrészlet`);
      })
      .catch(() => setAiMode('error'));
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    const previousTopic = [...messages].reverse().find(m => m.role === 'user' && !/k[eé]p|[aá]bra|illusztr/i.test(m.text))?.text || '';
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const res = await apiFetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, previousTopic }),
        signal: AbortSignal.timeout(90000)
      });
      const data = await res.json();
      if (!res.ok) {
        setAiMode('error');
        setMessages((prev) => [...prev, { role: 'model', text: data.error || 'Nem sikerült választ kapni az AI-tól.' }]);
      } else if (data.reply) {
        const isFallback = data.mode !== 'gemini';
        setAiMode(isFallback ? 'fallback' : 'gemini');
        setMessages((prev) => [...prev, {
          role: 'model',
          text: data.reply,
          visuals: Array.isArray(data.visuals) ? data.visuals.filter((id: unknown) => typeof id === 'string' && Object.prototype.hasOwnProperty.call(TUTOR_VISUALS, id)).slice(0, 3) : [],
          generatedImage: typeof data.generatedImage === 'string' && /^data:image\/(png|jpeg|webp);base64,[a-zA-Z0-9+/=]+$/.test(data.generatedImage) && data.generatedImage.length < 10000000 ? data.generatedImage : undefined,
        }]);
      } else {
        setAiMode('error');
        setMessages((prev) => [...prev, { role: 'model', text: 'Sajnálom, nem sikerült választ kapnom a szervertől.' }]);
      }
    } catch (err) {
      console.error(err);
      setAiMode('error');
      const timedOut = err instanceof DOMException && (err.name === 'TimeoutError' || err.name === 'AbortError');
      setMessages((prev) => [...prev, {
        role: 'model',
        text: timedOut
          ? 'A válasz túl sokáig tartott. Próbáld újra később.'
          : 'Hálózati hiba történt a kapcsolat során.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-tr from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 text-white p-4 rounded-full shadow-2xl shadow-indigo-600/40 flex items-center space-x-2 transition-all hover:scale-105"
        >
          <Bot className="w-6 h-6" />
          <span className="font-bold text-sm hidden sm:inline">Tanársegéd AI</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full sm:w-96 h-[500px] bg-slate-900 border border-indigo-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-slate-800/90 border-b border-slate-700/60 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Zeneelmélet Tanársegéd</h4>
                <p className={`text-xs flex items-center space-x-1 ${
                  aiMode === 'gemini' ? 'text-emerald-400' : aiMode === 'fallback' ? 'text-amber-400' : 'text-slate-400'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    aiMode === 'gemini' ? 'bg-emerald-400 animate-pulse' : aiMode === 'fallback' ? 'bg-amber-400' : 'bg-slate-400'
                  }`} />
                  <span>
                    {aiMode === 'checking' && 'AI állapotának ellenőrzése...'}
                    {aiMode === 'gemini' && 'Gemini konfigurálva'}
                    {aiMode === 'fallback' && 'Helyi tanársegéd – ellenőrzött fogalmak'}
                    {aiMode === 'error' && 'AI-kapcsolati hiba'}
                  </span>
                </p>
                {knowledgeSummary && <p className="text-[10px] text-slate-400 mt-0.5">{knowledgeSummary}</p>}
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <KnowledgeCoveragePanel/>
          {/* Messages Scroll Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-start space-x-2.5 ${
                  m.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-indigo-400 border border-slate-700'
                }`}>
                  {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`max-w-[75%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-800 border border-slate-700/60 text-slate-200 rounded-tl-none'
                }`}>
                  {m.role === 'user' ? m.text : (() => {
                    const { clean, pages } = splitPages(m.text);
                    return (
                      <>
                        <ReactMarkdown
                          components={{
                            p: (p) => <p className="mb-2 last:mb-0" {...p} />,
                            h1: (p) => <h3 className="font-bold text-base mt-3 mb-1" {...p} />,
                            h2: (p) => <h3 className="font-bold text-base mt-3 mb-1" {...p} />,
                            h3: (p) => <h4 className="font-bold mt-3 mb-1" {...p} />,
                            ul: (p) => <ul className="list-disc pl-5 mb-2 space-y-1" {...p} />,
                            ol: (p) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...p} />,
                            hr: () => <hr className="my-3 border-slate-700" />,
                          }}
                        >
                          {clean}
                        </ReactMarkdown>
                        {m.generatedImage && (
                          <figure className="mt-3 overflow-hidden rounded-xl bg-white border border-slate-600">
                            <button type="button" className="w-full cursor-zoom-in"
                              onClick={() => setZoomGenerated(m.generatedImage ?? null)}
                              aria-label="AI által készített ábra nagyítása">
                              <img src={m.generatedImage} alt="AI által készített zeneelméleti szemléltető kép"
                                className="w-full max-h-80 object-contain" />
                            </button>
                            <figcaption className="p-2 text-xs text-slate-700">
                              Újonnan generált kép · A kottaképet és a hangközöket érdemes ellenőrizni.
                            </figcaption>
                          </figure>
                        )}
                        {m.visuals && m.visuals.length > 0 && (
                          <div className="mt-3 space-y-3">
                            {m.visuals.map(id => {
                              const visual = TUTOR_VISUALS[id];
                              if (!visual) return null;
                              return (
                                <figure key={id} className="overflow-hidden rounded-xl bg-white border border-slate-600">
                                  <button type="button" className="block w-full cursor-zoom-in"
                                    onClick={() => setZoomVisual(id)} aria-label={visual.title + ' nagyítása'}>
                                    <img src={visual.image} alt={visual.title} loading="lazy" className="w-full h-auto max-h-80 object-contain" />
                                  </button>
                                  <figcaption className="px-3 py-2 text-xs text-slate-700">
                                    <strong className="block">{visual.title}</strong>
                                    <span className="block">{visual.description}</span>
                                    <span className="block text-slate-500 mt-1">Forrás: {visual.source}</span>
                                  </figcaption>
                                </figure>
                              );
                            })}
                          </div>
                        )}
                        {pages.length > 0 && (
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            {pages.map((n) => (
                              <button
                                key={n}
                                type="button"
                                onClick={() => setZoomPage(n)}
                                className="block text-left rounded-lg overflow-hidden border border-slate-600 hover:border-indigo-400 transition-colors bg-white"
                              >
                                <img src={PAGE_IMG(n)} alt={`Jegyzet ${n}. oldal`} loading="lazy" className="w-full" />
                                <span className="block bg-slate-900 text-slate-300 text-[11px] px-2 py-1">{n}. oldal · nagyítás</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2 text-slate-400 text-xs italic">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce delay-100" />
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce delay-200" />
                <span>A tanársegéd gépel...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input form */}
          <form onSubmit={handleSend} className="p-3 bg-slate-800/80 border-t border-slate-700/60 flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Kérdezz a ritmusról, hangközökről..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-all shadow-md shadow-indigo-600/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
      {zoomGenerated && (
        <div className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-5"
          role="dialog" aria-modal="true" aria-label="Generált ábra nagyítása"
          onClick={() => setZoomGenerated(null)}>
          <button type="button" aria-label="Bezárás" onClick={() => setZoomGenerated(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-white"><X className="w-5 h-5" /></button>
          <img src={zoomGenerated} alt="AI által generált ábra" className="max-w-full max-h-full rounded-lg bg-white object-contain" onClick={e=>e.stopPropagation()} />
        </div>
      )}
      {zoomVisual && TUTOR_VISUALS[zoomVisual] && (
        <div className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-5"
          role="dialog" aria-modal="true" aria-label="Kottakép nagyítása"
          onClick={() => setZoomVisual(null)}>
          <button type="button" aria-label="Bezárás" onClick={() => setZoomVisual(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-white"><X className="w-5 h-5" /></button>
          <img src={TUTOR_VISUALS[zoomVisual].image} alt={TUTOR_VISUALS[zoomVisual].title}
            className="max-w-full max-h-full rounded-lg bg-white object-contain"
            onClick={e => e.stopPropagation()} />
        </div>
      )}
      {zoomPage !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setZoomPage(null)}
        >
          <button
            type="button"
            aria-label="Bezárás"
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-white"
            onClick={() => setZoomPage(null)}
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={PAGE_IMG(zoomPage)}
            alt={`Jegyzet ${zoomPage}. oldal`}
            className="max-h-full max-w-full rounded-lg bg-white"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};
