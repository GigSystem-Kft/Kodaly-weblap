import test from 'node:test';
import assert from 'node:assert/strict';
import { createPitchCollectionRound,PITCH_COLLECTIONS,pitchNotes } from '../src/data/pitchCollections';
const expected=['Biton','Triton','Tetraton','Pentaton','Bichord','Trichord','Pentachord','Hexachord'];
const pitchCount=[2,3,4,5,2,3,5,6];
test('all eight pitch-set families and their two playable examples exist',()=>{
 assert.deepEqual(PITCH_COLLECTIONS.map(x=>x.title),expected);
 PITCH_COLLECTIONS.forEach((c,i)=>{
   assert.equal(c.variants.length,2);
   c.variants.forEach((notes,j)=>{
     assert.equal(new Set(notes).size,pitchCount[i],c.title+' '+j);
     assert.ok(notes.every(note=>/^[A-GH]#?[345]$/.test(note)));
     assert.deepEqual(pitchNotes(c,j),notes);
   });
 });
});
test('pitch-set rounds are shuffled, complete and without immediate repeat',()=>{
 for(const n of [0,1,8]){
  const ids=createPitchCollectionRound(n||undefined,()=>0.9999).map(x=>x.id);
  assert.deepEqual([...ids].sort((a,b)=>a-b),[1,2,3,4,5,6,7,8]);
  if(n)assert.notEqual(ids[0],n);
  assert.notDeepEqual(ids,[1,2,3,4,5,6,7,8]);
 }
});
test('bichord and biton differ by their pitch distance',()=>{
 const semi:Record<string,number>={C4:0,D4:2,E4:4,F4:5,G4:7,A4:9};
 const span=(name:string)=>PITCH_COLLECTIONS.find(x=>x.title===name)!.variants[0].slice(0,2).map(x=>semi[x]);
 assert.deepEqual(span('Biton'),[7,4]);
 assert.deepEqual(span('Bichord'),[7,9]);
});
