import React, { useState, useEffect } from 'react';
import { MATCHING_PAIRS } from '../data/musicData';
import { Layers, RotateCcw, CheckCircle2 } from 'lucide-react';
import { playNote } from '../utils/audio';

// Use unbiased Fisher–Yates shuffling instead of a random comparator.
const shuffle = <T,>(items: T[]): T[] => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const matchingLabelKey = (text: string): string =>
  text.normalize('NFC').trim().replace(/\\s+/g, ' ').toLocaleLowerCase('hu-HU');

interface MatchingGameProps {
  onCompleted: (pairIds: string[]) => void;
  initialCategory?: string;
}

export const MatchingGame: React.FC<MatchingGameProps> = ({ onCompleted, initialCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory ?? 'all');
  const categories = ['all', ...new Set(MATCHING_PAIRS.map(pair => pair.category))];
  const [terms, setTerms] = useState<{ id: string; text: string; pairId: string }[]>([]);
  const [matches, setMatches] = useState<{ id: string; text: string; pairId: string }[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [feedback, setFeedback] = useState('');

  const initGame = () => {
    const categoryPairs = selectedCategory !== 'all'
      ? MATCHING_PAIRS.filter((pair) => pair.category === selectedCategory)
      : MATCHING_PAIRS;
    // Do not show visually indistinguishable answers with different pair IDs.
    // Such rounds are impossible to solve reliably from their visible labels.
    const termLabels = new Set<string>();
    const answerLabels = new Set<string>();
    const subset = shuffle(categoryPairs).filter(pair => {
      const term = matchingLabelKey(pair.term);
      const answer = matchingLabelKey(pair.match);
      if (!term || !answer || termLabels.has(term) || answerLabels.has(answer)) return false;
      termLabels.add(term);
      answerLabels.add(answer);
      return true;
    }).slice(0, 6);
    const tList = shuffle(subset.map(p => ({ id: p.id, text: p.term, pairId: p.id })));
    const mList = shuffle(subset.map(p => ({ id: p.id + '-m', text: p.match, pairId: p.id })));
    setTerms(tList);
    setMatches(mList);
    setMatchedPairs([]);
    setSelectedTerm(null);
    setSelectedMatch(null);
    setIsCompleted(false);
    setFeedback('');
  };

  useEffect(() => {
    initGame();
  }, [selectedCategory]);

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
      setFeedback(`Helyes párosítás! ${newMatched.length} / ${terms.length} pár megtalálva.`);
      setSelectedTerm(null);
      setSelectedMatch(null);

      if (newMatched.length === terms.length) {
        setIsCompleted(true);
        onCompleted(newMatched);
      }
    } else {
      // Incorrect: provide the same outcome without requiring audio.
      setFeedback('Ez a két elem nem tartozik össze. Próbáld újra!');
      playNote('C3', 300);
      // Immediately release the selection. A delayed timer could otherwise
      // erase a new selection made after restart or a rapid retry.
      setSelectedTerm(null);
      setSelectedMatch(null);
    }
  };

  if (selectedCategory !== 'all' && !MATCHING_PAIRS.some(pair => pair.category === selectedCategory)) {
    return <div className="max-w-4xl mx-auto px-4 py-8 text-slate-900">
      <h2 className="text-xl font-bold mb-3">Ehhez a témakörhöz még nincs párosító feladat</h2>
      <p className="mb-4">Válassz másik témakört a párosító gyakorláshoz.</p>
      <button type="button" onClick={() => setSelectedCategory('all')}
        className="rounded-lg bg-indigo-700 px-4 py-2 font-semibold text-white">Összes párosító feladat</button>
    </div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold mb-3 border border-indigo-200">
          <Layers className="w-3.5 h-3.5" />
          <span>{initialCategory ? `${initialCategory} párosító` : 'Párosítós Feladat'}</span>
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
          {initialCategory ? `${initialCategory}: párosítsd össze!` : 'Kifejezés & Jelentés Párosítás'}
        </h2>
        <p className="text-slate-600 text-sm">
          Kattints egy kifejezésre, majd a hozzá tartozó jelentésre a párok megtalálásához!
        </p>
        <p role="status" aria-live="polite" aria-atomic="true" className="mt-3 min-h-5 text-sm font-semibold text-slate-800">
          {feedback}
        </p>
      </div>

      <div className="max-w-xl mx-auto mb-7">
        <label htmlFor="matching-category" className="block mb-2 text-sm font-semibold text-slate-800">Párosító témaköre</label>
        <select id="matching-category" value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
          className="w-full rounded-xl border border-indigo-400/50 bg-slate-900 text-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          {categories.map(category=>(
            <option key={category} value={category}>{category==='all'?'Összes téma':category}</option>
          ))}
        </select>
      </div>
      {isCompleted ? (
        <div className="bg-slate-900/90 border border-emerald-500/40 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Gratulálok! Sikeres Párosítás!</h3>
          <p className="text-slate-300 mb-6">Minden párt sikeresen megtaláltál. A teljesítésedet rögzítjük. Minden új pár 5 gyakorlási XP-t ér, egy körben legfeljebb 50-et; a már megtanult párok ismétléséért nem jár új XP.</p>
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
            <span className="text-sm font-medium text-slate-700">
              Megtalált párok: <strong className="text-emerald-700">{matchedPairs.length}</strong> / {terms.length}
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
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Fogalmak / Kifejezések</h4>
              {terms.map((t) => {
                const isMatched = matchedPairs.includes(t.pairId);
                const isSelected = selectedTerm === t.id;
                return (
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    aria-label={`Fogalom: ${t.text}`}
                    key={t.id}
                    disabled={isMatched}
                    onClick={() => handleSelectTerm(t.id, t.pairId)}
                    className={`w-full text-left p-4 rounded-2xl font-medium text-sm transition-all border ${
                      isMatched
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200 cursor-not-allowed'
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
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Jelentések / Példák</h4>
              {matches.map((m) => {
                const isMatched = matchedPairs.includes(m.pairId);
                const isSelected = selectedMatch === m.id;
                return (
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    aria-label={`Jelentés: ${m.text}`}
                    key={m.id}
                    disabled={isMatched}
                    onClick={() => handleSelectMatch(m.id, m.pairId)}
                    className={`w-full text-left p-4 rounded-2xl font-medium text-sm transition-all border ${
                      isMatched
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200 cursor-not-allowed'
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
