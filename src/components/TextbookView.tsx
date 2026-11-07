import React, { useEffect, useState } from 'react';
import { BookOpen, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Page { oldal: number; szoveg: string; }

export const TEXTBOOKS = [
  { id: 1, title: 'Énekzene 1. osztály' },
  { id: 2, title: 'Énekzene 2. osztály' },
  { id: 3, title: 'Énekzene 3. osztály' },
  { id: 4, title: 'Énekzene 4. osztály' },
  { id: 5, title: 'Ritmikai fejlesztőprogram' },
];

export const TextbookView: React.FC<{ book: number }> = ({ book }) => {
  const [pages, setPages] = useState<Page[]>([]);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setPages([]); setError(false); setOpen(null); setQuery('');
    if (!TEXTBOOKS.some(textbook => textbook.id === book)) { setError(true); return; }
    fetch(`/tankonyvek/${book}/oldalak.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setPages)
      .catch(() => setError(true));
  }, [book]);

  const normalize = (text: string) => text.toLocaleLowerCase('hu-HU')
    .normalize('NFD').replace(/[\\u0300-\\u036f]/g, '');
  const terms = normalize(query.trim()).split(/\\s+/).filter(Boolean);
  const visible = terms.length
    ? pages.filter(p => terms.every(term => normalize(p.szoveg).includes(term)))
    : pages;
  const img = (n: number) => `/tankonyvek/${book}/p${String(n).padStart(3, '0')}.jpg`;
  const current = open !== null ? visible[open] : null;

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') setOpen((i) => (i === null ? i : Math.min(visible.length - 1, i + 1)));
      if (e.key === 'ArrowLeft') setOpen((i) => (i === null ? i : Math.max(0, i - 1)));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, visible.length]);

  const title = TEXTBOOKS.find((t) => t.id === book)?.title;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-[#1c1c1c]">
      <div className="mb-6">
        <span className="inline-flex items-center gap-2 font-mono-jetbrains text-[0.7rem] uppercase tracking-widest text-[#4a54e1]">
          <BookOpen className="w-3.5 h-3.5" /> NAT 2020 állami tankönyv
        </span>
        <h2 className="font-serif-cormorant text-4xl italic font-semibold mt-1">{title}</h2>
        <p className="text-sm text-[#1c1c1c]/70 mt-2 max-w-2xl">
          A tankönyv oldalai kottaképekkel és a hozzájuk tartozó szöveges ismeretanyaggal. Kattints az oldalra a nagyításhoz. Személyes tanulási célra.
        </p>
      </div>

      <input
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(null); }}
        placeholder="Keresés a tankönyv szövegében…"
        className="w-full sm:w-96 mb-6 border border-[#1c1c1c]/20 bg-white px-3 py-2 text-sm"
      />

      {error && <p className="text-sm text-red-700">A tankönyv nem tölthető be.</p>}
      <p className="font-mono-jetbrains text-[0.7rem] uppercase mb-4">{visible.length} oldal{terms.length ? ' találat' : ''}</p>

      <div className="grid sm:grid-cols-2 gap-6">
        {visible.map((p, idx) => (
          <article key={p.oldal} className="border border-[#1c1c1c]/15 bg-white">
            <button onClick={() => setOpen(idx)} className="all-unset block w-full cursor-pointer">
              <img src={img(p.oldal)} alt={`${title}, ${p.oldal}. oldal`} loading="lazy" className="w-full h-auto block" />
            </button>
            <details className="px-3 py-2 border-t border-[#1c1c1c]/10">
              <summary className="cursor-pointer font-mono-jetbrains text-[0.65rem] uppercase text-[#1c1c1c]/60">
                {p.oldal}. oldal – szöveg
              </summary>
              <pre className="whitespace-pre-wrap text-sm mt-2 font-sans">{p.szoveg || '(nincs szöveg)'}</pre>
            </details>
          </article>
        ))}
      </div>

      {current && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setOpen(null)}>
          <button aria-label="Előző" className="absolute left-3 text-white p-2 disabled:opacity-30" disabled={open === 0}
            onClick={(e) => { e.stopPropagation(); setOpen((i) => Math.max(0, (i ?? 0) - 1)); }}>
            <ChevronLeft className="w-8 h-8" />
          </button>
          <div className="max-h-full max-w-3xl w-full overflow-auto" onClick={(e) => e.stopPropagation()}>
            <img src={img(current.oldal)} alt={`${current.oldal}. oldal`} className="w-full h-auto bg-white" />
            <p className="text-center text-white/80 font-mono-jetbrains text-xs mt-2">{current.oldal}. oldal</p>
          </div>
          <button aria-label="Következő" className="absolute right-3 text-white p-2 disabled:opacity-30" disabled={open === visible.length - 1}
            onClick={(e) => { e.stopPropagation(); setOpen((i) => Math.min(visible.length - 1, (i ?? 0) + 1)); }}>
            <ChevronRight className="w-8 h-8" />
          </button>
          <button aria-label="Bezár" className="absolute top-3 right-3 text-white p-2" onClick={() => setOpen(null)}>
            <X className="w-7 h-7" />
          </button>
        </div>
      )}
    </div>
  );
};
