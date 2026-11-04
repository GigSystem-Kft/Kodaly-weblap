import React from 'react';
import { TEXTBOOKS } from './TextbookView';
import { BookOpen, Award, Layers, Volume2, Flame, Sparkles, HelpCircle, Image as ImageIcon, Table } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  xp: number;
  streak: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, xp, streak }) => {
  const navItems = [
    { id: 'chapters', label: '01. Tananyag' },
    { id: 'gallery', label: '02. Ábratár' },
    { id: 'notationTable', label: '03. Jelölések' },
    { id: 'solfege', label: '04. Szolmizáció' },
    { id: 'abcNotes', label: '05. ABC-s hangok' },
    { id: 'flashcards', label: '06. Szókártyák' },
    { id: 'matching', label: '07. Játék' },
    { id: 'quiz', label: '08. Teszt' },
    { id: 'eartraining', label: '09. Hallás' },
    { id: 'dashboard', label: '10. Profil' },
  ];

  return (
    <header className="px-6 md:px-12 py-8 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#1c1c1c]/15 bg-[#fdfcf8]">
      <div className="brand cursor-pointer mb-4 md:mb-0" onClick={() => setActiveTab('chapters')}>
        <h1 className="font-serif-cormorant text-3xl md:text-4xl italic font-semibold leading-none mb-1 text-[#1c1c1c]">
          Kodály Zenei Műhely
        </h1>
        <p className="text-[0.7rem] tracking-widest uppercase text-[#1c1c1c]/60 font-medium">
          Zenei Ismeretek & Oktatási Portál
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`all-unset text-[0.75rem] font-medium tracking-wide uppercase cursor-pointer transition-colors ${
                  isActive
                    ? 'text-[#4a54e1] font-semibold underline underline-offset-4'
                    : 'text-[#1c1c1c]/60 hover:text-[#1c1c1c]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="relative group">
            <button
              className={`all-unset text-[0.75rem] font-medium tracking-wide uppercase cursor-pointer transition-colors ${
                activeTab.startsWith('textbook-')
                  ? 'text-[#4a54e1] font-semibold underline underline-offset-4'
                  : 'text-[#1c1c1c]/60 hover:text-[#1c1c1c]'
              }`}
            >
              11. Tankönyvek ▾
            </button>
            <div className="absolute left-0 top-full pt-2 hidden group-hover:block group-focus-within:block z-40">
              <div className="bg-white border border-[#1c1c1c]/15 shadow-md min-w-44 flex flex-col">
                {TEXTBOOKS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(`textbook-${t.id}`)}
                    className="all-unset text-left px-3 py-2 text-[0.75rem] font-medium tracking-wide uppercase cursor-pointer hover:bg-[#4a54e1]/10"
                  >
                    {t.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Stats */}
        <div className="flex items-center gap-3 text-[0.7rem] font-medium tracking-wide text-[#1c1c1c]/70">
          <div className="bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded">
            STREAK: <b className="text-amber-600">{streak} NAP</b>
          </div>
          <div className="bg-[#4a54e1]/10 border border-[#4a54e1]/30 px-2.5 py-1 rounded">
            XP: <b className="text-[#4a54e1]">{xp} XP</b>
          </div>
        </div>
      </div>
    </header>
  );
};
