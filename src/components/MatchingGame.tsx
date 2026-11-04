import React, { useState, useEffect } from 'react';
import { MATCHING_PAIRS } from '../data/musicData';
import { MatchingPair } from '../types';
import { Layers, RotateCcw, Award, CheckCircle2 } from 'lucide-react';
import { playNote } from '../utils/audio';

interface MatchingGameProps {
  onAddXp: (amount: number) => void;
  initialCategory?: string;
}

export const MatchingGame: React.FC<MatchingGameProps> = ({ onAddXp, initialCategory }) => {
  const [terms, setTerms] = useState<{ id: string; text: string; pairId: string }[]>([]);
  const [matches, setMatches] = useState<{ id: string; text: string; pairId: string }[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const initGame = () => {
    const categoryPairs = initialCategory
      ? MATCHING_PAIRS.filter((pair) => pair.category === initialCategory)
      : MATCHING_PAIRS;
    const subset = initialCategory ? categoryPairs : categoryPairs.slice(0, 6);
    const tList = subset.map((p) => ({ id: p.id, text: p.term, pairId: p.id })).sort(() => Math.random() - 0.5);
    const mList = subset.map((p) => ({ id: p.id + '-m', text: p.match, pairId: p.id })).sort(() => Math.random() - 0.5);
    setTerms(tList);
    setMatches(mList);
    setMatchedPairs([]);
    setSelectedTerm(null);
    setSelectedMatch(null);
    setScore(0);
    setIsCompleted(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleSelectTerm = (id: string, pairId: string) => {
    if (matchedPairs.includes(pairId)) return;
    setSelectedTerm(id);
    if (selectedMatch !== null) {
      checkPair(id, selectedMatch);
    }
  };

  const handleSelectMatch = (matchId: string, pairId: string) => {
    if (matchedPairs.includes(pairId)) return;
    setSelectedMatch(matchId);
    if (selectedTerm !== null) {
      checkPair(selectedTerm, matchId);
    }
  };

  const checkPair = (termId: string, matchId: string) => {
    const termObj = terms.find((t) => t.id === termId);
    const matchObj = matches.find((m) => m.id === matchId);

    if (termObj && matchObj && termObj.pairId === matchObj.pairId) {
      // Correct match!
      playNote('C5', 300);
      const newMatched = [...matchedPairs, termObj.pairId];
      setMatchedPairs(newMatched);
      setScore((prev) => prev + 20);
      setSelectedTerm(null);
      setSelectedMatch(null);

      if (newMatched.length === terms.length) {
        setIsCompleted(true);
        onAddXp(50);
      }
    } else {
      // Incorrect
      playNote('C3', 300);
      setTimeout(() => {
        setSelectedTerm(null);
        setSelectedMatch(null);
      }, 500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
          <Layers className="w-3.5 h-3.5" />
          <span>{initialCategory ? `${initialCategory} párosító` : 'Párosítós Feladat'}</span>
        </span>
        <h2 className="text-3xl font-extrabold text-white mb-2">
          {initialCategory ? `${initialCategory}: párosítsd össze!` : 'Kifejezés & Jelentés Párosítás'}
        </h2>
        <p className="text-slate-400 text-sm">
          Kattints egy kifejezésre, majd a hozzá tartozó jelentésre a párok megtalálásához!
        </p>
      </div>

      {isCompleted ? (
        <div className="bg-slate-900/90 border border-emerald-500/40 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Gratulálok! Sikeres Párosítás!</h3>
          <p className="text-slate-300 mb-6">Minden párt sikeresen megtaláltál. Szereztél +50 XP-t!</p>
          <button
            onClick={initGame}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all shadow-lg shadow-indigo-600/30 flex items-center space-x-2 mx-auto"
          >
            Új játék indítása
          </button>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-medium text-slate-300">
              Megtalált párok: <strong className="text-emerald-400">{matchedPairs.length}</strong> / {terms.length}
            </span>
            <button
              onClick={initGame}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Újrakezdés</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Terms Column */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Fogalmak / Kifejezések</h4>
              {terms.map((t) => {
                const isMatched = matchedPairs.includes(t.pairId);
                const isSelected = selectedTerm === t.id;
                return (
                  <button
                    key={t.id}
                    disabled={isMatched}
                    onClick={() => handleSelectTerm(t.id, t.pairId)}
                    className={`w-full text-left p-4 rounded-2xl font-medium text-sm transition-all border ${
                      isMatched
                        ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300 opacity-50 cursor-not-allowed'
                        : isSelected
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30'
                        : 'bg-slate-900/80 border-slate-800 text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {t.text}
                  </button>
                );
              })}
            </div>

            {/* Matches Column */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Jelentések / Példák</h4>
              {matches.map((m) => {
                const isMatched = matchedPairs.includes(m.pairId);
                const isSelected = selectedMatch === m.id;
                return (
                  <button
                    key={m.id}
                    disabled={isMatched}
                    onClick={() => handleSelectMatch(m.id, m.pairId)}
                    className={`w-full text-left p-4 rounded-2xl font-medium text-sm transition-all border ${
                      isMatched
                        ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300 opacity-50 cursor-not-allowed'
                        : isSelected
                        ? 'bg-violet-600 border-violet-400 text-white shadow-lg shadow-violet-600/30'
                        : 'bg-slate-900/80 border-slate-800 text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {m.text}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
