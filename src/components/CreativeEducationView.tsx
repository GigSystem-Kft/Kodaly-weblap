import React, { useState } from 'react';
import { CREATIVE_SOURCE, CREATIVE_THEMES, CREATIVE_PRACTICES } from '../data/creativeEducation';
import { ArrowLeft, BookOpen, ChevronDown, ChevronUp, Users, Clock, Target } from 'lucide-react';

interface CreativeEducationViewProps {
  onBack?: () => void;
}

export const CreativeEducationView: React.FC<CreativeEducationViewProps> = ({ onBack }) => {
  const [theme, setTheme] = useState('Összes téma');
  const [expanded, setExpanded] = useState<string | null>(null);
  const filtered = theme === 'Összes téma' ? CREATIVE_PRACTICES :
    CREATIVE_PRACTICES.filter(practice => practice.theme === theme);

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 text-[#1c1c1c]">
      {onBack && (
        <button type="button" onClick={onBack} className="flex items-center gap-2 text-sm text-[#4a54e1] mb-6 hover:underline">
          <ArrowLeft size={16} /> Vissza a tananyaghoz
        </button>
      )}
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
                  <p className="text-xs text-[#1c1c1c]/55 mt-4">
                    Módszertani alap: {CREATIVE_SOURCE.author}, {CREATIVE_SOURCE.title}, {practice.page} oldal.
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};
