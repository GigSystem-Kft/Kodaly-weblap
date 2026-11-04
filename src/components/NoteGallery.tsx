import React, { useState } from 'react';
import { ImageLightbox } from './ImageLightbox';
import { Image as ImageIcon, Sparkles, Music } from 'lucide-react';

import egeszImg from '../assets/images/ritmus_egesz.png';
import felImg from '../assets/images/ritmus_fel.png';
import negyedImg from '../assets/images/ritmus_negyed.png';
import nyolcadImg from '../assets/images/ritmus_nyolcad.png';
import tizenhatodImg from '../assets/images/ritmus_tizenhatod.png';
import szunetekImg from '../assets/images/ritmus_szunetek.png';

import elm_abc from '../assets/images/elmelet_abc.png';
import elm_kulcsok from '../assets/images/elmelet_kulcsok.png';
import elm_jelek from '../assets/images/elmelet_jelek.png';
import elm_utemmutatok from '../assets/images/elmelet_utemmutatok.png';
import elm_utemmutatok2 from '../assets/images/elmelet_utemmutatok2.png';
import elm_ritmusok from '../assets/images/elmelet_ritmusok.png';
import elm_hangsor from '../assets/images/elmelet_hangsor.png';
import elm_hangkozok from '../assets/images/elmelet_hangkozok.png';
import elm_durok from '../assets/images/elmelet_durok.png';

const THEORY = [
  { title: 'ABC-s nevek és oktávok', desc: 'A hangok betűnevei (c, d, e…) és az oktávtartományok: kis oktáv, egy-, két- és háromvonalas oktáv violin- és basszuskulcsban.', src: elm_abc },
  { title: 'Kulcsok', desc: 'Violinkulcs (G-kulcs), altkulcs (C-kulcs) és basszuskulcs (F-kulcs): ugyanazok a hangnevek más-más vonalon.', src: elm_kulcsok },
  { title: 'Módosított hangok és vonalak', desc: 'Alterált hangok (ciszt, disz…), enharmonikus párok, ütemvonal, dupla vonal, ismétlőjel és szaggatott vonal.', src: elm_jelek },
  { title: 'Ütemmutatók: 2/4, 3/4, 4/4, 5/4', desc: 'Ugyanaz az ütem fél, negyed, nyolcad és tizenhatod értékekkel kitöltve.', src: elm_utemmutatok },
  { title: 'Ütemmutatók: 6/4, 3/8, 6/8, 3/2', desc: 'Összetett és nyolcados ütemmutatók különböző ritmusfelosztással.', src: elm_utemmutatok2 },
  { title: 'Ritmusok', desc: 'Nyújtott ritmus, éles ritmus, szinkópa, kis változataik és a triola.', src: elm_ritmusok },
  { title: 'Hangsor és lépések', desc: 'A C-dúr hangsor betűnevekkel és szolmizációval; nagy (n2) és kis (k2) másodlépések.', src: elm_hangsor },
  { title: 'Hangközök', desc: 'Tiszta prímtől az oktávig: kis és nagy szekund, terc, kvart, kvint, szext, szeptim.', src: elm_hangkozok },
  { title: 'Dúr hangsorok előjegyzéssel', desc: 'C-, G-, D-, F- és B-dúr szolmizációs hangnevekkel.', src: elm_durok },
];

const NOTE_IMAGES = [
  { title: 'Egész Érték (Semi-breve)', desc: '4 ütemnyi időtartam, üres ovális fej vonalrendszeren.', src: egeszImg },
  { title: 'Fél Érték (Minim)', desc: '2 ütemnyi időtartam, üres fej és szár.', src: felImg },
  { title: 'Negyed Érték (Crotchet)', desc: '1 ütemnyi időtartam (lüktetés alapértéke), kitöltött fej és szár.', src: negyedImg },
  { title: 'Nyolcad Érték (Quaver)', desc: 'Fél ütemnyi időtartam, gerendával összekötött párban (ti-ti).', src: nyolcadImg },
  { title: 'Tizenhatod Érték (Semiquaver)', desc: 'Dupla gerendás gyorsabb ritmusérték (ri-ri).', src: tizenhatodImg },
  { title: 'Zenei Szünetjelek (Rests)', desc: 'Egész szünet, fél szünet, negyed szünet és nyolcad szünet.', src: szunetekImg },
];

export const NoteGallery: React.FC = () => {
  const [zoom, setZoom] = useState<{ src: string; alt: string } | null>(null);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Vizuális Illusztrációk</span>
        </span>
        <h2 className="text-3xl font-extrabold text-white mb-2">Ritmusértékek & Szünetjelek Galéria</h2>
        <p className="text-slate-400 text-sm">
          Szemléltető kottaképek a hangértékekről és zenei csendekről.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {NOTE_IMAGES.map((item, idx) => (
          <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col group hover:border-indigo-500/50 transition-all">
            <div className="relative overflow-hidden bg-white flex items-center">
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-auto object-contain cursor-zoom-in"
                onClick={() => setZoom({ src: item.src, alt: item.title })}
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{item.desc}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-indigo-400 font-medium flex items-center space-x-1.5">
                <Music className="w-3.5 h-3.5" />
                <span>Kodály Zenei Műhely Illusztráció</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <h3 className="text-2xl font-bold text-[#1c1c1c] mt-14 mb-6">Zeneelméleti áttekintés</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {THEORY.map((item) => (
          <figure key={item.title} className="bg-white border border-[#1c1c1c]/15 rounded-2xl overflow-hidden shadow-sm">
            <img src={item.src} alt={item.title} loading="lazy" className="w-full h-auto cursor-zoom-in" onClick={() => setZoom({ src: item.src, alt: item.title })} />
            <figcaption className="p-4 border-t border-[#1c1c1c]/10">
              <h4 className="font-bold text-[#1c1c1c]">{item.title}</h4>
              <p className="text-sm text-[#1c1c1c]/70">{item.desc}</p>
            </figcaption>
          </figure>
        ))}
      </div>
      {zoom && <ImageLightbox src={zoom.src} alt={zoom.alt} onClose={() => setZoom(null)} />}
    </div>
  );
};
