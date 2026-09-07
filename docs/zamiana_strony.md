# Podmiana starej strony na nową — kroki i audyt SEO

Stan na: **2026-09-06**. Gałąź `static-export` (31 commitów ponad `main`, wszystko wypchnięte). Wersja testowa: `https://new.airsquad.pl/` (noindex). Stara strona: WordPress na `airsquad.pl`, ten sam serwer cyber-folks (195.78.67.54).

Ten plik jest listą roboczą do dnia podmiany. Stan projektu jako całości: `00-status.md`. Kontrakt adresów: `03-mapa-url.md`.

---

## 1. Co dzieli nas od podmiany

| # | Bloker | Kto | Czas | Status |
|---|---|---|---|---|
| 1 | **Konto FTP z dostępem do `domains/airsquad.pl/public_html`.** Obecne konto `strona@airsquad.online` jest zamknięte w katalogu domeny `airsquad.online` (dlatego staging leży w jej `public_html/new`). `REMOTE_PRODUCTION` w `.deploy-target` jest puste — skrypt produkcyjny nie ma dokąd wysłać. | Gabriel: DirectAdmin → FTP Management → nowe konto na domenie `airsquad.pl`; login+hasło do `~/.netrc` (wpis `machine s176.cyber-folks.pl`), ścieżka do `REMOTE_PRODUCTION` | 10 min | ☐ |
| 2 | **Supabase — host projektu nie rozwiązuje się w DNS.** `ajwuxxflltppzgzdyijf.supabase.co` nie odpowiada przez 1.1.1.1 ani 8.8.8.8 (supabase.com działa). Kilka godzin wcześniej host odpowiadał. Wygląda na usunięty/przeniesiony projekt. Bez niego martwe: sklep, feed IG, logowanie do panelu. Strona statyczna buduje się mimo to poprawnie (treść z fallbacków). | Gabriel: dashboard Supabase → czy projekt istnieje, czy ma ten sam „ref". Jeśli nowy ref → Claude podmienia `NEXT_PUBLIC_SUPABASE_*` w `.env.local` i w obu projektach Vercel, rebuild, redeploy panelu. Jeśli projekt trzeba odtworzyć → SQL `001 → 002 → 003a → 004` + seed produktów | 30–60 min | ☐ |
| 3 | **Konto admina + wyłączona rejestracja w Supabase.** Panel nie sprawdza roli — każde konto w projekcie ma pełny dostęp do zamówień. | Gabriel: Authentication → Users → Add user (`klub.airsquad@gmail.com`, Auto Confirm) → Providers → Email → wyłączyć „Enable signup" | 5 min | ☐ |
| 4 | **Zatwierdzenie celów 301 dla 10 starych adresów** (sekcja 3.1). Mechanizm gotowy, cele to propozycje. | Gabriel: przejrzeć `lib/content/legacy-redirects.json`, zmienić cel tam, gdzie trzeba, `status` → `zatwierdzone` | 10 min | ☐ |
| 5 | **Decyzja o merge `static-export` → `main`.** `main` auto-deployuje na Vercel (`kopiav0.vercel.app`) — to NIE jest produkcja airsquad.pl, więc merge nie zmienia nic dla użytkowników, ale porządkuje repo. | Gabriel | — | ☐ |
| 6 | Sprzeczność w treści landingu `/letni/`: opis „12-osobowy zespół trenerów", statystyki „20 kadra trenerów". Która liczba jest prawdziwa? | Gabriel (jedno słowo) → Claude poprawia `lib/content/letni.ts` | 2 min | ☐ |
| 7 | Rotacja dwóch haseł FTP, które pojawiły się w historii shella / na zrzutach (`ssports`, `strona@airsquad.online`); wyczyszczenie `~/.zsh_history` | Gabriel | 5 min | ☐ |
| 8 | **103 pliki nowej strony żyją w starym WordPressie.** Filmy „Nasze zajawki" i galerie na `/rzeszow/`, `/jaslo/`, `/biecz/`, `/brzostek/`, `/pilzno/` i `/letni/` są ładowane z `airsquad.pl/wp-content/uploads/…`. Produkcyjny `deploy-ftp.sh` robi `mirror --delete`, więc po podmianie skasowałby je razem z WordPressem — filmy i galerie zniknęłyby tego samego dnia. | Claude (zrobione 2026-09-06): skrypt produkcyjny wyklucza `wp-content/uploads/` z kasowania, więc te pliki zostają na serwerze obok nowej strony. Docelowo: przenieść do `public/media/` (za duże do repo: filmy 12–63 MB) albo Supabase Storage — decyzja Gabriela | 0 min teraz / 1–2 h docelowo | ☑ tymczasowo |

