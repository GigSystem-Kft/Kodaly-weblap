import React, { useState } from 'react';
import { ArrowRight, BookOpen, Layers, Music2, Volume2 } from 'lucide-react';
import { playMelody, playNote } from '../utils/audio';
import { ImageLightbox } from './ImageLightbox';

import abcImage from '../assets/images/elmelet_abc.png';
import scaleImage from '../assets/images/elmelet_hangsor.png';

type PitchTopic = 'solfege' | 'abcNotes';

interface PitchNamesViewProps {
  topic: PitchTopic;
  onOpenQuiz: (chapterId: string) => void;
  onOpenFlashcards: (category: string) => void;
  onOpenMatching: (category: string) => void;
}

const SOLFEGE_NOTES = [
  { name: 'Dó', symbol: 'd', degree: '1. fok', note: 'C4', role: 'Dúrban az alaphang; a relatív dó helye a hangnemmel együtt változik.' },
  { name: 'Ré', symbol: 'r', degree: '2. fok', note: 'D4', role: 'A dúr hangsor második foka.' },
  { name: 'Mi', symbol: 'm', degree: '3. fok', note: 'E4', role: 'A dúr hangsor harmadik foka.' },
  { name: 'Fá', symbol: 'f', degree: '4. fok', note: 'F4', role: 'A dúr hangsor negyedik foka.' },
  { name: 'Szó', symbol: 's', degree: '5. fok', note: 'G4', role: 'A dúr hangsor ötödik foka.' },
  { name: 'Lá', symbol: 'l', degree: '6. fok', note: 'A4', role: 'Dúrban a 6. fok; természetes mollban az alaphang.' },
  { name: 'Ti', symbol: 't', degree: '7. fok', note: 'H4', role: 'A dúr hangsor hetedik foka, amely a dó felé vezet.' }
];

const ABC_NOTES = [
  { name: 'C', solfege: 'dó', degree: '1. fok', note: 'C4' },
  { name: 'D', solfege: 'ré', degree: '2. fok', note: 'D4' },
  { name: 'E', solfege: 'mi', degree: '3. fok', note: 'E4' },
  { name: 'F', solfege: 'fá', degree: '4. fok', note: 'F4' },
  { name: 'G', solfege: 'szó', degree: '5. fok', note: 'G4' },
  { name: 'A', solfege: 'lá', degree: '6. fok', note: 'A4' },
  { name: 'H', solfege: 'ti', degree: '7. fok', note: 'H4' }
];

