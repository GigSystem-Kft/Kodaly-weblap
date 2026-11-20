import React, { useState } from 'react';
import { headerBrandImage } from '../assets/headerBrandImage';
import { TEXTBOOKS } from './TextbookView';
import { BookOpen, Award, Layers, Volume2, Flame, Sparkles, HelpCircle, Image as ImageIcon, Table } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  xp: number;
  isAdmin?: boolean;
  streak: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, xp, streak, isAdmin = false }) => {
  const [textbooksOpen, setTextbooksOpen] = useState(false);
  const navItems = [
    { id: 'chapters', label: '01. Tananyag' },
    { id: 'flashcards', label: '02. Szókártyák' },
    { id: 'matching', label: '03. Játék' },
    { id: 'quiz', label: '04. Teszt' },
    { id: 'eartraining', label: '05. Hallás' },
    { id: 'dashboard', label: '06. Profil' },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin' }] : []),
  ];

  return (
    <header className="px-6 md:px-12 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#1c1c1c]/15 bg-[#fdfcf8]">
      <h1 className="brand shrink-0 mb-4 md:mb-0" aria-label="Zeneelméleti Műhely">
        <button
          type="button"
          className="cursor-pointer rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4a54e1]"
          onClick={() => setActiveTab('chapters')}
          aria-label="Zeneelméleti Műhely – vissza a tananyag főoldalára"
          title="Vissza a tananyag főoldalára"
        >
          <img
            src={headerBrandImage}
            alt="Zeneelméleti Műhely – Zenei Ismeretek és Oktatási Portál"
            className="h-[7.2rem] md:h-[8.4rem] w-auto object-contain"
            width="270"
            height="245"
            decoding="async"
            draggable={false}
          />
        </button>
      </h1>

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
                    : 'text-[#1c1c1c]/75 hover:text-[#1c1c1c]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="relative"
            onMouseEnter={() => setTextbooksOpen(true)}
            onMouseLeave={() => setTextbooksOpen(false)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setTextbooksOpen(false);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setTextbooksOpen(false);
                event.stopPropagation();
              }
            }}>
            <button
              type="button"
              aria-expanded={textbooksOpen}
              aria-controls="textbook-navigation"
              onClick={() => setTextbooksOpen(true)}
              className={`all-unset text-[0.75rem] font-medium tracking-wide uppercase cursor-pointer transition-colors ${
                activeTab.startsWith('textbook-')
                  ? 'text-[#4a54e1] font-semibold underline underline-offset-4'
                  : 'text-[#1c1c1c]/75 hover:text-[#1c1c1c]'
              }`}
            >
              07. Tankönyvek ▾
            </button>
            <div id="textbook-navigation" className={`absolute left-0 top-full pt-2 z-40 ${textbooksOpen ? 'block' : 'hidden'}`}>
              <div className="bg-white border border-[#1c1c1c]/15 shadow-md min-w-44 flex flex-col">
                {TEXTBOOKS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setActiveTab(`textbook-${t.id}`); setTextbooksOpen(false); }}
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
        <div className="flex items-center gap-3 text-[0.7rem] font-medium tracking-wide text-[#1c1c1c]/80">
          <div className="bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded">
            STREAK: <b className="text-amber-800">{streak} NAP</b>
          </div>
          <div className="bg-[#4a54e1]/10 border border-[#4a54e1]/30 px-2.5 py-1 rounded">
            XP: <b className="text-[#4a54e1]">{xp} XP</b>
          </div>
        </div>
      </div>
    </header>
  );
};
