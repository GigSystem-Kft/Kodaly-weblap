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
