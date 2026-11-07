import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createEmptyProgress} from '../src/progress';
import {MUSIC_CHAPTERS, FLASHCARDS_DATA} from '../src/data/musicData';
import {EXTRA_LEARNING_MODULES, learningProgressSummary} from '../src/data/learningProgressSummary';

test('dashboard knows all current nine chapters without fabricating completion of special units',()=>{
 const summary=learningProgressSummary(createEmptyProgress());
 assert.equal(summary.coreChapters,MUSIC_CHAPTERS.length);
 assert.equal(EXTRA_LEARNING_MODULES.length,4);
 assert.equal(summary.curriculumModules,9);
 assert.equal(summary.completedCoreChapters,0);
 assert.equal(summary.corePercentage,0);
 assert.equal(summary.averageBestQuizScore,null);
 assert.equal(summary.totalCards,FLASHCARDS_DATA.length);
});
test('historic completion IDs remain stable and do not count unknown removed chapters',()=>{
 const progress=createEmptyProgress();
 progress.completedChapters=[MUSIC_CHAPTERS[0].id,'retired-chapter'];
 progress.flashcardsMastered=[FLASHCARDS_DATA[0].id,'retired-flashcard',FLASHCARDS_DATA[0].id];
 progress.quizScores={ritmus:100,'zenei-kifejezesek':50};
 progress.activityDays=['2026-11-03','2026-11-05'];
 progress.lastActiveDate='2026-11-03';
 const s=learningProgressSummary(progress);
 assert.equal(s.completedCoreChapters,1);
 assert.equal(s.masteredCards,1);
 assert.equal(s.attemptedQuizCategories,2);
 assert.equal(s.averageBestQuizScore,75);
 assert.equal(s.lastStudy,'2026-11-05');
 assert.equal(s.studyDays,2);
});
test('profile distinguishes five progress-tracked lessons and the four extended modules',()=>{
 const page=readFileSync('src/components/ProgressDashboard.tsx','utf8');
 const app=readFileSync('src/App.tsx','utf8');
 assert.ok(page.includes('Az öt alapfejezet teljesítése'));
 assert.ok(page.includes('Bővített tananyagegységek'));
 assert.ok(page.includes('A kvízpontszám önmagában nem jelenti a fejezet teljesítését.'));
 assert.ok(page.includes('Korábbi helyi eredmények átvitele'));
 assert.ok(page.includes('onOpenModule(module.tab)'));
 assert.ok(app.includes('onOpenModule={(tab) => {setActiveTab(tab)'));
 assert.ok(!page.includes('Tanfolyam Haladása'));
});

test('extended module completion is counted separately and reflected on profile',()=>{
 const progress=createEmptyProgress();
 progress.completedChapters=[MUSIC_CHAPTERS[0].id,...EXTRA_LEARNING_MODULES.map(module=>module.id)];
 const summary=learningProgressSummary(progress);
 assert.equal(summary.completedCoreChapters,1);
 assert.equal(summary.completedExtendedModules,4);
 assert.equal(summary.completedModules,5);
 const dashboard=readFileSync('src/components/ProgressDashboard.tsx','utf8');
 assert.match(dashboard,/stats.completedModules/);
 for(const id of EXTRA_LEARNING_MODULES.map(module=>module.id)){
   assert.ok(readFileSync('src/App.tsx','utf8').includes(`completeChapter('${id}')`));
 }
});
