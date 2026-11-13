# A-15 – Felhasználási jogi és forrásbizonyíték-nyilvántartás

**Zeneelméleti Műhely · 2026-11-09 · állapot: NINCS LEZÁRVA**

A cél nem jogi tanácsadás vagy automatikus engedélyezés, hanem az audit tényszerű, ellenőrizhető lezárása. Az alábbi szöveg **nem állítja**, hogy az anyagok közzétételére már minden szükséges engedély rendelkezésre áll. A fejlesztés és az éles publikálás két külön döntés.

## Kötelező forráscsoportok

| Csoport | Jelenlegi műszaki kör | Felhasználási mód | Ellenőrizendő bizonyíték | Elfogadás |
|---|---|---|---|---|
| Ének-zene 1–4. tankönyv | 302, a ZIP-be csomagolt PDF-oldalkép | Oldalszintű közzététel, keresés, nagyítás | Kiadó/jogosult, kiadás, oldalszám, írásos online közzétételi engedély vagy konkrét szabad licenc; nem elegendő a PDF nyilvános elérhetősége | **Nyitott** |
| 13 ritmikai fejlesztőoldal | MTA–SZTE eredetű, helyileg képpé alakított PDF-oldalak | Másolat a webhelyen | Szerző/jogosult, tanulmány és ábrák jogosításának külön tisztázása, engedély szövege és hatálya | **Nyitott** |
| 64 jegyzetkép | Kiadási csomagban ellenőrzött JPG | Másolat a webhelyen | Forrásdokumentum/oldal, képenként jogosult, átvételi és átalakítási jog | **Nyitott** |
| Teljes 1793 tételes szótár | Fogalom és eredeti szöveg, kvízek/AI-index | Teljes szöveg megjelenítése és kereshetővé tétele | Szótár jogosultja, konkrét engedély a teljes vagy részleges közlésre, módosításra, online és gépi keresőindexelésre | **Nyitott** |
| Bartáné Góhér Edit: egyetemi módszertani jegyzet | Szakmai feldolgozás, forrásoldalak | Saját összefoglaló / esetleges bővebb engedélyezett közlés | A korábban jelzett engedély írásos terjedelme: mely fejezetek, milyen média, milyen közönség, módosíthatóság és időtartam | **Nyitott** |
| „A zene története”, 16 oldalas jegyzet | Történeti összefoglalók és hivatkozások | Önálló oktatási feldolgozás, AI-index | Eredeti jogosult és származás; az átvett rész és az új magyarázat elkülönítése | **Nyitott** |
| Wikimedia Commons ábrák és történeti képek | Kurátori és történeti képkatalógus, képenkénti fájloldal | Többnyire külső képbetöltés | Fájlszintű aktuális licenc, szerző, forrás, megfelelő attribúció, módosítás és share-alike feltételek (ha vannak) | **Fájlonként nyitott** |
| Külső videó-/hang-/kot.hivatkozások | Magyar nyelvű forrásoldalak és videóbeágyazások | Hivatkozás vagy külső beágyazás | Jogosult által megengedett beágyazás; hozzáférés, nyelv, forrásoldal, elérhetőség és esetleges regisztrációs feltétel | **Fájlonként nyitott** |
| Saját furulya-, ritmus-, hangmagassági és kvintkör-ábrák | A projekt saját szerkesztésű `public/assets/` fájljai | Kiadási csomag része | Szerzői nyilatkozat és a beépített idegen komponensek/jelképek ellenőrzése | **Nyitott szerzői nyilatkozat** |

## Kötelező bizonyíték egy jóváhagyott tételhez

1. **Tételazonosító és pontos fájl/URL:** a GitHub-fájl vagy közzétett média konkrét azonosítója és verziója.
2. **Jogosult és bizonyíték:** aláírt engedély (vagy egyértelmű, hivatkozható licenc) és a jogosult megnevezése.
3. **Engedély terjedelme:** online nyilvános vagy csak egyetemi/hallgatói hozzáférés; teljes másolat, részlet, ábra, hang, videó, átdolgozás és AI-indexelés külön megjelölve.
4. **Attribúció:** szerző, cím, forrás, licenc, szükség esetén módosítás és licenchivatkozás a felhasználói képernyőn is.
5. **Dátum és ellenőrző személy:** rögzített ellenőrzési időpont, jóváhagyás és annak hivatkozása egy nem nyilvános, biztonságos irattárra. **Az engedélylevél személyes adatait vagy szerződéses titkait ne másoljuk nyilvános GitHub-repóba.**

## Automatikusan ellenőrzött és nem ellenőrizhető részek

- A `scripts/test-curated-media.ts` megköveteli a beillesztett képek forrás-URL-jét, a helyi fájl létezését, a licencadat mezőt és a tananyagi kapcsolódást.
- A `scripts/test-media-source-metadata.ts` vizsgálja a történeti forrás- és licenchivatkozásokat. Az ábráknál szereplő `licenseNote` **csak metaadat**, nem önálló jogszerzési bizonyíték.
- A `scripts/verify-release-assets.py` a PDF-oldalképek és a többi médium **jelenlétét és formátumát** ellenőrzi, nem a felhasználási jogosultságot.
- Az AI-ba indexeléshez és a teljes szövegek másolásához külön jogosultság is szükséges lehet; az egyszerű külső link más jogi helyzet, mint a szerverre másolt kép vagy teljes tankönyv.
- **Nem szabad automatikusan elfogadottnak tekinteni egy tételt** kizárólag `CC0`, `Közkincs`, `CC BY-SA` szöveges címke, forrásoldal-elérés, vagy a felhasználó korábbi általános engedélyközlése alapján. A konkrét mű és a tervezett felhasználás összhangját kell igazolni.

**Kiadási kapu:** az A-15 csak akkor zárható, ha a teljes közzétett médiakör és szótári/jegyzetszöveg minden érintett tételéhez a megfelelő bizonyíték megvan, és a jogosult személy(ek) jóváhagyták az éles publikálást. Addig nincs végleges letöltési link és nincs `main` összevezetés.
