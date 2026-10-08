# Audyt po podmianie — 2026-10-06

Stan: `airsquad.pl` serwuje nową stronę od 2026-10-05 ok. 14:50 (przebieg: `zamiana_strony.md` sekcja 0). Ten dokument to audyt dzień po podmianie i **lista rzeczy do uzupełnienia**. Proces wprowadzania zmian na żywej produkcji: `07-rozwoj-po-golive.md`. Kontrakt adresów: `03-mapa-url.md`.

**Metoda.** Audyt wieloagentowy, wyłącznie do odczytu (bez zmian w repo, na serwerze i bez FTP). 9 audytorów równolegle: ciągłość starych adresów, metadane i linkowanie, technika/indeksacja/bezpieczeństwo, wydajność, dane strukturalne i NAP, treść, zapisy/analityka/RODO, media, dostępność. Dane starej strony wyciągnięte ze zrzutu bazy WordPressa (`airsquad-archiwum/…baza-danych.zip`: 29 stron, 103 adresy z indeksu Yoast, 509 linków wewnętrznych) oraz z Wayback Machine. Pomiary: curl, PageSpeed Insights, Playwright (Chromium, mobile i desktop, także po odmowie zgody), validator.schema.org. Każde ustalenie P0/P1 sprawdzało potem **trzech niezależnych sceptyków** (odtworzenie dowodu, realny wpływ, czy to nie świadoma decyzja), P2/P3 — jeden. Krytyk kompletności wskazał 5 luk w samym audycie; zostały zbadane w dogrywce. Łącznie ok. 200 agentów, 134 surowe ustalenia → 85 po scaleniu duplikatów → lista poniżej. Obalone: patrz koniec dokumentu.

## Stan prac (aktualizowany)

**2026-10-08 — WDROŻONE NA PRODUKCJĘ** (`./scripts/deploy-ftp.sh production` z `b5b18c9`; bez przerwy w działaniu — sama synchronizacja plików, katalogów nie ruszano). Weryfikacja na żywo po wdrożeniu: przycisk „Ustawienia cookies” obecny na 28 stronach i **po kliknięciu realnie otwiera baner** z pełnym wyborem (Zezwól na wszystkie / Spersonalizuj / Zezwól na wybór / Odmowa) — luka „nie da się wycofać zgody” zamknięta; kod GTM nadal w HTML (na nim opiera się weryfikacja Search Console); 28/28 adresów z sitemapy → 200; `www` → 301, `/tyczyn/` → 301, `/sitemap_index.xml` → 301, `wp-login.php` → 404, media z `wp-content/` → 200; żadna strona nie niesie `x-robots-tag`. Uwaga przy sprawdzaniu: przeglądarka potrafi pokazać starą wersję z cache — wymusić odświeżenie bez cache.

**2026-10-07 — scommitowane (`71f4a51`, docs `03b8fd3`) i wdrożone na staging `new.airsquad.pl`:**
F11 (konta FB/YT/TikTok/IG, wspólna lista `lib/content/socials.ts`), F04 (linki do kanonicznych slugów, `/longboardy/` i `/obozy-sportowe/` w stopce), F13 (przycisk zapisu na stronach dyscyplin), F05 (`/szarfy/` → `/debica/`, `/spotkanie/` → `/letni/`), R2.1 (YouTube API dopiero po zgodzie marketingowej), F47 (fasada filmu na `/letni/`), F30/F31 (Open Graph na wszystkich stronach), F38, F59, F35 (kwadratowe favicony ze starej strony), F56 (waga 400 nagłówków na hubach), przycisk „Ustawienia cookies” w stopce, F19 (AIPAX ładowany przy zbliżeniu do sekcji zapisów) + F55 (title ramek AIPAX), F17 (filmy w tle po załadowaniu strony / przy widoczności; przy reduced-motion i oszczędzaniu danych wcale — część F52), F22 (logotypy WebP, bez preloadu pod zgięciem, poprawne proporcje), F14 — część kodowa (zdarzenie `enrol_open` do GTM, tylko przy zgodzie na statystykę). Przy okazji: F29 (0 linków wewnętrznych bez końcowego ukośnika), martwa kotwica `#aircamp` na kartach cennika 6 miast (→ `/letni/` i `/obozy-sportowe/`), pływający przycisk nie zasłania już ikon social media w stopce na desktopie, ikona iOS na tle marki.
Weryfikacja niezależna (4 kontrole + sceptycy): 0 blokerów, 0 „major”; 13 drobnych usterek — poprawione. Testy w Chromium: bez zgody 0 ciasteczek YouTube i 0 skryptu YouTube API; AIPAX na `/rzeszow/` 0 żądań przed przewinięciem do zapisów; `enrol_open` tylko przy zgodzie; 0 błędów konsoli.

**2026-10-06 — zrobione na serwerze:** F02 — wtyczki, motywy, `mu-plugins`, `upgrade*`, `languages` przeniesione z `wp-content/` do `public_html_wp/wp-content/` (rozszerzony `scripts/move-wp-aside.sh`, tryb `--apply-wp-content`; `--rollback` przywraca wszystko), w `wp-content/.htaccess` blokada wykonywania PHP (`scripts/wp-content.htaccess`). Sprawdzone: pliki wtyczek → 404, PHP w `uploads/` → 403, 54/54 media strony i próbki starych plików → 200. Cofnięcie samego tego etapu: `./scripts/move-wp-aside.sh --rollback-wp-content` (pełne `--rollback` cofa całą podmianę).

**Gotowe do pracy właściciela:** `08a-pakiet-gabriela.md` (panele: GSC, Cookiebot, GTM, wizytówki, Bing, AIPAX + kwestionariusz treści) i `08b-polityka-prywatnosci-projekt.md` (projekt nowej polityki, F01 — publikacja dopiero po rozdzieleniu statystyki i marketingu w GTM, decyzja D3).

**Wstrzymane:** F20 (przekodowanie filmów — wymaga `ffmpeg`), F21 (WebP i warianty zdjęć — osobna paczka), F45 (krytyczny CSS — osobna paczka), treści z kwestionariusza (F10, F09, F36, F37, F06, F07, F27, F26, F08, F40).

---

## 1. Werdykt

**SEO zostało utrzymane. Podmiana się udała.** Nie ma żadnego ustalenia P0: nic nie wyindeksowuje strony, żaden adres z historią w Google nie daje błędu, który kosztowałby pozycje, zapisy działają we wszystkich 6 miastach. Google przeindeksował nowe tytuły w ok. 22 h i trzyma pozycje.

Do poprawy jest sporo, ale to rzeczy z kategorii „dopracować”, nie „gasić pożar”. Najpilniejsze (P1) dotyczą trzech obszarów:

