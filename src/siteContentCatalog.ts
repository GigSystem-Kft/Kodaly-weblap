import { MUSIC_CHAPTERS } from './data/musicData';

export type EditableSiteField = {
  id: string;
  section: string;
  label: string;
  fallback: string;
};

const homepage: EditableSiteField[] = [
  { id: 'home.title', section: 'Főoldal', label: 'Nagy címsor',
    fallback: 'A zenei\nismeretek\nművészete.' },
  { id: 'home.intro', section: 'Főoldal', label: 'Bevezető szöveg',
    fallback: 'Interaktív egyetemi tananyag kisgyermeknevelő, óvodapedagógus és tanító szakos hallgatóknak a MATE gondozásában. Ismerd meg a ritmust, hangközöket, dúr és moll hangsorokat.' }
];

const navigation: EditableSiteField[] = [
  ['chapters','01. Tananyag'],
  ['flashcards','02. Szókártyák'],
  ['matching','03. Játék'],
  ['quiz','04. Teszt'],
  ['eartraining','05. Hallás'],
  ['dashboard','06. Profil'],
].map(([id,fallback]) => ({
  id: 'navbar.' + id, section: 'Felső menü', label: fallback, fallback
}));

const modules: EditableSiteField[] = [
  ['creative','Kreatív zenei nevelés',
    'Énekes-játékok, ritmikus mozgás és kipróbálható, forrásmegjelölt zenepedagógiai jógyakorlatok.'],
  ['musicHistory','Zenetörténet',
    'Korszakok az ókortól a 20. századig, jellegzetes műfajok, zeneszerzők és több Wikipédia-forrás.'],
  ['musicPedagogy','Ének-zene tantárgy-pedagógia',
    'Kelemen Judit szakirodalma nyomán: 17 részletes egyetemi témakör, módszertani feladatok és önellenőrzés.'],
  ['musicExpressions','Zenei kifejezések',
    '1793 kereshető zenei fogalom, betűrend és tematikus kategóriák, szókártyák, párosító és kvíz.']
].flatMap(([id,title,description]) => [
  { id: 'module.' + id + '.title', section: '06–09. modulok – főoldali kártyák',
    label: title + ' – cím', fallback: title },
  { id: 'module.' + id + '.description', section: '06–09. modulok – főoldali kártyák',
    label: title + ' – leírás', fallback: description }
]);

const chapters: EditableSiteField[] = MUSIC_CHAPTERS.flatMap(chapter => [
  { id: 'chapter.' + chapter.id + '.title', section: 'Tananyag – ' + chapter.title,
    label: 'Fejezet címe', fallback: chapter.title },
  { id: 'chapter.' + chapter.id + '.description', section: 'Tananyag – ' + chapter.title,
    label: 'Fejezet bevezetője', fallback: chapter.description },
  ...chapter.subchapters.flatMap(sub => [
    { id: 'sub.' + sub.id + '.title', section: chapter.title + ' / ' + sub.title,
      label: 'Alfejezet címe', fallback: sub.title },
    { id: 'sub.' + sub.id + '.summary', section: chapter.title + ' / ' + sub.title,
      label: 'Rövid összefoglaló', fallback: sub.summary },
    ...sub.content.map((text, index) => ({
      id: 'sub.' + sub.id + '.paragraph.' + index,
      section: chapter.title + ' / ' + sub.title,
      label: 'Bekezdés ' + (index + 1),
      fallback: text
    }))
  ])
]);

// Existing chapter/subchapter IDs and quiz datasets are not editable here,
// so completed lessons, favorites, and scores keep their identity.
export const EDITABLE_SITE_FIELDS: EditableSiteField[] = [
  ...homepage, ...navigation, ...modules, ...chapters
];
