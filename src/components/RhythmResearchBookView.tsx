import React, {useEffect, useMemo, useState} from 'react';
import { BookOpen, ChevronLeft, ChevronRight, X, Search, ZoomIn } from 'lucide-react';
import { RHYTHM_RESEARCH_PAGES, RHYTHM_PROGRAM_ORIGINAL_URL } from '../data/rhythmResearchPages';

/**
 * A tankönyvnézethez igazított, oldalképes dokumentumolvasó.
 * Az eredeti, 13 oldalas MTA-SZTE PDF-ből készített oldal-JPG fájlok:
 * /ritmikai/p001.jpg ... /ritmikai/p013.jpg.
 * A hozzá tartozó kinyert szöveg a tanulói keresőben és az AI-indexben is elérhető.
 */
export const RhythmResearchBookView:React.FC = () => {
  const [query,setQuery]=useState('');
  const [open,setOpen]=useState<number|null>(null);
  const [missing,setMissing]=useState<number[]>([]);
  const pageImage=(number:number)=>`/ritmikai/p${String(number).padStart(3,'0')}.jpg`;
  const normalize=(text:string)=>text.toLocaleLowerCase('hu-HU').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const terms=useMemo(()=>normalize(query.trim()).split(/\s+/).filter(Boolean),[query]);
  const visible=useMemo(()=>RHYTHM_RESEARCH_PAGES.filter(page=>
    terms.every(term=>normalize([String(page.page),page.title,page.text,page.figureDescription??''].join(' ')).includes(term))
  ),[terms.join('|')]);
  const current=open===null?null:visible[open]??null;
  useEffect(()=>{
    if(open===null)return;
    const onKey=(event:KeyboardEvent)=>{
      if(event.key==='Escape')setOpen(null);
      if(event.key==='ArrowRight')setOpen(i=>i===null?null:Math.min(visible.length-1,i+1));
      if(event.key==='ArrowLeft')setOpen(i=>i===null?null:Math.max(0,i-1));
    };
    window.addEventListener('keydown',onKey);
    return ()=>window.removeEventListener('keydown',onKey);
  },[open,visible.length]);
  useEffect(()=>{setOpen(null);},[query]);
  const markMissing=(number:number)=>setMissing(old=>old.includes(number)?old:[...old,number]);
  return <section id="rhythm-research-book" aria-label="Ritmikai fejlesztőprogram – könyvszerű, kereshető oldalképek"
    className="mt-8 mb-10 rounded-2xl border border-indigo-200 bg-white p-4 sm:p-6 lg:p-8">
    <div className="mb-5">
      <span className="inline-flex items-center gap-2 font-mono-jetbrains text-[0.7rem] uppercase tracking-widest text-[#4a54e1]">
        <BookOpen size={15}/> MTA–SZTE kutatási segédanyag
      </span>
      <h3 className="font-serif-cormorant text-3xl sm:text-4xl italic font-semibold mt-2 text-[#1c1c1c]">
        Ritmikai fejlesztőprogram – Játékgyűjtemény
      </h3>
      <p className="text-sm text-slate-600 mt-3 max-w-3xl leading-relaxed">
        Az eredeti dokumentum mind a 13 oldala olvasható képként, az eredeti ritmuskottákkal együtt.
        Kattints egy oldal képére a nagyításhoz; a képek alatt az eredetileg kinyert, kereshető szöveg is megnyitható.
      </p>
    </div>
    <div className="flex flex-wrap items-center gap-3 mb-5">
      <label className="relative block w-full sm:w-96">
        <Search size={16} className="absolute left-3 top-3 text-slate-500"/>
        <span className="sr-only">Keresés a ritmikai fejlesztőprogram oldalain</span>
        <input value={query} onChange={e=>setQuery(e.target.value)}
          placeholder="Keresés a dokumentum szövegében…"
          type="search" className="w-full border border-slate-300 rounded-md bg-white pl-9 pr-3 py-2 text-sm text-slate-900"/>
      </label>
      <span className="text-xs font-mono-jetbrains uppercase text-slate-600">
        {visible.length} / {RHYTHM_RESEARCH_PAGES.length} oldal{terms.length?' találat':''}
      </span>
    </div>
    <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
      {visible.map((page,index)=><article key={page.page} className="border border-slate-200 bg-white overflow-hidden">
        <button type="button" onClick={()=>setOpen(index)} aria-label={`A Ritmikai fejlesztőprogram ${page.page}. oldalának nagyítása`}
          className="relative block w-full cursor-zoom-in group bg-slate-100 focus-visible:outline-2 focus-visible:outline-indigo-700">
          <img src={pageImage(page.page)} loading="lazy" alt={`Ritmikai fejlesztőprogram, eredeti ${page.page}. oldal`}
            onError={()=>markMissing(page.page)} className="block w-full h-auto aspect-[595/842] object-contain bg-white"/>
          <span className="absolute bottom-3 right-3 rounded-md bg-slate-900/70 text-white px-2 py-1 text-xs flex gap-1 items-center">
            <ZoomIn size={14}/> Nagyítás
          </span>
        </button>
        <div className="border-t border-slate-200 px-3 py-2">
          <details>
            <summary className="cursor-pointer text-xs uppercase tracking-wide font-semibold text-slate-600">
              {page.page}. oldal – szöveg és magyarázat
            </summary>
            <div className="mt-3 max-h-80 overflow-y-auto whitespace-pre-wrap break-words text-sm text-slate-700 leading-relaxed">
              {page.text||'Az eredeti oldalon nincs kinyerhető szöveg.'}
            </div>
            {page.figureDescription&&<p className="mt-3 text-xs text-amber-900 bg-amber-50 p-2 rounded-lg">
              <strong>Kottaképi tárgymutató:</strong> {page.figureDescription}
            </p>}
          </details>
        </div>
      </article>)}
    </div>
    {visible.length===0&&<p className="text-sm text-slate-600 p-5 border border-dashed border-slate-200">
      Nincs találat ebben a dokumentumban. Próbálj másik kifejezést vagy ritmustáblázat-azonosítót.
    </p>}
    {missing.length>0&&<p role="alert" className="text-xs mt-4 text-amber-900 bg-amber-50 border border-amber-200 p-3 rounded-lg">
      Néhány eredeti oldalkép hiányzik a telepítésből ({missing.join(', ')}. oldal).
      Az oldal képeit a telepítő `ritmikai` mappájából is fel kell tölteni.
      A szöveges keresés ettől még működik.
    </p>}
    <p className="text-xs text-slate-600 mt-5">
      A PDF kottái az oldalképeken az eredeti formájukban láthatók. A képen szereplő hangjegyek
      automatikus szöveges átírása nem tekinthető ellenőrzöttnek.
      {' '}<a href={RHYTHM_PROGRAM_ORIGINAL_URL} target="_blank" rel="noopener noreferrer" className="text-indigo-700 underline">
        Eredeti forrás PDF megnyitása
      </a>
    </p>
    {current&&<div role="dialog" aria-modal="true" aria-label={`Ritmikai fejlesztőprogram ${current.page}. oldal, nagyított nézet`}
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-3 sm:p-8"
      onClick={()=>setOpen(null)}>
      <button type="button" aria-label="Bezárás" className="absolute top-3 right-3 text-white p-2 z-10 bg-slate-900/70 rounded-lg"
        onClick={()=>setOpen(null)}><X size={26}/></button>
      <button type="button" aria-label="Előző oldal" disabled={open===0} className="absolute left-2 sm:left-4 z-10 text-white bg-slate-900/70 rounded-full p-2 disabled:opacity-25"
        onClick={e=>{e.stopPropagation();setOpen(i=>Math.max(0,(i??0)-1));}}><ChevronLeft size={28}/></button>
      <div className="max-w-4xl max-h-full overflow-y-auto w-full flex flex-col items-center"
        onClick={e=>e.stopPropagation()}>
        <img src={pageImage(current.page)} alt={`Eredeti ${current.page}. oldal nagyítva`}
          className="w-full h-auto bg-white max-w-[850px]"/>
        <p className="text-white/80 text-sm mt-3">{current.page}. oldal · {current.title} · Esc: bezárás, ← →: lapozás</p>
      </div>
      <button type="button" aria-label="Következő oldal" disabled={open===visible.length-1} className="absolute right-2 sm:right-4 z-10 text-white bg-slate-900/70 rounded-full p-2 disabled:opacity-25"
        onClick={e=>{e.stopPropagation();setOpen(i=>Math.min(visible.length-1,(i??0)+1));}}><ChevronRight size={28}/></button>
    </div>}
  </section>;
};