- **RODO i zgody** — polityka prywatności twierdzi, że strona nie śledzi, a po zgodzie działają GA4, Google Ads, Meta Pixel i Mouseflow; Cookiebot pokazuje deklarację ze skanu wygasłej domeny `diamondteam.pl`; filmy YouTube w tle zapisują ciasteczka YouTube także po odmowie zgody.
- **Pomiar** — konwersje w GTM są przypięte do elementów starej strony, więc GA4 i Google Ads od 05.10 nie rejestrują żadnego zapisu, telefonu ani maila (odsłony są mierzone). Search Console nie ma jeszcze weryfikacji.
- **Drobne, ale szkodliwe błędy w kodzie** — linki Facebook/TikTok/YouTube w stopce prowadzą do obcych kont; `/longboardy/` i `/obozy-sportowe/` nie mają ani jednego linku wewnętrznego; meta i schema obiecują zajęcia „od 4 lat”, których nie ma w żadnym grafiku.

---

## 2. Co poszło dobrze (sprawdzone z liczbami)

**Ciągłość adresów**
- **2174 stare adresy** z 7 źródeł (zrzut bazy WP, indeks Yoast, Wayback CDX, stara sitemapa Yoasta, linki wewnętrzne, typowe ścieżki WP/WooCommerce, warianty adresów) sprawdzone na żywo z pełnym łańcuchem przekierowań. **Wszystkie przekierowania to 301** — ani jednego 302/307/308. Żadne nie prowadzi na stronę główną.
- **29/29 stron starego WordPressa**: 18 × 200 pod tym samym adresem, 11 × jeden skok 301 na cel, który daje 200. Wszystkie 24 reguły z produkcyjnego `.htaccess` działają dokładnie wg `legacy-redirects.json` i `withdrawn-locations.json`.
- **19/19 chronionych adresów**: 200, canonical na siebie, `index,follow`, bez `X-Robots-Tag`. Warianty `http://`, `www.`, bez ukośnika → jeden skok 301; `?utm_source=`, `?fbclid=` → 200 z canonicalem na czysty adres.
- **1338/1338 starych mediów** z `wp-content/uploads` i **137/137 obrazów** ze starej image sitemap → 200. Google Grafika nie dostanie 404.
- Archiwa tagów/kategorii/typów treści starego motywu (57 adresów, wszystkie puste) dają 404 — to akceptowalne.

**Indeksacja i serwer**
- `robots.txt` i `sitemap.xml` poprawne (28/28 adresów → 200, self-canonical, 0 noindex); stare `/sitemap_index.xml` i `/page-sitemap.xml` → 301.
- Staging `new.airsquad.pl` i kopia `airsquad.pl/new/` mają `noindex, nofollow` na każdej odpowiedzi i canonical na `airsquad.pl`; `site:new.airsquad.pl`, `site:airsquadweb.vercel.app`, `site:kopiav0.vercel.app` → 0 wyników. Aliasy (`mail.`, `ftp.`, goły IP) → 403.
- Rdzeń WordPressa i pliki wrażliwe niedostępne: `wp-login.php`, `wp-admin/`, `xmlrpc.php`, `wp-config.php`, `.git/`, `.env`, `.deploy-target`, `debug.log`, zrzuty `.sql`, `duplicator-backups/`, `public_html_wp/` → 404/403. Listowanie katalogów wyłączone. Brak map źródeł JS.
- TLS 1.2/1.3, certyfikat ważny do 17.12.2026, HTTP/2 + h3, brotli, 0 mixed content. Googlebot, bingbot i facebookexternalhit dostają 200.

**Metadane i treść**
- Dokładnie jeden H1 na każdej stronie, `lang="pl"` wszędzie, 0 duplikatów title/description/H1 wśród 28 stron z sitemapy.
- Meta description na 27/28 stron w przedziale 84–160 znaków. **Stara strona miała puste description na 28 z 29 stron.**
- Wszystkie frazy ze starych tytułów zachowane („Akrobatyka Rzeszów/Dębica/…”, „Tricking Akademia”, „Tumbling”, „Longboardy”, „Air Camp”, „Obozy sportowe”).
- Strony miast są **2–2,3× dłuższe** niż na WordPressie i unikalne (podobieństwo par miast 0,14–0,24). 151/151 obrazów ma `alt`. 0 placeholderów typu Lorem/TODO/undefined w widocznym tekście.
- JSON-LD: 68 bloków, 0 błędów parsowania; validator.schema.org bez błędów poza `Event` (F32). Stara strona nie miała w ogóle schemy `Organization`.

**Google dzień po podmianie** (pomiar w przeglądarce, bez logowania, 06.10)
- Recrawl w ok. 22 h: nowe tytuły i opisy już widoczne dla `/`, `/rzeszow/`, `/debica/`; Google używa nowych okruszków (`airsquad.pl › Rzeszów`).
- **#1** na „akrobatyka dębica”, „akrobatyka jasło”, „akrobatyka biecz”, „akrobatyka brzostek”, „akrobatyka pilzno”, „tricking rzeszów”; „tumbling rzeszów” #1 i #2. Local pack: #1 na „tricking rzeszów” i „akrobatyka dębica”, #2 na „akrobatyka rzeszów”.
- 17 z 19 chronionych adresów widać w wynikach. Punkt odniesienia do monitoringu: zapytania i pozycje z 06.10 (do powtórzenia 20.10 i 03.11).

**Wydajność serwera i zapisy**
- TTFB **0,13–0,17 s** (stary WordPress w danych CrUX: 3,2–3,7 s). Plików JS/CSS ok. 7× mniej niż na WP. Lighthouse SEO = 100 na 6 badanych stronach, CLS mobile ≈ 0.
- Wszystkie 12 formularzy AIPAX istnieje (API → 200). Ścieżka zapisu przetestowana w przeglądarce na 6 miastach, z przycisku „Zapisz się” (42/42 stron), z `/zapisy/` i ze stron dyscyplin — mobile i desktop, także po odmowie zgody.
- Analityka startuje dopiero po zgodzie: 0 żądań do GTM/GA/Facebooka przed zgodą na 84 wczytaniach. Stara strona ładowała GTM, Meta Pixel i Hotjar bez żadnej zgody — pod tym względem nowa jest zgodniejsza z prawem.
- Telefon i e-mail spójne w całym serwisie (114 × `tel:+48728559101`, 88 × `mailto:klub.airsquad@gmail.com`), Instagram poprawny 104/104 razy, Tyczyn 0 wzmianek.
- **Cookiebot autoryzował już `airsquad.pl` i `www.airsquad.pl`** — punkt z listy „po stronie Gabriela” w `zamiana_strony.md` i `07-rozwoj-po-golive.md` jest zrobiony (nie dotyczy stagingu — F79).

