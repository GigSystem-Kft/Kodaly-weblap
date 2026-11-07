import React, { useState } from 'react';
import { FLASHCARDS_DATA } from '../data/musicData';
import { Sparkles, RotateCw, Check, ArrowRight, ArrowLeft, Volume2 } from 'lucide-react';
import { playNote } from '../utils/audio';

interface FlashcardsViewProps {
  onMasterCard: (id: string) => void;
  masteredCards: string[];
  initialCategory?: string;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ onMasterCard, masteredCards, initialCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const categories = ['all', ...Array.from(new Set(FLASHCARDS_DATA.map((f) => f.category)))];

  const filteredCards = selectedCategory === 'all'
    ? FLASHCARDS_DATA
    : FLASHCARDS_DATA.filter((f) => f.category === selectedCategory);

  const currentCard = filteredCards[currentIndex] || filteredCards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleMaster = () => {
    if (!masteredCards.includes(currentCard.id)) {
      onMasterCard(currentCard.id);
    }
    handleNext();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold mb-3 border border-indigo-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interaktív Szókártyák</span>
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Zenei Szakkifejezések Gyakorlása</h2>
        <p className="text-slate-600 text-sm">
          Kattints a kártyára vagy a gombra a definíció felfedéséhez! Sajátítsd el a fogalmakat és gyűjts XP-t.
        </p>
      </div>

      {/* Compact category filter: keep the flashcards visible without long button grids. */}
      <div className="max-w-xl mx-auto mb-8">
        <label htmlFor="flashcards-category" className="block text-sm font-semibold text-slate-800 mb-2">Szókártyák témaköre</label>
        <select
          id="flashcards-category"
          aria-label="Szókártyák témaköre"
          value={selectedCategory}
          onChange={(event) => {
            setSelectedCategory(event.target.value);
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className="w-full rounded-xl border border-indigo-400/50 bg-slate-900 text-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {categories.map((cat) => (
            <option value={cat} key={cat}>{cat === 'all' ? 'Összes kategória' : cat}</option>
          ))}
        </select>
        <p className="text-xs text-slate-600 mt-2">{filteredCards.length} szókártya a kiválasztott témakörben</p>
      </div>

      {/* Flashcard Box */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full h-80 sm:h-96 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border border-indigo-500/40 rounded-3xl p-8 flex flex-col justify-between shadow-2xl cursor-pointer hover:border-indigo-400 transition-all mb-8 relative group"
      >
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
            {currentCard.category}
          </span>
          <span className="text-xs text-slate-300 font-medium">
            {currentIndex + 1} / {filteredCards.length}
          </span>
        </div>

        <div className="text-center my-auto">
          {!isFlipped ? (
            <div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
                {currentCard.term}
              </h3>
              <p className="text-indigo-300 text-xs flex items-center justify-center space-x-1.5 font-medium">
                <RotateCw className="w-4 h-4 animate-spin-slow" />
                <span>Kattints ide a magyarázatért</span>
              </p>
            </div>
          ) : (
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-violet-400 mb-2 block">Definíció</span>
              <p className="text-lg sm:text-xl text-slate-100 font-medium leading-relaxed">
                {currentCard.definition}
              </p>
              <p className="text-slate-300 text-xs mt-4">Kattints a visszafordításhoz</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          {!currentCard.category.startsWith('Zenei kifejezések') && !currentCard.category.startsWith('Elméleti gyakorlás') && !['Kreatív zenei nevelés','Zenetörténet','Zenetörténet – alkotók'].includes(currentCard.category) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                playNote('C5', 400);
              }}
              className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-slate-700"
              title="Példahang lejátszása (C5)"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          )}
          <span className="text-xs text-slate-300 group-hover:text-white transition-colors">
            {isFlipped ? 'Mutasd a kifejezést' : 'Mutasd a jelentést'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-all border border-slate-700 flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Előző</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleMaster}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-all shadow-lg shadow-emerald-600/30 flex items-center space-x-2"
          >
            <Check className="w-4 h-4" />
            <span>Tudom (+15 XP)</span>
          </button>
        </div>

        <button
          onClick={handleNext}
          className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all shadow-lg shadow-indigo-600/30 flex items-center space-x-2"
        >
          <span>Következő</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Stats footer */}
      <div className="mt-8 text-center text-xs text-slate-600">
        Megtanult kártyák: <span className="font-bold text-emerald-700">{masteredCards.length}</span> / {FLASHCARDS_DATA.length}
      </div>
    </div>
  );
};
