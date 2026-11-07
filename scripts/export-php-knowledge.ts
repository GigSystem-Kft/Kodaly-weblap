import { mkdirSync, readFileSync, existsSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { MUSIC_CHAPTERS } from '../src/data/musicData';
import { VERIFIED_GLOSSARY } from '../src/data/verifiedMusicGlossary';
import { CURATED_MEDIA } from '../src/data/curatedMusicMedia';
import { FOUNDATIONS_GUIDES } from '../src/data/musicFoundationsGuide';
import { CREATIVE_WORKSHOPS, PEDAGOGY_WORKSHOPS } from '../src/data/hungarianDidacticWorkshops';
import { PEDAGOGY_SOURCE, PEDAGOGY_UNITS } from '../src/data/musicPedagogy';
import { DEEP_PEDAGOGY_LESSONS } from '../src/data/musicPedagogyDeep';
import { CREATIVE_SOURCE, CREATIVE_PRACTICES } from '../src/data/creativeEducation';
import { MUSIC_HISTORY } from '../src/data/musicHistory';
import { HISTORY_WORKSHOPS } from '../src/data/musicHistoryWorkshops';
import { COMPOSER_BIOGRAPHIES, GUIDED_LISTENING } from '../src/data/musicHistoryProfiles';
import { HISTORY_NOTE_INSIGHTS, HISTORY_TEXTBOOK_LINKS, HISTORY_VISUALS, HISTORY_RESOURCES, HISTORY_NOTE_SOURCE } from '../src/data/musicHistorySupplement';

type Entry = { source: string; label: string; text: string; creativePractice?: {
  id: string; title: string; theme: string; goal: string; materials: string;
  steps: string[]; observation: string; extension: string; page: string;
} };
const entries: Entry[] = [];
for (const concept of VERIFIED_GLOSSARY) {
 entries.push({source:concept.sourceTitle+' – '+concept.sourceUrl,
  label:'Ellenőrzött magyar zeneelméleti fogalomtár / '+concept.term+' ('+concept.keywords.join(', ')+')',
  text:[concept.definition,...concept.details,'Forrás: '+concept.sourceUrl].join('\\n\\n')});
}
for (const media of CURATED_MEDIA) {
 entries.push({source:'Ellenőrzött szemléltetőanyag-katalógus (a hivatkozott forrásoldal jogosult tartalma)',
  label:'Szemléltetés / '+media.title+' / '+media.chapters.map(n=>'0'+n).join(', '),
  text:['Cím: '+media.title,'Magyar ismertető: '+media.note,
    'Típus: '+media.kind,'Elérhetőség: '+media.url,
    ...(media.access?['Hozzáférés: '+media.access]:[]),
    ...(media.license?['Felhasználás: '+media.license]:[])].join('\\n')});
}
for (const chapter of MUSIC_CHAPTERS) {
  for (const sub of chapter.subchapters) {
    const text = [sub.summary, ...sub.content].filter(Boolean).join('\n\n');
    if (text.length > 12) entries.push({
      source: 'Zeneelméleti Műhely – Tananyag',
      label: `${chapter.title} / ${sub.title}`,
      text: text.slice(0, 5000)
    });
  }
}
for (const guide of FOUNDATIONS_GUIDES) {
 const chapter=MUSIC_CHAPTERS.find(c=>c.id===guide.chapterId);
 if (!chapter) continue;
 for (const section of guide.sections) {
  entries.push({
   source:'Zeneelméleti Műhely – magyar nyelvű saját magyarázat; szakmai alapok: NKP Ének-zene kézikönyvek, Kodály HUB, magyar zeneelméleti követelmények',
   label:`0${chapter.number}. ${chapter.title} / ${section.title}`,
   text:[...section.paragraphs,'Tanulási célok: '+guide.objectives.join('; '),
    'Gyakorlatok: '+guide.guidedPractice.join('; '),
    'Önellenőrzés: '+guide.selfCheck.map(item=>item.question+' – '+item.answer).join('; '),
    'Források: '+guide.sources.map(source=>source.url).join('; ')].join('\\n\\n')
  });
 }
}
for (const practice of CREATIVE_PRACTICES) {
  entries.push({
    source: `${CREATIVE_SOURCE.author} (${CREATIVE_SOURCE.year}) – ${CREATIVE_SOURCE.title} (módszertani feldolgozás)`,
    label: `Kreatív zenei nevelés / ${practice.theme} / ${practice.title}, ${practice.page} oldal`,
    text: [
      'Fejlesztési cél: ' + practice.goal,
      'Csoport: ' + practice.grouping,
      'Előkészítés: ' + practice.materials,
      ...practice.steps,
      'Megfigyelés: ' + practice.observation,
      'Továbbfejlesztés: ' + practice.extension
    ].join('\n'),
    creativePractice: {
      id: practice.id, title: practice.title, theme: practice.theme,
      goal: practice.goal, materials: practice.materials, steps: practice.steps,
      observation: practice.observation, extension: practice.extension, page: practice.page
    }
  });
}
for (const [category,workshops] of [['06. Kreatív zenei nevelés',CREATIVE_WORKSHOPS],['08. Ének-zene tantárgy-pedagógia',PEDAGOGY_WORKSHOPS]] as const) {
 for (const unit of workshops) {
  entries.push({source:'Magyar nyelvű módszertani feldolgozás – '+unit.sources.map(source=>source.label+' '+source.url).join('; '),
   label:category+' / '+unit.id+' / Részletes módszertani műhely',
   text:[...unit.aims,...unit.explanation,...unit.differentiation,...unit.evidence,
    ...unit.questions.flatMap(q=>[q.prompt,q.answer])].join('\n\n')});
 }
}
for (const period of MUSIC_HISTORY) {
  entries.push({
    source: 'Zenetörténet – önálló oktatási összefoglaló, magyar Wikipédia-szócikkek alapján',
    label: `Zenetörténet / ${period.name} / ${period.period}`,
    text: [
      period.lead,
      ...(period.sections ?? []).flatMap(section => [section.title, ...section.paragraphs]),
      'Jellemzők: ' + period.features.join('; '),
      'Műfajok: ' + period.genres.join('; '),
      'Zeneszerzők és személyek: ' + period.figures.join('; '),
      'Hallgatási feladat: ' + period.example,
      'Önellenőrző kérdés: ' + period.question,
      'Források: ' + period.sourceLinks.map(link => link.name + ' ' + link.url).join('; ')
    ].join('\\n')
  });
}
for (const workshop of HISTORY_WORKSHOPS) {
 const period=MUSIC_HISTORY.find(item=>item.id===workshop.periodId);
 if (!period) continue;
 entries.push({
  source:'Zenetörténet – önálló részletes korszakfeldolgozás; források: '+period.sourceLinks.map(link=>link.url).join('; '),
  label:'07. Zenetörténet / '+period.name+' / Tanulási műhely',
  text:[...workshop.goals,...workshop.context,...workshop.steps,workshop.question,
    workshop.modelAnswer,workshop.furtherPractice].join('\\n\\n')
 });
}
for(const item of HISTORY_NOTE_INSIGHTS){
 entries.push({source:HISTORY_NOTE_SOURCE+' – önálló, forráskritikus értelmezés',
  label:'07. Zenetörténet / '+item.periodId+' / '+item.title+' / '+item.pages.join('–')+'. oldal',
  text:[item.title,item.explanation,...item.listenFor,item.task,item.sampleAnswer,item.caution??''].join('\\n\\n')});
}
for(const item of HISTORY_TEXTBOOK_LINKS){
 entries.push({source:'NAT 2020 Ének-zene '+item.grade+'. osztály – zenetörténeti művek',
  label:'07. Zenetörténet / '+item.periodId+' / '+item.work+' / '+item.page+'. PDF-oldal',
  text:[item.work,'Tankönyv: '+item.grade+'. osztály, '+item.page+'. oldal',item.focus,item.activity].join('\\n')});
}
for(const item of HISTORY_VISUALS){
 entries.push({source:'Zenetörténet – történeti illusztráció, forrás és licenc',
  label:'07. Zenetörténet / '+item.periodId+' / '+item.title,
  text:[item.caption,item.sourceUrl,item.licenseNote].join('\\n')});
}
for(const item of HISTORY_RESOURCES){
 entries.push({source:'Zenetörténet – külső hang- és videóforrás',
  label:'07. Zenetörténet / '+item.periodId+' / '+item.title,
  text:[item.focus,item.url,item.availabilityNote??''].join('\\n')});
}
for (const profile of COMPOSER_BIOGRAPHIES) {
  entries.push({
    source: 'Zenetörténet – önálló tanulási portré, Wikipédia forráslinkkel',
    label: 'Zenetörténet / ' + profile.name,
    text: [
      profile.dates, profile.significance,
      'Kulcsfogalmak: ' + profile.keywords.join('; '),
      'Művek: ' + profile.works.join('; '),
      'Életrajzi forrás: ' + profile.sourceUrl
    ].join('\\n')
  });
}
for (const study of GUIDED_LISTENING) {
  entries.push({
    source: 'Zenetörténet – irányított, önálló műelemzés',
    label: 'Zenetörténet / Műelemzés / ' + study.title,
    text: [
      study.concept, study.before, ...study.during, study.after, study.sampleAnswer,
      'Forrás: ' + study.sourceUrl
    ].join('\\n')
  });
}
// Only original, attributed instructional summaries, NOT the original protected PDF text.
for (const unit of PEDAGOGY_UNITS) {
 for (const section of unit.sections) {
  entries.push({
   source: `${PEDAGOGY_SOURCE.author} (${PEDAGOGY_SOURCE.year}), ${PEDAGOGY_SOURCE.title} – saját módszertani feldolgozás, ${unit.page} oldal`,
   label: `08. Ének-zene tantárgy-pedagógia / ${unit.title} / ${section.heading}`,
   text: [
    'Tanulási cél: '+unit.goal,
    section.text,
    'Kulcsfogalmak: '+unit.concepts.join(', '),
    'Szemináriumi kérdések: '+unit.seminar.join(' '),
    'Önellenőrzés: '+unit.reflection.join(' '),
    'Eredeti forrás: '+PEDAGOGY_SOURCE.originalUrl
   ].join('\\n')
  });
 }
}
for (const deep of DEEP_PEDAGOGY_LESSONS) {
  const unit = PEDAGOGY_UNITS.find(x=>x.id===deep.unitId);
  if (!unit) continue;
  entries.push({
    source: `${PEDAGOGY_SOURCE.author} (${PEDAGOGY_SOURCE.year}) – részletes egyetemi pedagógiai feldolgozás; ${unit.page} oldal`,
    label: `08. Ének-zene tantárgy-pedagógia / ${unit.title} / Részletes módszertan`,
    text: [...deep.explanation, 'Tanítási folyamat: '+deep.lessonPlan.join(' '),
      'Elkerülendő hibák: '+deep.pitfalls.join(' '),
      'Forrás: '+PEDAGOGY_SOURCE.originalUrl].join('\\n\\n')
  });
}
const root = resolve('server-data');
const files = [
  { file: 'jegyzet.txt', label: 'Bartáné Góhér Edit – egyetemi jegyzet' }
];
const sub = join(root, 'forrasok');
if (existsSync(sub)) for (const f of readdirSync(sub).filter(x=>/\.(txt|md)$/i.test(x) && !x.startsWith('_') && !/kesztler[-_ ]zenei[-_ ]alapismeretek/i.test(x))) {
  files.push({ file: 'forrasok/' + f, label: f });
}
for (const item of files) {
  const file = join(root, item.file);
  if (!existsSync(file)) continue;
  const raw = readFileSync(file, 'utf8');
  const re = /(?:^===\s*\[OLDAL\s+(\d+)\][^\n]*===\s*$)|(?:^---\s*(\d+)\.\s*oldal\s*---\s*$)/gim;
  const boundaries = [...raw.matchAll(re)];
  const parts = boundaries.length ? boundaries.map((m,i)=>({
    label: `${m[1] ?? m[2]}. oldal`,
    text: raw.slice(m.index!+m[0].length, boundaries[i+1]?.index ?? raw.length)
  })) : [{label:'forrásrészlet',text:raw}];
  for (const part of parts) {
    for (let offset=0;offset<part.text.length;offset+=1200) {
      const text=part.text.slice(offset,offset+1200).trim();
      if (text.length > 30) entries.push({source:item.label,label:part.label,text});
    }
  }
}
const output=process.argv[2] ?? 'release/api/knowledge.php';
mkdirSync(resolve(output,'..'),{recursive:true});
const base64=Buffer.from(JSON.stringify(entries),'utf8').toString('base64');
writeFileSync(output,'<?php\n// Built knowledge index. PHP executes it; text is not directly downloadable.\nreturn json_decode(base64_decode(\''+base64+'\'), true, 512, JSON_THROW_ON_ERROR);\n');
console.log(`Exported ${entries.length} knowledge passages to ${output}`);