---

## 3. Lista do uzupełnienia

Priorytety: **P1** — w tym tygodniu · **P2** — w tym miesiącu · **P3** — drobne, przy okazji. Kto: **kod** (zmiana w repo), **serwer** (pliki/`.htaccess` na hostingu), **Gabriel** (panele, decyzje, dane), **treść** (teksty/dane do dostarczenia). Wysiłek: S ≤ 1 h, M — kilka godzin, L — dzień i więcej. Identyfikatory (F…, R…, S…) pozwalają odwoływać się do pozycji w rozmowie.

### P1 — w tym tygodniu

| ID | Co | Kto | Wys. | Jak naprawić |
|---|---|---|---|---|
| F01 | Polityka prywatności nieprawdziwa: „strona nie używa cookies do śledzenia ani analityki”, a po zgodzie działają GA4 (G-F41FNPX3XV), Google Ads (AW-10873381756), Meta Pixel, Mouseflow; brak podstawy prawnej, transferu do USA, wycofania zgody | kod + Gabriel zatwierdza | S | `app/polityka-prywatnosci/page.tsx` sekcje 3 i 6 + data; osadzić deklarację Cookiebot (`CookieDeclaration`); decyzja, czy Mouseflow zostaje |
| F15 | Cookiebot pokazuje deklarację ciasteczek ze skanu **wygasłej domeny diamondteam.pl** (ostatni skan 23.05.2024), bez Mouseflow — zgoda nie jest „świadoma” | Gabriel | S | Cookiebot → Domain Group: `airsquad.pl` jako domena główna, usunąć `diamondteam.pl`, ręczny skan, sklasyfikować Mouseflow i ciasteczka AIPAX |
| R2.1 | Filmy YouTube w tle zapisują ciasteczka YouTube (`VISITOR_INFO1_LIVE`, `YSC`…) **przed zgodą i po odmowie** — na `/`, `/rzeszow/`, `/debica/`, `/jaslo/` (+ duplikaty) | kod | M | `components/background-video.tsx:26,93`: `iframe_api` ładować tylko przy `Cookiebot.consent.marketing`; bez zgody sam iframe `youtube-nocookie` bez `enablejsapi` albo plakat/MP4 |
| F14 | Konwersje w GTM przypięte do starej strony (`#active-now-submit`, stary tel. 722 248 546, mail ks.street.sport@, WPForms, `diamondteam.pl`) → **GA4 i Ads: 0 konwersji od 05.10** | Gabriel (GTM) + kod | M | GTM: wyzwalacze na `tel:+48728559101`, `mailto:`, „Zapisz się”, wybór miasta; kod: `dataLayer.push({event:'enrol_open', city})` w `AipaxModal`, `CityEnrolment`, `EnrolFab`; usunąć martwe tagi (UA-92219779-2, diamondteam, WPForms) |
| F03 | Search Console bez weryfikacji (brak TXT w DNS, meta, pliku). Stara usługa mogła być weryfikowana przez GTM w `<head>`, a teraz GTM ładuje się po zgodzie | Gabriel | S | Usługa domenowa przez TXT w DNS cyberfolks → wysłać `sitemap.xml`, usunąć `sitemap_index.xml`, „Poproś o zindeksowanie” dla `/`, `/rzeszow/`, `/akrobatyka/`, `/letni/` |
| F11 | Linki Facebook, TikTok i YouTube w stopce i na `/kontakt/` (41 stron) prowadzą do **obcych kont** (firma najmu, konto konkursowe z NL, stary kanał) | kod | S | `components/layout/footer.tsx:33-35`, `app/kontakt/page.tsx:38-40` → `facebook.com/KlubAirSquad`, `youtube.com/@klubairsquad`; TikTok usunąć, dopóki nie ma właściwego konta. Jedna stała `SOCIALS` + `sameAs` |
| F04 | Chronione `/longboardy/` i `/obozy-sportowe/` **osierocone** (0 linków wewnętrznych); karty na home i huby linkują do duplikatów `/dyscypliny/x/`, `/lokalizacje/x/` zamiast do kanonicznych slugów | kod | S | `disciplines-reveal.tsx:37`, `training-types-section.tsx:64`, `app/dyscypliny/page.tsx:55`, `app/lokalizacje/page.tsx:101`, `app/wydarzenia/page.tsx:122` → stare slugi; stopka: tricking, tumbling, longboard, obozy sportowe; „Zarezerwuj turnus” → `/letni/` |
| F10 | „Od 4 lat” w meta description i schema na 8 stronach + grupa „AcroKids 4–6” i FAQ na `/akrobatyka/` — **żadne miasto nie ma grupy poniżej 6 lat**; karty dyscyplin „OD 7 LAT” także dla trickingu (od 9) | treść (Gabriel podaje wiek) + kod | S | `app/layout.tsx:37`, `lib/content/akrobatyka.ts:16,24,83,120`, `lib/content/cities.ts:42,152,249,330,409,481`, `disciplines-section.tsx:20-69` |
| F06 | `/airmeeting/` i `/gravityjam/` chude: ok. 25 słów własnej treści (na WP 266 i 363); `Event` bez `startDate` | treść | M | Odbudowa z `zamiana_strony.md` 7.6 (relacja + status kolejnej edycji, edycje archiwalne oznaczone); dane w `lib/content/letni.ts:152-210` |
| F17 | Strona główna: **3 filmy YouTube w tle ładują się naraz**, bez plakatu i lazy — ok. 43–58 MB na wizytę mobilną, TBT 650–770 ms, PSI mobile 36–39 | kod | M | Hero: plakat WebP ≤ 100 KB jako element LCP; YouTube po `load`/idle, bez `saveData` i `prefers-reduced-motion`; pas Air Meeting i Air Camp przez IntersectionObserver (`hero-section.tsx:35`, `section-video-band.tsx:31`, `camps-section.tsx:53`) |
| F19 | Widget AIPAX montuje się od razu na 6 miastach i `/letni/`, choć sekcja zapisów jest kilka ekranów niżej — ok. 4 MB i TBT 1640 ms na `/rzeszow/` (PSI mobile 34) | kod | S | `components/seo/city-aipax-calendar.tsx:44-62`: montować, gdy `#zapisy` zbliża się do widoku (IntersectionObserver, rootMargin ~800 px). Uwaga: `CLAUDE.md` opisuje ten komponent jako fasadę — to nieaktualne |

### P2 — w tym miesiącu

**SEO, treść, dane**

