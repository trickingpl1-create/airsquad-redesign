# Audyt obecnej strony Air Squad

Data audytu: 2026-05-01  
Strona: https://airsquad.pl  
Zakres: analiza publicznej strony, treści WordPress, struktury podstron, formularzy AIPAX, podstaw SEO i gotowości administracyjnej.  
Założenie do ręcznej weryfikacji: nie wykonywałem pełnego pomiaru Lighthouse ani testu wszystkich breakpointów w przeglądarce. Wnioski o mobile wynikają z HTML, struktury stron, osadzonych iframe i układu treści.

## Źródła użyte w audycie

- Strona główna: https://airsquad.pl/
- Akrobatyka: https://airsquad.pl/akrobatyka/
- Lokalizacje: https://airsquad.pl/rzeszow/, https://airsquad.pl/debica/, https://airsquad.pl/jaslo/, https://airsquad.pl/biecz/, https://airsquad.pl/brzostek/, https://airsquad.pl/tyczyn/, https://airsquad.pl/pilzno/
- Zajęcia i oferta: https://airsquad.pl/tricking-akademia/, https://airsquad.pl/tumbling/, https://airsquad.pl/longboardy/
- Obozy i wydarzenia: https://airsquad.pl/letni/, https://airsquad.pl/obozy-sportowe/, https://airsquad.pl/airmeeting/, https://airsquad.pl/gravityjam/
- Zapisy: https://airsquad.pl/zapisy/
- Publiczny WordPress REST API strony.

## Obecna struktura informacji

Obecne podstrony obejmują:

- Strona główna: obecnie pod tytułem „Akrobatyka”.
- Oferta główna: Akrobatyka, Tricking Akademia, Tumbling, Longboardy, warsztaty i lekcje indywidualne.
- Lokalizacje: Rzeszów, Tyczyn, Dębica, Pilzno, Brzostek, Jasło, Biecz.
- Obozy: Air Camp, Obozy Sportowe, Diamond Camp, archiwalne AirCamp24, Diamond Camp 2021, Diamond Camp 2022.
- Wydarzenia: Air Meeting, Gravity Jam, StickIt.
- Zapisy: osobna strona z formularzem oraz formularze osadzone na stronach lokalizacji i wydarzeń.
- Inne: AirSpace, Aktualności, Portfolio, Sklep, Spotkanie, Polityka prywatności.

Strona główna zawiera obecnie:

- Hero z ogólnym komunikatem o akrobatyce i trickingu.
- CTA „zapisz się na zajęcia” i „sprawdź grafik”.
- Sekcję aktualności dla rodziców.
- Liczniki: grupy treningowe, uczestnicy, trenerzy, obozy.
- Air Meeting 2026.
- Letni obóz sportowy Air Camp.
- Treningi akrobatyki z listą miast.
- Osadzony grafik AIPAX.
- Warsztaty i lekcje indywidualne.
- Tricking Akademia.
- Skoki na ścieżce.
- Longboard.
- Gravity Jam.
- Zimowy obóz akrobatyczny.
- Zespół trenerów.
- Kontakt i stopkę.

Główne oferty są obecne, ale są ułożone bardziej jak długi zbiór sekcji niż jak system oferty:

- Akrobatyka: najmocniejsza i najlepiej opisana, występuje globalnie oraz na stronach miast.
- Tricking: osobna strona, sekcja na głównej i w Rzeszowie.
- Tumbling / skoki na ścieżce: osobna strona, sekcje na głównej i w Rzeszowie.
- Longboard: osobna strona, ale mniej powiązana z zapisami i miastami.
- Obozy: Air Camp jest aktywny, Diamond Camp i starsze obozy mieszają się z aktualnymi treściami.
- Air Meeting i Gravity Jam: silne treści wydarzeniowe, ale wymagają osobnego modelu wydarzeń.
- Warsztaty i lekcje indywidualne: istnieją, lecz nie mają wyraźnej ścieżki zapisu i landing page.
- Lokalizacje: są osobne strony, ale nie mają jednolitego szablonu treści.

Użytkownik może się zapisać:

- Przez CTA na stronie głównej.
- Na stronie /zapisy/.
- Przez osadzone formularze AIPAX na podstronach lokalizacji.
- Przez osadzone formularze AIPAX na stronach wydarzeń i obozów.
- Czasem przez kontakt telefoniczny lub SMS, np. przy wydarzeniach.

