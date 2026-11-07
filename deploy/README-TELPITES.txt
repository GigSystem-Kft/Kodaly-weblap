Zeneelméleti Műhely – telepítési megjegyzések

Domain: https://zeneelmelet.digitaliskottatar.hu
CloudPanel: Node.js 24, 3100-as alkalmazásport
Célkönyvtár: /home/zeneelmelet/htdocs/zeneelmelet.digitaliskottatar.hu/

Tartalom: server.mjs, dist/, server-data/, node_modules/, package.json, package-lock.json.

A csomagba nem kerülnek titkos környezeti beállítások.
A webhelyen a .well-known könyvtárat meg kell őrizni.
A telepítőcsomag feltöltése és kibontása nem indítja el a Node.js folyamatot.

Az üzemeltető a webhely felhasználójával, az alkalmazás gyökérkönyvtárából
indíthatja a szervert:
node server.mjs

A szerveroldali környezeti változók:
NODE_ENV=production
PORT=3100
APP_ORIGIN=https://zeneelmelet.digitaliskottatar.hu
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=zeneelmelet
DB_USER=zeneelmelet
DB_PASSWORD=(a szerveren biztonságosan konfigurált adatbázis-jelszó)

Folyamatos rendelkezésre álláshoz systemd vagy más hiteles folyamatkezelő
szükséges, amelynek beállítását rendszergazdának kell elvégeznie.

Ellenőrzés indítás után:
GET /api/health
GET /api/auth/status

Az első kiadás pilot célú. A nyilvános regisztrációt e-mail ellenőrzés,
jelszó-visszaállítás, adatvédelmi tájékoztató és biztonsági audit előtt
nem szabad megnyitni.
