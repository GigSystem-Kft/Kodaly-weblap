import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {HISTORY_NOTE_INSIGHTS,HISTORY_TEXTBOOK_LINKS,HISTORY_VISUALS,HISTORY_RESOURCES} from '../src/data/musicHistorySupplement';
import {MUSIC_HISTORY} from '../src/data/musicHistory';
import {searchKnowledge,sourceCoverageReport} from '../server-knowledge';
const raw=readFileSync('server-data/forrasok/sajat-zenetorteneti-jegyzet-16-oldal.txt','utf8');
test('all 16 original user music-history PDF pages are stored in the AI source index',()=>{
 const pages=[...raw.matchAll(/^--- (\d+)\. oldal ---$/gm)].map(m=>Number(m[1]));
 assert.deepEqual(pages,Array.from({length:16},(_,i)=>i+1));
 assert.ok(raw.length>95000);
 assert.ok(raw.includes('Aquincum'));assert.ok(raw.includes('Bartók'));
 assert.ok(raw.includes('Elektronikus zene'));
 const report=sourceCoverageReport();
 assert.ok(report.sources.some(x=>/sajat-zenetorteneti-jegyzet/.test(x.source)&&x.chunks>=16));
 assert.equal(report.missing.length,0);
});
test('all seven eras have source-specific expanded learning content',()=>{
 const periods=MUSIC_HISTORY.map(x=>x.id);
 assert.deepEqual([...new Set(HISTORY_NOTE_INSIGHTS.map(x=>x.periodId))].sort(),[...periods].sort());
 assert.ok(HISTORY_NOTE_INSIGHTS.length>=14);
 for(const x of HISTORY_NOTE_INSIGHTS){
  assert.ok(x.pages.every(n=>n>=1&&n<=16),x.title);
  assert.ok(x.explanation.length>140,x.title);
  assert.ok(x.listenFor.length>=2,x.title);
  assert.ok(x.task.length>25&&x.sampleAnswer.length>25,x.title);
 }
 const critical=HISTORY_NOTE_INSIGHTS.filter(x=>x.caution);
 assert.ok(critical.length>=3);
});
test('graded historical crosswalk includes all four textbooks with exact cited pages',()=>{
 assert.ok(HISTORY_TEXTBOOK_LINKS.length>=18);
 assert.deepEqual([...new Set(HISTORY_TEXTBOOK_LINKS.map(x=>x.grade))].sort(),[1,2,3,4]);
 assert.ok(HISTORY_TEXTBOOK_LINKS.some(x=>x.grade===1&&x.page===18&&x.work.includes('Haydn')));
 assert.ok(HISTORY_TEXTBOOK_LINKS.some(x=>x.grade===2&&x.page===33&&x.work.includes('Mozart')));
 assert.ok(HISTORY_TEXTBOOK_LINKS.some(x=>x.grade===3&&x.page===63&&x.work.includes('Erkel')));
 assert.ok(HISTORY_TEXTBOOK_LINKS.some(x=>x.grade===4&&x.page===15&&x.work.includes('Bartók')));
 for(const link of HISTORY_TEXTBOOK_LINKS)assert.ok(link.focus.length>15&&link.activity.length>15);
});
test('each era receives a playable educational sound sample, media sources and history view link',()=>{
 const s=readFileSync('src/components/HistorySupplementSection.tsx','utf8');
 for(const period of MUSIC_HISTORY)assert.ok(s.includes(period.id+':{caption:'),'Missing sound model for '+period.id);
 assert.ok(s.includes('AudioContext'));
 assert.ok(s.includes('nem történeti hangfelvétel'));
 const v=readFileSync('src/components/MusicHistoryView.tsx','utf8');
 assert.ok(v.includes('<HistorySupplementSection periodId={period.id}'));
 assert.ok(v.includes('HISTORY_TEXTBOOK_LINKS.filter'));
 assert.ok(HISTORY_VISUALS.length>=8);
 assert.ok(HISTORY_RESOURCES.some(x=>x.kind==='video'&&x.url.includes('youtube.com/watch?v=')));
});
test('Tanársegéd searchable sources provide page labels for original notes and textbook works',()=>{
 const questions=['Aquincum víziorgona','Palestrina polifónia','Haydn Óra szimfónia','Bartók népzene','Kodály Éneklő Ifjúság','Vivaldi Tél'];
 for(const question of questions){
  const hits=searchKnowledge(question,20);
  assert.ok(hits.length>0,'Missing AI source for '+question);
  assert.ok(hits.some(h=>h.source&&h.label),'Missing citation label '+question);
 }
 const report=sourceCoverageReport();
 assert.ok(report.sources.some(x=>x.source.includes('NAT 2020 Ének-zene 3. osztály')));
});