Informacje powtarzalne:

- Opisy akrobatyki i bezpieczeństwa.
- Listy miast.
- CTA „Więcej informacji / zapisy”.
- Dane kontaktowe.
- Dane trenerów.
- Formularze i grafiki AIPAX.
- Informacje o tym, że zajęcia prowadzą doświadczeni trenerzy na matach AirTrack.

Informacje ukryte lub trudne do znalezienia:

- Szybki wybór miasta z poziomu pierwszego ekranu.
- Różnice między akrobatyką, trickingiem i tumblingiem.
- Dla jakiego wieku i poziomu są konkretne grupy.
- Aktualne ceny, jeśli nie są widoczne w iframe.
- Jeden prosty proces „chcę zapisać dziecko”.
- Status aktualności: aktywne, archiwalne, ważne dla rodziców.
- Informacje lokalne: adres, parking, wejście, grupa wiekowa, pierwszy trening, zasady płatności.

## UX

Rodzic po wejściu na stronę rozumie, że Air Squad prowadzi akrobatykę, tricking, obozy i zajęcia sportowe. Problemem jest tempo zrozumienia szczegółów. Strona szybko pokazuje energię i zakres działalności, ale mniej szybko odpowiada na pytania rodzica:

- Czy są zajęcia w moim mieście?
- Dla jakiego wieku?
- Którą grupę mam wybrać?
- Ile to kosztuje?
- Jak wygląda pierwszy trening?
- Czy to jest bezpieczne?
- Jak zapisać dziecko bez dzwonienia?

Największe bariery konwersji:

- Brak jednego widocznego modułu „Wybierz miasto i zajęcia”.
- CTA są częste, ale niespójne i często wyglądają podobnie do zwykłych linków.
- Osadzone formularze są potrzebne, ale iframe może spowalniać stronę i utrudniać orientację.
- Strony lokalizacji mają różną strukturę i różny poziom szczegółowości.
- Archiwalne treści mieszają się z aktywnymi ofertami.
- Część nagłówków brzmi jak komunikaty organizacyjne, a nie jak decyzje użytkownika.
- Strona prowadzi bardziej przez „co mamy” niż przez „co mam zrobić jako rodzic”.

Rekomendowana ścieżka użytkownika:

1. Widzę w hero jasny komunikat: akrobatyka, tricking i obozy dla dzieci, młodzieży i dorosłych.
2. Klikam „Wybierz miasto” albo „Zapisz dziecko”.
3. Widzę listę lokalizacji i dostępnych zajęć.
4. Na stronie lokalizacji mam adres, grupy, wiek, grafik, trenerów, FAQ i przycisk zapisu.
5. Formularz zapisu jest osadzony dopiero po wybraniu właściwej lokalizacji lub grupy.

## UI

Najważniejsze obserwacje:

- Hierarchia nagłówków jest niespójna. Na stronie głównej brakuje jasnego H1 w treści REST, a wiele ważnych sekcji jest H2. Na stronie Longboardy użyto wielu H1. Na stronie Jasło pojawia się H1 „Zapisy!”, co nie opisuje strony.
- Dużo tekstów jest pisanych wielkimi literami. To obniża czytelność, szczególnie na mobile.
- Układ jest długi, z dużą liczbą sekcji i podobnych CTA.
- Styl zdjęć jest atrakcyjny, ale mieszają się zdjęcia aktualne, archiwalne, grafiki wydarzeń, galerie i portrety trenerów bez jednolitego rytmu.
- Kolory opierają się na fiolecie, czerni i jasnych tłach, ale brakuje systemu: kolor CTA, kolor informacji, kolor alertu, kolor zaufania.
- Typografia nie buduje wyraźnej różnicy między hero, sekcjami, kartami i treścią organizacyjną.
- Stopka zawiera wiele starych lub technicznych linków, np. Portfolio, archiwalne obozy i duplikaty.
- Motyw WordPress i liczne wtyczki powodują wizualne oraz techniczne obciążenie strony.

Mobile view, do ręcznej weryfikacji:

