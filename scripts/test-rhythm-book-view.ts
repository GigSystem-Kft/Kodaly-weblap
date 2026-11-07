import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {RHYTHM_RESEARCH_PAGES} from '../src/data/rhythmResearchPages';
test('textbook-style rhythm view covers all 13 original PDF pages in numbered order',()=>{
 assert.equal(RHYTHM_RESEARCH_PAGES.length,13);
 assert.deepEqual(RHYTHM_RESEARCH_PAGES.map(p=>p.page),Array.from({length:13},(_,i)=>i+1));
 const view=readFileSync('src/components/RhythmResearchBookView.tsx','utf8');
 assert.ok(view.includes("padStart(3,'0')"));
 assert.ok(view.includes('/ritmikai/p'));
 assert.ok(view.includes('loading="lazy"'));
 assert.ok(view.includes('setOpen(index)'));
 assert.ok(view.includes('ArrowRight'));
 assert.ok(view.includes('ArrowLeft'));
 assert.ok(view.includes("event.key==='Escape'"));
 assert.ok(view.includes('page.text'));
 assert.ok(view.includes('page.figureDescription'));
});
test('creative section uses book-like page image gallery instead of separate button-only text reader',()=>{
 const panel=readFileSync('src/components/RhythmResearchPanel.tsx','utf8');
 assert.ok(panel.includes('<RhythmResearchBookView/>'));
 assert.ok(panel.includes('RESEARCH_RHYTHM_GAMES.map'));
 assert.ok(!panel.includes('A dokumentum mind a 13 oldala – szöveges kereső'));
});
test('the original PDF can be converted reproducibly into 13 exact numbered pages',()=>{
 const script=readFileSync('scripts/render-rhythm-research-pages.sh','utf8');
 assert.ok(script.includes('pdftoppm'));
 assert.ok(script.includes('COUNT'));
 assert.ok(script.includes('public/ritmikai'));
 assert.ok(script.includes('seq 1 13'));
});
