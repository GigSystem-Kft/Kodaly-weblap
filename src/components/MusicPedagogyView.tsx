import React, { useMemo, useState } from 'react';
import { PEDAGOGY_SOURCE, PEDAGOGY_UNITS } from '../data/musicPedagogy';
import { DEEP_PEDAGOGY_LESSONS } from '../data/musicPedagogyDeep';
import { PEDAGOGY_WORKSHOPS } from '../data/hungarianDidacticWorkshops';
import { ArrowLeft, BookOpen, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

export const MusicPedagogyView:React.FC<{onBack:()=>void;onQuiz:()=>void;onFlashcards:()=>void;onMatching:()=>void}> = ({onBack,onQuiz,onFlashcards,onMatching}) => {
 const [query,setQuery]=useState('');
 const [active,setActive]=useState<string|null>(PEDAGOGY_UNITS[0]?.id ?? null);
 const [openImage,setOpenImage]=useState<string|null>(null);
 const [missingImages,setMissingImages]=useState<string[]>([]);
 const normalized=(s:string)=>s.toLocaleLowerCase('hu-HU').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 const results=useMemo(()=>{
  const words=normalized(query.trim()).split(/\s+/).filter(Boolean);
  return words.length ? PEDAGOGY_UNITS.filter(unit=>{
   const haystack=normalized([unit.title,unit.goal,...unit.concepts,...unit.sections.flatMap(section=>[section.heading,section.text]),...(DEEP_PEDAGOGY_LESSONS.find(item=>item.unitId===unit.id)?.explanation ?? []),...unit.seminar,...unit.reflection].join(' '));
   return words.every(word=>haystack.includes(word));
  }) : PEDAGOGY_UNITS;
 },[query]);
 return <section className="max-w-6xl mx-auto px-6 md:px-12 py-12 text-[#1c1c1c]">
  <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-[#4a54e1] mb-6 hover:underline"><ArrowLeft size={17}/> Vissza a tananyaghoz</button>
  <p className="text-indigo-600 tracking-wider font-semibold uppercase text-xs mb-2">08. fejezet · Egyetemi szakirodalomra épülő tananyag</p>
  <h1 className="font-serif-cormorant text-4xl md:text-6xl font-semibold mb-5">Ének-zene tantárgy-pedagógia</h1>
  <p className="text-base md:text-lg leading-relaxed max-w-3xl mb-6 text-slate-700">
    A tanító szakos hallgatók számára készített tantárgy-pedagógiai tanulóút: a zenei
    élmény szerepétől a Kodály-koncepción át a daltanításig, a készségfejlesztésig,
    a műelemzésig és az óratervezésig. Minden egységhez szemináriumi gyakorlatok
    és önellenőrző kérdések kapcsolódnak.
  </p>
  <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5 mb-8">
   <p className="font-bold text-sm flex items-center gap-2 mb-2"><BookOpen size={18}/> Szakirodalmi alap</p>
   <p className="text-sm leading-relaxed">
    {PEDAGOGY_SOURCE.author} ({PEDAGOGY_SOURCE.year}): <em>{PEDAGOGY_SOURCE.title}</em>.
    {' '}{PEDAGOGY_SOURCE.publisher}. ISBN {PEDAGOGY_SOURCE.isbn}.
   </p>
   <p className="text-sm text-slate-700 mt-2">
    Ez önálló megfogalmazású módszertani feldolgozás; a pontos nyomtatott oldalszámokat
    témánként közöljük. Az engedélyezett eredeti kötet szerveroldalon, az AI tudásbázisában külön kereshető.
   </p>
   <a href={PEDAGOGY_SOURCE.originalUrl} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-sm text-[#4a54e1] mt-3 hover:underline">
      Könyv – egyetemi kiadói repozitórium <ExternalLink size={14}/>
   </a>
  </div>
  <aside className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-4 md:p-6 mb-8">
    <h2 className="font-serif-cormorant font-semibold text-2xl mb-2">Gyakorlás és önellenőrzés</h2>
    <p className="text-sm text-slate-700 mb-4">A szakirodalmi fejezethez szókártyák, fogalompárosító játék és külön módszertani tesztek tartoznak.</p>
    <div className="flex flex-wrap gap-3">
      <button type="button" onClick={onFlashcards} className="px-4 py-2 rounded-lg bg-white border border-indigo-200 text-indigo-700 font-semibold">Szókártyák</button>
      <button type="button" onClick={onMatching} className="px-4 py-2 rounded-lg bg-white border border-indigo-200 text-indigo-700 font-semibold">Párosító játék</button>
      <button type="button" onClick={onQuiz} className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold">Tudáspróba</button>
    </div>
  </aside>
  <label className="block max-w-xl mb-6">
   <span className="text-sm font-semibold block mb-2">Keresés a feldolgozott tananyagban</span>
   <input value={query} onChange={e=>setQuery(e.target.value)}
    placeholder="Pl. daltanítás, relatív hallás, motiváció, óravázlat"
    className="w-full bg-white rounded-xl border border-slate-300 px-4 py-3 focus:outline-2 focus:outline-indigo-500"/>
  </label>
  <p className="text-sm text-slate-600 mb-5">{results.length} / {PEDAGOGY_UNITS.length} témakör</p>
  <div className="space-y-4">
   {results.length===0 && <p className="text-slate-600">Nem találtam ilyen témakört. Próbálj rövidebb kifejezést.</p>}
   {results.map((unit)=>{
    const deep=DEEP_PEDAGOGY_LESSONS.find(item=>item.unitId===unit.id);
    const isOpen=active===unit.id || Boolean(query.trim());
    return <article key={unit.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <button type="button" className="w-full text-left px-5 md:px-7 py-5 flex items-start justify-between gap-3 hover:bg-indigo-50/50"
       aria-expanded={isOpen} onClick={()=>setActive(isOpen && !query ? null : unit.id)}>
       <span>
        <span className="text-[#4a54e1] text-xs font-mono-jetbrains block mb-2">{unit.page} oldal · {String(PEDAGOGY_UNITS.indexOf(unit)+1).padStart(2,'0')}. témakör</span>
        <span className="font-serif-cormorant font-semibold text-xl md:text-2xl block mb-1">{unit.title}</span>
        <span className="text-sm text-slate-600 block">{unit.goal}</span>
       </span>
       {isOpen ? <ChevronUp size={20} className="shrink-0 mt-2"/> : <ChevronDown size={20} className="shrink-0 mt-2"/>}
      </button>
      {isOpen && <div className="p-5 md:p-7 border-t border-slate-100">
       <div className="flex flex-wrap gap-2 mb-6">{unit.concepts.map(tag=><span key={tag} className="text-xs rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5">{tag}</span>)}</div>
       {unit.sections.map(section=><section key={section.heading} className="mb-6">
        <h3 className="font-serif-cormorant font-semibold text-xl md:text-2xl mb-2">{section.heading}</h3>
        <p className="text-sm md:text-base text-slate-700 leading-relaxed">{section.text}</p>
       </section>)}
       {deep && <section className="mb-6" aria-label="Részletes pedagógiai feldolgozás">
        <h3 className="font-serif-cormorant font-semibold text-2xl md:text-3xl mb-4">Részletes didaktikai feldolgozás</h3>
        {deep.explanation.map(paragraph=><p key={paragraph.slice(0,45)} className="text-sm md:text-base text-slate-700 leading-relaxed mb-4">{paragraph}</p>)}
        <h4 className="font-semibold mt-5 mb-2">Javasolt tanítási folyamat</h4>
        <ol className="list-decimal pl-5 space-y-2 text-sm md:text-base text-slate-700 leading-relaxed">
          {deep.lessonPlan.map(step=><li key={step}>{step}</li>)}
        </ol>
        <h4 className="font-semibold mt-5 mb-2">Gyakori módszertani hibák</h4>
        <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-slate-700">
          {deep.pitfalls.map(item=><li key={item}>{item}</li>)}
        </ul>
        {deep.figure && !missingImages.includes(deep.figure.file) && <figure className="mt-6 max-w-2xl">
          <button type="button" className="block w-full text-left" title="Kattints az eredeti kottarészlet nagyításához"
           onClick={()=>setOpenImage(deep.figure?.file ?? null)}>
            <img src={'/assets/pedagogy/'+deep.figure.file} loading="lazy"
             alt={deep.figure.caption}
             onError={()=>setMissingImages(prev=>[...prev,deep.figure!.file])}
             className="w-full rounded-lg border border-slate-200 cursor-zoom-in shadow-sm hover:shadow-md"/>
          </button>
          <figcaption className="text-xs text-slate-500 mt-2">
            {deep.figure.caption}. Kelemen Judit (2019), nyomtatott {deep.figure.printPage}. oldal
            (PDF {deep.figure.pdfPage}. oldal). Forrás: Líceum Kiadó.
          </figcaption>
        </figure>}
       </section>}
       <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="rounded-xl bg-indigo-50/60 border border-indigo-100 p-5">
         <h3 className="font-bold mb-2">Szemináriumi feladatok</h3>
         <ol className="list-decimal pl-5 text-sm leading-relaxed space-y-3">{unit.seminar.map(task=><li key={task}>{task}</li>)}</ol>
        </div>
        <div className="rounded-xl bg-slate-50 border border-slate-100 p-5">
         <h3 className="font-bold mb-2">Önellenőrző kérdések</h3>
         <ol className="list-decimal pl-5 text-sm leading-relaxed space-y-3">{unit.reflection.map(task=><li key={task}>{task}</li>)}</ol>
        </div>
       </div>
       <p className="text-xs text-slate-500 mt-5">Forrás: Kelemen Judit (2019), {unit.page} oldal; saját pedagógiai feldolgozás.</p>
      </div>}
     </article>;
   })}
  </div>
  {openImage && <div role="dialog" aria-modal="true" aria-label="Kottapélda nagyítva"
   className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4"
   onClick={()=>setOpenImage(null)}>
   <button type="button" onClick={()=>setOpenImage(null)}
    className="absolute right-5 top-4 rounded-lg bg-white text-slate-900 px-4 py-2 font-semibold">Bezárás ×</button>
   <img src={'/assets/pedagogy/'+openImage} alt="Kottapélda nagyítva"
    className="max-w-full max-h-[87vh] object-contain bg-white rounded shadow-lg" onClick={e=>e.stopPropagation()}/>
  </div>}
 </section>;
};
