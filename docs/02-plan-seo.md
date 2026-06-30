# Plan ochrony SEO przy redesignie Air Squad

Cel: poprawić stronę bez utraty obecnej widoczności w Google. Zakładamy, że airsquad.pl już dobrze pozycjonuje się na ważne frazy, dlatego redesign ma być ewolucją, nie resetem.

## Główna zasada

Nie zmieniamy jednocześnie wszystkiego. Najpierw zachowujemy adresy, intencje stron i najważniejsze treści. Dopiero potem poprawiamy UX, szybkość, nagłówki, schema.org i linkowanie wewnętrzne.

## Co musi zostać zachowane

Adresy URL, które powinny zostać zachowane jako publiczne landing pages:

- `/`
- `/akrobatyka/`
- `/rzeszow/`
- `/debica/`
- `/jaslo/`
- `/biecz/`
- `/brzostek/`
- `/tyczyn/`
- `/pilzno/`
- `/tricking-akademia/`
- `/tumbling/`
- `/longboardy/`
- `/zapisy/`
- `/letni/`
- `/obozy-sportowe/`
- `/airmeeting/`
- `/gravityjam/`
- `/aktualnosci/`

Strony archiwalne, np. `aircamp24`, `diamond-camp-2021`, `diamond-camp-2022`, `spotkanie`, `stickit`, nie powinny być usuwane bez sprawdzenia w Google Search Console. Mogą mieć ruch sezonowy albo linki zewnętrzne.

## Dane potrzebne przed finalną budową

Przed wdrożeniem finalnej strony warto pobrać:

- Google Search Console: skuteczność według stron z ostatnich 16 miesięcy.
- Google Search Console: zapytania dla każdej ważnej strony.
- Google Search Console: strony z linkami zewnętrznymi.
- Google Search Console: stan indeksowania i błędy.
- Obecny sitemap.
- Crawl obecnej strony: statusy HTTP, title, meta description, H1, canonical, linki wewnętrzne.
- Lista najważniejszych fraz biznesowych: akrobatyka Rzeszów, akrobatyka Dębica, tricking Rzeszów, obozy sportowe dla dzieci, Air Camp itd.

## Zasady migracji URL

- Domyślnie zachowujemy obecny URL.
- Jeżeli nowa struktura wymaga nowego URL, stary adres dostaje przekierowanie 301.
- Nie stosujemy przekierowań 302 dla stałych zmian.
- Nie przekierowujemy wielu różnych stron na stronę główną.
- Nie usuwamy strony z ruchem tylko dlatego, że jest „stara”.
- Każdy URL z ruchem organicznym musi mieć docelowy odpowiednik.
- Każdy stary URL musi zwracać 200 albo 301. Nie powinien kończyć jako 404.

## Co poprawiamy bez ryzyka utraty pozycji

- Szybkość ładowania.
- Czytelność mobile.
- Struktura H1/H2, ale bez zmiany intencji strony.
- Meta descriptions, bo obecnie wiele kluczowych stron ma puste opisy.
- Linkowanie wewnętrzne między miastami, zajęciami, trenerami i zapisami.
- Schema.org: Organization, LocalBusiness/SportsActivityLocation, Event, FAQPage, BreadcrumbList.
- Alt texty zdjęć.
- Moduły FAQ lokalne i ofertowe.
- Opinie i sekcje zaufania.
- Usunięcie chaosu w stopce, ale z zachowaniem linków do stron, które mają znaczenie SEO.

## Czego nie robić na start

- Nie przenosić `/rzeszow/` na `/lokalizacje/rzeszow/` bez mocnego powodu.
- Nie przenosić `/akrobatyka/` na `/zajecia/akrobatyka/` bez 301 i analizy.
- Nie przepisywać całych tekstów tak, że Google widzi zupełnie inną intencję strony.
- Nie usuwać archiwalnych obozów i wydarzeń przed analizą ruchu.
- Nie blokować stagingu ani produkcji błędnym `robots.txt`.
- Nie publikować strony z pustymi meta, losowymi H1 albo brakującymi canonical.
- Nie indeksować wersji testowej.

## Rekomendowany proces wdrożenia

