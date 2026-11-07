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
    if (item.licenseUrl) validExternal(item.licenseUrl,item.title+' license');
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

test('published Hungarian Kodály video and OSZK collections have accurate navigational labels',()=>{
  const kodaly=HISTORY_RESOURCES.find(item=>item.title.includes('Kodály mindenkié'));
  assert.equal(kodaly?.url,'https://lfze.hu/videok/kodaly-mindenkie-119270');
  assert.ok(!HISTORY_RESOURCES.some(item=>item.url.includes('/2026/07/15/retro/legyen-a-zene-mindenkie-2-resz')),
    'The time-limited 2026 television recording expired in October and must not be promoted');
  for(const entry of HISTORY_RESOURCES.filter(item=>
    item.url==='https://oszk.hu/category/virtualis-kiallitasok/zene')){
    assert.match(entry.title,/gyűjtőoldala/);
    assert.match(entry.focus,/gyűjtőoldalon/);
  }
});

test('Aquincum reconstruction credits Kaboldy and the exact CC BY-SA 3.0 license',()=>{
  const aquincum=HISTORY_VISUALS.find(item=>item.imageUrl.includes('Hidraulis_Aquincum1'));
  assert.ok(aquincum,'The Aquincum illustration is missing');
  assert.match(aquincum.licenseNote,/Kaboldy/);
  assert.match(aquincum.licenseNote,/CC BY-SA 3\.0/);
  assert.equal(aquincum.licenseUrl,'https://creativecommons.org/licenses/by-sa/3.0/');
});
