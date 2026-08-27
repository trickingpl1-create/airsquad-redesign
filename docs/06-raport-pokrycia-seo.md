# Raport: audyt założeń SEO i pokrycia linków (stara vs nowa strona)

Data: 26.08.2026 · Zakres: sitemap starej strony airsquad.pl (WordPress, 29 URL-i) vs build nowej strony (`out/`, 40 podstron) + staging new.airsquad.pl · Punkt odniesienia: `docs/02-plan-seo.md` i `docs/03-mapa-url.md`.

## Werdykt w skrócie

Fundament jest zgodny z planem: wszystkie chronione landing pages istnieją pod starymi adresami, mają tytuły, opisy i canonicale, a wycofany `/tyczyn/` faktycznie robi 301 na `/rzeszow/` (sprawdzone na żywo na stagingu). Do naprawy przed produkcją: 1 uszkodzony link w stopce (polityka prywatności), 5 błędnych linków wewnętrznych, brak `/aktualnosci/` w sitemapie, brak H1 na 5 stronach oraz decyzja o losie 10 archiwalnych URL-i, które dziś skończyłyby jako 404.

## 1. Pokrycie URL-i: stara → nowa

### Zachowane zgodnie z planem (✓ = strona istnieje, canonical poprawny, jest w sitemapie)

`/` · `/rzeszow/` · `/debica/` · `/jaslo/` · `/biecz/` · `/brzostek/` · `/pilzno/` · `/akrobatyka/` · `/tricking-akademia/` · `/tumbling/` · `/longboardy/` · `/zapisy/` · `/letni/` · `/obozy-sportowe/` · `/airmeeting/` · `/gravityjam/` · `/sklep/` — wszystkie ✓.

`/aktualnosci/` — strona istnieje, ale **NIE MA jej w sitemap.xml** (plan każe ją zachować; stara strona miała ją w sitemapie). Do dodania.

`/tyczyn/` — zgodnie z decyzją: 301 → `/rzeszow/`. **Zweryfikowane na żywo na new.airsquad.pl — działa.**

### Stare URL-e bez odpowiednika i bez przekierowania (na produkcji będą 404)

| Stary URL | Status w planie | Propozycja celu 301 |
|---|---|---|
| `/polityka-prywatnosci/` | — (pominięty w planie) | **utworzyć stronę** — stopka nowej strony już do niej linkuje; wymóg RODO |
| `/zimowy/` | archiwalny, do analizy GSC | `/obozy-sportowe/` |
| `/aircamp24/` | archiwalny, do analizy GSC | `/letni/` |
| `/diamond-camp-2021/` | archiwalny, do analizy GSC | `/obozy-sportowe/` |
| `/diamond-camp-2022/` | archiwalny, do analizy GSC | `/obozy-sportowe/` |
| `/portfolio/` | archiwalny, do analizy GSC | `/media/` |
| `/stickit/` | archiwalny, do analizy GSC | `/wydarzenia/` |
| `/spotkanie/` | archiwalny, do analizy GSC | `/wydarzenia/` |
| `/airspace/` | archiwalny, do analizy GSC | do decyzji |
| `/zapisyairspace/` | — (nie ujęty w planie) | `/zapisy/` lub jak `/airspace/` |
| `/szarfy/` | — (nie ujęty w planie) | `/sklep/` |

Zasada z planu: „Każdy stary URL musi zwracać 200 albo 301". Przed premierą każdy z powyższych musi dostać stronę albo regułę 301 (po weryfikacji ruchu w Google Search Console). Mechanizm `withdrawn-locations.json` obsługuje tylko lokalizacje — te reguły trzeba dodać osobno do generatora `.htaccess`.

## 2. Uszkodzone linki wewnętrzne w buildzie

| Strona | Linkuje do | Problem |
|---|---|---|
| strona główna | `/dyscypliny/tricking/` | istnieje `/dyscypliny/tricking-akademia/` — zły slug |
| strona główna | `/dyscypliny/longboard/` | istnieje `/dyscypliny/longboardy/` — zły slug |
| strona główna | `/dyscypliny/showdance/` | strona nie istnieje w ogóle |
| strona główna | `/dyscypliny/snowboard/` | strona nie istnieje w ogóle |
| `/lokalizacje/` | `/lokalizacje/tyczyn/` | Tyczyn wycofany — link powinien zniknąć |
| stopka (wszystkie strony) | `/polityka-prywatnosci/` | strona nie istnieje |