- Długie strony i liczne osadzone iframe prawdopodobnie wymagają dużo przewijania.
- Galerie i portrety mogą dominować nad informacją użytkową.
- Formularze AIPAX i kalendarze mogą mieć ograniczoną czytelność w wąskich viewportach.
- CTA powinno być powtórzone jako sticky lub widoczne po ważnych blokach, ale nie powinno zasłaniać treści.

## SEO

Strona ma bardzo dobry potencjał lokalny, bo realnie działa w wielu miejscowościach i ma konkretne zajęcia. Po dodatkowym założeniu właściciela, że strona już dobrze i szybko pozycjonuje się w Google, priorytet SEO trzeba zmienić: nie zaczynamy od przebudowy adresów URL, tylko od ochrony istniejących landing pages i ostrożnego wzmacniania ich treści.

Najważniejsza korekta względem pierwotnej rekomendacji: nowa struktura informacji może być logiczniejsza w nawigacji i CMS, ale publiczne adresy URL powinny zostać zachowane tam, gdzie już pracują w Google.

### Założenia SEO-first

- Nie zmieniamy domeny, protokołu ani podstawowych adresów URL bez bardzo dobrego powodu.
- Istniejące strony lokalne zostają pod obecnymi adresami: `/rzeszow/`, `/debica/`, `/jaslo/`, `/biecz/`, `/brzostek/`, `/tyczyn/`, `/pilzno/`.
- Istniejące strony ofertowe zostają pod obecnymi adresami: `/akrobatyka/`, `/tricking-akademia/`, `/tumbling/`, `/longboardy/`.
- Istniejące strony obozów i wydarzeń zostają pod obecnymi adresami, jeżeli generują ruch lub mają linki: `/letni/`, `/obozy-sportowe/`, `/airmeeting/`, `/gravityjam/`, `/stickit/`.
- Nową strukturę można pokazać w menu, breadcrumbs i CMS, ale nie musi ona oznaczać zmiany URL-i.
- Nowe adresy typu `/lokalizacje/` lub `/zajecia/` mogą działać jako strony zbiorcze, a nie jako zamienniki obecnych stron.
- Przekierowania 301 stosujemy tylko wtedy, gdy strona naprawdę znika albo łączymy duplikaty po analizie Google Search Console.
- Nie usuwamy archiwalnych stron bez sprawdzenia, czy nie mają ruchu, linków zewnętrznych lub sezonowych wyszukiwań.

Problemy SEO:

- Meta descriptions są puste dla kluczowych stron.
- Title są często generyczne, np. „Akrobatyka - Air Squad”, bez mocnego doprecyzowania miasta, wieku i oferty.
- Brakuje spójnej struktury H1/H2.
- Lokalizacje mają osobne strony, ale nie zawsze mają pełny zestaw lokalnych informacji.
- Starsze strony obozów i wydarzeń mogą konkurować z aktualnymi.
- Brakuje systemowego schema.org dla LocalBusiness, SportsActivityLocation, Event, FAQPage, BlogPosting i Course/Event tam, gdzie ma to sens.
- Brakuje dedykowanych sekcji lokalnych: dojazd, sala, trenerzy, FAQ, najbliższe terminy, opinie z miasta.

Czy warto rozdzielić ofertę według miast i dyscyplin:

Tak, ale z kontrolą jakości i bez kasowania obecnych landingów. Najbezpieczniejszy model:

- Każda dyscyplina ma własną stronę ogólną.
- Każde miasto ma własną stronę lokalizacji.
- Obecne strony lokalne wzmacniamy jako strony typu „Akrobatyka Rzeszów”, „Akrobatyka Dębica”, „Akrobatyka Jasło” itd., zamiast przenosić je pod nowe URL-e.
- Dla najważniejszych połączeń, które nie mają jeszcze własnej strony, tworzymy nowe landing pages dopiero wtedy, gdy mamy realne zajęcia i unikalną treść.
- Nie tworzymy cienkich, automatycznych stron dla połączeń bez realnych zajęć lub bez unikalnej treści.

Rekomendowana struktura URL w trybie ochrony pozycji:

- `/`
- `/akrobatyka/`
- `/tricking-akademia/`
- `/tumbling/`
- `/longboardy/`
- `/rzeszow/`
- `/debica/`
- `/jaslo/`
- `/biecz/`
- `/brzostek/`
- `/tyczyn/`
- `/pilzno/`
- `/obozy-sportowe/`
- `/letni/`
- `/airmeeting/`
- `/gravityjam/`
- `/trenerzy/`
- `/aktualnosci/`
- `/kontakt/`
- `/zapisy/`

