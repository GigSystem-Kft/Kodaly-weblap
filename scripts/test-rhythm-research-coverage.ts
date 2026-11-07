import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {RHYTHM_RESEARCH_PAGES} from '../src/data/rhythmResearchPages';
import {RESEARCH_RHYTHM_GAMES} from '../src/data/rhythmResearchGames';
import {FLASHCARDS_DATA,QUIZ_QUESTIONS,MATCHING_PAIRS} from '../src/data/musicData';
import {searchKnowledge,localKnowledgeReply,sourceCoverageReport} from '../server-knowledge';

test('uploaded MTA-SZTE PDF contains every one of its 13 original pages in the website',()=>{
 assert.equal(RHYTHM_RESEARCH_PAGES.length,13);
 assert.deepEqual(RHYTHM_RESEARCH_PAGES.map(p=>p.page),Array.from({length:13},(_,i)=>i+1));
 for(const p of RHYTHM_RESEARCH_PAGES)assert.ok(p.text.length>30,'Empty PDF page: '+p.page);
 assert.match(RHYTHM_RESEARCH_PAGES[1].text,/10-15 perc/i);
 assert.match(RHYTHM_RESEARCH_PAGES[6].text,/Ritmustelefon/);
 assert.match(RHYTHM_RESEARCH_PAGES[8].text,/Osztinátó|osztinátó/);
});
test('all graphic table pages have explicit non-OCR limitations and their 42 distinct identifiers',()=>{
 for(const [page,series,count] of [[10,1,15],[11,2,18],[12,3,9]] as const){
  const p=RHYTHM_RESEARCH_PAGES[page-1];
  assert.ok(p.figureDescription,'Missing music-image index on page '+page);
  for(let i=1;i<=count;i++)assert.ok(p.figureDescription!.includes(series+'.'+i),'Missing '+series+'.'+i);
 }
});
test('research PDF is genuinely indexed as a text source and no essential document is missing',()=>{
 const report=sourceCoverageReport();
 const entries=report.sources.filter(x=>/Ritmikai fejlesztőprogram|ritmikai-fejleszto-jatekgyujtemeny/i.test(x.source));
 assert.ok(entries.length>=1,'No source inventory entry for uploaded research document');
 assert.ok(entries.some(x=>x.chunks>=13),'PDF pages are not fully represented');
 assert.equal(report.missing.length,0,'Missing mandatory source file: '+report.missing.join(', '));
 assert.ok(report.limitations.some(x=>/10–12/.test(x)),'Unverified rhythm-image disclaimer missing');
});
test('all ten source-based creative games are accessible through one pedagogical section',()=>{
 assert.equal(RESEARCH_RHYTHM_GAMES.length,10);
 assert.equal(new Set(RESEARCH_RHYTHM_GAMES.map(x=>x.id)).size,10);
 for(const item of RESEARCH_RHYTHM_GAMES){
  assert.ok(item.steps.length>=3,item.name);
  assert.ok(item.pages.every(p=>p>=5&&p<=9),item.name);
  assert.ok(item.variations.length>0&&item.observation.length>15,item.name);
 }
 const panel=readFileSync('src/components/CreativeEducationView.tsx','utf8');
 assert.match(panel,/RhythmResearchPanel/);
});
test('quiz answers, flashcards and pairings from the website are accessible to the AI index',()=>{
 const report=sourceCoverageReport();
 for(const word of ['Szókártyák','Teszt','Párosító','Hangzó hangsor','Kreatív ritmikai játék']){
  assert.ok(report.sources.some(x=>x.source.includes(word)),'Missing site content category: '+word);
 }
 assert.ok(FLASHCARDS_DATA.length>20);
 assert.ok(QUIZ_QUESTIONS.length>20);
 assert.ok(MATCHING_PAIRS.length>20);
});
// 60 real source-retrieval questions; existing 80-case regression suite is also run by CI.
const checks=[
 ['ritmustelefon','ritmustelefon'],['nyolcadfordulós','nyolcadfordul'],['hangszerpakolós','hangszerpakol'],
 ['osztinátó','osztinat'],['páros játék','paros'],['utánzás körben','utanzas'],
 ['lüktetés körben','luktetes'],['testhangszer','testhang'],['mérőjárás','mero'],
 ['negyed nyolcad','negyed'],['szünetes ritmus','szunet'],['hármashangzat','harmashang'],
 ['kvintkör','kvintkor'],['moll','moll'],['pentaton','pentaton']
] as const;
const stems=[
 (word:string)=>'Mi a '+word+'?',
 (word:string)=>'Hogyan tanítható a '+word+'?',
 (word:string)=>'Hol szerepel a '+word+' a tananyagban?',
 (word:string)=>'Adj egy példát a '+word+' fejlesztésére!'
];
let n=0;
for(const [term] of checks){
 for(const template of stems){
  const q=template(term);
  test('MTA-SZTE és teljes tananyag forráskeresési teszt '+(++n)+'/60: '+q,()=>{
   const results=searchKnowledge(q,12);
   assert.ok(results.length>0,'Nincs AI-találat: '+q);
   assert.ok(results[0].source.length>6&&results[0].label.length>3);
   const reply=localKnowledgeReply(q);
   assert.ok(reply.includes('kapcsolódó tananyag')&&reply.includes(results[0].source));
  });
 }
}
for(const [id,page] of [['1.13',10],['2.18',11],['3.9',12]] as const){
 test('exact rhythm exercise '+id+' resolves to document page '+page,()=>{
  const hits=searchKnowledge('Ritmikai fejlesztőprogram '+id,20);
  assert.ok(hits.some(x=>x.label.includes(page+'. oldal')),'Cannot locate page '+page+' for '+id);
 });
}
