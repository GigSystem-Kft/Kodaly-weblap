import React, { useEffect, useState } from 'react';
import { Volume2, Play, Award, CheckCircle2, RotateCcw } from 'lucide-react';
import { playNote, playEarTrainingInterval, stopEarTrainingInterval } from '../utils/audio';
import { shuffleEarChallenges } from '../utils/earTraining';
import { PitchCollectionTraining } from './PitchCollectionTraining';

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
  const [trainingTab,setTrainingTab] = useState<'intervals'|'collections'>('intervals');
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
    </nav>
    {trainingTab==='collections' ? <PitchCollectionTraining onAddXp={onAddXp}/> : (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
          <Volume2 className="w-3.5 h-3.5" />
          <span>Hallásfejlesztés & Intervallumok</span>
        </span>
        <h2 className="text-3xl font-extrabold text-white mb-2">Fülre Hallás & Hangköz Felismerés</h2>
        <p className="text-slate-400 text-sm">
          Hallgasd meg a lejátszott hangközt vagy akkordot, majd találd el a helyes megnevezést!
        </p>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-center">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-bold text-indigo-400">
            Kihívás {currentChallengeIndex + 1} / {round.length} · véletlen sorrend
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-medium">
            Sorozat: {streak} helyes
          </span>
        </div>

        <div className="my-8">
          <button
            onClick={playChallenge}
            className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 text-white flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/30 hover:scale-105 transition-transform"
          >
            <Play className="w-10 h-10 fill-white ml-1" />
          </button>
          <p className="text-sm text-slate-300 mt-4 font-medium">Hallgasd meg a két hosszabb, lágy hangot!</p>
          <p className="text-xs text-slate-400 mt-1">Újrahallgatáshoz kattints ismét a lejátszásra.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {EAR_CHALLENGES.map((ch) => {
            let btnClass = 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700';
            if (selectedAnswer !== null) {
              if (ch.title === current.title) {
                btnClass = 'bg-emerald-950/50 border-emerald-500 text-emerald-200';
              } else if (ch.title === selectedAnswer) {
                btnClass = 'bg-rose-950/50 border-rose-500 text-rose-200';
              } else {
                btnClass = 'bg-slate-900 border-slate-800 text-slate-500 opacity-50';
              }
            }

            return (
              <button
                key={ch.id}
                disabled={selectedAnswer !== null}
                onClick={() => handleGuess(ch.title)}
                className={`p-4 rounded-2xl font-medium text-sm transition-all border ${btnClass}`}
              >
                {ch.title}
              </button>
            );
          })}
        </div>

        {selectedAnswer !== null && (
          <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <p className={`font-bold text-sm ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isCorrect ? 'Helyes válasz! Szereztél +25 XP-t.' : `Helytelen. A helyes válasz: ${current.title}`}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{current.description}</p>
            </div>
            <button
              onClick={nextChallenge}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all shadow-lg shadow-indigo-600/30 shrink-0"
            >
              {currentChallengeIndex === round.length - 1 ? 'Új, kevert kör indítása' : 'Következő kihívás'}
            </button>
          </div>
        )}
      </div>
    </div>)}
    </>
  );
};