Opcjonalne nowe strony zbiorcze, które nie zastępują obecnych URL-i:

- `/lokalizacje/`
- `/zajecia/`
- `/obozy/`
- `/wydarzenia/`

Jeżeli w przyszłości zapadnie decyzja o przeniesieniu adresów do struktury `/lokalizacje/rzeszow/`, musi powstać pełna mapa 301, a wdrożenie powinno być poprzedzone eksportem danych z Google Search Console.

Przykładowe H1 i H2:

- H1: „Akrobatyka dla dzieci w Rzeszowie”
- H2: „Dla kogo są zajęcia”
- H2: „Grafik i grupy”
- H2: „Gdzie odbywają się treningi”
- H2: „Trenerzy w Rzeszowie”
- H2: „Jak zapisać dziecko”
- H2: „Najczęstsze pytania rodziców”

- H1: „Tricking w Rzeszowie”
- H2: „Czym jest tricking”
- H2: „Grupy od podstaw i zaawansowane”
- H2: „Sala Air Space”
- H2: „Zapisy na treningi”

- H1: „Air Camp 2026 - letni obóz sportowy Air Squad”
- H2: „Termin i miejsce”
- H2: „Program obozu”
- H2: „Kadra i opieka”
- H2: „Dla kogo jest obóz”
- H2: „Cena i zapisy”
- H2: „FAQ dla rodziców”

## Dostępność

Najważniejsze ryzyka:

- Niespójna struktura nagłówków utrudnia korzystanie z czytników ekranu.
- CTA mogą nie mieć wystarczającego kontrastu w każdej sekcji.
- Teksty pisane wielkimi literami są trudniejsze do czytania.
- Brakuje pewności, że wszystkie zdjęcia mają sensowne alt texty.
- Osadzone iframe formularzy i kalendarzy wymagają opisowych tytułów, jasnego kontekstu i fallbacku.
- Linki typu „Więcej informacji / zapisy” powtarzają się bez jednoznacznego celu.
- Formularze zewnętrzne muszą być dostępne klawiaturą i testowane na mobile.

Rekomendacje:

- Jeden H1 na stronę.
- Sekcje H2, podsekcje H3.
- Każdy przycisk z jednoznacznym tekstem, np. „Zapisz dziecko w Rzeszowie”.
- Alt texty opisujące aktywność, lokalizację lub osobę.
- Widoczny focus state.
- Minimalny rozmiar tekstu 16 px dla treści.
- Kontrast zgodny z WCAG AA.
- Iframe z `title` i krótkim opisem przed osadzeniem.

## Administracja

Treści, które powinny być łatwe do edycji:

- Lokalizacje.
- Zajęcia.
- Grupy treningowe i grafiki.
- Trenerzy.
- Wydarzenia.
- Obozy.
- Aktualności.
- Opinie.
- FAQ.
- Galerie.
- Linki do formularzy AIPAX.
- Dane kontaktowe.
- CTA globalne i sezonowe komunikaty.

Sekcje, które powinny być komponentami:

- Hero.
- Wybór miasta.
- Siatka zajęć.
- Karta lokalizacji.
- Karta trenera.
- Karta wydarzenia.
- Karta obozu.
- Sekcja zapisów.
- FAQ.
- Opinie.
- Galeria.
- Kontakt.
- SEO/meta.
- Stopka.

Dane do zarządzania z JSON/Markdown albo CMS:

- `locations`: miasto, adres, sala, grafik, trenerzy, formularz, FAQ, zdjęcia, SEO.
- `classes`: typ zajęć, opis, wiek, poziom, korzyści, lokalizacje, CTA.
- `trainers`: bio, specjalizacje, lokalizacje, zdjęcie, social media.
- `events`: data, miejsce, program, instruktorzy, formularz, galeria, status.
- `camps`: termin, miejsce, cena, program, atrakcje, kadra, FAQ.
- `posts`: aktualności i komunikaty dla rodziców.
- `testimonials`: opinie powiązane z miastem lub zajęciami.
- `siteSettings`: logo, kolory, kontakt, social media, stopka, link zapisu.

## Najważniejsze problemy

