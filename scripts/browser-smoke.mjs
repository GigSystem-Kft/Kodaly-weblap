import { chromium } from 'playwright';

const browser = await chromium.launch({headless:true});
const root='http://127.0.0.1:4173/';
const page=await browser.newPage({viewport:{width:1280,height:900}});
const failures=[];

try {
  await page.goto(root,{waitUntil:'domcontentloaded'});
  await page.getByRole('heading',{name:'Zeneelméleti Műhely'}).waitFor();
  console.log('Guest: landing page loaded');

  await page.getByRole('button',{name:/02\. Szókártyák/}).click();
  await page.getByRole('heading',{name:'Zenei Szakkifejezések Gyakorlása'}).waitFor();
  const flashcard=page.locator('[aria-label^="Szókártya:"]');
  await flashcard.waitFor();
  await flashcard.focus();
  await flashcard.press('Enter');
  if(await flashcard.getAttribute('aria-pressed') !== 'true') {
    throw new Error('Flashcard not operable with keyboard Enter');
  }
  console.log('Guest: flashcards keyboard interaction OK');

  await page.getByRole('button',{name:/03\. Játék/}).click();
  await page.getByRole('heading',{name:/Párosítás|Párosítsd össze/}).waitFor();
  console.log('Guest: matching screen loaded');

  await page.getByRole('button',{name:/04\. Teszt/}).click();
  await page.getByRole('heading',{name:'Interaktív Ellenőrző Teszt'}).waitFor();
  const category=page.locator('#quiz-chapter');
  await category.selectOption('hangkeszletek');
  await page.getByText(/Kérdés 1 \/ /).waitFor();
  console.log('Guest: chapter 04 quiz loaded');

  await page.getByRole('button',{name:/07\. Tankönyvek/}).click();
  await page.getByRole('button',{name:/Énekzene 1\. osztály/}).click();
  const search=page.locator('#textbook-search');
  await search.waitFor();
  await search.fill('ének');
  await page.waitForTimeout(200);
  if(await page.locator('article').count()===0) throw new Error('Textbook search returned no matches');
  await page.locator('article button').first().click();
  await page.getByRole('dialog').waitFor();
  await page.getByRole('button',{name:'Bezár'}).click();
  if(await page.getByRole('dialog').count()!==0) throw new Error('Textbook lightbox did not close');
  console.log('Guest: textbook search and lightbox OK');

  await page.getByRole('button',{name:/06\. Profil/}).click();
  await page.getByRole('heading',{name:'Személyes tanulási napló'}).waitFor();
  console.log('Guest: personal learning dashboard loaded');

  // A mobile touch device exercises actual click-to-open navigation without hover.
  const touch=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  await touch.goto(root,{waitUntil:'domcontentloaded'});
  await touch.getByRole('button',{name:/07\. Tankönyvek/}).click();
  await touch.getByRole('button',{name:/Énekzene 1\. osztály/}).click();
  await touch.locator('#textbook-search').waitFor();
  await touch.close();
  console.log('Mobile: textbook menu works with touch');

  await page.setViewportSize({width:390,height:844});
  await page.getByRole('button',{name:'Tanársegéd megnyitása'}).click();
  await page.getByRole('heading',{name:'Zeneelmélet Tanársegéd'}).waitFor();
  const panel=page.locator('div.fixed').filter({has:page.getByRole('heading',{name:'Zeneelmélet Tanársegéd'})}).first();
  const bounds=await panel.boundingBox();
  if(!bounds || bounds.x < -1 || bounds.x+bounds.width>391 ||
      bounds.y< -1 || bounds.y+bounds.height>845) throw new Error('Tutor panel overflows mobile viewport');
  console.log('Mobile: assistant remains inside screen');
  // UI role visibility tests use intercepted API responses; the real PHP
  // authorization is independently tested against the disposable MySQL server.
  for(const role of ['student','teacher','admin']){
    const accountPage=await browser.newPage();
    await accountPage.route('**/api/index.php?*', route => {
      const endpoint=new URL(route.request().url()).searchParams.get('route');
      let data;
      if(endpoint==='auth/me'){
        data={user:{id:'role-fixture',email:'example@example.invalid',displayName:'Próbafiók',role}};
      } else if(endpoint==='progress'){
        data={progress:null,revision:'0'.repeat(64)};
      } else if(endpoint==='auth/status'){
        data={available:true,registrationEnabled:false};
      } else if(endpoint==='chat/status'){
        data={mode:'fallback',knowledge:{indexedSources:0,lessonChunks:0}};
      } else {
        data={error:'Fixture endpoint unavailable'};
      }
      return route.fulfill({status:data.error?404:200,contentType:'application/json',body:JSON.stringify(data)});
    });
    await accountPage.goto(root,{waitUntil:'domcontentloaded'});
    await accountPage.getByRole('button',{name:/06\\. Profil/}).click();
    await accountPage.getByText('Próbafiók').first().waitFor();
    const adminButton=accountPage.getByRole('button',{name:'Admin',exact:true});
    if(role==='admin' && await adminButton.count()!==1) throw new Error('Admin navigation missing for admin role');
    if(role!=='admin' && await adminButton.count()!==0) throw new Error('Admin navigation exposed to '+role);
    await accountPage.close();
    console.log('Account UI: '+role+' navigation verified');
  }

  console.log('Browser smoke checks PASSED');
} catch(error) {
  failures.push(error instanceof Error ? error.stack : String(error));
} finally {
  await browser.close();
}
if(failures.length) {
  console.error(failures.join('\n'));
  process.exitCode=1;
}
