# Mapa URL-i i przekierowań

Cel: zachować obecne publiczne adresy, które mogą mieć widoczność w Google. Nie tworzymy przekierowań na stronę główną jako rozwiązania domyślnego.

## Zachowane URL-e

| URL | Status | Typ strony | Decyzja |
|---|---|---|---|
| `/` | zachowany | strona główna | Prerenderowana strona główna. |
| `/akrobatyka/` | zachowany | oferta | Nie przenosić na `/zajecia/akrobatyka/`. |
| `/rzeszow/` | zachowany | lokalizacja | Nie przenosić na `/lokalizacje/rzeszow/`. |
| `/debica/` | zachowany | lokalizacja | Zachować jako lokalny landing. |
| `/jaslo/` | zachowany | lokalizacja | Zachować jako lokalny landing. |
| `/biecz/` | zachowany | lokalizacja | Zachować jako lokalny landing. |
| `/brzostek/` | zachowany | lokalizacja | Zachować jako lokalny landing. |
| `/tyczyn/` | **301 → `/rzeszow/`** | lokalizacja | Zajęcia zawieszone (sierpień 2026), bez planu powrotu — decyzja klubu. Strona nie buduje się, adres przekierowany. Patrz sekcja niżej. |
| `/pilzno/` | zachowany | lokalizacja | Zachować jako lokalny landing. |
| `/tricking-akademia/` | zachowany | oferta | Zachować istniejący slug. |
| `/tumbling/` | zachowany | oferta | Zachować istniejący slug. |
| `/longboardy/` | zachowany | oferta | Zachować istniejący slug. |
| `/zapisy/` | zachowany | zapisy | Zachować jako główną ścieżkę konwersji. |
| `/letni/` | zachowany | Air Camp | Zachować jako aktywny landing Air Camp. |
| `/obozy-sportowe/` | zachowany | hub obozów | Zachować i rozbudować jako hub. |
| `/airmeeting/` | zachowany | wydarzenie | Zachować jako landing wydarzenia. |
| `/gravityjam/` | zachowany | wydarzenie/archiwum | Zachować jako archiwum/landing wydarzenia. |
| `/aktualnosci/` | zachowany | aktualności | Zachować jako lista komunikatów. **Zbudowana 2026-07-14** (`app/aktualnosci/page.tsx`, treść ze zscrape'owanej tablicy ogłoszeń airsquad.pl), link w głównym menu. |

## Nowe strony zbiorcze

Te strony mogą istnieć, ale nie zastępują starych landing pages:

| URL | Cel |
|---|---|
| `/lokalizacje/` | Lista lokalizacji prowadząca do istniejących URL-i miast. |
| `/zajecia/` | Lista zajęć prowadząca do istniejących URL-i ofert. |
| `/obozy/` | Strona zbiorcza, ale `/obozy-sportowe/` pozostaje zachowane. |
| `/wydarzenia/` | Strona zbiorcza prowadząca do Air Meeting i Gravity Jam. |
| `/trenerzy/` | Nowa strona zespołu. |
| `/kontakt/` | Nowa strona kontaktowa. |

**Restrukturyzacja menu głównego (2026-07-14):** główna nawigacja zawiera teraz 5 pozycji (AKTUALNOŚCI / OBOZY I WYDARZENIA / TRENINGI / SKLEP / KONTAKT — `components/layout/header.tsx`). „TRENINGI" to przemianowany link do `/lokalizacje/` (URL bez zmian). „OBOZY I WYDARZENIA" to rozwijane menu prowadzące bezpośrednio do `/letni/`, `/airmeeting/`, `/gravityjam/` — hub-y `/obozy/` i `/wydarzenia/` **wypadły z top-level menu** (nadal istnieją w kodzie, linkowane śródtekstowo/ze stopki). `/grafik/`, `/trenerzy/`, `/dyscypliny/` również wypadły z top-level menu z tego samego powodu — zostają dostępne, ale nie z głównej nawigacji. Wizualne ujednolicenie tych stron do nowego stylu i naprawa pobierania danych (Supabase) zaplanowane jako Faza B (patrz plan „Restrukturyzacja menu głównego" w historii sesji).

## Kandydaci do przekierowań, ale tylko po decyzji

| Z | Do | Status | Dlaczego nie wdrożone automatycznie |
|---|---|---|---|
| `/lokalizacje/rzeszow/` | `/rzeszow/` | do ręcznej decyzji | Nie tworzymy nowej struktury kosztem obecnego URL-a. |
| `/zajecia/akrobatyka/` | `/akrobatyka/` | do ręcznej decyzji | Obecny URL `/akrobatyka/` ma zostać zachowany. |
| `/obozy/air-camp/` | `/letni/` | do ręcznej decyzji | `/letni/` jest aktywnym adresem Air Camp. |
| `/wydarzenia/air-meeting/` | `/airmeeting/` | do ręcznej decyzji | `/airmeeting/` jest istniejącym adresem. |

## Strony archiwalne do analizy przed decyzją

Nie usunięto i nie przekierowano automatycznie:

- `/aircamp24/`
- `/diamond-camp-2021/`
- `/diamond-camp-2022/`
- `/zimowy/`
- `/stickit/`
- `/spotkanie/`
- `/airspace/`
- `/portfolio/`
- `/sklep/` — **decyzja użytkownika 2026-07-14**: mimo statusu „do analizy" zostaje na razie aktywnym linkiem w głównym menu (rozwój sklepu odłożony w czasie, nie usuwamy dostępu).

Decyzja wymaga danych z Google Search Console: kliknięcia, wyświetlenia, linki zewnętrzne, stan indeksowania.

## Zasada wdrożeniowa

Jeżeli po publikacji pojawi się URL, który ma zostać usunięty:

1. Sprawdzić ruch i linki w Google Search Console.
2. Wybrać najbliższy tematycznie docelowy adres.
3. Dodać 301, nie 302.
4. Nie przekierowywać masowo na stronę główną.
5. Zaktualizować sitemap i ponownie przetestować crawl.

## Wycofane lokalizacje

Adres z kolumny „zachowany" wolno wycofać **wyłącznie razem z przekierowaniem 301**
na stronę o pokrewnej treści. Bez 301 mielibyśmy 404 na adresie obecnym w Google
od czasów WordPressa — czyli utratę pozycji i zerwane linki z zewnątrz.
Z 301 większość mocy adresu przechodzi na cel, więc sens kontraktu zostaje
dotrzymany, mimo że sama strona znika.

| Adres | Cel 301 | Data | Powód |
|---|---|---|---|
| `/tyczyn/` | `/rzeszow/` | sierpień 2026 | Zajęcia zawieszone bez planu powrotu. Rzeszów to najbliższa czynna lokalizacja (ok. 10 km), ta sama oferta. |

Mechanika: wpis w `lib/content/withdrawn-locations.json` robi trzy rzeczy naraz —
usuwa lokalizację z menu, zapisów i `/kontakt/`, odcina jej stronę w
`getCityPages()` (więc nie trafia do sitemapy ani do `generateStaticParams`)
oraz generuje regułę `Redirect 301` w `.htaccess` przez
`scripts/emit-redirects.mjs`. `scripts/make-deploy-zip.sh` przerywa pakowanie,
gdy wycofana lokalizacja nadal ma stronę w `out/` albo gdy cel 301 nie istnieje.

Treść strony **zostaje** w `lib/content/cities.ts`. Przywrócenie lokalizacji to
usunięcie jednego wpisu z JSON-a — bez odtwarzania tekstów.
