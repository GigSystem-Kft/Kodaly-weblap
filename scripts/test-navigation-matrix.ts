import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { TEXTBOOKS } from '../src/components/TextbookView';
import { EXTRA_LEARNING_MODULES } from '../src/data/learningProgressSummary';

const app=readFileSync('src/App.tsx','utf8');
const nav=readFileSync('src/components/Navbar.tsx','utf8');

test('all main menu tabs resolve to an actual page or guarded admin view',()=>{
  for(const id of ['chapters','flashcards','matching','quiz','eartraining','dashboard','admin']){
    assert.match(nav,new RegExp("id: '"+id+"'"),'Missing nav: '+id);
    assert.ok(app.includes("activeTab === '"+id+"'"),'Missing route: '+id);
  }
});
test('all four textbook page readers plus rhythm research reader are addressable',()=>{
  assert.equal(TEXTBOOKS.length,5);
  for(const book of TEXTBOOKS){
    const tab='textbook-'+book.id;
    assert.ok(nav.includes('textbook-${t.id}'),'Missing textbook menu linking');
    assert.ok(app.includes("activeTab.startsWith('textbook-')"),'Missing standard textbook route');
    assert.ok(app.includes("activeTab === 'textbook-5'"),'Missing research reader route');
    assert.ok(Number(book.id)>0,'Invalid book identifier: '+tab);
  }
});
test('the four extended curriculum modules have complete page dispatches',()=>{
  for(const module of EXTRA_LEARNING_MODULES){
    assert.ok(app.includes("activeTab === '"+module.tab+"'"),'Missing extended module route: '+module.tab);
    assert.ok(app.includes("completeChapter('"+module.id+"')"),'Missing completion marker: '+module.id);
  }
});

test('textbook dropdown visibility and aria-expanded are derived from the same state',()=>{
 assert.match(nav,/aria-expanded=\{textbooksOpen\}/);
 assert.match(nav,/textbooksOpen \? 'block' : 'hidden'/);
 assert.match(nav,/onMouseEnter=\{\(\) => setTextbooksOpen\(true\)\}/);
 assert.match(nav,/onMouseLeave=\{\(\) => setTextbooksOpen\(false\)\}/);
 assert.match(nav,/event\.key === 'Escape'/);
});

test('textbook reader has accessible search and keyboard-trapped image lightbox',()=>{
 const book=readFileSync('src/components/TextbookView.tsx','utf8');
 assert.match(book,/htmlFor="textbook-search"/);
 assert.match(book,/role="dialog" aria-modal="true"/);
 assert.match(book,/onKeyDown=\{trapDialogTab\}/);
 assert.match(book,/ref=\{closeButtonRef\}/);
 assert.match(book,/originatingButtonRef\.current = event\.currentTarget/);
});
