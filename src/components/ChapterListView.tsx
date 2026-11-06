import React from 'react';
import { MUSIC_CHAPTERS } from '../data/musicData';
import { Chapter, UserProgress } from '../types';
import { CheckCircle2, ChevronRight } from 'lucide-react';

interface ChapterListViewProps {
  onSelectChapter: (chapter: Chapter) => void;
  progress: UserProgress;
  onOpenCreative: () => void;
}

export const ChapterListView: React.FC<ChapterListViewProps> = ({ onSelectChapter, progress, onOpenCreative }) => {
  const totalChapters = MUSIC_CHAPTERS.length + 1;
  const completedCount = MUSIC_CHAPTERS.filter(chapter => progress.completedChapters.includes(chapter.id)).length;

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_1px_1.2fr] px-6 md:px-12 py-12 gap-8 lg:gap-0 overflow-hidden">
      {/* Left Section */}
      <div className="flex flex-col justify-between pr-0 lg:pr-12 overflow-y-auto">
        <div>
          <div className="font-serif-cormorant text-5xl md:text-7xl font-semibold leading-[0.95] mb-6 text-[#1c1c1c]">
            A zenei<br />ismeretek<br />művészete.
          </div>
          <p className="font-sans text-base md:text-lg leading-relaxed text-[#1c1c1c]/70 mb-8 max-w-lg">
            Interaktív egyetemi tananyag kisgyermeknevelő, óvodapedagógus és tanító szakos hallgatóknak a MATE gondozásában. Ismerd meg a ritmust, hangközöket, dúr és moll hangsorokat.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-6 border-t border-[#1c1c1c]/10">
          <button
            onClick={() => onSelectChapter(MUSIC_CHAPTERS[0])}
            className="px-8 py-4 bg-[#1c1c1c] text-[#fdfcf8] hover:bg-[#4a54e1] transition-colors font-mono-jetbrains text-[0.8rem] font-semibold tracking-widest uppercase cursor-pointer text-center shadow-lg"
          >
            Kurzus indítása
          </button>
          <div className="flex gap-6 font-mono-jetbrains text-[0.75rem] text-[#1c1c1c]/70">
            <div>STREAK: <b className="text-[#4a54e1]">{progress.streak} NAP</b></div>
            <div>XP: <b className="text-[#4a54e1]">{progress.xp} XP</b></div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden lg:block bg-[#1c1c1c]/15" />

      {/* Right Section */}
      <div className="flex flex-col pl-0 lg:pl-12 overflow-y-auto">
        <div className="flex justify-between items-center mb-6 font-mono-jetbrains text-[0.7rem] text-[#1c1c1c]/60">
          <span>TANANYAG ({totalChapters} FEJEZET)</span>
          <span>TELJESÍTVE: {completedCount}/{MUSIC_CHAPTERS.length} ELMÉLETI FEJEZET</span>
        </div>

        <div className="flex flex-col gap-[2px] bg-[#1c1c1c]/10 rounded-2xl overflow-hidden border border-[#1c1c1c]/10">
          {MUSIC_CHAPTERS.map((chapter) => {
            const isCompleted = progress.completedChapters.includes(chapter.id);
            const numStr = chapter.number < 10 ? `0${chapter.number}` : `${chapter.number}`;

            return (
              <div
                key={chapter.id}
                onClick={() => onSelectChapter(chapter)}
                className="bg-[#fdfcf8] hover:bg-[#f5f4ef] p-6 grid grid-cols-[3rem_1fr_auto] gap-4 items-center transition-colors cursor-pointer group"
              >
                <div className="font-mono-jetbrains text-[0.8rem] text-[#1c1c1c]/50 font-medium">
                  {numStr}
                </div>
                <div>
                  <h4 className="font-serif-cormorant text-xl font-bold mb-1 text-[#1c1c1c] group-hover:text-[#4a54e1] transition-colors">
                    {chapter.title}
                  </h4>
                  <p className="text-xs text-[#1c1c1c]/60 line-clamp-1 leading-normal">
                    {chapter.description}
                  </p>
                </div>
                <div>
                  {isCompleted ? (
                    <div className="w-6 h-6 rounded-full border border-[#4a54e1] flex items-center justify-center text-[#4a54e1] text-xs font-bold">
                      ✓
                    </div>
                  ) : (
                    <ChevronRight className="w-5 h-5 text-[#1c1c1c]/30 group-hover:text-[#4a54e1] transition-colors" />
                  )}
                </div>
              </div>
            );
          })}
          <button type="button" onClick={onOpenCreative}
            className="w-full text-left bg-[#fdfcf8] hover:bg-[#f5f4ef] p-6 grid grid-cols-[3rem_1fr_auto] gap-4 items-center transition-colors cursor-pointer group">
            <span className="font-mono-jetbrains text-[0.8rem] text-[#1c1c1c]/50 font-medium">06</span>
            <span>
              <span className="block font-serif-cormorant text-xl font-bold mb-1 text-[#1c1c1c] group-hover:text-[#4a54e1] transition-colors">
                Kreatív zenei nevelés
              </span>
              <span className="block text-xs text-[#1c1c1c]/60 leading-normal">
                Énekes-játékok, ritmikus mozgás és kipróbálható, forrásmegjelölt zenepedagógiai jógyakorlatok.
              </span>
            </span>
            <ChevronRight className="w-5 h-5 text-[#1c1c1c]/30 group-hover:text-[#4a54e1]" />
          </button>
        </div>
      </div>
    </div>
  );
};
