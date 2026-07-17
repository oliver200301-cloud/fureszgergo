# FORGE — személyi edzői rendszer

Edzőközpontú, reszponzív kezelőfelület személyi edzők napi munkájához. A vizuális rendszer Fűrész Gergő meglévő „Iron Discipline” arculatára épül.

## Fő funkciók

- edzői áttekintés napi programmal és kulcsmutatókkal;
- edzettek keresése, szűrése és új profil létrehozása;
- részletes edzettprofil kontaktokkal, célokkal, figyelmeztetésekkel és edzői jegyzettel;
- mérések, személyes rekordok, súlytrend és edzéstörténet;
- előre tervezett edzések és profilból indítható munkamenetek;
- heti naptár és edzésindítás;
- edzéstervek, aktív programok és sablonok kezelése;
- élő edzés során súly, ismétlés és RPE rögzítése;
- automatikus volumen- és teljesítésszámítás;
- frissítés és minimalizálás után is folytatható, automatikusan mentett élő edzés;
- törölhető sorozatsorok és megerősítéssel lezárható félkész edzések;
- a naptárban megőrzött, halvány és áthúzott kész edzésállapot;
- fejlődési, erőszint- és testösszetételi nézetek.

## Helyi előnézet

Az alkalmazás külső függőség nélküli statikus prototípus. Nyisd meg az `index.html` fájlt, vagy szolgáld ki a mappát egy tetszőleges statikus webszerverrel.

## Technológia

HTML, CSS és natív JavaScript. A felület asztali, tablet- és mobilnézetre is optimalizált.

A prototípus dummy profiljai és a futó edzés állapota a böngésző `localStorage` tárhelyén maradnak meg. Éles, több eszközös használathoz később szerveroldali adatbázis és bejelentkezés kapcsolható hozzá.