1. Crawl obecnej strony i eksport danych SEO.
2. Oznaczenie stron jako: chronione, do poprawy, do połączenia, archiwalne, do noindex po analizie.
3. Budowa nowych szablonów na tych samych adresach.
4. Przeniesienie najważniejszych treści i fraz z obecnych stron.
5. Dodanie nowych sekcji, które wzmacniają SEO: FAQ, trenerzy, lokalizacja, grafik, dojazd, opinie.
6. Test stagingu z `noindex`.
7. Test statusów: 200, 301, canonical, sitemap, robots.
8. Publikacja.
9. Wysłanie sitemap w Google Search Console.
10. Monitoring przez 2-8 tygodni: indeksacja, pozycje, kliknięcia, błędy 404, Core Web Vitals.

## Proponowana mapa decyzji URL

| Obecny URL | Decyzja SEO-safe | Uzasadnienie |
|---|---|---|
| `/akrobatyka/` | Zachować | Główna strona oferty, potencjał na frazy ogólne i lokalne. |
| `/rzeszow/` | Zachować | Silna strona lokalna, prawdopodobnie kluczowa dla ruchu. |
| `/debica/` | Zachować | Strona lokalna z konkretną salą i zapisami. |
| `/jaslo/` | Zachować | Strona lokalna z grupami i formularzem. |
| `/biecz/` | Zachować | Strona lokalna z grafikiem i zapisami. |
| `/brzostek/` | Zachować | Strona lokalna, wzmacnia SEO w mniejszej miejscowości. |
| `/tyczyn/` | Zachować | Strona lokalna, nie przenosić bez potrzeby. |
| `/pilzno/` | Zachować | Strona lokalna i historyczna treść. |
| `/tricking-akademia/` | Zachować | Istniejący landing dla trickingu. |
| `/tumbling/` | Zachować | Istniejący landing dla skoków na ścieżce. |
| `/longboardy/` | Zachować | Istniejący landing dla longboardu. |
| `/letni/` | Zachować | Aktualny Air Camp 2026, sezonowy potencjał SEO. |
| `/airmeeting/` | Zachować | Wydarzenie cykliczne, może łapać zapytania brandowe. |
| `/obozy-sportowe/` | Zachować lub rozbudować jako hub | Może wspierać Air Camp i obozy zimowe. |
| `/zapisy/` | Zachować | Ważna ścieżka konwersji i potencjalny sitelink. |

## Jak poprawić wyniki, nie tylko je utrzymać

- Dodać unikalne meta descriptions dla każdej ważnej strony.
- Dodać lokalne H1: „Akrobatyka dla dzieci w Rzeszowie”, „Akrobatyka Dębica - zajęcia dla dzieci”.
- Dodać sekcje „Dla kogo”, „Grafik”, „Adres”, „Trenerzy”, „Jak się zapisać”, „FAQ” na każdej lokalizacji.
- Dodać widoczne linki z głównej do wszystkich lokalizacji.
- Linkować z każdej lokalizacji do `/zapisy/` i do odpowiednich zajęć.
- Linkować z zajęć do miast, w których realnie są prowadzone.
- Dodać breadcrumbs.
- Dodać schema.org dla wydarzeń i obozów.
- Zoptymalizować zdjęcia i lazy loading galerii.
- Uporządkować archiwum obozów jako relacje, które linkują do aktualnego Air Camp.

## Monitoring po publikacji

Przez pierwsze tygodnie po wdrożeniu trzeba sprawdzać:

- Czy Google widzi sitemap.
- Czy nie rośnie liczba błędów 404.
- Czy strony lokalne są zaindeksowane.
- Czy canonical wskazuje właściwy adres.
- Czy najważniejsze frazy nie spadają.
- Czy poprawiają się Core Web Vitals.
- Czy formularze zapisów nadal działają.

## Wniosek

Najlepsza strategia dla Air Squad to SEO-safe redesign: zachować działające URL-e, poprawić szablony i treść, dodać brakujące elementy SEO, a migrację technologii lub struktury adresów traktować jako osobną decyzję po analizie Search Console. W ten sposób minimalizujemy ryzyko spadków, a jednocześnie zwiększamy szanse na lepsze wyniki.