Rzeczy niewymagane do podmiany, ale warte zrobienia tego samego dnia: usunięcie testowego zamówienia `TEST-RLS-PROBE`, poprawa opisów produktów bez polskich znaków (panel).

## 2. Procedura podmiany (dzień D)

Zakładając, że punkty 1–4 są odhaczone:

1. `git pull origin static-export` — świeży stan.
2. `npm run build` **bez** `ALLOW_PLACEHOLDER_BUILD` — build musi przejść na realnym env (canonicale i sitemapa na `https://airsquad.pl`).
3. `./scripts/make-deploy-zip.sh production` — składa `.htaccess` **bez** `noindex`, z 301 dla Tyczyna i 10 starych adresów, z `ForceType image/png` dla obrazu OG; sprawdza, że każdy cel 301 istnieje w buildzie. Przerywa, jeśli cokolwiek się nie zgadza.
4. Backup starej strony: w DirectAdmin → File Manager spakować `domains/airsquad.pl/public_html` do zipa (WordPress + `wp-content/uploads`, do których nowa strona **nadal linkuje** — filmy „Nasze zajawki" i część galerii są hostowane pod `airsquad.pl/wp-content/uploads/…`; patrz sekcja 3.7 pkt 6).
5. `./scripts/deploy-ftp.sh production` — wysyłka `out/` do `public_html` (lftp mirror z `--delete`, uprawnienia 644/755).
6. Test na żywo (10 minut): `curl -I` dla 29 adresów z listy w sekcji 3.1 — każdy 200 albo 301 na właściwy cel; `https://airsquad.pl/opengraph-image` ma `Content-Type: image/png`; `sitemap.xml` i `robots.txt` bez `noindex`; formularz AIPAX na `/rzeszow/` i `/biecz/` otwiera się; sklep ładuje produkty (wymaga działającego Supabase).
7. Google Search Console: wysłać `https://airsquad.pl/sitemap.xml`; „Poproś o zindeksowanie" dla `/`, `/rzeszow/`, `/akrobatyka/`, `/letni/`.
8. Monitoring 2–8 tygodni: raport „Strony" i „Błędy 404" w GSC, pozycje na `akrobatyka rzeszów`, `akrobatyka dębica`, `tricking rzeszów`, `air camp`.

**Rollback:** wgranie backupu z pkt 4 z powrotem do `public_html` (ten sam skrypt FTPS w drugą stronę albo File Manager). Stara strona nie jest kasowana z serwera przed pkt 5, więc do tego momentu rollback to „nic nie rób".

---

## 3. Audyt SEO — założenia vs stan (2026-09-06)

Metoda: skrypt po wszystkich 44 stronach w `out/` (title, description, canonical, robots, OG, H1, JSON-LD, alt, linki wewnętrzne, liczba słów) + crawl 29 adresów starej strony na żywo + porównanie z `02-plan-seo.md`, `03-mapa-url.md` i checklistą `_referencje/analizy-seo/14-checklista-publikacji.md`.

### 3.1 Czy nowe podstrony mają te same ścieżki? — TAK, wszystkie 29

Sitemapa starej strony (Yoast, `page-sitemap.xml`) ma 29 adresów. Po dzisiejszych poprawkach każdy z nich w nowym buildzie zwraca 200 albo 301:

| Stary adres | Nowa strona | Uwagi |
|---|---|---|
| `/` `/rzeszow/` `/debica/` `/jaslo/` `/biecz/` `/brzostek/` `/pilzno/` | **200**, ten sam slug | tytuły zachowują frazę „Akrobatyka <miasto>" ze starej strony |
| `/tricking-akademia/` `/tumbling/` `/longboardy/` | **200** | tytuł Trickingu odzyskał dziś frazę „Tricking Akademia" (nowy tytuł ją gubił) |
| `/letni/` `/obozy-sportowe/` `/airmeeting/` `/gravityjam/` | **200** | `/airmeeting/` i `/gravityjam/` są **chude treściowo** — patrz 3.6 |
| `/zapisy/` `/aktualnosci/` `/sklep/` `/polityka-prywatnosci/` | **200** | |
| `/tyczyn/` | **301 → `/rzeszow/`** | decyzja klubu (zajęcia zawieszone), działa na stagingu |
| `/aircamp24/` | **301 → `/letni/`** | propozycja |
| `/zimowy/` `/diamond-camp-2021/` `/diamond-camp-2022/` | **301 → `/obozy-sportowe/`** | propozycja; `/zimowy/` to jedyna stara strona z własnym meta description („Zimowy obóz akrobatyczny Diamond Team…") — jeśli obóz zimowy wraca, lepiej zbudować mu stronę niż przekierowywać |
| `/stickit/` `/spotkanie/` | **301 → `/wydarzenia/`** | propozycja |
| `/portfolio/` | **301 → `/media/`** | propozycja |
| `/airspace/` `/zapisyairspace/` | **301 → `/rzeszow/`** | propozycja — AirSpace to sala w Rzeszowie |
| `/szarfy/` | **301 → `/sklep/`** | propozycja |

Ciekawostka z crawla: na starej stronie `/akrobatyka/` **sam jest przekierowaniem 301 na `/`** (canonical strony głównej). Nowa strona ma pod tym adresem pełny landing dyscypliny — to strona dodatkowa, nie ryzyko.

Nowe adresy, których stara strona nie miała (na starej dają 404, więc niczego nie zastępują): `/trenerzy/`, `/kontakt/`, `/lokalizacje/`, `/dyscypliny/`, `/wydarzenia/`, `/obozy/`, `/grafik/`, `/media/`, `/franczyza/`, `/aircamp/`. Duplikaty pod nową strukturą (`/lokalizacje/rzeszow/`, `/dyscypliny/akrobatyka/`, `/wydarzenia/letni/`, `/aircamp/`) mają canonical na stary adres i nie są w sitemapie — zgodnie z planem. Linkują do nich tylko huby (`/lokalizacje/`, `/dyscypliny/`, `/wydarzenia/`) i strona główna (4 kafle dyscyplin) — patrz 3.7 pkt 4.

Plan SEO zabrania masowego 301 na stronę główną — generator `.htaccess` odrzuca teraz cel `/` (kontrola w `scripts/emit-redirects.mjs`).

### 3.2 Meta: title, description, canonical, H1, robots

| Kryterium | Stara strona | Nowa strona (44 strony) |
|---|---|---|
| `<title>` | generyczne „X - Air Squad", część WIELKIMI LITERAMI | unikalny na każdej stronie kanonicznej; 14 „duplikatów" to wyłącznie pary stary-slug/nowy-hub z canonicalem |
| meta description | **puste na 28 z 29 stron** | wszystkie 44 mają; po dzisiejszych korektach wszystkie ≤ 160 znaków |
| canonical | poprawny | 42/44 self-canonical lub → stary slug; brak tylko na `/404/` i `/_not-found/` (noindex) |
| H1 | brak albo wiele na stronę (audyt 01) | **dokładnie jeden** na każdej z 44 stron |
| `lang` | pl | pl |
| robots meta | — | `index,follow` na landingach; `noindex` na 404 |
| obrazy bez `alt` | nie badano | **0** |
| iframe bez `title` | — | **0** |
| uszkodzone linki wewnętrzne | — | **0** (26.08 było 6) |

Długości tytułów: 12 stron ma 61–70 znaków (sufiks „| Air Squad") — Google utnie końcówkę, ale fraza kluczowa jest na początku. Nie ruszać przed launchem.

### 3.3 Open Graph

Przed audytem: 3 strony wskazywały generowany obraz 1200×630 (`/opengraph-image`), 11 stron logo 592×355 z fałszywie zadeklarowanym 1200×630 (dziedziczone z layoutu). Na stagingu `/opengraph-image` był serwowany **bez `Content-Type`** — LiteSpeed nie zna pliku bez rozszerzenia; scrapery Facebooka/WhatsAppa odrzucają obraz bez typu MIME.

Po poprawkach: wszystkie strony używają `/opengraph-image` (1200×630 PNG), `/letni/` ma własne logo Air Camp; `.htaccess` dostaje `ForceType image/png`. **Do sprawdzenia po deployu:** `curl -I https://new.airsquad.pl/opengraph-image` → `Content-Type: image/png`.

### 3.4 Schema.org — checklista publikacji

| Wymóg z checklisty | Stan |
|---|---|
| Organization | ✅ dziś: `SportsOrganization` na `/` (NAP: telefon, e-mail, adres stowarzyszenia ze stopki, `sameAs` Instagram) |
| WebSite | ✅ dziś: na `/`, spięty z organizacją przez `@id` |
| BreadcrumbList | ✅ 25 stron (miasta, dyscypliny, wydarzenia) |
| FAQPage | ✅ 6 miast + `/letni/` |
| Event (Air Meeting, Gravity Jam) | ✅ + `/letni/` |
| SportsActivityLocation | ✅ miasta |
| ContactPage / ContactPoint | ✅ dziś: `/kontakt/` |
| Course | ✅ 4 dyscypliny |

Bez JSON-LD zostają huby i strony narzędziowe (`/lokalizacje/`, `/dyscypliny/`, `/wydarzenia/`, `/obozy/`, `/grafik/`, `/media/`, `/sklep/`, `/trenerzy/`, `/aktualnosci/`, `/franczyza/`) — checklista tego nie wymaga. Opcjonalnie później: `ItemList` na hubach, `Person` na `/trenerzy/`, `Product` w sklepie.

### 3.5 Sitemap, robots, staging

- `sitemap.xml`: 28 adresów (dziś dopisane `/media/` — miało self-canonical, a nie było w mapie). Zawiera wyłącznie kanoniczne slugi; duplikaty hubów celowo poza mapą. Żaden wpis nie wskazuje nieistniejącej strony.
- `robots.txt`: `Allow: /`, `Disallow: /admin/`, `/api/`, wskazuje produkcyjną sitemapę. Stara strona (Yoast) miała `Disallow:` puste — równoważne.
- Staging: `X-Robots-Tag: noindex, nofollow` z nagłówka (potwierdzone `curl -I`). Skrypt produkcyjny przerywa, jeśli w paczce zostałby `noindex`.
- `/tyczyn/` → 301 działa na stagingu. Stare adresy (`/aircamp24/` itd.) na stagingu dają dziś 404 — 301 pojawią się po następnej wysyłce (mechanizm dodany dziś).

### 3.6 Treść — czy intencja stron została zachowana

Plan: „nie przepisywać całych tekstów tak, że Google widzi zupełnie inną intencję". Porównanie objętości tekstu (słowa w treści, bez nagłówka/stopki):

| Strona | Stara | Nowa | Ocena |
|---|---|---|---|
| `/rzeszow/` i miasta | — | 500–690 | bogatsze niż stare (sale, grupy, FAQ, kadra) |
| `/akrobatyka/` | (301 na `/`) | 462 | nowa treść |
| `/zapisy/` | 165 | 92 | OK — strona ma prowadzić do miasta |
| `/aktualnosci/` | 437 | 152 | OK — lista ogłoszeń |
| `/obozy-sportowe/` | 21 | 69 | lepiej niż było, ale nadal hub bez treści własnej |
| **`/airmeeting/`** | **269** | **46** | ⚠️ regresja — stara strona miała datę (18 kwietnia 2026), miejsce (Zespół Szkół nr 1, ul. Towarnickiego 4, Rzeszów), program, dojazd autobusem z Jasła i Dębicy, telefon, zastrzeżenie „nie dla grup naborowych" |
| **`/gravityjam/`** | **391** | **51** | ⚠️ regresja — stara miała termin (8 czerwca 2025), cennik (wstęp bezpłatny, warsztaty 20 zł, zawody 20 zł, koszulka 45 zł), harmonogram godzinowy, partnerów (MB Park, Street Life) |

Obie strony wydarzeń to chronione adresy z historią w Google. Nowe wersje to hero + dwie linijki. Odzyskana treść starych stron jest w tym pliku powyżej — do przeniesienia do `lib/content/letni.ts` (`AIRMEETING_EVENT.description`, `GRAVITYJAM_EVENT.description`), z aktualizacją dat (edycja 2026 Air Meetingu już się odbyła; Gravity Jam 2025 to archiwum — należy to zaznaczyć, checklista: „archiwalne wydarzenia jasno oznaczone").

### 3.7 Co poprawiono dziś (w kodzie, niezacommitowane)

1. **10 starych adresów: 301 zamiast 404** — nowy `lib/content/legacy-redirects.json` + generator w `scripts/emit-redirects.mjs` (obie formy: z ukośnikiem i bez; odrzuca cel `/`) + kontrola w `scripts/make-deploy-zip.sh` (cel musi istnieć, źródło nie może mieć własnej strony). Cele = propozycje z raportu 26.08, pole `status: "propozycja"`.
2. **Obraz OG dla całej strony** — layout wskazuje generowany `/opengraph-image` 1200×630 zamiast logo 592×355; `.htaccess` dostaje `ForceType image/png`.
3. **Schema `SportsOrganization` + `WebSite`** na stronie głównej, **`ContactPage` + `ContactPoint`** na `/kontakt/`.
4. **Nieaktualne liczby miast** w meta i tekstach: „8 lokalizacji" (layout), „7 miast" (`/akrobatyka/`), „Siedem miast" (`/zapisy/`, hero), „7 lokalizacjach" (`/grafik/`) → **6** (po wycofaniu Tyczyna).
5. **Tytuł `/tricking-akademia/`** odzyskał frazę „Tricking Akademia" (tytuł starej strony i slug).
6. **Podwójny sufiks** „Polityka prywatności | Air Squad | Air Squad" → jeden.
7. **Opisy > 160 znaków** skrócone: `/rzeszow/` (168), `/trenerzy/` (199), `/polityka-prywatnosci/` (176), `/zapisy/` (167).
8. **`/media/` dopisane do sitemapy.**

### 3.8 Do poprawy — priorytety

**Przed podmianą (blokujące lub tanie):**

1. Zatwierdzić cele 301 w `legacy-redirects.json` (sekcja 1, pkt 4). Najlepiej z danymi z Google Search Console: „Skuteczność → Strony" za 16 miesięcy pokaże, które archiwalne adresy mają jeszcze kliknięcia i skąd. Bez GSC — propozycje są rozsądne, ale `/zimowy/` warto rozważyć jako własną stronę, jeśli obóz zimowy wraca.
2. Odbudować treść `/airmeeting/` i `/gravityjam/` (sekcja 3.6) — jedyna realna regresja SEO na chronionych adresach. Godzina pracy, treść jest odzyskana.
3. Po wysyłce na staging sprawdzić `Content-Type` obrazu OG i wszystkie 22 reguły 301 (`curl -I` na każdy stary adres).
4. Zdecydować o linkach ze strony głównej do `/dyscypliny/<slug>/` (4 kafle) — to duplikaty z canonicalem na `/akrobatyka/` itd. Bezpieczniej linkować od razu do adresów kanonicznych; zmiana w `components/home/disciplines-section.tsx` (pole `href`).

**Po podmianie (monitoring):**

5. Search Console: wysłać sitemapę, pilnować 404 i „Strona z przekierowaniem", pozycje na frazy lokalne. Plan zakłada 2–8 tygodni.
6. **103 pliki (filmy „Nasze zajawki", galerie) ładują się z `airsquad.pl/wp-content/uploads/…`** — na `/rzeszow/`, `/jaslo/`, `/biecz/`, `/brzostek/`, `/pilzno/`, `/letni/`. Skrypt produkcyjny wyklucza już `wp-content/uploads/` z kasowania (sekcja 1, pkt 8), więc podmiana ich nie zepsuje. Docelowo przenieść je do `public/media/` (za duże do repo: filmy 12–63 MB — trzeba je wgrywać obok, poza gitem) albo do Supabase Storage, i podmienić ścieżki w `lib/content/cities.ts` i `letni.ts`. Do tego czasu katalog `wp-content/uploads/` na serwerze jest częścią nowej strony i nie wolno go kasować.
7. Tytuły 61–70 znaków — skrócić sufiks lub środek, jeśli GSC pokaże ucinanie w wynikach.
8. Zweryfikować uchwyty social na `/kontakt/`: `tiktok.com/@airsquad`, `youtube.com/@airsquad`, `facebook.com/airsquad` odpowiadają 200, ale nie sprawdzono, czy to konta klubu. W schemie `sameAs` jest tylko potwierdzony Instagram.
9. `/obozy-sportowe/` — chroniony hub z 69 słowami; rozbudować (historia obozów, do czego prowadzi, FAQ), gdy będzie treść.
10. Opcjonalna schema na hubach (`ItemList`) i `Person` na `/trenerzy/`.

---

## 4. Pliki, które dotyka podmiana

| Plik | Rola |
|---|---|
| `.deploy-target` (gitignore) | `FTP_HOST`, `REMOTE_STAGING=public_html/new`, `REMOTE_PRODUCTION=` — **do uzupełnienia** |
| `~/.netrc` | login/hasło FTP (600) |
| `scripts/make-deploy-zip.sh` | build + `.htaccess` per cel + kontrole spójności 301 |
| `scripts/deploy-ftp.sh` | wysyłka FTPS; odmawia stagingu poza katalogiem `new`; produkcja przerywa przy `noindex` |
| `scripts/emit-redirects.mjs` | reguły 301: `withdrawn-locations.json` + `legacy-redirects.json` |
| `lib/content/legacy-redirects.json` | 10 starych adresów → cele (do zatwierdzenia) |
| `app/sitemap.ts`, `app/robots.ts` | zapiekane w buildzie na `https://airsquad.pl` |