- Brak spójnego systemu informacji dla rodzica.
- Zbyt dużo aktywnych i archiwalnych treści w jednym poziomie nawigacji.
- Niespójne CTA i powtarzalne linki.
- Brak jednolitego szablonu lokalizacji.
- Puste meta descriptions.
- Chaotyczna struktura nagłówków.
- Brak centralnego modelu treści dla zajęć, trenerów, wydarzeń i obozów.
- Osadzone formularze są niezbędne, ale powinny być lepiej opakowane UX-owo.

## Najważniejsze szanse

- Silna, autentyczna marka lokalna.
- Dużo realnych zdjęć i trenerów.
- Szeroka oferta, która może dobrze pracować na SEO.
- Lokalizacje w wielu miastach dają bardzo dobry potencjał wyszukiwań lokalnych.
- Air Camp i Air Meeting mają charakter wydarzeń, które mogą budować społeczność i cykliczny ruch.
- Treści rodzicielskie mogą zwiększyć zaufanie i konwersję.

## Rekomendowana struktura nowej strony

- Strona główna:
  - Hero z jasnym komunikatem.
  - Wybór miasta i zajęć.
  - Oferta.
  - Dlaczego rodzice wybierają Air Squad.
  - Lokalizacje.
  - Trenerzy.
  - Obozy i wydarzenia.
  - Opinie.
  - CTA do zapisów.

- Zajęcia:
  - Akrobatyka.
  - Tricking.
  - Tumbling / skoki na ścieżce.
  - Longboard.
  - Warsztaty i lekcje indywidualne.

- Lokalizacje:
  - Lista miast.
  - Osobna strona miasta z grafikiem, adresem, trenerami, FAQ i formularzem.

- Obozy:
  - Lista obozów.
  - Air Camp jako aktywny landing.
  - Archiwum obozów jako relacje, nie jako konkurencyjna oferta.

- Wydarzenia:
  - Air Meeting.
  - Gravity Jam.
  - StickIt.
  - Archiwum wydarzeń.

- Trenerzy, aktualności, kontakt, zapisy.

## Rekomendowane typy treści

- Lokalizacja.
- Zajęcia.
- Grupa treningowa.
- Trener.
- Wydarzenie.
- Obóz.
- Aktualność.
- Opinia.
- FAQ.
- Galeria.
- Formularz zapisu.
- Ustawienia globalne.

## Priorytety zmian

1. Uporządkować ścieżkę „chcę zapisać dziecko”.
2. Zachować obecne adresy URL stron, które mogą mieć pozycje i linki.
3. Stworzyć jednolity szablon lokalizacji bez zmiany publicznych slugów.
4. Oddzielić aktywne oferty od archiwum bez pochopnego usuwania starych stron.
5. Poprawić strukturę SEO: title, description, H1/H2, schema.org, linkowanie wewnętrzne.
6. Zbudować komponentowy system treści.
7. Dodać FAQ, opinie i sekcje zaufania dla rodziców.
8. Zoptymalizować mobile i iframe zapisów.
9. Uporządkować stopkę i nawigację.

## Ryzyka

- Zbyt duża liczba stron lokalno-dyscyplinarnych może stworzyć cienkie treści.
- Zewnętrzny system zapisów może ograniczać kontrolę UX i dostępności.
- Migracja z WordPressa albo zmiana URL-i może chwilowo obniżyć widoczność, jeśli nie zachowamy adresów, treści, kanonicznych linków i przekierowań.
- Aktualność grafiku zależy od dyscypliny administracyjnej.
- Zdjęcia archiwalne i aktualne trzeba opisać oraz uporządkować.
- Jeśli właściciel nie będzie mieć prostego panelu lub instrukcji, treści szybko znów się rozjadą.

## Czego nie przenosić 1:1

- Starego układu stopki z długą listą przypadkowych stron.
- Mieszania aktywnych ofert z archiwalnymi relacjami.
- Powtarzania tego samego CTA bez kontekstu.
- Wielu H1 na jednej stronie.
- Nagłówków pisanych wielkimi literami jako domyślnego stylu.
- Długich bloków tekstu bez modułów: wiek, poziom, miejsce, grafik, zapisy.
- Formularzy iframe bez opisu, tytułu i fallbacku.
- Stron pustych lub technicznych, np. Portfolio/Sklep, jeśli nie mają funkcji w nowej strukturze.
