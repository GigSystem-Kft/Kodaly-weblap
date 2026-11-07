import React, { useState } from 'react';
import { MUSIC_HISTORY } from '../data/musicHistory';
import { HISTORY_WORKSHOPS } from '../data/musicHistoryWorkshops';
import { COMPOSER_BIOGRAPHIES, GUIDED_LISTENING } from '../data/musicHistoryProfiles';
import { ArrowLeft, BookOpen, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

interface MusicHistoryViewProps {
  onBack: () => void;
  onQuiz: () => void;
  onFlashcards: () => void;
  onMatching: () => void;
}
export const MusicHistoryView: React.FC<MusicHistoryViewProps> = ({ onBack, onQuiz, onFlashcards, onMatching }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [revealedAnswers, setRevealedAnswers] = useState<string[]>([]);
  const normalize = (value: string) => value.toLocaleLowerCase('hu-HU').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const query = normalize(search.trim());
  const visible = MUSIC_HISTORY.filter(period =>
    !query || normalize([period.name,period.lead,period.period,
      ...period.features,...period.genres,...period.figures,...(period.sections ?? []).flatMap(section => [section.title,...section.paragraphs]),...(period.listening ?? []).map(item => item.title),...(HISTORY_WORKSHOPS.find(workshop=>workshop.periodId===period.id)?.context ?? []),...COMPOSER_BIOGRAPHIES.filter(item => item.periodId === period.id).flatMap(item => [item.name,item.significance,...item.works])].join(' ')).includes(query)
  );

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-12 py-12 text-[#1c1c1c]">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm text-[#4a54e1] hover:underline mb-7">
        <ArrowLeft size={17} /> Vissza a tananyaghoz
      </button>
      <div className="mb-8 max-w-3xl">
        <p className="text-[#4a54e1] font-bold text-xs uppercase tracking-widest mb-3">07. fejezet · Zenetörténet</p>
        <h2 className="font-serif-cormorant text-5xl md:text-6xl font-semibold mb-4">Zenetörténet</h2>
        <p className="text-base md:text-lg text-[#1c1c1c]/75 leading-relaxed">
          A zene alakulása az ókortól napjainkig. Áttekintő tanulókártyák, fontos műfajok,
          jellegzetes stílusjegyek és hallgatási feladatok, megbízhatóan megjelölt továbbolvasási forrásokkal.
        </p>
      </div>
      <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-5 mb-8">
        <h3 className="font-bold text-sm flex items-center gap-2 mb-2"><BookOpen size={17} /> A tananyag forrásai</h3>
        <p className="text-sm leading-relaxed text-[#1c1c1c]/75">
          A fejezet több magyar Wikipédia-szócikk alapján összeállított, önálló megfogalmazású oktatási áttekintés.
          A megadott korszakhatárok megközelítőek; a művészeti stílusok gyakran átfedtek egymással.
          A forrásszócikkeket a korszakoknál külön megnyithatod, és ellenőrizheted a részletes adatokat.
        </p>
        <p className="text-xs text-[#1c1c1c]/60 mt-3">
          A Wikipédia közösségi enciklopédia, nem lektorált zenetörténeti kézikönyv.
          Ez az áttekintés nem helyettesíti a szakirodalmi ellenőrzést.
        </p>
      </div>
      <section className="mb-8" aria-label="Wikipédia zenetörténeti forrás és ábrák">
        <h3 className="font-serif-cormorant text-2xl md:text-3xl font-semibold mb-2">Zenetörténeti áttekintő ábrák</h3>
        <p className="text-sm text-[#1c1c1c]/70 mb-4">
          Az alábbi idővonalak az eredeti Wikipédia-szócikk szemléltető ábrái.
          A diagramok a korok időbeli átfedéseit és jelentős zeneszerzőit mutatják be.
          A részletekért nyisd meg az eredeti forrást.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              src: 'https://upload.wikimedia.org/wikipedia/hu/timeline/1xgjpwairsmgruzinm8wcjmn3773ng1.png',
              title: 'Az európai klasszikus zene fő korszakai',
              alt: 'Idővonal a reneszánsz, barokk, klasszicista, romantikus és 20. századi zenéről'
            },
            {
              src: 'https://upload.wikimedia.org/wikipedia/hu/timeline/a02y9qttkjyb0bl7tnzz5es2crucnsf.png',
              title: 'Jelentősebb zeneszerzők és stíluskorszakok',
              alt: 'Zeneszerzőket korszakokhoz rendelő színes Wikipédia-idővonal'
            }
          ].map(illustration => (
            <figure key={illustration.src} className="border border-slate-200 rounded-xl bg-white overflow-hidden">
              <a href={illustration.src} target="_blank" rel="noopener noreferrer"
                title="Ábra megnyitása eredeti méretben" className="block cursor-zoom-in p-3 bg-white">
                <img src={illustration.src} alt={illustration.alt} loading="lazy"
                  className="w-full h-auto max-h-72 object-contain" />
              </a>
              <figcaption className="p-3 text-xs text-slate-700">
                <strong className="block mb-1">{illustration.title}</strong>
                Forrás: <a href="https://hu.wikipedia.org/wiki/Zenet%C3%B6rt%C3%A9net"
                  target="_blank" rel="noopener noreferrer" className="underline text-[#4a54e1]">Wikipédia – Zenetörténet</a>
                {' · '}<a href="https://creativecommons.org/licenses/by-sa/4.0/"
                  target="_blank" rel="noopener noreferrer" className="underline">CC BY-SA 4.0</a>.
                A Wikipédia által készített idővonal; a forrásoldal változhat.
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-4 border border-indigo-200 bg-indigo-50/50 rounded-xl p-4">
          <p className="font-semibold text-sm mb-2">A teljes eredeti szócikk megnyitása</p>
          <p className="text-sm text-slate-700 mb-3">
            A fejezet itt saját, tanulásra szerkesztett összefoglalókat tartalmaz.
            A Wikipédia eredeti, teljes szövegét és valamennyi képét a forrásoldalon olvashatod el.
          </p>
          <a href="https://hu.wikipedia.org/wiki/Zenet%C3%B6rt%C3%A9net"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex gap-2 items-center text-sm text-[#4a54e1] font-semibold hover:underline">
            Teljes Zenetörténet-szócikk megnyitása <ExternalLink size={15} />
          </a>
        </div>
      </section>

      <label className="block max-w-xl mb-8">
        <span className="block text-xs font-semibold mb-2">Keresés korszak, zeneszerző vagy műfaj szerint</span>
        <input value={search} onChange={event => setSearch(event.target.value)}
          placeholder="Például: Bach, motetta, romantika…"
          className="w-full p-3 rounded-xl bg-white border border-slate-300 focus:outline-2 focus:outline-indigo-500" />
      </label>
      <div className="space-y-4">
        {visible.length === 0 && <p className="text-sm text-slate-600">Nincs találat. Próbálj másik keresőkifejezést.</p>}
        {visible.map((period, index) => {
          const expanded=selectedId===period.id || Boolean(query);
          const workshop=HISTORY_WORKSHOPS.find(item=>item.periodId===period.id);
          return (
            <article key={period.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <button type="button" aria-expanded={expanded}
                aria-controls={`history-${period.id}`} onClick={() => setSelectedId(expanded && !query ? null : period.id)}
                className="w-full px-5 md:px-7 py-5 text-left flex gap-4 items-start justify-between hover:bg-indigo-50/50">
                <div>
                  <div className="text-xs font-mono-jetbrains text-[#4a54e1] mb-2">{period.period}</div>
                  <h3 className="font-serif-cormorant text-2xl md:text-3xl font-semibold mb-2">{period.name}</h3>
                  <p className="text-sm text-[#1c1c1c]/75 max-w-3xl leading-relaxed">{period.lead}</p>
                </div>
                {expanded ? <ChevronUp size={22} className="shrink-0 mt-2" /> : <ChevronDown size={22} className="shrink-0 mt-2" />}
              </button>
              {expanded && (
                <div id={`history-${period.id}`} className="px-5 md:px-7 pt-5 pb-7 border-t border-slate-100">
                  {period.sections?.map(section => (
                    <section key={section.title} className="mb-6">
                      <h4 className="font-serif-cormorant font-semibold text-xl md:text-2xl mb-3">{section.title}</h4>
                      <div className="space-y-3">
                        {section.paragraphs.map((paragraph, i) => (
                          <p key={i} className="text-sm md:text-base text-slate-700 leading-relaxed">{paragraph}</p>
                        ))}
                      </div>
                    </section>
                  ))}
                  {workshop && <section className="mb-7 space-y-5" aria-label="Részletes zenetörténeti műhely">
                    <div className="border border-indigo-100 rounded-xl bg-indigo-50/40 p-5">
                      <h4 className="font-semibold mb-2">Tanulási célok</h4>
                      <ul className="list-disc pl-5 text-sm text-slate-700 space-y-2">
                        {workshop.goals.map(goal=><li key={goal}>{goal}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-serif-cormorant font-semibold text-xl md:text-2xl mb-3">Történeti összefüggések – részletesebb magyarázat</h4>
                      {workshop.context.map(paragraph=><p key={paragraph.slice(0,36)}
                       className="text-sm md:text-base leading-relaxed text-slate-700 mb-3">{paragraph}</p>)}
                    </div>
                    <div className="border border-slate-200 rounded-xl p-5">
                      <h4 className="font-semibold mb-3">Irányított zenehallgatás és alkalmazás</h4>
                      <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-700">
                        {workshop.steps.map(step=><li key={step}>{step}</li>)}
                      </ol>
                      <p className="text-sm text-slate-700 mt-4"><strong>Továbbgondolás:</strong> {workshop.furtherPractice}</p>
                    </div>
                    <div className="border border-indigo-200 rounded-xl p-5">
                      <h4 className="font-semibold mb-2">Önellenőrzés – ellenőrizhető mintaválasszal</h4>
                      <p className="text-sm text-slate-700 mb-3">{workshop.question}</p>
                      <button type="button" aria-expanded={revealedAnswers.includes(period.id)}
                       onClick={()=>setRevealedAnswers(current=>current.includes(period.id)?current.filter(id=>id!==period.id):[...current,period.id])}
                       className="text-sm text-[#4a54e1] font-semibold hover:underline">
                        {revealedAnswers.includes(period.id) ? 'Mintaválasz elrejtése' : 'Mintaválasz megtekintése'}
                      </button>
                      {revealedAnswers.includes(period.id) && <p className="text-sm leading-relaxed text-slate-700 mt-3">{workshop.modelAnswer}</p>}
                    </div>
                  </section>}
                  <div className="grid md:grid-cols-2 gap-7">
                    <div>
                      <h4 className="font-semibold mb-2">Jellegzetességek</h4>
                      <ul className="list-disc pl-5 text-sm leading-relaxed space-y-2 text-slate-700">
                        {period.features.map(feature => <li key={feature}>{feature}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Fontos műfajok</h4>
                      <p className="text-sm text-slate-700 mb-5">{period.genres.join(' · ')}</p>
                      <h4 className="font-semibold mb-2">Jellegzetes személyek</h4>
                      <p className="text-sm text-slate-700">{period.figures.join(' · ')}</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <h4 className="font-semibold text-sm mb-2">Hallgatási / megfigyelési feladat</h4>
                      <p className="text-sm text-slate-700">{period.example}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4">
                      <h4 className="font-semibold text-sm mb-2">Önellenőrző kérdés</h4>
                      <p className="text-sm text-slate-700">{period.question}</p>
                    </div>
                  </div>
                  <section className="mt-6" aria-label="Zeneszerzői portrék">
                    <h4 className="font-serif-cormorant font-semibold text-xl md:text-2xl mb-3">Személyek és alkotók közelebbről</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {COMPOSER_BIOGRAPHIES.filter(profile => profile.periodId === period.id).map(profile => (
                        <article key={profile.id} className="rounded-xl border border-slate-200 p-4 bg-slate-50">
                          <h5 className="font-bold mb-1">{profile.name}</h5>
                          <p className="text-xs text-[#4a54e1] mb-2">{profile.dates}</p>
                          <p className="text-sm leading-relaxed text-slate-700">{profile.significance}</p>
                          <p className="text-sm text-slate-700 mt-2"><strong>Kapcsolódó művek:</strong> {profile.works.join(' · ')}</p>
                          <a href={profile.sourceUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm mt-3 text-[#4a54e1] hover:underline">
                            Életrajzi forrás <ExternalLink size={13}/>
                          </a>
                        </article>
                      ))}
                    </div>
                  </section>
                  <section className="mt-6" aria-label="Irányított műelemzési gyakorlatok">
                    <h4 className="font-serif-cormorant font-semibold text-xl md:text-2xl mb-3">Irányított műelemzés</h4>
                    {GUIDED_LISTENING.filter(study => study.periodId === period.id).map(study => (
                      <article key={study.id} className="rounded-xl border border-indigo-200 p-5 bg-indigo-50/40">
                        <h5 className="font-semibold text-lg mb-1">{study.title}</h5>
                        <p className="text-xs text-slate-600 mb-4">Megfigyelendő: {study.concept}</p>
                        <p className="text-sm text-slate-700 mb-3"><strong>Hallgatás előtt:</strong> {study.before}</p>
                        <p className="text-sm font-semibold mb-2">Hallgatás közben figyeld meg:</p>
                        <ol className="list-decimal pl-5 text-sm text-slate-700 space-y-2">
                          {study.during.map(step=><li key={step}>{step}</li>)}
                        </ol>
                        <p className="text-sm text-slate-700 mt-4"><strong>Hallgatás után:</strong> {study.after}</p>
                        <button type="button" onClick={() => setRevealedAnswers(previous =>
                          previous.includes(study.id) ? previous.filter(id => id !== study.id) : [...previous, study.id])}
                          aria-expanded={revealedAnswers.includes(study.id)}
                          className="text-sm font-semibold text-[#4a54e1] hover:underline mt-4">
                          {revealedAnswers.includes(study.id) ? 'Mintaválasz elrejtése' : 'Mintaválasz megmutatása'}
                        </button>
                        {revealedAnswers.includes(study.id) && (
                          <p className="text-sm text-slate-700 mt-2 border-l-2 border-indigo-400 pl-3">
                            {study.sampleAnswer}
                          </p>
                        )}
                        <div className="mt-4">
                          <a className="text-xs text-[#4a54e1] hover:underline inline-flex gap-1 items-center"
                            href={study.sourceUrl} target="_blank" rel="noopener noreferrer">
                            A mű és a szerző forrása <ExternalLink size={12}/>
                          </a>
                        </div>
                      </article>
                    ))}
                  </section>
                  {!!period.listening?.length && (
                    <section className="mt-6 p-5 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                      <h4 className="font-semibold mb-2">Zenehallgatás – jellemző művek</h4>
                      <p className="text-sm text-slate-600 mb-4">
                        A hivatkozások a YouTube-on nyílnak meg, saját videót nem másolunk a weboldalra.
                        A keresési találatoknál válassz szakmailag megfelelő előadást.
                      </p>
                      <div className="space-y-3">
                        {period.listening.map(item => (
                          <div key={item.url} className="bg-white border border-indigo-100 rounded-lg p-3">
                            <a href={item.url} target="_blank" rel="noopener noreferrer"
                              className="inline-flex gap-1 items-center font-semibold text-sm text-[#4a54e1] hover:underline">
                              {item.title}<ExternalLink size={14} />
                            </a>
                            <p className="text-sm text-slate-700 mt-1"><strong>Megfigyelés:</strong> {item.focus}</p>
                            {item.kind === 'search' && <p className="text-xs text-slate-500 mt-1">YouTube-keresési hivatkozás, nem ellenőrzött konkrét felvétel.</p>}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                  <div className="mt-6 border-t pt-4">
                    <h4 className="font-semibold text-xs uppercase tracking-wide mb-2">Felhasznált Wikipédia-szócikkek</h4>
                    <div className="flex flex-wrap gap-4 text-sm">
                      {period.sourceLinks.map(link => (
                        <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#4a54e1] hover:underline">
                          {link.name}<ExternalLink size={13} aria-hidden="true" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
      <aside className="mt-10 border border-indigo-200 rounded-2xl p-5 md:p-7 bg-indigo-50/60">
        <h3 className="font-serif-cormorant font-semibold text-2xl mb-2">Gyakorold a zenetörténetet!</h3>
        <p className="text-sm text-slate-700 mb-4">A teljes fejezet után válassz feladattípust. Korábbi eredményeid megmaradnak.</p>
        <div className="flex gap-3 flex-wrap">
          <button type="button" onClick={onFlashcards} className="px-4 py-3 rounded-xl border border-indigo-200 bg-white text-[#4a54e1] font-semibold hover:bg-indigo-50">Szókártyák</button>
          <button type="button" onClick={onMatching} className="px-4 py-3 rounded-xl border border-indigo-200 bg-white text-[#4a54e1] font-semibold hover:bg-indigo-50">Párosító játék</button>
          <button type="button" onClick={onQuiz} className="px-4 py-3 rounded-xl bg-[#4a54e1] text-white font-semibold hover:opacity-90">Tudáspróba</button>
        </div>
      </aside>
      <p className="text-xs text-slate-500 mt-8">
        Tájékozódási forrás: Wikipédia szerkesztői közössége, magyar Wikipédia.
        Az összefoglalók saját megfogalmazásban készültek; a forrásoldalak időközben változhatnak.
        A Wikipédia-szövegek jellemző licence: <a className="text-[#4a54e1] underline"
          href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a>.
      </p>
    </section>
  );
};