export const PitchNamesView: React.FC<PitchNamesViewProps> = ({
  topic,
  onOpenQuiz,
  onOpenFlashcards,
  onOpenMatching
}) => {
  const isSolfege = topic === 'solfege';
  const [zoom, setZoom] = useState<{ src: string; alt: string } | null>(null);
  const activity = isSolfege
    ? { quiz: 'solfege', category: 'Szolmizáció' }
    : { quiz: 'abc-hangok', category: 'ABC-s hangok' };
  const rows: { name: string; detail: string; degree: string; note: string; role?: string }[] = isSolfege
    ? SOLFEGE_NOTES.map(({ name, symbol, degree, note, role }) => ({ name, detail: symbol, degree, note, role }))
    : ABC_NOTES.map(({ name, solfege, degree, note }) => ({ name, detail: solfege, degree, note }));
  const playScale = () => playMelody(rows.map(({ note }) => ({ note, duration: 380 })));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="text-center mb-8">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
          {isSolfege ? <Music2 className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
          <span>{isSolfege ? 'Dallamfokok és relatív hangnevek' : 'Hangnevek és hangmagasság'}</span>
        </span>
        <h2 className="text-3xl font-extrabold text-white mb-2">
          {isSolfege ? 'Szolmizációs hangok' : 'ABC-s hangok'}
        </h2>
        <p className="text-slate-300 text-sm max-w-3xl mx-auto leading-relaxed">
          {isSolfege
            ? 'A szolmizáció a dallam hangjainak egymáshoz és a hangnem alaphangjához való viszonyát teszi hallhatóvá.'
            : 'Az ABC-s hangnevek a hangokat nevezik meg. A kottában elfoglalt helyüket a kulcs határozza meg.'}
        </p>
      </header>

      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 mb-8">
        <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-3">
            {isSolfege ? 'Mit jelentenek a szótagok?' : 'A hét törzshang neve'}
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            {isSolfege
              ? 'A relatív szolmizációban dúr hangnemben az alaphang a dó, természetes mollban az alaphang a lá. A többi szótag a hangsor fokait követi, ezért a dó tényleges hangmagassága más hangnembe lépve megváltozhat.'
              : 'A magyar hangnévsor: C – D – E – F – G – A – H. A H után a következő oktáv C hangja következik. A hangnév azonosítja a hangot, az oktávszám pedig annak fekvését jelöli, például C4 és C5.'}
          </p>
          <div className="mt-5 rounded-2xl border border-indigo-500/30 bg-indigo-950/40 p-4">
            <h4 className="text-sm font-bold text-indigo-200 mb-2">
              {isSolfege ? 'Fontos különbség: relatív és abszolút' : 'Figyelj a magyar H és B különbségére!'}
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {isSolfege
                ? 'A relatív rendszerben a dó a hangnem alaphangjához igazodik. Az abszolút szolmizáció ezzel szemben rögzített hangmagasságot társít a szótagokhoz. A magyar ének-zene oktatásban a relatív rendszer használata jellemző.'
                : 'A magyar jelölésben H a természetes B hang, B pedig a leszállított H hang (B♭). Ezért a magyar C-dúr hangjai C–D–E–F–G–A–H; az angol „B” természetes hang magyar neve H.'}
            </p>
          </div>
          <button
            onClick={playScale}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition-colors"
          >
            <Volume2 className="w-4 h-4" />
            Példaskála meghallgatása
          </button>
        </section>

        <figure className="bg-white border border-slate-800 rounded-3xl overflow-hidden shadow-xl self-start">
          <img
            src={isSolfege ? scaleImage : abcImage}
            alt={isSolfege ? 'C-dúr hangsor szolmizációs szótagokkal' : 'ABC-s hangnevek és oktávok kottapéldája'}
            className="w-full h-auto cursor-zoom-in"
            onClick={() => setZoom({
              src: isSolfege ? scaleImage : abcImage,
              alt: isSolfege ? 'C-dúr hangsor szolmizációs szótagokkal' : 'ABC-s hangnevek és oktávok kottapéldája'
            })}
          />
          <figcaption className="p-4 text-sm text-slate-700 border-t border-slate-200">
            {isSolfege
              ? 'A C-dúr példa: a dó–ré–mi–fá–szó–lá–ti szótagok és a hangnevek együtt. (Kattints a nagyításhoz)'
              : 'A hangok kottabeli helyét a kulcs és az oktáv határozza meg. (Kattints a nagyításhoz)'}
          </figcaption>
        </figure>
      </div>

      <section className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl mb-8">
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              {isSolfege ? 'Szótagok a C-dúr példáján' : 'Hangnevek C-dúrban'}
            </h3>
            <p className="text-sm text-slate-400">
              {isSolfege
                ? 'A hangmagasságok itt csak szemléltető C-dúr példák; más hangnemben a relatív szótagok ugyanazt a fokot jelentik.'
                : 'A táblázat a C-dúr hangsor hét hangját mutatja. Nyomd meg a hangszórót egy-egy hang meghallgatásához.'}
            </p>
          </div>
          <button onClick={playScale} className="text-sm font-medium text-indigo-300 hover:text-white inline-flex items-center gap-2">
            <Volume2 className="w-4 h-4" /> Lejátszás
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/80 text-xs uppercase tracking-wider text-slate-300">
                <th className="p-4 sm:px-6">{isSolfege ? 'Szótag' : 'Hangnév'}</th>
                <th className="p-4 sm:px-6">{isSolfege ? 'Jelölés' : 'Szolmizáció C-dúrban'}</th>
                <th className="p-4 sm:px-6">Fok</th>
                <th className="p-4 sm:px-6">Hangzó példa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {rows.map((row) => (
                <tr key={row.note} className="text-sm text-slate-200 hover:bg-slate-800/40">
                  <td className="p-4 sm:px-6 font-bold text-white">{row.name}</td>
                  <td className="p-4 sm:px-6 font-mono text-indigo-300">
                    {row.detail}
                  </td>
                  <td className="p-4 sm:px-6 text-slate-300">{row.degree}</td>
                  <td className="p-4 sm:px-6">
                    <button
                      onClick={() => playNote(row.note, 500)}
                      aria-label={`${row.note} hang lejátszása`}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-indigo-300 hover:bg-indigo-600 hover:text-white"
                    >
                      <Volume2 className="w-4 h-4" />
                      {row.note}
                    </button>
                    {row.role && <p className="text-xs text-slate-400 mt-1">{row.role}</p>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex items-start gap-3 mb-5">
          <Layers className="w-5 h-5 text-indigo-400 mt-0.5" />
          <div>
            <h3 className="text-lg font-bold text-white">Gyakorolj tovább!</h3>
            <p className="text-sm text-slate-400 mt-1">A gyakorlók csak a most tanult témához tartozó kártyákat és párokat mutatják.</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <button
            onClick={() => onOpenFlashcards(activity.category)}
            className="flex items-center justify-between gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-left text-sm text-slate-200 hover:border-indigo-500"
          >
            Szókártyák <ArrowRight className="w-4 h-4 text-indigo-400" />
          </button>
          <button
            onClick={() => onOpenMatching(activity.category)}
            className="flex items-center justify-between gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-left text-sm text-slate-200 hover:border-indigo-500"
          >
            Párosító játék <ArrowRight className="w-4 h-4 text-indigo-400" />
          </button>
          <button
            onClick={() => onOpenQuiz(activity.quiz)}
            className="flex items-center justify-between gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-left text-sm text-slate-200 hover:border-indigo-500"
          >
            Témakvíz <ArrowRight className="w-4 h-4 text-indigo-400" />
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-5">
          Forrásalap: Késztler: Zenei alapismeretek; NAT 2020 Ének-zene tankönyvek és a műhely meglévő tananyaga.
        </p>
      </section>

      {zoom && <ImageLightbox src={zoom.src} alt={zoom.alt} onClose={() => setZoom(null)} />}
    </div>
  );
};
