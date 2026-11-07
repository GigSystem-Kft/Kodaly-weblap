import test from 'node:test';
import assert from 'node:assert/strict';
import { HISTORY_VISUALS, HISTORY_RESOURCES } from '../src/data/musicHistorySupplement';
import { MUSIC_HISTORY } from '../src/data/musicHistory';

const periods = new Set(MUSIC_HISTORY.map(p=>p.id));
function validExternal(url:string, label:string):void {
  let target:URL;
  try { target = new URL(url); } catch { assert.fail(label+': invalid URL '+url); }
  assert.equal(target.protocol,'https:',label+': external materials must use HTTPS');
  assert.ok(target.hostname.includes('.'),label+': URL host missing');
}
test('every external history illustration retains source and a specific license statement',()=>{
  assert.ok(HISTORY_VISUALS.length>=8);
  for(const item of HISTORY_VISUALS){
    assert.ok(periods.has(item.periodId),'Unknown historical period in image: '+item.title);
    assert.ok(item.title.trim() && item.caption.trim() && item.licenseNote.trim(),item.title);
    validExternal(item.imageUrl,item.title);
    validExternal(item.sourceUrl,item.title+' source');
  }
});
test('every external audio/video/score has an explanatory link and historical context',()=>{
  assert.ok(HISTORY_RESOURCES.length>=10);
  for(const item of HISTORY_RESOURCES){
    assert.ok(periods.has(item.periodId),'Unknown history period: '+item.title);
    assert.ok(item.title.trim() && item.focus.trim(),item.title);
    validExternal(item.url,item.title);
    if(item.kind==='video') assert.ok(item.availabilityNote?.trim(),item.title+' requires availability notice');
  }
});
