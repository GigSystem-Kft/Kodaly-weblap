import test from 'node:test';
import assert from 'node:assert/strict';
import { EXTENDED_EAR_DRILLS, earDrillSchedule } from '../src/components/ExtendedEarTraining';

const scales: Record<string,number[]> = {
  'c-major':[60,62,64,65,67,69,71,72],
  'g-major':[67,69,71,72,74,76,78,79],
  'f-major':[65,67,69,70,72,74,76,77],
  'a-minor':[69,71,72,74,76,77,79,81],
  'a-harm':[69,71,72,74,76,77,80,81],
  'a-melod':[69,71,72,74,76,78,80,81],
  'pent':[60,62,64,67,69,72],
  'hex':[60,62,64,65,67,69],
  'pentach':[60,62,64,65,67],
};
test('every scale example plays the exact named Hungarian melodic pitch collection',()=>{
  const found = Object.fromEntries(EXTENDED_EAR_DRILLS.hangsor.map(item=>[item.id,item.pitches]));
  assert.deepEqual(found,scales);
  assert.ok(EXTENDED_EAR_DRILLS.hangsor.find(x=>x.id==='f-major')?.explanation.includes('B–C'));
  assert.ok(EXTENDED_EAR_DRILLS.hangsor.find(x=>x.id==='c-major')?.explanation.includes('H–C'));
});
test('rhythm practice durations match explained quarter-note counts',()=>{
  const expected: Record<string,number> = {
    sync:2,pointed:2,reverse:2,triplet:1,'two-eighth':1,'quarter-eighths':2
  };
  for(const item of EXTENDED_EAR_DRILLS.ritmus){
    assert.ok(item.lengths,'Rhythm durations missing for '+item.id);
    const total=item.lengths.reduce((sum,value)=>sum+value,0);
    assert.ok(Math.abs(total-expected[item.id])<1e-8,
      `${item.id} has ${total} quarter notes, expected ${expected[item.id]}`);
  }
});
test('all four ear drill modes are playable, monotonic and have distinct exercise IDs',()=>{
  for(const [mode,drills] of Object.entries(EXTENDED_EAR_DRILLS)){
    assert.ok(drills.length>=4,'Too few exercises in '+mode);
    assert.equal(new Set(drills.map(d=>d.id)).size,drills.length);
    for(const drill of drills){
      const segments=earDrillSchedule(drill);
      assert.ok(segments.length,'No sound for '+drill.id);
      for(let i=0;i<segments.length;i++){
        assert.ok(segments[i].duration>0 && segments[i].pitch>=0 && segments[i].pitch<=127,
          'Invalid sound in '+drill.id);
        if(i>0) assert.ok(segments[i].time>segments[i-1].time,'Overlapping start order in '+drill.id);
      }
    }
  }
});
test('meter hearing examples contain exactly two complete metrical bars',()=>{
  const units: Record<string,number>={'2/4':4,'3/4':6,'4/4':8,'6/8':12};
  for(const item of EXTENDED_EAR_DRILLS['ütemmutató']){
    assert.equal(item.meter?.length,units[item.id]);
    assert.equal(item.meter?.[0],1);
    assert.equal(item.meter?.[units[item.id]/2],1);
  }
});