| ID | Co | Kto | Wys. | Jak naprawić |
|---|---|---|---|---|
| F07 | `/tricking-akademia/`, `/tumbling/`, `/longboardy/` bez sali, adresu i godzin (na WP były: AIR SPACE, Boya-Żeleńskiego 15, wt/czw 18:30); chipy miast otwierają kalendarz akrobatyki | treść + kod | M | Sala, dni, godziny, wiek, cena + 150–250 słów; `CityEnrolment` tylko z miastami, gdzie dyscyplina jest |
| F27 | `/longboardy/` skurczyła się z ok. 354 do ok. 158 słów — zniknął poradnik o rodzajach desek | treść | M | Gdzie/kiedy lekcje, cena, wiek, sprzęt + poradnik „Jaki longboard wybrać?” (250–300 słów, jest w `_referencje`/zrzucie WP) |
| F26 | `/obozy-sportowe/` chude (ok. 70 słów) i konkuruje z pustym hubem `/obozy/` | treść + decyzja | M | 301 `/obozy/` → `/obozy-sportowe/` albo podział intencji; 300–500 słów: Air Camp, obóz zimowy (czy wraca), historia Diamond Camp → Air Camp, FAQ |
| F08 | Air Camp 2026 po fakcie: „zapisy otwarte”, „Zarezerwuj turnus!”, badge „LATO 2026” w menu, pusty formularz AIPAX | treść + kod | M | Tryb „po edycji” na `/letni/` (relacja 2026 + „Air Camp 2027 — zapisy wkrótce”); etykiety sterowane datą (`letni.ts:17-25,82`, `camps-section.tsx:78`, `header.tsx:42`, `enrol-picker.tsx:9`) |
| F09 | „Sezon 2025/26” na `/` i `/zapisy/` (jest 2026/27); grafiki 2026/27 niepotwierdzone, część godzin inna niż na WP | treść + kod | M | Gabriel potwierdza grafiki 6 miast; etykietę sezonu liczyć z daty |
| F36 | Sprzeczne liczby: miasta 6/7/8, staż, kadra, wielkość grup, Air Camp 7 czy 9 dni | treść + kod | S | Gabriel podaje jeden zestaw faktów; liczniki liczone z danych, nie wpisane na sztywno |
| F37 | Cenniki niezgodne z grafikami (Premium 3×/tydz. w Pilźnie i Brzostku, gdzie zajęcia są raz w tygodniu) | treść | S | Cennik per miasto od Gabriela; `pricing_hide_plans` dla Pilzna i Brzostku |
| F05 | Słabe cele 301: `/szarfy/` → pusty `/sklep/` (szarfy są na `/debica/`), `/spotkanie/` (informacje dla rodziców Air Camp) → `/wydarzenia/` | kod | S | `lib/content/legacy-redirects.json`: `/szarfy/` → `/debica/`, `/spotkanie/` → `/letni/`; statusy reguł → „zatwierdzone” |
| F28 | `/sklep/` i `/media/` w sitemapie i jako cele 301, a pokazują „BŁĄD POŁĄCZENIA” (martwy Supabase) | kod | S | Do czasu Supabase: poza sitemapą albo treść statyczna („gadżety u trenera”, filmy + link do IG); ukryć ikonę koszyka |
| F31 | Brak `og:image`, `og:url`, `og:site_name`, `og:locale` na 29 z 42 stron (znane, poz. 11 w `zamiana_strony.md`) | kod | S | Domyślne `/opengraph-image` 1200×630 + `url` = canonical w `lib/seo/metadata.tsx`; potem Facebook Sharing Debugger |
| F30 | `og:url` = strona główna oraz og:title/description strony głównej na 11 hubach (m.in. `/aktualnosci/`, `/kontakt/`) | kod | S | Usunąć `url` z openGraph w layoucie, huby przez `generateSEOMetadata` |
| F34 | Zdjęcia niewidoczne dla Google Grafika: tła CSS, galeria Air Camp po kliknięciu, brak image sitemap | kod | M | Najpierw ruch „Grafika” w GSC; hero i galerie jako `<img>` z opisowym alt; galeria w HTML od razu (lazy) |
| F35 | Favicon niekwadratowy (592×355, 152 KB), `/favicon.ico` i `/apple-touch-icon.png` → 404 | kod | S | `app/icon.png` 512×512, `app/apple-icon.png`, `favicon.ico` — gotowe kwadratowe ikony leżą w `wp-content/uploads/2026/01/cropped-…` |
| F12 | Wizytówki Google Business Profile do sprawdzenia po podmianie (URL ze slashem, telefon 728 559 101, nazwy, adresy, Tyczyn) | Gabriel | M | Każda wizytówka: `https://airsquad.pl/<miasto>/`, jeden telefon, Tyczyn zamknięty, godziny = grafik 2026/27, linki FB/YT klubu |
| R5.2 | `airsquad.pl` nieobecne w Bingu (a za nim DuckDuckGo); brak Bing Webmaster Tools i IndexNow | Gabriel (+ kod opcjonalnie) | S | Po GSC: Bing Webmaster Tools → import z GSC → sitemap; opcjonalnie IndexNow w `deploy-ftp.sh` |

**Zapisy i UX**

| ID | Co | Kto | Wys. | Jak naprawić |
|---|---|---|---|---|
| F13 | Martwy przycisk „Zapisz się na zajęcia” na 4 stronach dyscyplin (`<Button>` bez `href`) + błąd odmiany w H2 „Chcesz spróbować …” | kod | S | `components/seo/views.tsx:396,401-403` → `asChild` + `<a href="#zapisy">`; dopełniacz z danych |
| F39 | CTA w nagłówku i hero prowadzą na `/kontakt/` bez formularza; `/zapisy/` ma tylko 1 link wewnętrzny | kod | S | Nagłówek/hero → `/zapisy/` albo panel wyboru miasta; `/zapisy/` w stopce |
| F40 | `/airmeeting/`, `/gravityjam/`, `/franczyza/` obiecują formularz, a link prowadzi na `/kontakt/` bez formularza | treść | S | „Zapytaj o następną edycję” + `mailto:` z tematem; `/franczyza/` — mailto „Franczyza Air Squad” |
| F41 | Plakietka „Nabór — wolne miejsca” wpisana na sztywno, a w AIPAX część naborów jest pełna | kod | S | Neutralnie „Nabór — nowe osoby” albo flaga „pełna” w `cities.ts` (`city-view.tsx:405-408`) |
| R2.2 | Przycisk „Zapisz się” i kafle „Jak to działa” otwierają tylko formularz naboru — osoby kontynuujące nie mają swojej ścieżki | kod | S | W `EnrolPicker` krok „Nowa osoba / Kontynuacja” dla miast z `formIdContinuation` (jak `cta-mini-form.tsx:31-32`) |
| F38 | `/wydarzenia/`: widoczne znaczniki „<p>”, „3 wydarzeń” przy 2 kartach, link AkroNocki prowadzi donikąd | kod | S | Czysty tekst opisów, licznik z kart z odmianą, wpis o AkroNockach albo inny link |

