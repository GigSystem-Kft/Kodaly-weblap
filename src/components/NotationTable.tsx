import React, { useState } from 'react';
import { ImageLightbox } from './ImageLightbox';
import { Table, Music, Eye, Clock, Volume2 } from 'lucide-react';
import { playNote } from '../utils/audio';

import egeszImg from '../assets/images/ritmus_egesz.png';
import felImg from '../assets/images/ritmus_fel.png';
import negyedImg from '../assets/images/ritmus_negyed.png';
import nyolcadImg from '../assets/images/ritmus_nyolcad.png';
import tizenhatodImg from '../assets/images/ritmus_tizenhatod.png';
import szunetekImg from '../assets/images/ritmus_szunetek.png';

const NOTATION_DATA = [
  {
    name: 'Egész érték',
    english: 'Semi-breve / Whole note',
    beats: '4 egység (4 negyed)',
    practiceName: 'tá - á - á - á',
    rest: 'Egész szünet (4 ütem)',
    image: egeszImg,
    soundNote: 'C4'
  },
  {
    name: 'Fél érték',
    english: 'Minim / Half note',
    beats: '2 egység (2 negyed)',
    practiceName: 'tá - á',
    rest: 'Fél szünet (2 ütem)',
    image: felImg,
    soundNote: 'E4'
  },
  {
    name: 'Negyed érték',
    english: 'Crotchet / Quarter note',
    beats: '1 egység (1 negyed - metrum alapértéke)',
    practiceName: 'tá',
    rest: 'Negyed szünet',
    image: negyedImg,
    soundNote: 'G4'
  },
  {
    name: 'Nyolcad érték',
    english: 'Quaver / Eighth note',
    beats: '1/2 egység (párban: ti - ti)',
    practiceName: 'ti - ti',
    rest: 'Nyolcad szünet',
    image: nyolcadImg,
    soundNote: 'C5'
  },
  {
    name: 'Tizenhatod érték',
    english: 'Semiquaver / Sixteenth note',
    beats: '1/4 egység (párban: ri - ri / ti-ri)',
    practiceName: 'ri - ri',
    rest: 'Tizenhatod szünet',
    image: tizenhatodImg,
    soundNote: 'E5'
  }
];

export const NotationTable: React.FC = () => {
  const [zoom, setZoom] = useState<{ src: string; alt: string } | null>(null);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
          <Table className="w-3.5 h-3.5" />
          <span>Összehasonlító Összefoglaló</span>
        </span>
        <h2 className="text-3xl font-extrabold text-white mb-2">Zenei Jelölések és Értékek Táblázata</h2>
        <p className="text-slate-400 text-sm">
          A ritmusértékek, szolmizációs gyakorló nevek, ütemértékek és szünetjelek áttekintő rendszere.
        </p>
      </div>

      {/* Overview Banner with Rests Image */}
      <div className="bg-slate-900/90 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 mb-10 shadow-xl grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-xl font-bold text-white">Zenei Csendek & Szünetjelek</h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            A ritmusértékekhez szünetjelek is társulnak. Az egyenletes lüktetés érzékeltetésénél nagy figyelmet kell fordítanunk a szünetekre, hiszen csak akkor tudjuk az egyenletességet érzékeltetni, ha a szünetre is mérünk, azaz lüktetünk.
          </p>
        </div>
        <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
          <img src={szunetekImg} alt="Szünetjelek" onClick={() => setZoom({ src: szunetekImg, alt: 'Szünetjelek' })} className="w-full h-40 object-contain bg-white cursor-zoom-in" />
        </div>
      </div>

      {/* Comparative Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/80 border-b border-slate-700 text-xs uppercase tracking-wider text-slate-300">
                <th className="p-4 sm:p-6">Jelölés / Kép</th>
                <th className="p-4 sm:p-6">Megnevezés</th>
                <th className="p-4 sm:p-6">Időtartam / Ütésérték</th>
                <th className="p-4 sm:p-6">Gyakorló Név</th>
                <th className="p-4 sm:p-6">Megfelelő Szünet</th>
                <th className="p-4 sm:p-6 text-center">Hangzó</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {NOTATION_DATA.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 sm:p-6">
                    <div className="w-40 h-20 rounded-xl overflow-hidden bg-slate-950 border border-slate-700">
                      <img src={row.image} alt={row.name} onClick={() => setZoom({ src: row.image, alt: row.name })} className="w-full h-full object-contain bg-white cursor-zoom-in" />
                    </div>
                  </td>
                  <td className="p-4 sm:p-6">
                    <h4 className="font-bold text-white text-sm">{row.name}</h4>
                    <span className="text-xs text-slate-400">{row.english}</span>
                  </td>
                  <td className="p-4 sm:p-6">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {row.beats}
                    </span>
                  </td>
                  <td className="p-4 sm:p-6 font-mono text-xs font-bold text-emerald-400">
                    {row.practiceName}
                  </td>
                  <td className="p-4 sm:p-6 text-xs text-slate-300">
                    {row.rest}
                  </td>
                  <td className="p-4 sm:p-6 text-center">
                    <button
                      onClick={() => playNote(row.soundNote, 500)}
                      className="p-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 transition-all inline-flex items-center justify-center shadow-md"
                      title="Hang lejátszása"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {zoom && <ImageLightbox src={zoom.src} alt={zoom.alt} onClose={() => setZoom(null)} />}
    </div>
  );
};
