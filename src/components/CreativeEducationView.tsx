import { ModuleCompletionButton } from './ModuleCompletionButton';
import React, { useEffect, useState } from 'react';
import { CREATIVE_SOURCE, CREATIVE_THEMES, CREATIVE_PRACTICES } from '../data/creativeEducation';
import { CuratedMediaPanel } from './CuratedMediaPanel';
import { CREATIVE_WORKSHOPS } from '../data/hungarianDidacticWorkshops';
import { RhythmResearchPanel } from './RhythmResearchPanel';
import { ArrowLeft, BookOpen, ChevronDown, ChevronUp, Users, Clock, Target, X, ZoomIn } from 'lucide-react';

interface CreativeEducationViewProps {
  onBack?: () => void;
  completed?: boolean;
  onComplete?: () => void;
}

export const CreativeEducationView: React.FC<CreativeEducationViewProps> = ({ onBack, completed = false, onComplete }) => {
  const [theme, setTheme] = useState('Összes téma');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [missingImages, setMissingImages] = useState<string[]>([]);
  const [enlargedImageId, setEnlargedImageId] = useState<string | null>(null);
  const sourceImages = [
    {
      id: 'szunet',
      src: '/images/kreativ/szunet-testritmus.webp',
      title: 'Negyed szünet és testritmus – Szólj síp, szólj',
      page: '47.',
      related: 'szunetszobor',
    },
    {
      id: 'szinkopa',
      src: '/images/kreativ/szinkopa-testritmus.webp',
      title: 'Szinkópa és testritmus – Hej, Dunáról fúj a szél',
      page: '48.',
      related: 'szinkopalabda',
    },
    {
      id: 'egeszhang',
      src: '/images/kreativ/egesz-hang-testritmus.webp',
      title: 'Egész hang értékének megélése – Fut a kicsi kordé',
      page: '49.',
      related: 'testritmus',
    },
  ];
  const enlargedImage = sourceImages.find(image => image.id === enlargedImageId) ?? null;
  useEffect(() => {
    if (!enlargedImageId) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setEnlargedImageId(null);
    };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [enlargedImageId]);

  const filtered = theme === 'Összes téma' ? CREATIVE_PRACTICES :
    CREATIVE_PRACTICES.filter(practice => practice.theme === theme);

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 text-[#1c1c1c]">
      {onBack && (
        <button type="button" onClick={onBack} className="flex items-center gap-2 text-sm text-[#4a54e1] mb-6 hover:underline">
          <ArrowLeft size={16} /> Vissza a tananyaghoz
        </button>
      )}
      {onComplete && <div className="mb-5"><ModuleCompletionButton completed={completed} onComplete={onComplete}/></div>}
      <div className="max-w-3xl mb-10">
        <p className="uppercase tracking-[0.2em] text-[0.7rem] font-semibold text-[#4a54e1] mb-3">Kreatív · módszertani gyűjtemény</p>
        <h2 className="font-serif-cormorant text-4xl md:text-6xl font-bold leading-tight mb-4">Kreatív zenei nevelés</h2>
        <p className="text-lg text-[#1c1c1c]/75 leading-relaxed">
          Éneklés, játék és mozgás találkozása. Kipróbálható módszertani ötletek a lüktetés,
          metrum, zenei forma, ritmus, dallami relációk, többszólamúság és zenehallgatás fejlesztéséhez.
        </p>
      </div>

      <aside className="rounded-2xl border border-[#4a54e1]/25 bg-[#4a54e1]/[0.05] p-5 md:p-6 mb-10">
        <div className="flex items-center gap-2 mb-2 font-semibold"><BookOpen size={19} /> Szakmai forrás</div>
        <p className="text-sm leading-relaxed">
          <strong>{CREATIVE_SOURCE.author} ({CREATIVE_SOURCE.year}): {CREATIVE_SOURCE.title}.</strong>
          {' '}{CREATIVE_SOURCE.series}. ISBN {CREATIVE_SOURCE.isbn}.
        </p>
        <p className="text-xs text-[#1c1c1c]/65 mt-2">
          A könyv tanári kézikönyv: elsősorban 6–10 évesekkel kipróbált módszereket mutat be.
          A gyakorlati vázlatok a kézikönyv alapján, önálló megfogalmazásban készültek;
          az oldalszámok a nyomtatott kötetre utalnak. A javaslatok a csoport adottságaihoz igazítandók.
        </p>
      </aside>

      <section className="mb-10" aria-label="Szemléltető részletek a tanári kézikönyvből">
        <h3 className="font-serif-cormorant text-2xl md:text-3xl font-semibold mb-2">Kézikönyvi szemléltető példák</h3>
        <p className="text-sm text-[#1c1c1c]/65 mb-4">
          Az eredeti kötet kis részletei a testritmus módszeréről, az eredeti könyvoldalak megadásával.
          Ezek nem AI által készített illusztrációk, hanem a feltöltött kézikönyvből kivágott képek.
        </p>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sourceImages.filter(image => !missingImages.includes(image.id)).map(image => (
            <figure key={image.id} className="rounded-xl border border-[#1c1c1c]/15 bg-white overflow-hidden">
              <button type="button" onClick={() => setEnlargedImageId(image.id)}
                aria-label={image.title + ' nagyítása'}
                className="block w-full relative cursor-zoom-in group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                <img src={image.src} alt={image.title} loading="lazy" className="w-full object-contain bg-white"
                  onError={() => setMissingImages(previous => previous.includes(image.id) ? previous : [...previous, image.id])} />
                <span className="absolute right-2 bottom-2 bg-white/90 rounded-full p-1.5 shadow text-slate-700 group-hover:text-indigo-600" aria-hidden="true">
                  <ZoomIn size={18} />
                </span>
              </button>
              <figcaption className="p-3 text-xs text-[#1c1c1c]/75">
                <strong className="block mb-1">{image.title}</strong>
                <span>{CREATIVE_SOURCE.author} ({CREATIVE_SOURCE.year}): {CREATIVE_SOURCE.title}, {image.page} oldal.</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-2 mb-7" aria-label="Módszertani témaszűrő">
        {['Összes téma', ...CREATIVE_THEMES].map(option => (
          <button key={option} type="button" onClick={() => { setTheme(option); setExpanded(null); }}
            className={`px-3 py-2 rounded-full text-xs font-semibold border transition-colors ${theme === option
              ? 'bg-[#4a54e1] text-white border-[#4a54e1]'
              : 'bg-white text-[#1c1c1c]/75 border-slate-200 hover:border-[#4a54e1]'}`}>
            {option}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filtered.map(practice => {
          const open = expanded === practice.id;
          return (
            <article key={practice.id} className="rounded-2xl border border-[#1c1c1c]/15 bg-white overflow-hidden">
              <button type="button" className="w-full text-left p-5 md:p-6 flex justify-between gap-4 items-start"
                aria-expanded={open} aria-controls={`practice-${practice.id}`}
                onClick={() => setExpanded(open ? null : practice.id)}>
                <div>
                  <p className="uppercase text-[0.65rem] tracking-widest font-bold text-[#4a54e1] mb-2">{practice.theme} · {practice.page} o.</p>
                  <h3 className="font-serif-cormorant text-2xl md:text-3xl font-semibold mb-2">{practice.title}</h3>
                  <p className="text-sm text-[#1c1c1c]/70">{practice.goal}</p>
                </div>
                {open ? <ChevronUp className="shrink-0 mt-2" /> : <ChevronDown className="shrink-0 mt-2" />}
              </button>
              {open && (
                <div id={`practice-${practice.id}`} className="border-t border-[#1c1c1c]/10 px-5 md:px-6 pb-6 pt-5">
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#1c1c1c]/65 mb-5">
                    <span className="flex items-center gap-1"><Users size={14} /> {practice.grouping}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> Javasolt idő: {practice.duration}</span>
                    <span className="flex items-center gap-1"><Target size={14} /> {practice.age}</span>
                  </div>
                  <h4 className="font-semibold text-sm mb-2">Szükséges eszközök / előkészítés</h4>
                  <p className="text-sm text-[#1c1c1c]/75 mb-5">{practice.materials}</p>
                  <h4 className="font-semibold text-sm mb-2">A foglalkozás menete</h4>
                  <ol className="list-decimal ml-5 space-y-2 text-sm text-[#1c1c1c]/85 mb-5">
                    {practice.steps.map((step, i) => <li key={i}>{step}</li>)}
                  </ol>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <h4 className="font-bold mb-1">Megfigyelési szempont</h4>
                      <p className="text-[#1c1c1c]/75">{practice.observation}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4">
                      <h4 className="font-bold mb-1">Továbbfejlesztési ötlet</h4>
                      <p className="text-[#1c1c1c]/75">{practice.extension}</p>
                    </div>
                  </div>
                  {sourceImages.filter(image => image.related === practice.id && !missingImages.includes(image.id)).map(image => (
                    <figure key={image.id} className="mt-5 max-w-xl rounded-xl border border-[#1c1c1c]/15 overflow-hidden">
                      <button type="button" onClick={() => setEnlargedImageId(image.id)}
                        aria-label={image.title + ' nagyítása'} className="block w-full cursor-zoom-in focus-visible:outline-2 focus-visible:outline-indigo-600">
                        <img src={image.src} alt={image.title} loading="lazy" className="w-full bg-white"
                          onError={() => setMissingImages(previous => previous.includes(image.id) ? previous : [...previous, image.id])} />
                      </button>
                      <figcaption className="px-3 py-2 bg-slate-50 text-xs text-[#1c1c1c]/70">
                        Forrás: {CREATIVE_SOURCE.author} ({CREATIVE_SOURCE.year}), {image.page} oldal.
                      </figcaption>
                    </figure>
                  ))}
                  {CREATIVE_WORKSHOPS.filter(item=>item.id===practice.id).map(workshop=><section key={workshop.id}
                    className="mt-6 rounded-xl border border-indigo-200 p-5 bg-indigo-50/30">
                    <h4 className="font-serif-cormorant text-xl font-semibold mb-3">Részletes módszertani műhely</h4>
                    <h5 className="font-semibold text-sm mb-2">Tanulási célok</h5>
                    <ul className="list-disc ml-5 space-y-1 text-sm text-slate-700 mb-4">
                      {workshop.aims.map(item=><li key={item}>{item}</li>)}
                    </ul>
                    {workshop.explanation.map(item=><p key={item.slice(0,35)}
                      className="text-sm leading-relaxed text-slate-700 mb-3">{item}</p>)}
                    <h5 className="font-semibold text-sm mt-4 mb-2">Differenciálási lehetőségek</h5>
                    <ul className="list-disc ml-5 space-y-1 text-sm text-slate-700 mb-4">
                      {workshop.differentiation.map(item=><li key={item}>{item}</li>)}
                    </ul>
                    <h5 className="font-semibold text-sm mb-2">Hogyan ellenőrizhető a fejlődés?</h5>
                    <ul className="list-disc ml-5 space-y-1 text-sm text-slate-700 mb-4">
                      {workshop.evidence.map(item=><li key={item}>{item}</li>)}
                    </ul>
                    <h5 className="font-semibold text-sm mb-2">Önellenőrzés – mintaválasszal</h5>
                    {workshop.questions.map(q=><details key={q.prompt} className="rounded-lg border border-slate-200 bg-white p-3 mb-3">
                      <summary className="cursor-pointer text-sm font-semibold">{q.prompt}</summary>
                      <p className="mt-2 text-sm text-slate-700">{q.answer}</p>
                    </details>)}
                    <h5 className="font-semibold text-sm mb-2">Magyar nyelvű továbbolvasás</h5>
                    {workshop.sources.map(source=><a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer"
                      className="block text-sm text-[#4a54e1] hover:underline mb-2">{source.label} ↗</a>)}
                  </section>)}
                  <p className="text-xs text-[#1c1c1c]/55 mt-4">
                    Módszertani alap: {CREATIVE_SOURCE.author}, {CREATIVE_SOURCE.title}, {practice.page} oldal.
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </div>
      <RhythmResearchPanel/>
      <CuratedMediaPanel chapterNumber={6}/>
      {enlargedImage && (
        <div role="dialog" aria-modal="true" aria-label={enlargedImage.title + ' nagyított képe'}
          className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4 md:p-8"
          onClick={() => setEnlargedImageId(null)}>
          <button type="button" aria-label="Nagyított kép bezárása" autoFocus
            onClick={() => setEnlargedImageId(null)}
            className="absolute top-4 right-4 text-white bg-slate-800 rounded-full p-3 hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-white">
            <X size={24} />
          </button>
          <img src={enlargedImage.src} alt={enlargedImage.title}
            className="max-w-full max-h-[78vh] object-contain rounded-md bg-white"
            onClick={event => event.stopPropagation()} />
          <p className="max-w-3xl mt-4 text-center text-sm text-white">
            <strong>{enlargedImage.title}</strong>
            {' — '}{CREATIVE_SOURCE.author} ({CREATIVE_SOURCE.year}): {CREATIVE_SOURCE.title}, {enlargedImage.page} oldal.
          </p>
          <p className="mt-1 text-white/70 text-xs">Bezárás: Esc vagy kattintás a háttérre</p>
        </div>
      )}
    </div>
  );
};