**RODO i analityka**

| ID | Co | Kto | Wys. | Jak naprawić |
|---|---|---|---|---|
| F16 | Ramki AIPAX uruchamiają GA4, Meta Pixel i Microsoft Clarity (konta AIPAX) przed zgodą Cookiebot | Gabriel (AIPAX) | M | Leniwe montowanie (F19) zawęzi problem; zapytać AIPAX o embed bez trackerów / respektujący zgodę; opisać w polityce |
| F47 | `/letni/`: film z `www.youtube.com` (nie nocookie), bez lazy i fasady — 973 KB i ciasteczka przed zgodą | kod | S | `components/seo/camp-view.tsx:438-445`: fasada (miniatura + przycisk), `youtube-nocookie` po kliknięciu |
| F48 | Cookiebot ładowany dwa razy (layout + tag Cookiebot CMP w GTM); Meta Pixel i remarketing startują już przy zgodzie „statystyka” | Gabriel (GTM) | S | W GTM wstrzymać tag Cookiebot CMP; Pixel i Mouseflow na zgodę marketingową; test w podglądzie GTM |
| F49 | Analityka zachowuje się inaczej niż na WP: GA4 spadnie skokowo (wcześniej liczyło bez zgody), Hotjar zniknął, brak Consent Mode v2 | Gabriel | S | SEO oceniać w GSC, nie w GA4; decyzja o Consent Mode v2; potwierdzić rezygnację z Hotjara |

**Wydajność**

| ID | Co | Kto | Wys. | Jak naprawić |
|---|---|---|---|---|
| F20 | Ciężkie MP4 z autoplay: hero `/biecz/` 33,5 MB, „Nasze zajawki” 13–68 MB, kafle `/letni/` do 124 MB | kod | M | Przekodować do pętli 720p, 8–15 s, ≤ 2–5 MB (+ WebM, `faststart`); na mobile plakat |
| F21 | Obrazy bez WebP/AVIF i wariantów, tła CSS bez lazy, preload zdjęć spod zgięcia — `/` waży 10,2 MB | kod | L | Rozszerzyć `scripts/make-image-variants.mjs` o WebP w640/w1024/w1600 + `srcset`; tła jako `<img loading=lazy>` |
| F22 | Logo Air Camp (PNG 1,4 MB) i logo nagłówka (152 KB) preloadowane z wysokim priorytetem | kod | S | Logo Air Camp ≤ 100 KB bez `priority`; logo nagłówka SVG/WebP 2× |
| F45 | CSS blokuje renderowanie (FCP mobile 3,4–3,6 s) | kod | S | Sprawdzić `experimental.inlineCss` na stagingu albo preload fontów |
| F18 | Na mobile baner Cookiebot zajmuje cały ekran i jest elementem LCP | Gabriel + kod | S | Kompaktowy baner u dołu w panelu Cookiebot; duży element w mobilnym hero; link „Ustawienia cookies” w stopce |
| F46 | Tło formularza AIPAX to PNG 2,34 MB bez cache | Gabriel (AIPAX) | S | W panelu AIPAX JPG/WebP ≤ 250 KB albo kolor |
| F44 | 54 pliki (≈310 MB) nowej strony leżą w `wp-content/uploads`, poza repo i deployem — ktoś „posprząta” WordPressa i znikną filmy i galerie | serwer | M | Po przekodowaniu (F20) przenieść do `public/media/`; do tego czasu HEAD-check tych plików w `deploy-ftp.sh` |

**Bezpieczeństwo**

| ID | Co | Kto | Wys. | Jak naprawić |
|---|---|---|---|---|
| F02 | W `wp-content/` zostały stare wtyczki i motyw WordPressa: **ich pliki PHP się wykonują** (np. `elementor.php`, `wp-contact-form-7.php`, `debug-bar.php`), `readme.txt` ujawniają wersje. Porzucony kod bez aktualizacji to realna furtka | serwer | S | Przenieść `wp-content/{plugins,themes,mu-plugins,upgrade,languages,cache}` do `public_html_wp/wp-content/` (i dopisać do `move-wp-aside.sh` dla rollbacku); w `wp-content/.htaccess` zablokować `*.php`; sprawdzić, czy w `uploads/` nie ma plików `.php`. **Zalecam zrobić od razu — kwadrans pracy, zero wpływu na stronę** |

**Dostępność (WCAG)**

| ID | Co | Kto | Wys. | Jak naprawić |
|---|---|---|---|---|
| F23 | Tryb jasny: kolory akcentów jako tekst z kontrastem 2,05–4,1:1 na stronach zapisów | kod | M | Ciemniejsze tokeny tekstowe dla `.light`, usunąć `/80` z tekstu (np. `city-view.tsx:421`) |
| F53 | Tryb ciemny: `primary` jako tekst i cyan na białych kartach bez kontrastu (79 węzłów, 20/28 stron) | kod | M | `violet-soft` do tekstu na ciemnym tle, ciemny tekst na białych kartach |
| F24 | Kalendarz AIPAX: biały tekst na jasnoróżowym tle (1,1–2,3:1) | Gabriel (AIPAX) | S | Ciemniejsze tła kursów w panelu AIPAX albo zgłoszenie do AIPAX |
| F50 | Modal AIPAX i panel przycisku „Zapisz się”: fokus nie trafia do okna, brak pułapki fokusu, Escape nie działa z fokusem w iframe | kod | M | `components/ui/dialog.tsx` (Radix) albo `<dialog>.showModal()` |
| F52 | Filmy w tle grają w pętli bez pauzy i ignorują `prefers-reduced-motion` (WCAG 2.2.2) | kod | M | Przycisk pauzy ≥ 44 px; przy reduced-motion sam plakat |
| F54 | Linki bez zrozumiałej nazwy: 6 pustych kafelków Instagrama na `/letni/`, „IG/TT/YT/FB” w stopce | kod | S | `aria-hidden` + jeden link „Obserwuj na Instagramie”; pełne nazwy w stopce |
| F55 | Iframe’y AIPAX wstawiane skryptem bez atrybutu `title` (12 ramek na 8 stronach) | kod | S | MutationObserver ustawia `iframe.title` po wstawieniu |
| F56 | Font odręczny ze sztucznym pogrubieniem 800/900, wersalikami i ciasnym trackingiem na hubach, polityce, franczyzie — **łamie ustaloną konwencję `fontWeight: 400`** | kod | S | `fontWeight: 400`, bez `uppercase`/`tracking-tighter` dla fontu display (`app/lokalizacje/page.tsx:39,76` i in.) |
| F57 | Co trzeci tekst ma mniej niż 12 px (10–11 px mono, wersaliki) — także adresy, „Nabór”, kontakt | kod | M | Treść informacyjna min. 13–14 px; wersaliki tylko dla etykiet 1–3 słów |
| F59 | „Pokaż więcej zdjęć” na `/letni/` w trybie jasnym: biały tekst na białym tle (1,11:1) | kod | S | `components/seo/expandable-gallery.tsx:72` → `text-foreground`, `aria-expanded` |

