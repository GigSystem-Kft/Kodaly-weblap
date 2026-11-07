// A korábban a 02. Hangértékek galériában szereplő ábrák tananyaghoz rendelve.
// A képek forrása változatlan, ugyanazokat használja a galéria és a leckék.
import egesz from '../assets/images/ritmus_egesz.png';
import fel from '../assets/images/ritmus_fel.png';
import negyed from '../assets/images/ritmus_negyed.png';
import nyolcad from '../assets/images/ritmus_nyolcad.png';
import tizenhatod from '../assets/images/ritmus_tizenhatod.png';
import szunetek from '../assets/images/ritmus_szunetek.png';
import abc from '../assets/images/elmelet_abc.png';
import kulcsok from '../assets/images/elmelet_kulcsok.png';
import jelek from '../assets/images/elmelet_jelek.png';
import utemmutatok from '../assets/images/elmelet_utemmutatok.png';
import utemmutatok2 from '../assets/images/elmelet_utemmutatok2.png';
import ritmusok from '../assets/images/elmelet_ritmusok.png';
import hangsor from '../assets/images/elmelet_hangsor.png';
import hangkozok from '../assets/images/elmelet_hangkozok.png';
import durok from '../assets/images/elmelet_durok.png';

export interface LessonIllustration {
  title: string;
  description: string;
  image: string;
}

const illustration = (title: string, description: string, image: string): LessonIllustration =>
  ({title, description, image});

export const LESSON_ILLUSTRATIONS: Record<string, LessonIllustration[]> = {
  'ritmus-alapok': [
    illustration('Egész hangérték', 'Négy negyednyi időérték.', egesz),
    illustration('Fél hangérték', 'Két negyednyi időérték.', fel),
    illustration('Negyed hangérték', 'Egy negyednyi időérték.', negyed),
    illustration('Nyolcad hangérték', 'Két nyolcad ér egy negyedet.', nyolcad),
    illustration('Tizenhatod hangérték', 'Négy tizenhatod ér egy negyedet.', tizenhatod)
  ],
  'ritmuskepsz': [
    illustration('Ritmusképletek', 'Éles ritmus, nyújtott ritmus, szinkópa és triola.', ritmusok),
    illustration('Szünetjelek', 'A zenei csend értékei és kottajelei.', szunetek)
  ],
  'tempo-utem': [
    illustration('Ütemmutatók I.', 'Egyszerű ütemfajták és hangértékek.', utemmutatok),
    illustration('Ütemmutatók II.', 'Összetett ütemek, 6/8-os csoportosítás és hangsúlyrend.', utemmutatok2)
  ],
  'ritmus-gyakorlatok': [
    illustration('Ritmusértékek', 'A különböző hangértékek felismerése.', nyolcad),
    illustration('Ritmusképletek', 'Ritmusolvasás összetett képletekkel.', ritmusok)
  ],
  'abszolutm-hangok': [
    illustration('ABC-s hangnevek és oktávok', 'Hangnevek elhelyezkedése a vonalrendszeren.', abc),
    illustration('Zenei kulcsok', 'G-, F- és C-kulcs összehasonlítása.', kulcsok)
  ],
  'modositok': [
    illustration('Módosító jelek', 'Kereszt, bé és kapcsolódó kottajelek.', jelek),
    illustration('Dúr hangsorok előjegyzései', 'C-, G-, D-, F- és B-dúr előjegyzések és a feloldójel használata.', durok)
  ],
  'kottaolvasas': [
    illustration('Zenei kulcsok', 'A hangok helye a különböző kulcsokban.', kulcsok),
    illustration('ABC-s hangnevek', 'Oktávok és betűnevek szemléltetése.', abc)
  ],
  'szolmizacio-elonyai': [
    illustration('Hangsor és szolmizáció', 'A C-dúr skála hangnevei és szolmizációja.', hangsor)
  ],
  'hangkoz-fajtak': [
    illustration('Hangközök', 'Prím, szekund, terc, kvart, kvint, szext, szeptim és oktáv.', hangkozok)
  ],
  'hangkoz-szamitas': [
    illustration('Hangközök összehasonlítása', 'Hangközszámok és -minőségek kottapéldákkal.', hangkozok)
  ],
  'szolmizacio-alkalmazas': [
    illustration('Hangsor és fokok', 'A relatív szolmizáció kiindulópontja.', hangsor),
    illustration('Dúr hangnemek', 'Különböző hangnemek szolmizációs hangjai.', durok)
  ],
  'dúr-es-modalis': [
    illustration('Hangsor lépései', 'Egész- és félhanglépések a dúr hangsorban.', hangsor),
    illustration('Dúr hangsorok', 'Hangnemek és előjegyzések.', durok)
  ],
  'kvintkor': [
    illustration('Dúr előjegyzések', 'A kvintkör feldolgozásához használható előjegyzési példák.', durok)
  ],
  'moll-hangsorok': [
    illustration('Dúr hangsor szerkezete', 'A moll hangsorokkal történő összehasonlításhoz.', hangsor)
  ]
};