## 3. Meta SEO nowej strony

Dobrze: wszystkie 40 stron mają unikalny `<title>` i meta description (plan: „obecnie wiele kluczowych stron ma puste opisy" — naprawione). Lokalne tytuły typu „Akrobatyka Dębica — zajęcia dla dzieci i dorosłych" zgodne z rekomendacją. Duplikaty pod nową strukturą (`/lokalizacje/rzeszow/`, `/dyscypliny/akrobatyka/`, `/wydarzenia/letni/` itd.) mają canonical wskazujący stary adres i nie występują w sitemapie — dokładnie tak, jak zakładał plan („nowe strony zbiorcze nie zastępują starych landingów").

Braki:

- **Canonical brakuje na 13 stronach**: `/`, `/aktualnosci/`, `/dyscypliny/`, `/lokalizacje/`, `/wydarzenia/`, `/obozy/`, `/grafik/`, `/kontakt/`, `/trenerzy/`, `/sklep/`, `/media/`, `/aircamp/`, `/404/`. Plan: „Nie publikować strony z … brakującymi canonical".
- **H1 = 0** na: `/kontakt/`, `/obozy-sportowe/` (strona chroniona!), `/aktualnosci/`, `/grafik/`, `/zapisy/` (główna ścieżka konwersji). Pozostałe 35 stron ma dokładnie jedno H1.
- **`/aircamp/` dubluje `/letni/`** (obie o Air Camp 2026), bez canonicala i poza sitemapą — ryzyko kanibalizacji; dodać canonical → `/letni/` albo 301.
- Sitemap nie zawiera także `/media/` i `/aircamp/` — jeśli mają być indeksowane, dodać; jeśli nie, dodać im canonical/noindex świadomie.

## 4. Schema.org (założenie z planu: Organization, LocalBusiness, Event, FAQ, Breadcrumb)

Zrealizowane na stronach kluczowych: lokalizacje mają `SportsActivityLocation` + `SportsOrganization` + `FAQPage` + `BreadcrumbList` + `PostalAddress`; `/letni/` i `/airmeeting/` mają `Event` + `Place` + FAQ/Breadcrumb; `/akrobatyka/` ma `Course` + `Organization` + Breadcrumb. Braki: strona główna bez `Organization` (plan ją wymienia), `/kontakt/` i `/zapisy/` bez żadnej schemy (na kontakcie przydałby się `Organization` z danymi kontaktowymi).

## 5. Staging i robots

- `robots.txt`: poprawny (Allow /, Disallow /admin/ i /api/, wskazuje sitemapę produkcyjną).
- Staging: 301 z `/tyczyn/` działa, więc `.htaccess` na serwerze jest aktywny — to wersja generowana przez `make-deploy-zip.sh staging`, zawierająca nagłówek `X-Robots-Tag: noindex` (warto raz potwierdzić w DevTools → Network → Headers). Uwaga procesowa: paczka wgrana 26.08 była spakowana ręcznie z minimalnym `.htaccess` bez reguł 301 — na serwerze działa właściwa wersja, ale kolejne deploye robić wyłącznie przez `./scripts/make-deploy-zip.sh staging|production`, który generuje pełny `.htaccess` i pilnuje spójności przekierowań.

## 6. Lista zadań przed produkcją (priorytet malejąco)

1. Utworzyć `/polityka-prywatnosci/` (stopka już linkuje; RODO).
2. Poprawić 4 linki dyscyplin na stronie głównej i usunąć link do `/lokalizacje/tyczyn/` z `/lokalizacje/`.
3. Dodać `/aktualnosci/` do sitemap.xml.
4. Uzupełnić H1 na `/zapisy/`, `/obozy-sportowe/`, `/kontakt/`, `/aktualnosci/`, `/grafik/`.
5. Dodać canonicale na 13 stronach bez nich (min. strona główna i huby).
6. Pobrać dane GSC i zdecydować o 301 dla 10 archiwalnych URL-i; dodać reguły do generatora `.htaccess`.
7. Rozstrzygnąć `/aircamp/` vs `/letni/` (canonical lub 301).
8. Dodać `Organization` na stronie głównej i schemę na `/kontakt/`.
9. Po premierze: wysłać sitemapę w GSC i monitorować 404/pozycje przez 2–8 tygodni (zgodnie z planem).