### P3 — drobne, przy okazji

| ID | Co | Kto | Jak |
|---|---|---|---|
| F29 | 26 linków i 39 pozycji BreadcrumbList bez końcowego ukośnika (każdy = zbędne 301) | kod | Ukośnik w `href` (`views.tsx:406,698,787`) i normalizacja w `buildBreadcrumbs` |
| F61 | Reguły `Redirect` (mod_alias) z `www.` robią 2–3 skoki, a z dopiskiem ścieżki (`/zimowy/feed/`) kończą na 404 | kod | `RedirectMatch 301 ^/tyczyn/?$ https://airsquad.pl/rzeszow/` (zakotwiczone, absolutne) w `make-deploy-zip.sh` |
| F60 | 5 stron z historią w Wayback daje 404: `/promo/`, `/reklama/`, `/warsztaty/`, `/info/`, `/koszulki/` | kod | Po raporcie 404 w GSC: `/reklama/` → `/jaslo/`, `/warsztaty/` → `/wydarzenia/`, `/info/` → `/kontakt/`; `/promo/` 410 |
| F63 | Shortlinki `?p=ID` / `?page_id=ID` pokazują stronę główną zamiast 301 | kod | Opcjonalnie `RewriteCond %{QUERY_STRING}` dla 10 ID (lista w ustaleniu); najpierw GSC |
| F62 | Warianty: WIELKIE litery i polskie znaki → 404; `/index.html`, `//`, `/404/` → 200 | kod | Opcjonalnie `[NC,R=301]` dla chronionych slugów, 301 z `index.html` |
| F64 | Archiwa tagów/kategorii/RSS → 404 — akceptowalne (puste) | kod | Zostawić; opcjonalnie 410 i `/trainer/` → `/trenerzy/` |
| F25 | Słabo dopasowane cele 301 dla `/zimowy/` (obóz zimowy, Lubenia), `/stickit/` | kod/treść | Sekcja o obozach zimowych na `/obozy-sportowe/` albo osobna `/zimowy/`, jeśli obóz wraca. Uwaga: `/diamond-camp-2021/` i `-2022/` to relacje z obozu **letniego** |
| F76 | Cele 301 nie przejęły treści: brak zdania o Tyczynie i opisu sali AIR SPACE na `/rzeszow/` | treść | Zdanie „Zajęcia w Tyczynie zawieszone — zapraszamy do AIR SPACE Rzeszów” + 60–100 słów o sali |
| F66 | `lastmod` w sitemapie = moment buildu dla wszystkich 28 adresów | kod | Pomijać `lastModified` albo brać datę z gita |
| F69 | Tytuły 61–70 znaków na 10 stronach (nie 12, jak w `zamiana_strony.md`) | kod | Po 2–8 tygodniach CTR w GSC — nie ruszać przed |
| F70 | Krótkie tytuły i H1 bez frazy na hubach (`/obozy-sportowe/`, `/zapisy/`, `/grafik/`…) | kod | Np. „Grafik zajęć akrobatyki — 6 miast Podkarpacia” |
| F71 | `/wydarzenia/`, `/media/`, `/aircamp/`, `/wydarzenia/letni/` nieosiągalne z nawigacji | kod | `/wydarzenia/` do stopki; `/aircamp/` i `/wydarzenia/letni/` → 301 `/letni/` |
| F72 | 23 generyczne lub mylące anchor texty (np. Showdance, Snowboard) | kod | Opisowe anchory |
| F77 | `/aircamp/` z błędnymi terminami, puste H3 na `/wydarzenia/letni/`, „Trial”, interpunkcja | kod | `/aircamp/` → 301 `/letni/`; „Trial” → „Pierwszy trening” |
| F32 | Schema `Event`: `eventLocation` zamiast `location`, brak `startDate`, `endDate` = `startDate` | kod | `views.tsx:446-449`, `camp-view.tsx:78-81`; nie renderować Event bez daty |
| F33 | Adresy sal w `SportsActivityLocation` bez kodów i geo; Dębica łączy 3 sale | kod + Gabriel (kody, współrzędne z GBP) | `city-view.tsx:246-258` |
| F74 | Course ze względnym `image`, bez `offers`; Event z `image: null` | kod | Absolutne URL-e, `offers` 40 zł |
| F73 | Encja marki: brak `alternateName` (Diamond Team, Klub Air Squad), `sameAs` tylko IG | kod | Po F11: pełne `sameAs`, `alternateName`, `@id` |
| F75 | `/kontakt/`: ten sam numer jako „klub” i „trener Gabriel”; brak adresów sal w Jaśle, Brzostku, Bieczu | Gabriel + treść | Jedna pozycja „biuro i zapisy” albo dwa numery; pełne adresy |
| F42 | Brak nagłówków bezpieczeństwa (HSTS, nosniff, Referrer-Policy, X-Frame-Options) | kod | W produkcyjnym bloku `make-deploy-zip.sh`; HSTS od krótkiego `max-age` |
| F43 | HTML bez `Cache-Control`, `/_next/static` 7 dni bez `immutable` | kod | `.htaccess`: HTML `no-cache`, `_next/static` rok + `immutable` |
| F67 | Noindex stagingu zależy wyłącznie od `new/.htaccess` (staging w docroocie produkcji) | kod | Redundantny `X-Robots-Tag` dla `/new/` i hosta `new.` w produkcyjnym `.htaccess` |
| F79 | Staging `new.airsquad.pl` nieautoryzowany w Cookiebot (baner się nie pokazuje), a komentarz w `layout.tsx:23-25` twierdzi inaczej | Gabriel | Dodać `new.airsquad.pl` do Domain Group albo poprawić komentarz |
| F78 | „Placeholder AIPAX 5f7b99af” to działający formularz ogólny — wpis w docs nieaktualny | kod/docs | Skreślić z `zamiana_strony.md` §0 i komentarza w `akrobatyka.ts` |
| F51 | Przycisk „Zapisz się” zasłania CTA w otwartym menu mobilnym — zapowiadanej reguły CSS nie ma | kod | `body[data-mobile-nav-open] [data-enrol-fab]{display:none}` w `globals.css` |
| F58 | Słabo widoczny fokus w nawigacji i wyszukiwarce `/zapisy/` | kod | `focus-visible:ring-2` |
| F83 | Cele dotyku < 44 px na ścieżce zapisu (chipy miast 30 px, zamknięcie modala 32 px) | kod | `min-h-11` |
| F84 | Marquee czytane 3× przez czytnik ekranu; teksty WIELKIMI LITERAMI w źródle | kod | Kopie z `aria-hidden`; wersaliki przez CSS |
| F85 | Brak skip-linku, przeskoki h1→h3, błędna lista `<dl>` na home | kod | Skip-link w `layout.tsx` |
| F82 | Ryzyko CLS: galeria `/letni/` bez wymiarów (przesunięcie 193 px na telefonie) | kod | `width`/`height` w `expandable-gallery.tsx:24-48` |
| F80 | Zbędny JS: polyfille i prefetch klienta Supabase (58,6 KiB) | kod | `browserslist` na nowoczesne przeglądarki |
| F81 | CrUX to jeszcze dane WordPressa (okno 7.09–4.10) — punkt odniesienia | Gabriel | Porównać CWV w GSC za ok. 4 tygodnie |
| F68 | Dawna domena `diamondteam.pl` nie przekierowuje na airsquad.pl (aukcja na nicsell zamknięta) | Gabriel | Tylko jeśli da się odkupić: 301 ze ścieżkami |
| R5.4 | Google pokazuje jeszcze stare tytuły WP, nazwę witryny „Akrobatyka - Air Squad” i adresy 301/404 — recrawl w toku | Gabriel | Po weryfikacji GSC: „Poproś o zindeksowanie” dla ~14 adresów; pomiar 20.10 i 03.11 |
| R5.3 | Pozycja na „akrobatyka rzeszów” rozbieżna między pomiarami (#11 strona główna vs #2 `/rzeszow/`) | Gabriel | Rozstrzygnie GSC (zapytanie, 16 mies.); w GBP Rzeszów link na `/rzeszow/` |

---

## 4. Dogrywka — wyniki

Trzy sondy wskazane przez krytyka kompletności (kopie strony poza domeną, linki zewnętrzne i wizytówki, dokumenty i zgody w AIPAX) oraz weryfikacja 9 ustaleń, które w pierwszej rundzie nie dostały werdyktu. Żadnego ustalenia nie obalono. Dwa nowe P1 dotyczą zgód w AIPAX (S3.1, S3.2).

**Zgody, regulaminy i dokumenty (AIPAX)**

| ID | Prio | Co | Kto | Jak |
|---|---|---|---|---|
| S3.1 | **P1** | Polityka obiecuje „odrębną zgodę na wizerunek”, a żaden z 12 formularzy AIPAX (54 pozycje) jej nie zbiera; jedyny wzór zgody to PDF z 2021 innego podmiotu (Street Sports, diamondteam.pl) | Gabriel | W AIPAX osobna, dobrowolna zgoda „Wizerunek” przy wszystkich kursach, warsztatach i obozie; nowa treść zgody (Stowarzyszenie Air Squad, airsquad.pl, IG/TT/YT/FB). Do tego czasu nie dodawać nowych zdjęć z rozpoznawalnymi dziećmi |
| S3.2 | **P1** | Zgoda „Akceptuję politykę prywatności” w AIPAX bez linku (linkUrl null we wszystkich kursach); 6 kursów bez regulaminu (AcroRzeszów NABÓR podstawa ×4, Tricking PRO, AcroJasło NABÓR 3) | Gabriel | Panel AIPAX: link `https://airsquad.pl/polityka-prywatnosci/` przy zgodzie; przypiąć regulamin 26/27 do 6 kursów |
| S3.3 | P2 | AkroNocki 16–18.10 (nocleg 19:00–9:00) w AIPAX bez regulaminu i bez żadnej zgody | Gabriel | **Przed 16.10:** regulamin nocki + zgody jak w kursach |
| S3.5 | P2 | Regulamin 26/27 jest tylko w AIPAX; strona nie ma sekcji dokumentów, a regulamin linkuje `/aktualności` (404) | kod + treść | Podstrona/sekcja „Dokumenty” z regulaminem i zgodami |
| S3.6 | P2 | Regulamin i formularze AIPAX każą płacić na RQ Sp. z o.o., kaucja i opłata rezerwacyjna — strona mówi o koncie Stowarzyszenia (też R2.5) | treść + Gabriel | Ujednolicić odbiorcę przelewów; opisać RQ w polityce (08b, P3) |
| S3.7 | P2 | Air Camp: brak karty kwalifikacyjnej, zaliczki i warunków rezygnacji; polityka pomija dane z karty | treść | Przy kolejnej edycji |
| S3.4 | P3 | Stare PDF-y 2021–2023 pod `airsquad.pl/wp-content/…`: inny administrator, diamondteam.pl, konto Diamond Team | serwer | Podmienić, dodać `X-Robots-Tag: noindex` albo usunąć z 410 |
| S3.8 | P3 | Regulamin dla dorosłych w AIPAX ważny „do 30 czerwca 2026”, przypięty też do Szarf 8+ (dzieci) | Gabriel | Aktualizacja w AIPAX |

**Kopie strony poza domeną**

| ID | Prio | Co | Kto | Jak |
|---|---|---|---|---|
| S1.1 | P2 | `airsquadweb.vercel.app` (i `kopiav0.vercel.app` → 307) to publiczna, indeksowalna kopia z buildu 13.08: 11 stron bez canonicala, `/tyczyn/` → 200, 6 chronionych adresów → 404. Dziś poza indeksem | Gabriel (Vercel) | Usunąć domeny `*.vercel.app` z projektu `airsquad-web` (albo projekt) lub Deployment Protection; produkcja od niego nie zależy |
| S1.2 | P2 | `v0-airspace.vercel.app` — stara wersja z v0 z marką i danymi klubu, 10 stron indeksowalnych bez canonicala | Gabriel | Sprawdzić w v0.app, czy deploy jest jego, i usunąć; jeśli cudzy — zgłosić do Vercela |
| S1.3 | P3 | Publiczne repo GitHub linkuje do kopii przez `kopiav0.vercel.app` | Gabriel | Zmienić link w repo na `https://airsquad.pl/` |

**Linki zewnętrzne i wizytówki**

| ID | Prio | Co | Kto | Jak |
|---|---|---|---|---|
| S2.1 | P2 | Wizytówki Google mają tylko Rzeszów (link na stronę główną) i Dębica (link bez ukośnika, adres jako plus code) | Gabriel | Rzeszów → `/rzeszow/`, Dębica → `/debica/` + ul. Lwowska 51; reszta wg 08a, A4 |
| S2.2 | P2 | Kanał YouTube linkuje do **niezarejestrowanej** domeny `www.airspace.rzeszow.pl` (może ją przejąć każdy) | Gabriel | YouTube Studio → Linki: usunąć; opcjonalnie wykupić domenę i 301 na `/rzeszow/` |
| S2.3 | P2 | TikTok, Facebook, YouTube i Kidoteka nadal podają Tyczyn i „7 miast”; linki w bio idą przez 2–3 przekierowania | Gabriel | Opisy na 6 miast, linki `https://airsquad.pl/…/` |
| S2.5 | P3 | Właściwy TikTok klubu to `@air__squad` | kod | **Zrobione** — dopisany do `lib/content/socials.ts` (do potwierdzenia przez Gabriela) |
| S2.4 | P3 | Katalogi firm z danymi Diamond Team (ul. Kolbego 1/31, tel. 722 248 546, diamondteam.pl) | Gabriel | Aktualizacja wpisów przy okazji |
| S2.6 | P3 | Artykuły lokalnych mediów i strony partnerów nie linkują do airsquad.pl | Gabriel | Prośby o link przy okazji współpracy |

**Zaległe weryfikacje z pierwszej rundy (wszystkie potwierdzone)**

| ID | Prio | Co |
|---|---|---|
| R5.1 | P2 | Hosting zwraca 429 robotowi Binga już przy 3. żądaniu w krótkim odstępie (Googlebot bez limitu). Limit łagodny, ale razem z R5.2 opóźnia wejście do Binga — zapytać cyber_Folks o białą listę bingbota |
| R2.4 | P2 | Grafik na `/pilzno/` i godziny grupy dorosłych w Rzeszowie różnią się od kursów w AIPAX (do kwestionariusza 08a, B2) |
| R2.5 | P2 | Formularze AIPAX Rzeszowa i Dębicy: przelew na RQ Sp. z o.o. (patrz S3.6) |
| R2.3 | P3 | Desktop: kalendarz naboru zajmuje pół szerokości obok filmu — piątek–niedziela schowane |
| R2.6 | P3 | Mobile: film „Nasze zajawki” zasłania etykietę „Zapisz dziecko w … — nabór” (5 miast) |
| R2.7 | P3 | Puste pola pod widgetami AIPAX (66–131 px pod launcherem, ok. 430 px pod listą) |
| R2.8 | P3 | Ramki AIPAX: martwy host Sentry i telemetria w konsoli (po stronie AIPAX) |
| R2.9 | P3 | `/wydarzenia/letni/` pokazuje ogólny kalendarz zajęć zamiast formularza obozu |
| R2.10 | P3 | Niespójna konfiguracja AIPAX w kodzie (aipax.eu obok aipax.pro, nieaktualne komentarze) |

---

## 5. Co się zdezaktualizowało w innych dokumentach

Nie edytowałem tych plików (równoległy czat może mieć w nich zmiany) — do poprawienia przy najbliższej okazji:

- `zamiana_strony.md` §0 i `07-rozwoj-po-golive.md`: „Cookiebot: dopisać `airsquad.pl` do Domain Group” — **zrobione**, produkcja jest autoryzowana (staging nie — F79). Za to deklaracja ciasteczek pochodzi ze skanu `diamondteam.pl` (F15).
- `00-status.md`: „Brak jakiejkolwiek analityki” — nieaktualne, GTM działa od 05.10 15:05; nie działają konwersje (F14).
- `zamiana_strony.md` §0 i §4 poz. 13: „placeholder AIPAX 5f7b99af” — to działający formularz ogólny klubu (F78).
- `zamiana_strony.md:256`: „nieaktualne liczby miast 8/7 → 6” — na żywej stronie nadal są 7 i 8 w kilku miejscach (F36).
- `zamiana_strony.md:215`: „12 stron ma 61–70 znaków” — realnie 10 (F69).
- `CLAUDE.md`: opis `city-aipax-calendar.tsx` jako leniwej fasady — nieaktualny od commita 1e65074 (F19).

---

## 6. Czego audyt nie sprawdził

- **Google Search Console** — brak dostępu (brak weryfikacji, F03). Kliknięcia, wyświetlenia, raport 404 i ruch z Grafiki to najważniejsze dane do monitoringu; pozycje z 06.10 to pomiar z przeglądarki, nie z GSC.
- **Wizytówki Google Business Profile** — tylko to, co widać publicznie w wynikach (F12).
- **Prawdziwy iOS Safari** — test zastępczy w Chromium z UA iPhone’a i blokadą ciasteczek stron trzecich.
- **Panele GTM, Cookiebot i AIPAX** — ocena na podstawie opublikowanego kontenera GTM (wersja 17), publicznej konfiguracji Cookiebot i odpowiedzi API AIPAX, bez wglądu w ustawienia.

---

## 7. Proponowana kolejność

1. **Od razu, kod (ok. pół dnia):** F11 (obce konta), F04 (osierocone strony), F13 (martwy przycisk), F05 (cele 301), R2.1 + F47 (YouTube przed zgodą), F30/F31 (Open Graph), F38, F59, F35, F56.
2. **Od razu, serwer (kwadrans):** F02 — wyprowadzić stare wtyczki i motyw z `wp-content`.
3. **Gabriel, panele (1–2 h):** F03 Search Console → F15 Cookiebot (skan) → F14 i F48 GTM → F12 wizytówki → R5.2 Bing → F46/F24 AIPAX.
4. **RODO:** F01 polityka prywatności (Claude pisze, Gabriel zatwierdza) + decyzje: Mouseflow, Consent Mode v2 (F49), trackery AIPAX (F16).
5. **Wydajność:** F19 → F17 → F20 → F22 → F21 → F45.
6. **Treść od Gabriela:** F10 (wiek), F09 (grafiki 2026/27), F36 (liczby), F37 (cenniki), F06, F07, F27, F26, F08, F40.
7. **Dostępność i P3** — partiami przy okazji innych zmian.

Monitoring: pozycje i indeks 20.10 i 03.11; Core Web Vitals w GSC ok. 4 tygodnie po podmianie; odnowienie certyfikatu ok. 20.11.2026.

---

## Obalone w weryfikacji

- **F65** „pozostałe stare mapy Yoasta i WP dają 404” — obalone: stara strona nigdy nie publikowała `post-`, `category-`, `product-sitemap.xml` ani `wp-sitemap.xml` (Yoast miał tylko `page-sitemap.xml`, która ma 301). 404 jest tu poprawne.
