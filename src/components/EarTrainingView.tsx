import React, { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import { playNote, playEarTrainingInterval, stopEarTrainingInterval } from '../utils/audio';
import { shuffleEarChallenges } from '../utils/earTraining';
import { PitchCollectionTraining } from './PitchCollectionTraining';
import { ExtendedEarTraining } from './ExtendedEarTraining';

interface EarTrainingViewProps {
  onAddXp: (amount: number) => void;
}

const EAR_CHALLENGES = [
  { id: 1, title: 'Tiszta Prím (t1)', notes: ['C4','C4'], description: '0 félhang: két azonos hang.' },
  { id: 2, title: 'Kis Szekund (k2)', notes: ['C4','C#4'], description: '1 félhang, például C–Desz.' },
  { id: 3, title: 'Nagy Szekund (n2)', notes: ['C4','D4'], description: '2 félhang: C–D.' },
  { id: 4, title: 'Kis Terc (k3)', notes: ['C4','D#4'], description: '3 félhang: C–Esz.' },
  { id: 5, title: 'Nagy Terc (n3)', notes: ['C4','E4'], description: '4 félhang: C–E.' },
  { id: 6, title: 'Tiszta Kvart (t4)', notes: ['C4','F4'], description: '5 félhang: C–F.' },
  { id: 7, title: 'Tiszta Kvint (t5)', notes: ['C4','G4'], description: '7 félhang: C–G.' },
  { id: 8, title: 'Kis Szext (k6)', notes: ['C4','G#4'], description: '8 félhang: C–Asz.' },
  { id: 9, title: 'Nagy Szext (n6)', notes: ['C4','A4'], description: '9 félhang: C–A.' },
  { id: 10, title: 'Kis Szeptim (k7)', notes: ['C4','A#4'], description: '10 félhang: C–B.' },
  { id: 11, title: 'Nagy Szeptim (n7)', notes: ['C4','B4'], description: '11 félhang: C–H.' },
  { id: 12, title: 'Tiszta Oktáv (t8)', notes: ['C4','C5'], description: '12 félhang: C–C.' }
];

export const EarTrainingView: React.FC<EarTrainingViewProps> = ({ onAddXp }) => {
  const [trainingTab,setTrainingTab] = useState<'intervals'|'collections'|'extended'>('intervals');
  const [round, setRound] = useState(() => shuffleEarChallenges(EAR_CHALLENGES));
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState<number>(0);

  const current = round[currentChallengeIndex];

  useEffect(() => () => stopEarTrainingInterval(), []);

  const playChallenge = () => {
    playEarTrainingInterval(current.notes);
  };

  const handleGuess = (title: string) => {
    setSelectedAnswer(title);
    const correct = title === current.title;
    setIsCorrect(correct);

    if (correct) {
      playNote('C6', 400);
      setStreak((prev) => prev + 1);
      onAddXp(25);
    } else {
      playNote('C3', 400);
      setStreak(0);
    }
  };

  const nextChallenge = () => {
    stopEarTrainingInterval();
    setSelectedAnswer(null);
    setIsCorrect(null);
    if (currentChallengeIndex === round.length - 1) {
      setRound(shuffleEarChallenges(EAR_CHALLENGES, current.id));
      setCurrentChallengeIndex(0);
    } else {
      setCurrentChallengeIndex(prev => prev + 1);
    }
  };

  return (
    <>
    <nav aria-label="Hallásfeladatok típusa" className="max-w-3xl mx-auto px-4 pt-8 flex gap-3 flex-wrap">
      <button type="button" aria-pressed={trainingTab==='intervals'} onClick={()=>{stopEarTrainingInterval();setTrainingTab('intervals')}}
        className={`px-5 py-3 rounded-xl text-sm font-semibold border ${trainingTab==='intervals'?'bg-indigo-600 text-white border-indigo-600':'bg-white text-slate-800 border-slate-300'}`}>Hangközök felismerése</button>
      <button type="button" aria-pressed={trainingTab==='collections'} onClick={()=>{stopEarTrainingInterval();setTrainingTab('collections')}}
        className={`px-5 py-3 rounded-xl text-sm font-semibold border ${trainingTab==='collections'?'bg-indigo-600 text-white border-indigo-600':'bg-white text-slate-800 border-slate-300'}`}>Hangkészletek és párosítás</button>
      <button type="button" aria-pressed={trainingTab==='extended'} onClick={()=>{stopEarTrainingInterval();setTrainingTab('extended')}}
        className={`px-5 py-3 rounded-xl text-sm font-semibold border ${trainingTab==='extended'?'bg-indigo-600 text-white border-indigo-600':'bg-white text-slate-800 border-slate-300'}`}>Hangsorok, ritmusok, hangértékek</button>
    </nav>
    <p className="max-w-3xl mx-auto px-4 mt-3 text-sm text-slate-600">
      Hallásfejlesztési gyakorlásért naponta összesen legfeljebb 100 XP gyűjthető.
      A további ismétlések korlátozás nélkül gyakorolhatók, de már nem adnak új XP-t.
      Az XP játékos gyakorlási pont, nem vizsgajegy.
    </p>
    {trainingTab==='extended' ? <ExtendedEarTraining onAddXp={onAddXp}/> : trainingTab==='collections' ? <PitchCollectionTraining onAddXp={onAddXp}/> : (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-900" aria-label="Hangközök felismerése">
      <div className="text-center mb-6">
        <p className="text-xs uppercase font-bold tracking-widest text-indigo-700 mb-2">Hallásfejlesztés · hangközök</p>
        <h2 className="text-3xl font-bold mb-3 text-slate-900">Hangközök felismerése</h2>
        <p className="text-sm text-slate-600">Hallgasd meg a két egymás után megszólaló hangot, majd válaszd ki a helyes hangközt!</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-5 sm:p-8 text-center">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-semibold text-indigo-700">
            Kihívás {currentChallengeIndex + 1} / {round.length} · véletlen sorrend
          </span>
          <span className="text-xs font-semibold text-indigo-700">
            Sorozat: {streak} helyes
          </span>
        </div>

        <div className="my-8">
          <button
            type="button"
            aria-label="Hangközpár lejátszása"
            onClick={playChallenge}
            className="w-20 h-20 rounded-full bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center mx-auto transition-colors focus-visible:outline focus-visible:outline-4 focus-visible:outline-indigo-400"
          >
            <Play className="w-9 h-9 fill-white ml-1" />
          </button>
          <p className="text-sm text-slate-600 mt-4 font-medium">Hallgasd meg a két hosszabb, lágy hangot!</p>
          <p className="text-xs text-slate-500 mt-1">Újrahallgatáshoz kattints ismét a lejátszásra.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {EAR_CHALLENGES.map((ch) => {
            let btnClass = 'bg-slate-50 hover:bg-indigo-50 text-slate-900 border-slate-200';
            if (selectedAnswer !== null) {
              if (ch.title === current.title) {
                btnClass = 'bg-emerald-100 border-emerald-600 text-emerald-900';
              } else if (ch.title === selectedAnswer) {
                btnClass = 'bg-rose-100 border-rose-500 text-rose-800';
              } else {
                btnClass = 'bg-slate-50 border-slate-200 text-slate-500';
              }
            }

            return (
              <button
                type="button"
                key={ch.id}
                disabled={selectedAnswer !== null}
                onClick={() => handleGuess(ch.title)}
                className={`p-3 sm:p-4 rounded-xl font-semibold text-sm transition-colors border focus-visible:outline focus-visible:outline-4 focus-visible:outline-indigo-400 ${btnClass}`}
              >
                {ch.title}
              </button>
            );
          })}
        </div>

        {selectedAnswer !== null && (
          <div role="status" className="mt-6 pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <p className={`font-bold text-sm ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                {isCorrect ? 'Helyes válasz! Szereztél +25 XP-t.' : `Helytelen. A helyes válasz: ${current.title}`}
              </p>
              <p className="text-xs text-slate-600 mt-1">{current.description}</p>
            </div>
            <button
              type="button"
              onClick={nextChallenge}
              className="px-5 py-3 rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white text-sm font-semibold shrink-0 focus-visible:outline focus-visible:outline-4 focus-visible:outline-indigo-400"
            >
              {currentChallengeIndex === round.length - 1 ? 'Új, kevert kör indítása' : 'Következő kihívás'}
            </button>
          </div>
        )}
      </div>
    </section>)}
    </>
  );
};
