# Zeneelméleti Műhely 1.2 – admin tananyag- és szövegszerkesztő

## Használat
1. Jelentkezz be meglévő adminisztrátori fiókkal, majd nyisd meg a felső **Admin** menüt.
2. A **Tananyag- és szövegszerkesztő** részben keresd ki a címet vagy bekezdést.
3. Módosítsd a szöveget. A kijelölt részre a **Félkövér** vagy **Dőlt** gomb alkalmazható. Választható zárt palettás szín, háromféle méret és sorköz.
4. Az **Előnézet** még nem publikus. Kattints a **Vázlat mentése** gombra; ekkor a hallgatók továbbra is az előző, közzétett változatot látják.
5. Ezután kattints a **Vázlat közzététele** gombra, és erősítsd meg. A frissen nyitott oldalakon már a javított szöveg látható; a régebben nyitott lapokat frissíteni kell.
6. A **Korábbi közzétett változat visszaállítása** művelet a kiválasztott korábbi közzétett szövegváltozatot állítja vissza. Legfeljebb az utolsó tíz publikálás érhető el.

## Szerkeszthető részek
- Főoldali nagy cím, bevezető szöveg.
- Felső menü hat általános oktatási pontjának felirata.
- 01–05. fejezet: cím, bevezető, alfejezetek címe, rövid összefoglaló és felsorolt alapszöveg-bekezdés.
- 06–09. modul: a főoldali kártyák címe és rövid leírása.

**Nem ebben a szerkesztőben:** a 06–09. modul belső részletes tananyag-szövegei, kvízkérdések és megoldókulcsok, hangfájlok, könyv/PDF, képek, a Tanársegéd forrásindexe és a speciális zenei vizualizációk. A módosított megjelenítő szöveg nem írja át automatikusan a külön generált PHP AI-indexet.

## Adatvédelem és telepítés
- Az adminfelület első megnyitása létrehoz egy különálló MySQL szövegtáblát: zm_site_editor. Az adatbázis-felhasználónak ehhez egyszeri CREATE TABLE jogosultság kell. Nem nyúl a meglévő fiók-, eredmény-, jogosultság- vagy kvíztáblákhoz.
- Az eredeti szöveg a programcsomagban marad. Ha az editor API nem elérhető, a program az eredeti szöveget jeleníti meg.
- Csak admin kezelhet vázlatot, előzményeket és közzétételt; a nyilvános API a publikált szöveget adja ki.
- Íráskor bejelentkezett admin szerepkör, azonos eredetű kérés és verzióegyezés kell. Párhuzamos szerkesztők verzióütközésénél a szerver HTTP 409 választ ad.
- Semmilyen szerkesztési művelet nem változtat tanulói eredményazonosítót, kvízmegoldást vagy a meglévő tanulói adatbázist.
- Új API-állomány kerül a PHP-csomagba (api/site-editor.php), ezért a forrásváltozást és a kiadási SHA-t együtt kell telepíteni, nem csupán a HTML-t.
- Élesítés után csak szűkített próba kell: admin megnyitás, vázlat, vendég nézet nem változik, közzététel, visszaállítás, régi tanulói eredmény megmarad.

## Megjegyzés
Ez 1.2-es célzott szövegszerkesztő, nem általános WYSIWYG CMS. A további modulok teljes belső szerkesztését külön fejlesztésben lehet bővíteni.