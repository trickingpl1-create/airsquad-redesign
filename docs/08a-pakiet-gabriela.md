# Pakiet Gabriela — airsquad.pl po przeprowadzce

Stan na 06.10.2026, dzień po przejściu z WordPressa na nową stronę. Identyfikatory (F03, F14…) pochodzą z audytu `docs/08-audyt-po-podmianie.md`.

**Jak z tego korzystać**
- **Część A** to zadania w panelach, w podanej kolejności (razem ok. 3–4 h, można rozłożyć na 2–3 dni). Odhaczaj `[x]`.
- **Część B** to kwestionariusz treści. Wpisuj odpowiedzi w miejscu `Odp.:` albo w pustych kolumnach tabel. Jeśli coś się zgadza, wystarczy wpisać „OK”.
- Gotowy plik odeślij Claude’owi. Na jego podstawie zostaną poprawione kod i teksty.
- Niczego nie usuwaj na stałe przed testem. W GTM najpierw **wstrzymuj**, a usuwaj dopiero po 2 tygodniach.

| # | Zadanie | Czas | Gotowe |
|---|---|---|---|
| A1 | Search Console (F03) | 30 min + 2× po 10 min | [ ] |
| A2 | Cookiebot (F15, F18, F79) | 30 min (+ skan do 24 h) | [ ] |
| A3 | Google Tag Manager (F14, F48) | 60–90 min | [ ] |
| A4 | Wizytówki Google (F12) | 10 min na wizytówkę | [ ] |
| A5 | Bing Webmaster Tools (R5.2) | 10 min | [ ] |
| A6 | AIPAX (F46, F24) i mail do supportu | 30 min | [ ] |
| B | Kwestionariusz treści | 60 min | [ ] |

**Przed startem przygotuj:** [ ] konto Google z dostępem do GTM, GA4, Google Ads i wizytówek · [ ] login do panelu cyber_Folks · [ ] login do manage.cookiebot.com · [ ] konto administratora w AIPAX · [ ] telefon do testów (tryb incognito).

---

# CZĘŚĆ A — panele

## A1. Google Search Console — usługa domenowa (F03)

Po co: bez weryfikacji nie widać raportu błędów 404, kliknięć ani pozycji po przeprowadzce. Stara strona prawdopodobnie weryfikowała się przez kod GTM w nagłówku. Nowa ładuje GTM dopiero po zgodzie na cookies, więc ta metoda przestała działać. W DNS nie ma obecnie żadnego rekordu Google (jest tylko SPF poczty).

### A1.1 Rozpocznij dodawanie usługi
- [ ] Wejdź na https://search.google.com/search-console, kliknij listę usług w lewym górnym rogu i wybierz **Dodaj usługę**.
- [ ] Wybierz lewy kafelek **Domena**, wpisz `airsquad.pl` (bez https, bez www) i kliknij **Dalej**.
- [ ] Google pokaże rekord w postaci `google-site-verification=XXXXXXXX…`. Kliknij **Kopiuj**. **Nie zamykaj tego okna.**

### A1.2 Dodaj rekord TXT w DirectAdmin (cyber_Folks)
- [ ] Zaloguj się do DirectAdmin swojego hostingu. Najprościej przez panel klienta cyber_Folks: Usługi → hosting → przycisk logowania do DirectAdmin.
- [ ] Wybierz **Zarządzanie kontem → Zarządzanie DNS** (po angielsku: Account Manager → DNS Management), a potem domenę **airsquad.pl**.
- [ ] Kliknij **Dodaj rekord** (Add Record) i wypełnij pola:
  - Typ: **TXT**
  - Nazwa: `airsquad.pl.` (z kropką na końcu). Jeśli panel podpowiada `@` albo pozwala zostawić pole puste, to to samo.
  - TTL: zostaw domyślne
  - Wartość: wklej `google-site-verification=…` bez cudzysłowów, DirectAdmin doda je sam
- [ ] Zapisz.
- **Uwaga:** dodaj **nowy** rekord. Nie edytuj istniejącego TXT `v=spf1 a mx include:_spf.cyberfolks.pl -all`, bo odpowiada za pocztę. Nie ruszaj też rekordów A ani MX.
- Gdyby w DirectAdmin nie było strefy airsquad.pl, sprawdź w panelu klienta cyber_Folks: Domeny → airsquad.pl → DNS. Serwery nazw domeny to ns1–3.cyberfolks.pl, więc strefa jest u nich.

### A1.3 Zweryfikuj
- [ ] Odczekaj 10–30 minut. Rekord możesz sprawdzić na https://toolbox.googleapps.com/apps/dig/#TXT/airsquad.pl — na liście powinien być wiersz `google-site-verification=…`.
- [ ] Wróć do okna Search Console i kliknij **Zweryfikuj**. Jeśli się nie uda, spróbuj ponownie za kilka godzin. Rekord może się rozchodzić do 24–48 h.
- Dobra wiadomość: weryfikacja domeny obejmuje też starą usługę `https://airsquad.pl/` (prefiks URL), jeśli taka istnieje na Twoim koncie. Jej historia zostaje, więc **nie usuwaj** starej usługi.
- Usługa domenowa pokaże też staging `new.airsquad.pl`. Jego adresy trafią do kategorii „wykluczone przez tag noindex” i tak ma być.

### A1.4 Mapy witryn
- [ ] W lewym menu wybierz **Indeksowanie → Mapy witryn**, w polu wpisz `sitemap.xml` i kliknij **Prześlij**. Po chwili status powinien zmienić się na „Powodzenie”, z 28 wykrytymi adresami.
- [ ] Jeśli na liście „Przesłane mapy witryn” jest `sitemap_index.xml` albo `page-sitemap.xml`, kliknij ją, potem menu ⋮ w prawym górnym rogu → **Usuń mapę witryny**. Sprawdź to w usłudze domenowej i w starej usłudze `https://airsquad.pl/`, jeśli ją masz.
  Te stare mapy i tak przekierowują na nową, a usunięcie z listy nie wpływa na indeks.

### A1.5 Poproś o zindeksowanie
Wklej każdy adres w pasek u góry („Sprawdź dowolny URL…”). Poczekaj na wynik, kliknij **Poproś o zindeksowanie** i odczekaj około minuty. Google ma dzienny limit (ok. 10 próśb). Jeśli pokaże „Przekroczono limit”, dokończ następnego dnia.

Dzień 1:
- [ ] https://airsquad.pl/
- [ ] https://airsquad.pl/rzeszow/
- [ ] https://airsquad.pl/debica/
- [ ] https://airsquad.pl/jaslo/
- [ ] https://airsquad.pl/biecz/
- [ ] https://airsquad.pl/brzostek/
- [ ] https://airsquad.pl/pilzno/
- [ ] https://airsquad.pl/akrobatyka/

Dzień 2:
- [ ] https://airsquad.pl/tricking-akademia/
- [ ] https://airsquad.pl/tumbling/
- [ ] https://airsquad.pl/longboardy/
- [ ] https://airsquad.pl/letni/
- [ ] https://airsquad.pl/obozy-sportowe/
- [ ] https://airsquad.pl/zapisy/

### A1.6 Punkt odniesienia — eksport 16 miesięcy (zrób zaraz po weryfikacji)
Nowa usługa domenowa pokazuje dane wstecz, czyli też z czasów WordPressa.
- [ ] Otwórz **Skuteczność → Wyniki wyszukiwania**, ustaw Data → **Ostatnie 16 miesięcy**, zaznacz wszystkie 4 kafelki (kliknięcia, wyświetlenia, CTR, pozycja).
- [ ] Kliknij **Eksportuj → Pobierz CSV** (w paczce są Zapytania, Strony, Kraje, Urządzenia i Daty). Zapisz plik jako `gsc-baseline-2026-10-06`.
- [ ] To samo zrób w starej usłudze `https://airsquad.pl/`, jeśli ją masz.
- [ ] Wyślij oba pliki Claude’owi.

### A1.7 Co obserwować w pierwszych tygodniach
| Kiedy | Gdzie w GSC | Co jest normalne | Kiedy reagować |
|---|---|---|---|
| 1–3 dni po weryfikacji | Mapy witryn | „Powodzenie”, 28 adresów | Błąd odczytu → daj znać |
| co tydzień do połowy listopada | Indeksowanie → Strony → **„Nie znaleziono (404)”** | puste archiwa tagów i kategorii starego WP | adres z ruchem albo z linkami (np. `/promo/`, `/reklama/`, `/warsztaty/`). **Eksportuj listę i wyślij Claude’owi** (na tę listę czeka F60) |
| j.w. | Indeksowanie → Strony → **„Strona z przekierowaniem”** | liczba rośnie, bo stare adresy WP przekierowują (301) na nowe. To prawidłowe | — |
| j.w. | „Wykluczona przez tag noindex” | adresy `new.airsquad.pl` i `/new/` | jeśli jest tam któryś z 14 adresów z A1.5 |
| j.w. | „Zeskanowana — obecnie niezindeksowana”, „Duplikat…” | pojedyncze adresy | któryś z 14 adresów → daj znać |
| **20.10 i 03.11** | Skuteczność → filtr Zapytanie zawiera… → **Porównaj** z poprzednimi 28 dniami | pozycje podobne, kliknięcia stabilne | spadek pozycji o 3 lub więcej na którejś frazie |
| j.w. | frazy: `akrobatyka rzeszów`, `akrobatyka dębica`, `akrobatyka jasło`, `akrobatyka biecz`, `akrobatyka brzostek`, `akrobatyka pilzno`, `tricking rzeszów`, `tumbling rzeszów`, `air squad`, `airsquad`, `air camp`, `obóz akrobatyczny` | — | — |
| j.w. | „akrobatyka rzeszów” → zakładka **Strony** | lepiej, żeby rankowała `/rzeszow/` | ranking `/` zamiast `/rzeszow/` → zapisz (R5.3) |
| j.w. | Skuteczność → Typ wyszukiwania: **Grafika** | — | spadek ruchu z Grafiki → daj znać (F34) |
| ok. 03.11 | Doświadczenie → **Podstawowe wskaźniki internetowe** | może pokazywać „za mało danych” | porównanie z danymi WP (F81) |

Pamiętaj: SEO oceniaj w Search Console, a nie w GA4. Ruch w GA4 spadnie skokowo, bo GA4 liczy teraz tylko osoby, które wyraziły zgodę (F49).

---

## A2. Cookiebot (F15, F18, F79)

Stan dziś: baner działa na airsquad.pl i www, tekst jest po polsku, szablon to pełnoekranowe okno („popup”). Deklaracja ciasteczek pochodzi jednak ze skanu z **23.05.2024**: 9 wpisów przypisanych do `diamondteam.pl`, a Mouseflow nie ma w niej wcale. Staging `new.airsquad.pl` nie jest autoryzowany, więc baner się tam nie pokazuje.

Wejdź na https://manage.cookiebot.com i wybierz grupę domen z identyfikatorem `fc61955c-aa38-4593-aecc-45d2739b74ff`.

### A2.1 Domeny
- [ ] Otwórz **Settings → Domains & aliases** (Domeny i aliasy).
- [ ] Domena główna ma być `airsquad.pl`, alias `www.airsquad.pl`.
- [ ] Jeśli na liście jest `diamondteam.pl` albo `www.diamondteam.pl`, usuń je. Domena wygasła i jest na sprzedaż.
- [ ] Dodaj `new.airsquad.pl` jako **alias** (F79). Alias nie jest skanowany osobno i zwykle nie liczy się do limitu planu. Jeśli plan na to nie pozwala, nic się nie stanie: testy zgód rób wtedy na `https://airsquad.pl/new/`, gdzie baner działa.
- [ ] Zapisz.

### A2.2 Skan ręczny
- [ ] Uruchom ręczny skan airsquad.pl (przycisk skanu przy domenie albo w zakładce **Cookies**). Wynik przychodzi mailem, zwykle w ciągu 24 h.
- [ ] Po skanie otwórz zakładkę **Cookies**. Stare wpisy WordPressa (`elementor`, `wpEmojiSettingsSupports`) i wpisy z domeną diamondteam.pl powinny zniknąć. Jeśli zostały, usuń je ręcznie.

### A2.3 Klasyfikacja ciasteczek („Unclassified”)
| Dostawca | Przykładowe nazwy | Kategoria |
|---|---|---|
| Google Analytics 4 | `_ga`, `_ga_#` | Statystyka |
| Google Ads | `_gcl_au`, `IDE`, `test_cookie` | Marketing |
| Meta Pixel | `_fbp`, `fr` | Marketing |
| **Mouseflow** | `mf_user`, `mf_*` | **Marketing**. Musi się zgadzać z GTM (A3.7), gdzie Mouseflow uruchamia się po zgodzie marketingowej. Jeśli wybierzesz Statystykę, powiedz o tym — wtedy GTM trzeba ustawić inaczej |
| YouTube | `VISITOR_INFO1_LIVE`, `YSC`, `__Secure-*` | Marketing |
| AIPAX (formularz zapisów) | Hotjar `_hj*`, Clarity `_clck`/`_clsk`/`CLID`, `sentryReplaySession` | Statystyka (opis: „AIPAX — system zapisów, narzędzia analityczne dostawcy”) |
| AIPAX — Meta | `_fbp` z domeny aipax | Marketing |
| AIPAX — techniczne | sesja i język formularza | Niezbędne |

- [ ] Jeśli skan nie znalazł Mouseflow (skaner może nie wywołać GTM), dodaj ręcznie: **Add cookie** → `mf_user`, dostawca Mouseflow, cel „nagrywanie i analiza sesji”, kategoria Marketing, ważność 90 dni.
- [ ] **Decyzja D-A2:** czy Mouseflow zostaje? `[ ] tak` `[ ] nie`. Jeśli nie, w A3 usuń tag Mouseflow i nie klasyfikuj go tutaj. Ta decyzja wpływa też na politykę prywatności (F01).
- [ ] Jeśli Mouseflow zostaje: w panelu Mouseflow sprawdź, czy projekt `b903677c-…` ma ustawioną domenę **airsquad.pl**, a nie diamondteam.pl, i czy jest włączone maskowanie pól formularzy.

### A2.4 Język i wygląd (F18)
- [ ] Sprawdź w **Content / Language**, że język to polski. Przejrzyj też opisy kategorii i zakładkę „Szczegóły”, czy wszystko jest po polsku.
- [ ] W **Dialog** (wygląd banera) zmień typ z **Popup** na **Banner**, położenie **na dole** (Bottom). Motyw może zostać jasny.
- [ ] Na pierwszym ekranie banera mają być widoczne trzy przyciski: **„Odmowa”**, **„Dostosuj/Szczegóły”** i **„Zezwól na wszystkie”**. „Odmowa” ma być tak samo widoczna jak „Zezwól”.
- [ ] **Widget** (okrągła ikonka w lewym dolnym rogu): **na razie zostaw**. Wyłącz go dopiero wtedy, gdy w stopce strony pojawi się link „Ustawienia cookies” (to zmiana w kodzie, F18). Bez tego nie byłoby jak wycofać zgody.
- [ ] Zapisz i sprawdź na telefonie w trybie incognito: baner ma być u dołu, a treść strony widoczna nad nim.

---

## A3. Google Tag Manager — GTM-W44NNPZ (F14, F48)

### A3.0 Co jest w opublikowanym kontenerze (wersja 17, pobrana i rozłożona 06.10.2026)

**Tagi**
| Tag (typ, wartość, po której go poznasz) | Uruchamia się na | Na nowej stronie | Co zrobić |
|---|---|---|---|
| Tag Google (GA4) `G-F41FNPX3XV`, wysyła odsłony | Wszystkie strony | **działa** | zostaw |
| Remarketing Google Ads `AW-10873381756` | Wszystkie strony, bez dodatkowej zgody | działa, ale tylko na podstawie trybu zgody | przepnij na zgodę marketingową (A3.7) albo usuń, jeśli nie robisz remarketingu (D3) |
| Łącznik konwersji (Conversion Linker) | Wszystkie strony | działa | przepnij na zgodę marketingową (A3.7) |
| GA4 zdarzenie `klikniecie_w_button_zapis` | klik w element o id `active-now-submit` (stary przycisk ActiveNow) | **martwy** | wstrzymaj; zastąpi go `enrol_open` (A3.6) |
| Konwersja Ads, etykieta `kI5yCLCE6q0DEPzG6sAo` („zapis”) | j.w. | **martwy** | przepnij na `enrol_open` (A3.6, decyzja D2) |
| GA4 zdarzenie `klikniecie_telefon` | tekst kliknięcia zawiera „722 248 546” albo link = `tel:+48722248546` (stary numer) | **martwy** (na stronie jest tylko 728 559 101) | przepnij na nową regułę `tel:` (A3.5) |
| Konwersja Ads, etykieta `djI5CPPn99IYEPzG6sAo` (telefon) | j.w. | **martwy** | przepnij na regułę `tel:` |
| GA4 zdarzenie `klikniecie_email` | tekst zawiera `ks.street.sport@gmail.com` | **martwy** | przepnij na regułę `mailto:` |
| Konwersja Ads, etykieta `xXkVCPDn99IYEPzG6sAo` (e-mail) | j.w. | **martwy** | przepnij na regułę `mailto:` |
| GA4 zdarzenie `formularz_kontaktowy` | własny JavaScript czyta potwierdzenie WPForms `#wpforms-confirmation-9481` („Dziękujemy za wiadomość”) | **martwy**, na nowej stronie nie ma formularza kontaktowego | wstrzymaj → usuń |
| Konwersja Ads, etykieta `wNwcCO3n99IYEPzG6sAo` (formularz) | j.w. | **martwy** | wstrzymaj → usuń; w Google Ads ustaw tę konwersję jako dodatkową (A3.9) |
| GA4 zdarzenie `klikniecie_messenger` | tekst zawiera „DiamondTeamRzeszów” | **martwy**, nowa strona nie ma linku do Messengera | wstrzymaj → usuń |
| **Cookiebot CMP** (szablon, numer `fc61955c…`, tryb zgody włączony) | Inicjowanie zgody (gtm.init_consent) | działa, ale **ładuje Cookiebota drugi raz** („Cookiebot script is included twice”) | **wstrzymaj** (F48), test A3.8 |
| **Meta Pixel** (własny HTML, piksel `521740188954821`) | zdarzenie `cookie_consent_update` + wymagana zgoda ad_storage i ad_personalization | działa, start bywa za wczesny (już przy zgodzie na statystykę) | przepnij na `cookie_consent_marketing` (A3.7) |
| **Mouseflow** (projekt `b903677c-5794-4221-9b10-9bf837a23995`) | j.w. | j.w. | przepnij na `cookie_consent_marketing` albo usuń (D-A2) |

**Zmienne i reguły (wyzwalacze) bez sensu na nowej stronie**
| Element | Co zrobić |
|---|---|
| Zmienna „Ustawienia Google Analytics” z `UA-92219779-2` (Universal Analytics, wyłączony przez Google w 2024) i wskaźnikiem z ciasteczka `firstSource` | usuń obie zmienne |
| Zmienna „Własny kod JavaScript” czytająca `#wpforms-confirmation-9481` (na nowej stronie przy każdej odsłonie kończy się błędem) | usuń razem z tagami „formularz” |
| 4 reguły „Licznik czasu” (10 s, 20 s, 30 s, 60 s), tylko na stronie `https://www.diamondteam.pl/letni/` | usuń |
| 3 reguły „Głębokość przewijania” (40%, 60%, 90%), w opublikowanej wersji **żaden aktywny tag** z nich nie korzysta | usuń (GA4 i tak mierzy przewinięcie do 90%) |
| Reguła „klik w id active-now-submit” | usuń po przepięciu tagów |
| Reguły z „722 248 546”, `tel:+48722248546`, „ks.street.sport@gmail.com”, „DiamondTeamRzeszów” | usuń po przepięciu tagów |

Ważne:
- Wszystkie stare reguły kliknięć były typu **„Kliknięcie – wszystkie elementy”**. Nowe zakładaj jako **„Kliknięcie – tylko linki”**. Wtedy kliknięcie w ikonkę telefonu wewnątrz linku też się policzy.
- Nowa strona ładuje GTM **dopiero po zgodzie na statystykę** i przechodzi między podstronami bez przeładowania (Next.js). Reguła „Wszystkie strony” odpala się więc **raz na wizytę**, a kolejne odsłony GA4 łapie tylko dzięki ustawieniu z A3.9.
- Etykiety konwersji Ads **zostawiamy** i zmieniamy tylko reguły. Dzięki temu w Google Ads zostaje historia tych samych działań konwersji.

### A3.1 Kopia zapasowa
- [ ] W GTM wybierz **Administracja → Eksportuj kontener**, obszar roboczy z wersją 17. Zapisz plik JSON.
- Wersja 17 to punkt powrotu: w **Wersje** zawsze możesz ją ponownie opublikować.

### A3.2 Zmienne wbudowane
- [ ] Otwórz **Zmienne → Zmienne wbudowane → Konfiguruj** i zaznacz **Click URL**, **Click Text**, **Page Path**.

### A3.3 Nowe zmienne warstwy danych (dla `enrol_open`)
**Zmienne → Zdefiniowane przez użytkownika → Nowa → Zmienna warstwy danych** (wersja 2):
- [ ] `DLV – enrol_city`, nazwa zmiennej: `enrol_city`
- [ ] `DLV – enrol_type`, nazwa zmiennej: `enrol_type`
- [ ] `DLV – enrol_source`, nazwa zmiennej: `enrol_source`

### A3.4 Nowe reguły (wyzwalacze)
- [ ] **„Klik – tel:”**: typ **Kliknięcie – tylko linki**, opcja „Niektóre kliknięcia linków”, warunek `Click URL` **zaczyna się od** `tel:`.
- [ ] **„Klik – mailto:”**: typ **Kliknięcie – tylko linki**, „Niektóre kliknięcia linków”, warunek `Click URL` **zaczyna się od** `mailto:`.
- [ ] **„CE – enrol_open”**: typ **Zdarzenie niestandardowe**, nazwa zdarzenia `enrol_open` (dokładnie tak, małymi literami), „Wszystkie zdarzenia niestandardowe”.
- [ ] **„CE – cookie_consent_marketing”**: typ **Zdarzenie niestandardowe**, nazwa zdarzenia `cookie_consent_marketing`. To zdarzenie Cookiebot wysyła sam, gdy użytkownik ma zgodę marketingową.

### A3.5 Telefon i e-mail — przepięcie tagów
- [ ] Tag GA4 telefonu: nazwa zdarzenia **`phone_click`** (zob. D1), reguła **Klik – tel:**. Usuń starą regułę.
- [ ] Konwersja Ads `djI5CPPn99IYEPzG6sAo`: reguła **Klik – tel:**. Usuń starą.
- [ ] Tag GA4 e-maila: nazwa zdarzenia **`email_click`** (zob. D1), reguła **Klik – mailto:**.
- [ ] Konwersja Ads `xXkVCPDn99IYEPzG6sAo`: reguła **Klik – mailto:**.
- [ ] Wstrzymaj (ikonka ⋯ przy tagu → **Wstrzymaj**): `formularz_kontaktowy`, Ads `wNwcCO3n99IYEPzG6sAo`, `klikniecie_messenger`, `klikniecie_w_button_zapis`.

**Decyzja D1 — nazwy zdarzeń GA4:** `[ ] nowe nazwy phone_click / email_click` (zgodnie z planem) · `[ ] zostawiam stare klikniecie_telefon / klikniecie_email`.
Stare nazwy dają ciągłość wykresów w GA4. Przy nowych historię sprzed 05.10 trzeba czytać pod starą nazwą. Konwersje w Google Ads są niezależne od tej decyzji, bo etykiety zostają.

### A3.6 Rozpoczęcie zapisu — `enrol_open`
Strona (po zmianie w kodzie, którą zrobi Claude) wyśle przy otwarciu formularza zapisów:
```
dataLayer.push({ event: 'enrol_open', enrol_city: 'rzeszow', enrol_type: 'nabor', enrol_source: 'fab' })
```
- `enrol_city`: `rzeszow`, `debica`, `jaslo`, `biecz`, `brzostek`, `pilzno`, `general` (formularz ogólny), `letni` (Air Camp)
- `enrol_type`: `nabor` | `kontynuacja` | `ogolny` | `oboz`
- `enrol_source`: miejsce na stronie, np. `fab` (pływający przycisk „Zapisz się”), `cta_form` (formularz na dole strony głównej), `how_steps` („Jak to działa”), `city_page` (sekcja zapisów miasta), `discipline_page`, `zapisy`, `letni`. Ostateczną listę poda kod.

Kroki:
- [ ] **Nowy tag → Google Analytics: zdarzenie GA4**: identyfikator pomiaru `G-F41FNPX3XV`, nazwa zdarzenia `enrol_open`, parametry: `enrol_city` = `{{DLV – enrol_city}}`, `enrol_type` = `{{DLV – enrol_type}}`, `enrol_source` = `{{DLV – enrol_source}}`. Reguła **CE – enrol_open**.
- [ ] Konwersja Ads `kI5yCLCE6q0DEPzG6sAo` (dawny „klik w button zapis”): reguła **CE – enrol_open**. W Google Ads zmień nazwę działania na „Rozpoczęcie zapisu (enrol_open)”.
- Do czasu zmiany w kodzie ta reguła po prostu się nie odpali. Publikacja wcześniej niczym nie grozi.

**Ograniczenie, które trzeba znać:** sam zapis odbywa się w ramce AIPAX (inna domena). Strona widzi **otwarcie** formularza, ale **nie widzi wysłania**. Widżet AIPAX wysyła dziś do strony tylko komunikaty o otwarciu i zamknięciu okna oraz o zmianie rozmiaru, a nie „zapis wysłany”. To pytanie do AIPAX (A6.3): komunikat postMessage po wysłaniu albo przekierowanie na stronę „Dziękujemy”.

**Decyzja D2 — czy „Rozpoczęcie zapisu” ma być konwersją główną w Google Ads?**
`[ ] główna` — tylko jeśli kampanie działają na strategii „Maksymalizuj konwersje / Docelowy CPA” i nie ma lepszego sygnału. Licz się z tym, że otwarcie formularza to nie zapis, więc konwersji będzie więcej niż zapisów.
`[ ] dodatkowa` (obserwacyjna) — bezpieczniej, dopóki AIPAX nie da zdarzenia „wysłano”.
Telefon: `[ ] główna` `[ ] dodatkowa`.

### A3.7 Zgody (F48)
- [ ] **Wstrzymaj** tag **Cookiebot CMP**. Cookiebot jest już w kodzie strony, a druga kopia psuje kolejność zgód.
- [ ] **Meta Pixel**: zamień regułę `cookie_consent_update` na **CE – cookie_consent_marketing**. W *Ustawienia zaawansowane → Ustawienia zgody → Wymagaj dodatkowej zgody* zostaw `ad_storage` (i `ad_personalization`).
- [ ] **Mouseflow**: to samo (albo usuń tag, jeśli w D-A2 wybrałeś „nie”).
- [ ] **Remarketing Google Ads** i **Łącznik konwersji**: zamień regułę „Wszystkie strony” na **CE – cookie_consent_marketing** i dodaj wymaganą zgodę `ad_storage`.
- **Plan B** (tylko jeśli w teście A3.8 zdarzenie `cookie_consent_marketing` nie pojawi się na liście): zmienna **Własny plik cookie** o nazwie `CookieConsent` + reguła **Inicjowanie zgody – wszystkie strony** z warunkiem `{{Cookie – CookieConsent}}` **zawiera** `marketing:true`. Podepnij ją zamiast reguły CE.
- **Decyzja D3:** `[ ] remarketing Google Ads zostaje` · `[ ] usuwam` (jeśli nie prowadzisz kampanii remarketingowych, mniej danych = mniej kłopotu z RODO).
- **Decyzja F49 (Consent Mode v2):** `[ ] chcę pełny Consent Mode v2` (Claude przygotuje zmianę w kodzie) · `[ ] zostaje jak jest` (GTM tylko po zgodzie).

### A3.8 Test w trybie podglądu (przed publikacją)
Kliknij **Podgląd** i wpisz `https://airsquad.pl/`. Strona otworzy się w nowym oknie, a w drugiej karcie będzie Tag Assistant. Każdy scenariusz rób w **nowym oknie incognito** (albo kliknij ikonkę Cookiebota i zmień zgodę). Pamiętaj: GTM wczytuje się dopiero po zgodzie na statystykę, więc przed kliknięciem na banerze Tag Assistant będzie czekał. Tak ma być.

**Scenariusz 1 — pełna zgoda** (na banerze „Zezwól na wszystkie”)
- [ ] Na liście zdarzeń pojawia się `cookie_consent_marketing`.
- [ ] Uruchomione: tag Google GA4, Meta Pixel, Mouseflow (jeśli zostaje), Remarketing, Łącznik konwersji.
- [ ] **Nie** uruchomiony: Cookiebot CMP (wstrzymany).
- [ ] Zakładka **Zgoda** przy dowolnym zdarzeniu: `ad_storage` i `analytics_storage` mają wartość „Granted”. **Jeśli widzisz „Nie ustawiono”, nie publikuj.** Zapisz zrzut i wyślij Claude’owi: po wstrzymaniu szablonu Cookiebot zgody musi przekazywać kod strony.
- [ ] Kliknij numer telefonu (na komputerze otworzy się pytanie o aplikację, możesz anulować). Uruchomione: GA4 `phone_click` + konwersja Ads telefon. W zmiennych Click URL = `tel:+48728559101`.
- [ ] Kliknij adres e-mail. Uruchomione: GA4 `email_click` + konwersja Ads e-mail.
- [ ] (Po zmianie w kodzie) kliknij „Zapisz się” i wybierz miasto. Pojawia się zdarzenie `enrol_open` z wypełnionymi `enrol_city`, `enrol_type`, `enrol_source`, a tag GA4 `enrol_open` jest uruchomiony.
- [ ] W konsoli przeglądarki (opcjonalnie) nie ma już ostrzeżenia „Cookiebot script is included twice”.

**Scenariusz 2 — tylko statystyka** (baner → „Dostosuj”: Statystyka **wł.**, Marketing **wył.** → „Zezwól na wybór”)
- [ ] Uruchomione: tag Google GA4. Kliknięcia tel/mailto dają zdarzenia GA4.
- [ ] **Nie** uruchomione: Meta Pixel, Mouseflow, Remarketing, Łącznik konwersji. Zdarzenia `cookie_consent_marketing` nie ma na liście.
- [ ] Zakładka **Zgoda**: `analytics_storage` = Granted, `ad_storage` = Denied.

**Scenariusz 3 — odmowa** („Odmowa”)
- [ ] Tag Assistant **nie łączy się** z kontenerem („nie znaleziono tagu”). To prawidłowy wynik: bez zgody strona w ogóle nie wczytuje GTM.

(Uwaga: przy zgodzie **tylko** na marketing, bez statystyki, GTM też się nie wczyta, bo kod strony wymaga zgody na statystykę. Tak jest dziś zaprojektowane.)

### A3.9 Publikacja i ustawienia GA4 / Ads
- [ ] Kliknij **Prześlij**, nazwa wersji: `v18 – nowa strona: tel/mailto, enrol_open, zgody marketingowe, wstrzymany Cookiebot CMP`, i **Opublikuj**.
- [ ] Na telefonie (zgoda pełna) kliknij numer. W GA4 → **Raporty → Czas rzeczywisty** powinno pojawić się `phone_click`.
- [ ] GA4 → **Administracja → Strumienie danych → airsquad.pl → Pomiar zaawansowany**: włączony, a w ⚙ przy „Wyświetlenia stron” zaznacz **„Zmiany stron na podstawie zdarzeń historii przeglądania”**. Bez tego GA4 liczy tylko pierwszą stronę wizyty.
- [ ] GA4 → **Administracja → Zdarzenia kluczowe**: po pojawieniu się (do 24 h) oznacz `phone_click`, `email_click`, `enrol_open`.
- [ ] GA4 → **Administracja → Definicje niestandardowe → Utwórz wymiar** (zakres: zdarzenie): `enrol_city`, `enrol_type`, `enrol_source`. Bez tego parametrów nie zobaczysz w raportach.
- [ ] GA4 → Przechowywanie danych → **14 miesięcy** (opcjonalnie).
- [ ] Google Ads → **Cele → Konwersje → Podsumowanie**: konwersję „formularz” (`wNwc…`) ustaw jako **dodatkową** albo usuń. Od 05.10 ma 0 i może zaniżać wyniki kampanii. Status pozostałych powinien w 1–3 dni zmienić się na „Rejestrowanie konwersji”.
- [ ] Jeśli GA4 jest połączone z Ads: **nie importuj** do Ads tych samych zdarzeń z GA4 (`phone_click` itd.), bo już liczą je tagi Ads. Inaczej konwersje policzą się podwójnie.
- [ ] Po 2 tygodniach bez problemów **usuń** wstrzymane tagi oraz stare zmienne i reguły z tabeli A3.0 i opublikuj kolejną wersję.

---

## A4. Wizytówki Google — Google Business Profile (F12)

Wspólne wartości do skopiowania:
- Telefon: **+48 728 559 101** (jedyny numer na stronie, stary 722 248 546 usuń wszędzie)
- Instagram: `https://instagram.com/airsquad_akrobatyka`
- Facebook: `https://www.facebook.com/KlubAirSquad`
- YouTube: `https://www.youtube.com/@klubairsquad`
- Linki społecznościowe wpisz w *Edytuj profil → Kontakt → Profile w mediach społecznościowych*.

**Checklista dla każdej wizytówki** (odhaczaj w tabeli niżej):
1. **Witryna** = adres miasta **z ukośnikiem na końcu** (dokładnie jak w tabeli).
2. **Telefon** = +48 728 559 101.
3. **Nazwa**: tylko sprawdź i wpisz obecną do tabeli. **Nie zmieniaj teraz** (zmiana nazwy może wywołać ponowną weryfikację, a wizytówki trzymają #1–#2 w wynikach lokalnych). Popraw tylko, jeśli jest błędna, np. „Diamond Team”.
4. **Adres** z kodem pocztowym i pinezką dokładnie na wejściu do sali.
5. **Godziny** = grafik 2026/27 (propozycja z AIPAX w tabeli, popraw, jeśli się nie zgadza). Dodaj **godziny specjalne**: 1.11, 11.11, przerwa świąteczna, ferie.
6. **Opis** z szablonu niżej (6 lokalizacji).
7. **Link do zapisów** (Linki do rezerwacji/spotkań, jeśli dostępne): adres miasta + `#zapisy`.
8. **Profile społecznościowe**: IG, FB, YT.

| Wizytówka | Nazwa teraz (wpisz) | Witryna — wpisz | Adres (ze strony) | Godziny (AIPAX 2026/27, do potwierdzenia) | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Rzeszów | „Akrobatyka AirSquad Rzeszów - Sala AIRSPACE” (link dziś: `https://airsquad.pl/` → **zmień**) | `https://airsquad.pl/rzeszow/` | Sala AIR SPACE, ul. Boya-Żeleńskiego 15, 35-105 Rzeszów | pn 16:00–21:30 · wt 16:00–19:00 · śr 16:00–21:30 · czw 16:00–19:00 · pt 16:00–20:15 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Dębica | „Akrobatyka AirSquad Dębica” (link dziś: `https://airsquad.pl/debica` bez ukośnika → **popraw**) | `https://airsquad.pl/debica/` | AIR SPACE Dębica, ul. Lwowska 51 | pn 17:00–19:00 · wt 16:00–19:00 · śr 17:00–19:00 (do 20:00, jeśli ruszą dorośli) · czw 16:00–19:00 · pt 17:00–20:00 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Jasło | | `https://airsquad.pl/jaslo/` | Podkarpackie Centrum Sportów Walki (Sektor 3), ulica: ____ | pn 15:45–17:00 · śr 15:45–17:45 · pt 15:45–18:45 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Biecz | | `https://airsquad.pl/biecz/` | Hala Sportowa ZSZ im. św. Jadwigi Królowej, ul. Tysiąclecia | pn 17:20–20:20 · śr 17:20–20:20 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Brzostek | | `https://airsquad.pl/brzostek/` | Hala Widowiskowo-Sportowa, ulica: ____ | wt 15:45–17:45 · czw 16:00–19:15 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Pilzno / Strzegocice | | `https://airsquad.pl/pilzno/` | SP im. Marii Konopnickiej, Strzegocice 54 | wt 16:30–18:30 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| **Tyczyn** | | — | — | — | **Oznacz jako „Zamknięte na stałe”** (lepsze niż usunięcie, bo usunięcie z konta nie zdejmuje wizytówki z Map) `[ ]` |||||||||
| Siedziba stowarzyszenia (jeśli ma wizytówkę) | | `https://airsquad.pl/` | adres rejestrowy | — | Jeśli to lokal mieszkalny: ukryj adres (firma działająca na obszarze), **nie** pokazuj go jako miejsca zajęć `[ ]` |||||||||

- Czy Dębica ma osobne wizytówki dla SP nr 4 / SP nr 10? `[ ] nie` `[ ] tak: ____`
- Czy są inne wizytówki (np. stare „Diamond Team”, „AirSpace” bez „Akrobatyka”)? `Odp.:` ____

**Szablon opisu** (bez linków i numeru telefonu, bo Google ich w opisie nie przyjmuje; do 750 znaków; `{…}` uzupełnij):
> Air Squad to klub akrobatyki, trickingu i tumblingu dla dzieci, młodzieży i dorosłych, działający w 6 miastach Podkarpacia: w Rzeszowie, Dębicy, Jaśle, Bieczu, Brzostku i Pilźnie (Strzegocice). {W Rzeszowie} trenujemy w {sali AIR SPACE przy ul. Boya-Żeleńskiego}. Każde zajęcia prowadzi dwóch trenerów, a ćwiczymy na bezpiecznych matach AirTrack. Prowadzimy grupy naborowe dla dzieci od {X} lat, grupy kontynuacji i zaawansowane{, a także zajęcia dla dorosłych}. Latem organizujemy obóz Air Camp. Pierwszy trening kosztuje 40 zł, zapisy online przez stronę klubu.

**Prośba — kody pocztowe i współrzędne** (potrzebne do danych strukturalnych na stronie, F33). Współrzędne: w Mapach Google kliknij prawym przyciskiem dokładnie w wejście do sali. Pierwszy wiersz menu to współrzędne, kliknij go, żeby skopiować.
| Sala | Kod pocztowy | Współrzędne (np. 50.0332, 21.9987) |
|---|---|---|
| AIR SPACE Rzeszów, Boya-Żeleńskiego 15 | 35-105 (ze starej strony — potwierdź) | |
| AIR SPACE Dębica, Lwowska 51 | (39-200?) | |
| SP nr 4 Dębica — adres: ____ | | |
| SP nr 10 Dębica — adres: ____ | | |
| Podkarpackie Centrum Sportów Walki, Jasło — ulica: ____ | (38-200?) | |
| Hala Sportowa ZSZ, ul. Tysiąclecia, Biecz — nr: ____ | (38-340?) | |
| Hala Widowiskowo-Sportowa, Brzostek — ulica: ____ | (39-230?) | |
| SP Strzegocice 54 | (39-220?) | |

Kody ze znakiem zapytania to typowe kody tych miejscowości. Potwierdź je albo popraw.

---

## A5. Bing Webmaster Tools (R5.2) — po zakończeniu A1

Stan: Bing nie ma dziś w indeksie żadnej strony z airsquad.pl, a za nim również DuckDuckGo.
- [ ] Wejdź na https://www.bing.com/webmasters i zaloguj się (konto Microsoft albo Google).
- [ ] Wybierz **Importuj z Google Search Console** → zezwól na dostęp → zaznacz airsquad.pl → **Importuj**. Witryna zostanie zweryfikowana automatycznie, a mapy witryn przeniesione.
  - Jeśli na liście importu nie ma usługi domenowej: w Search Console dodaj usługę **Prefiks URL** `https://airsquad.pl/` (zweryfikuje się sama dzięki rekordowi z A1) i powtórz import.
  - Plan C: w Bingu dodaj witrynę ręcznie, metoda „rekord CNAME”, i dodaj go w DirectAdmin tak jak TXT w A1.2.
- [ ] Otwórz **Mapy witryn** i sprawdź, czy jest `https://airsquad.pl/sitemap.xml`. Jeśli nie ma, **Prześlij mapę witryny**.
- [ ] W **Przesyłanie adresów URL** wklej 14 adresów z A1.5 (jeden na linię) i prześlij.
- [ ] Za 14 dni (ok. 20.10): w Bingu wpisz `akrobatyka dębica` i `site:airsquad.pl`. Sprawdź też w panelu **Eksplorator witryny**, czy strony są w indeksie.
- Opcjonalnie: automatyczne zgłaszanie zmian (IndexNow) może dodać Claude w skrypcie wdrożenia.

---

## A6. AIPAX — panel organizacji (F46, F24) i pytania do supportu

### A6.1 Ciężkie tła formularzy (F46)
Tła ładują się, gdy formularz jest w trybie „przycisk + okno” (launcher), czyli na telefonach na stronach miast i na `/letni/`.
| Gdzie ustawione | Używają go formularze | Plik dziś |
|---|---|---|
| **Tło organizacji** | Ogólny „FORMULARZ ZAPISÓW AIRSQUAD”, „OBÓZ SPORTOWY”, Brzostek, Rzeszów-kontynuacja | PNG 1920×730, **2,39 MB**, bez cache: `https://assets.aipax.eu/organizations/8fa31a2e-ce36-4a75-ad0f-13df8492d1a3/backgroundImage-1780658459` |
| Własne tło formularza | „Zapisy na kontynuacje zajęć Air Squad Dębica” | PNG **2,09 MB** |
| Własne tło formularza | „Zapisy na kontynuacje zajęć Air Squad Jasło” | PNG **4,12 MB** (największe, poza audytem) |

- [ ] Otwórz link do tła organizacji w przeglądarce i zapisz obraz (prawy przycisk → Zapisz obraz). Tła Dębicy i Jasła znajdziesz w ustawieniach tych formularzy.
- [ ] Na https://squoosh.app wrzuć plik, z prawej wybierz **MozJPEG** z jakością **70–75** (albo **WebP 75**, jeśli AIPAX przyjmuje WebP). Szerokość zostaw 1920 px. Cel: **≤ 250 KB** (najlepiej ok. 150 KB). Pobierz plik.
- [ ] W AIPAX podmień **tło organizacji** (ustawienia organizacji → wygląd/tło; nazwy menu mogą się różnić).
- [ ] W formularzach **Dębica-kontynuacja** i **Jasło-kontynuacja**: podmień tło na lekkie albo przełącz na „tło organizacji” lub „brak tła” z kolorem.
- [ ] Daj znać Claude’owi, a on sprawdzi rozmiary nowych plików.

### A6.2 Kontrast w kalendarzu (F24)
Napisy na kartach zajęć są białe, a tło karty bierze się z pola **„Kolor”** zajęć (kursu). Dziś to jasne róże i fiolety, np. `#eda6ff`, przy których kontrast wynosi 1,0–2,4:1 (wymagane 4,5:1). AIPAX dodatkowo rozjaśnia początek gradientu.
- [ ] W AIPAX przy każdym kursie zmień **Kolor** na jeden z ciemnych (w nawiasie kontrast z białym, także po rozjaśnieniu):
  `#4C1D95` ciemny fiolet (6,7) · `#5B21B6` fiolet (5,6) · `#1E40AF` granat (5,3) · `#86198F` śliwka (5,2) · `#9D174D` malina (5,1) · `#7F1D1D` bordo (6,2) · `#14532D` ciemna zieleń (5,4) · `#374151` grafit (5,9)
  Pomysł: jeden kolor na typ grupy, np. nabór = fiolet, kontynuacja = granat, tricking = malina, dorośli = grafit.
- [ ] Formularz „Zapisy na zajęcia Naborowe Air Squad Rzeszów” ma kolor obramowania `#239B56`, na którym biały napis ma 3,6:1 (przycisk „Wszystkie”, pole daty). Zmień na `#17643E` (7,2:1).

### A6.3 Porządki w danych AIPAX (wyszło przy porównaniu ze stroną)
- [ ] **AcroJasło 3**: w kalendarzu poniedziałek ma 15:45–16:45, a w opisie 16:00–17:00. Popraw na właściwe.
- [ ] **AcroBrzostek 3**: w kalendarzu czwartek ma 18:00–19:15, a w opisie 18:00–19:00. Popraw.
- [ ] **AcroBrzostek NABÓR** i **AcroJasło NABÓR**: terminy trwają do **21–22.09.2027**, a pozostałe grupy kończą się w czerwcu 2027. Pomyłka?
- [ ] **Akrobatyka Dorośli (Rzeszów)**: w środę są dwa wpisy (20:00–21:15 i 20:15–21:30).
- [ ] **Odbiorca przelewu**: część grup (nabory Rzeszów, Dębica Air Space i SP) ma w opisie „RQ Sp. z o.o.”, reszta „Stowarzyszenie Air Squad”. Strona pisze „konto Stowarzyszenia Air Squad”, więc jedno z dwóch trzeba poprawić (pytanie w B4).
- [ ] Formularz **„OBÓZ SPORTOWY”** jest pusty (0 zajęć). Dodaj Air Camp 2027, gdy będą dane (B9).

### A6.4 Mail do supportu AIPAX (gotowy do wklejenia)
> Temat: Air Squad (organizacja 8fa31a2e-ce36-4a75-ad0f-13df8492d1a3) — pytania o widżet zapisów na airsquad.pl
>
> Dzień dobry,
> osadzamy formularze zapisów AIPAX (widżet aipax-enrolment-widget.v1.js, tryby calendar i launcher) na nowej stronie https://airsquad.pl. Mam kilka pytań:
>
> 1. **Informacja o wysłaniu zapisu.** Widżet wysyła do strony komunikaty AIPAX_ENROLMENT_OPEN_MODAL, AIPAX_ENROLMENT_MODAL_OPENED, AIPAX_ENROLMENT_CLOSE_MODAL i AIPAX_ENROLMENT_LAUNCHER_RESIZE. Czy możecie dodać komunikat po skutecznym wysłaniu zapisu (np. AIPAX_ENROLMENT_SUBMITTED z identyfikatorem formularza i nazwą zajęć, bez danych osobowych)? Alternatywnie: czy da się ustawić przekierowanie całej strony (nie ramki) po wysłaniu na nasz adres, np. https://airsquad.pl/dziekujemy/? Potrzebujemy tego do mierzenia skuteczności reklam.
> 2. **Narzędzia analityczne w ramce.** Na naszej stronie ramki AIPAX uruchamiają Google Analytics (G-2FTCYKWQHZ), Meta Pixel (739691538446769), Microsoft Clarity (xf04czpjx1) i Sentry, zanim użytkownik odpowie na nasz baner zgód (Cookiebot). Czy możecie je wyłączyć dla naszej organizacji albo uzależnić od zgody (np. parametr w adresie ramki lub komunikat ze strony)? Kto jest administratorem tych danych i czy możemy podpisać umowę powierzenia przetwarzania? Czy Clarity maskuje pola formularza (dane dzieci)? Prosimy o listę ciasteczek i kluczy pamięci przeglądarki, które ustawia widżet — potrzebujemy jej do deklaracji cookies.
> 3. **Dostępność.** Czy widżet może nadawać ramce atrybut `title` (np. „Zapisy Air Squad — kalendarz zajęć”) albo przyjmować go w parametrze `data-aipax-title`? Czy dwa przyciski strzałek w kalendarzu mogą dostać dostępne nazwy (np. „Poprzedni tydzień”/„Następny tydzień”)? Czy przewidujecie automatyczny ciemny tekst na jasnych kolorach zajęć?
> 4. **Wydajność.** Obrazy tła z assets.aipax.eu nie mają nagłówka Cache-Control. Czy możecie go dodać i kompresować wgrywane tła? Czy ramka może mieć `loading="lazy"`?
>
> Pozdrawiam,
> Gabriel Myśliwiec, Air Squad, tel. 728 559 101

- [ ] Wysłane · [ ] Odpowiedź przekazana Claude’owi

---

# CZĘŚĆ B — kwestionariusz treści

Zasada: przy każdym punkcie jest to, co **jest teraz na stronie** (plik:linia w repo), a czasem też to, co jest w **AIPAX** (stan 06.10.2026). Wpisz poprawne dane. „OK” oznacza, że się zgadza.

## B1. Minimalny wiek (F10)

Na stronie (sprzeczne):
- `app/layout.tsx:37` (opis całej strony w Google): „…obozy dla dzieci **od 4 lat**…”
- `lib/content/akrobatyka.ts:16` meta: „Zajęcia akrobatyki **od 4 lat** w 6 miastach…”, `:24` „od 4 lat”, `:28` statystyka „**4+** zaczynamy od 4. roku życia”, `:82–85` grupa „**AcroKids 4–6**”, `:120` FAQ „Od 4. roku życia w grupach AcroKids”
- meta wszystkich miast: „dla dzieci **od 4 lat**” (`lib/content/cities.ts:42, 152, 249, 330, 409, 481`)
- `components/home/hero-section.tsx:137`: „dla dzieci **od 7 lat**” · `components/home/how-audience-section.tsx:3`: „Dzieci **7–10** lat”
- `components/home/disciplines-section.tsx:20, 29, 38, 48, 57, 69`: **„OD 7 LAT”** na wszystkich 6 kartach (także tricking)
- `app/franczyza/page.tsx:21`: „program treningowy **od 4 do 99 lat**”
- miasta: Rzeszów 7+ i 9+ (`cities.ts:55–57`, FAQ `:68`); Dębica „od 7. roku życia” (`:158`, `:183`); Jasło „od 6. roku życia” (`:268`); Biecz „od 6 lat” (`:339–340`, `:349`); Brzostek „od 6 lat” (`:413`); Pilzno nabór „od 6 lat”, Pilzno 1 „od 7”, Pilzno 2–3 „od 10 lat” (`:490–493`, `:502`)
- dyscypliny: tricking „od 9 lat” (`akrobatyka.ts:172`), tumbling „od 7 lat” (`:209`), longboard „od 8 lat” (`:246`); Air Camp „od 8 do 16 lat” (`lib/content/letni.ts:84`)
- AIPAX: tylko Rzeszów podaje wiek (NABÓR 7+, NABÓR 9+, Tricking 9+). Grupa „AcroRzeszów NABÓR podstawa” jest „dla dzieci, które potrafią gwiazdę i przewrót”, bez wieku.

Wpisz minimalny wiek (pusta kratka = brak takich zajęć w mieście):
| Miasto | Akrobatyka — nabór | Tricking | Tumbling | Longboard | Dorośli od (lat) |
|---|---|---|---|---|---|
| Rzeszów | (7 / 9?) | (9?) | | | |
| Dębica | (7?) | | | | |
| Jasło | (6?) | | | | |
| Biecz | (6?) | | | | |
| Brzostek | (6?) | | | | |
| Pilzno | (6?) | | | | |

- Czy istnieje gdziekolwiek grupa dla dzieci **4–6 lat** (AcroKids)? `[ ] nie, usuń` `[ ] tak, gdzie: ____`
- „Acro Kids Rzeszów” (wt, czw 17:00–18:00): dla jakiego wieku? `Odp.:` ____
- Showdance i snowboard „od 7 lat”: czy te zajęcia w ogóle istnieją? (zob. B3) `Odp.:` ____
- Air Camp: wiek 8–16? `Odp.:` ____
- Hasło na stronę główną: „dla dzieci od ___ lat, młodzieży i dorosłych”. `Odp.:` ____

## B2. Grafik 2026/27 (F09)

Na stronie: „SEZON **2025/26** · ZAPISY OTWARTE” (`components/home/hero-section.tsx:100`), „Sezon **2025/26** · zapisy otwarte” (`app/zapisy/page.tsx:66`); „Sezon trwa od września do czerwca” (`components/home/how-steps-section.tsx:24`). Etykietę sezonu poprawi kod.
- Sezon 2026/27 trwa od ____ do ____ (np. 1.09.2026–30.06.2027). `Odp.:` ____

Poniżej grafik ze strony porównany z AIPAX. Zaznacz, co jest prawdą. Pogrubione są rozbieżności.

**Rzeszów** (`lib/content/cities.ts:55–62`): w AIPAX zgodne są NABÓR 7+ (wt·czw 16–17, sala Tumbling), NABÓR 9+ (pn/śr/pt 16–17), Tricking NABÓR 9+ (wt·czw 18–19), Acro Kids (wt·czw 17–18), Acro Junior (pn/śr/pt 18–19), Junior PRO (pn·śr·pt 19:00–20:15) i Tricking PRO (wt·czw 18–19).
| Rozbieżność | Strona | AIPAX | Poprawnie |
|---|---|---|---|
| Brak na stronie | — | **AcroRzeszów NABÓR podstawa** pn/śr/pt 17:00–18:00 (2× lub 3×; „dzieci, które umieją gwiazdę i przewrót”) | `[ ] dodać na stronę` |
| Dorośli | pn·śr 20:00–21:15 | **pn 20:15–21:30, śr 20:00–21:15 i śr 20:15–21:30** | |
| Zapełnienie | wszystkie nabory „wolne miejsca” | **pełne:** Tricking NABÓR 9+, NABÓR podstawa PON/ŚR, Dorośli | `[ ] pokazywać „lista rezerwowa”` |
- `[ ] reszta Rzeszowa OK`

**Dębica** (`cities.ts:170–178`): zgodne są NABÓR Air Space (wt·czw 16–17), NABÓR 2 SP10 (pt 16–17), AcroDębica 1, 1.1, 1.2, 2 i 3.
| Rozbieżność | Strona | AIPAX | Poprawnie |
|---|---|---|---|
| NABÓR SP4 | **pn / śr** 16–17 („1× w tyg. do wyboru”) | **tylko pn** 16–17 | |
| Dorośli | „**Szarfy / Dorośli**” śr·pt 19–20 | „Akro Dorośli (Dębica)” śr·pt 19–20, „o terminie rozpoczęcia poinformujemy” | Czy to szarfy? Czy już działa? |
| AcroDębica 1.2 | „średniozaawansowana” | w opisie AIPAX „poziom podstawowy” | |
| Pełne | — | AcroDębica 1 i 3 | |
- Tekst `cities.ts:158` „Treningi… prowadzimy w salach SP nr 4 i nr 10” pomija salę AIR SPACE Dębica. `[ ] dopisać AIR SPACE`
- `[ ] reszta Dębicy OK`

**Jasło** (`cities.ts:259–263`): zgodne z AIPAX, poza jednym punktem.
| AcroJasło 3, poniedziałek | strona „16:00–17:15 (pn do 17:00)” | AIPAX: kalendarz 15:45–16:45, opis 16:00–17:00 | Poprawnie: ____ |
- `[ ] reszta Jasła OK`

**Biecz** (`cities.ts:339–344`): zgodne z AIPAX. Oba nabory (pn i śr 17:20) są w AIPAX **pełne**. `[ ] OK`

**Brzostek** (`cities.ts:420–423`): zgodne, poza czwartkiem w AcroBrzostek 3: strona i opis AIPAX 18:00–19:00, kalendarz AIPAX 18:00–19:15. Poprawnie: ____ `[ ] reszta OK`

**Pilzno / Strzegocice** (`cities.ts:490–493`): **duża rozbieżność**. Komentarz w kodzie (`:513–515`) mówi, że AIPAX Pilzno jest pusty, a to już nieprawda.
| Grupa | Strona | AIPAX | Poprawnie |
|---|---|---|---|
| NABÓR | wt **18:00–19:00**, od 6 lat | wt **16:30–17:30**, **pełny** | |
| Pilzno 1 | wt 18:00–19:00, od 7 lat | wt 16:30–17:30 | |
| Pilzno 2 | wt 19:00–20:00, od 10 lat | wt **17:30–18:30** | |
| Pilzno 1.2 (nowa od 06.10) | — | wt 17:30–18:30, średniozaawansowani | |
| Pilzno 3 | wt 19:00–20:00, od 10 lat | **brak w AIPAX** | `[ ] istnieje` `[ ] usunąć` |
- FAQ Pilzna (`cities.ts:498`) mówi: „grupy młodsze 18:00–19:00, grupy starsze 19:00–20:00”. Poprawnie: ____

## B3. Liczby o klubie (F36)

| Fakt | Na stronie teraz (gdzie) | Poprawna wartość |
|---|---|---|
| Liczba miast | **6**: `hero-section.tsx:139`, `app/zapisy/page.tsx:21`, `app/grafik/page.tsx:10`, `app/layout.tsx:37`, `akrobatyka.ts:16` · **7**: `akrobatyka.ts:27`, `:214`, `app/lokalizacje/page.tsx:12`, `app/franczyza/page.tsx:31` („Siedem działających lokalizacji”) · **8**: `components/home/cta-section.tsx:6` | (6?) |
| Rok założenia klubu (i ewentualnie poprzednia nazwa, np. Diamond Team) | „**10** lat istnienia” (`cta-section.tsx:7`) | rok: ____ |
| Staż / doświadczenie | „Ponad **20** lat doświadczenia” (`franczyza/page.tsx:21`). Czyje: klubu czy trenera? | |
| Obozy od roku | „od **2016** roku”, „**11.** edycja” (`letni.ts:25, 31, 36`; `app/obozy-sportowe/page.tsx:56`) | |
| Uczniów w sezonie | „**1100+** uczniów / sezon” (`cta-section.tsx:5`) | |
| Trenerzy w klubie | **9 osób** na `/trenerzy/` (`lib/content/team.ts`); liczba „KADRA” na stronie głównej liczy się z tej listy | Czy lista jest pełna? ____ |
| Kadra Air Camp | „**12**-osobowy zespół trenerów” (`letni.ts:31`) vs „**20** kadra trenerów” (`letni.ts:34`) | 12 czy 20? ____ |
| Maks. wielkość grupy | „do **12** osób” (`akrobatyka.ts:22, 29`; tumbling `:212`) · Dębica „ok. **20**-osobowe (12 osób na 1 trenera)” (`cities.ts:156`), FAQ „maks. **20**” (`:183`) · Jasło „maks. **20**” (`:253`) · Pilzno „maks. **25**” (`:485, 506`) · Biecz „**12** uczestników na trenera” (`:372`) · Air Camp „grupy do **20** osób” (`pricing-section.tsx:222`) | uzupełnij tabelę niżej |
| Trenerów na zajęciach | „dwóch trenerów na każdej sali” (wiele miejsc; w AIPAX też „dwóch instruktorów”) | OK? |
| Długość Air Camp | „**9** dni” (`letni.ts:33`, `components/seo/camp-view.tsx:192, 372`) vs „**7** dni intensywnego treningu” (`app/obozy/page.tsx:63`) | 2026: 9 dni (25.07–02.08). Standard na przyszłość: ____ |
| Sekcje treningowe | „**06** SEKCJE: Akrobatyka · Tricking · Longboard · Tumbling · **Showdance** · **Snowboard**” (`hero-section.tsx:191–197`; karty `disciplines-section.tsx:44–72`) | Czy showdance i snowboard są w ofercie 2026/27? ____ |
| Czas odpowiedzi | „odpisujemy w **24** godziny” (`how-steps-section.tsx:14`), „potwierdzenie w 24h” (`camp-view.tsx:537`) | OK? |

Maks. liczba osób w grupie: Rzeszów ___ · Dębica ___ · Jasło ___ · Biecz ___ · Brzostek ___ · Pilzno ___ · na 1 trenera ___

## B4. Cennik per miasto (F37)

Na stronie jest **jeden cennik dla wszystkich** (`components/home/pricing-section.tsx:6–50`): Basic **150 zł** (1×/tydz., 5% zniżki na obozy), Standard **240 zł** (2×/tydz., 5%), Premium **280 zł** (3×/tydz., 10%). Wejścia jednorazowe: pojedynczy trening 40 zł, trening w małej grupie (2–3 os.) 300 zł, pakiet 4 treningów 270 zł, pierwsze zajęcia 40 zł. Wyjątki: Biecz ukrywa Premium i wejścia jednorazowe poza pierwszym treningiem (`cities.ts:373, 377`), a w Dębicy plan Basic jest „tylko w szkołach” (`:167`). **Pilzno i Brzostek pokazują Premium 3×/tydz., choć mają tylko zajęcia 1×/tydz.**

W AIPAX (opisy zajęć) jest inaczej. Wpisz ceny obowiązujące:
| Miasto | 1×/tydz. (AIPAX) | 2×/tydz. (AIPAX) | 3×/tydz. (AIPAX) | Dorośli | Poprawne ceny (1× / 2× / 3×) |
|---|---|---|---|---|---|
| Rzeszów | — | 240 | 280 | karnet (warianty?) | |
| Dębica | 150 (SP4, SP10) | 240 (Air Space) | 280 | ? | |
| Jasło | 150 | **220** | **260** | — | |
| Biecz | **130** | **190** | — | — | |
| Brzostek | 150 | **220** (grupa 3) | — | — | |
| Pilzno | 150 | — | — | — | |
| Tricking Rzeszów | — | 240 | — | — | |

- Dorośli Rzeszów: warianty karnetu i ceny: ____
- Pojedynczy trening 40 zł / mała grupa 300 zł / pakiet 4 treningi 270 zł: gdzie obowiązują? `Odp.:` ____
- Zniżki na obozy 5% / 10%: aktualne? `Odp.:` ____
- Płatność „do 10. dnia miesiąca, po terminie +30 zł” (`cities.ts:26–27`): aktualne? `Odp.:` ____
- **Na czyje konto** płacą rodzice? Strona: „konto Stowarzyszenia Air Squad” (`cities.ts:28–29`, FAQ Dębica `:195`). AIPAX: część grup „RQ Sp. z o.o.”. `Odp.:` ____
- Brzostek FAQ: „przelew lub gotówka u trenera” (`cities.ts:440`): aktualne? `Odp.:` ____

## B5. Air Meeting i Gravity Jam (F06)

Na stronie teraz (ok. 25 słów, bez daty):
- `/airmeeting/` (`lib/content/letni.ts:156–182`): tytuł „Air Meeting 2026”, data pusta, miejsce „Podkarpacie”, opis: „Spotkanie, zawody i wspólne emocje… dla członków klubu Air Squad. Szczegóły najbliższej edycji wkrótce.” Na stronie głównej w tle leci film „AIRMEETING 2026” (`components/home/section-video-band.tsx:4`).
- `/gravityjam/` (`letni.ts:184–210`): data pusta, „Rzeszów”, opis: „Warsztaty rolkowe, akrobatyczne, strefa longboardowa i gier drewnianych… Air Squad, MB Park i Street Life Rzeszów.”
- Ze starej strony odzyskano: Air Meeting **18.04.2026**, Zespół Szkół nr 1, ul. Towarnickiego 4, Rzeszów, dojazd autobusem z Jasła i Dębicy, „nie dla grup naborowych”; Gravity Jam **8.06.2025**, wstęp wolny, warsztaty 20 zł, zawody 20 zł, koszulka 45 zł, partnerzy MB Park i Street Life.

**Air Meeting 2026 (relacja):**
- Data i miejsce się zgadzają (18.04.2026, ZS nr 1, Towarnickiego 4)? `Odp.:` ____
- Ilu uczestników, z ilu miast, jakie kategorie/konkurencje? `Odp.:` ____
- Wyniki lub wyróżnienia do pokazania (bez nazwisk dzieci, chyba że masz zgody)? `Odp.:` ____
- Zdjęcia/filmy: link do folderu albo posty IG? `Odp.:` ____

**Air Meeting 2027:**
- `[ ] będzie` · termin ____ · miejsce ____ · dla kogo (czy nadal bez grup naborowych?) ____ · opłata ____ · zapisy od ____
- `[ ] termin jeszcze nieznany` → na stronę: „Air Meeting 2027 — termin ogłosimy w ____ (miesiąc)”

**Gravity Jam:**
- Czy była edycja 2026? `[ ] nie` `[ ] tak: data/miejsce ____`
- Kolejna edycja: `[ ] planowana: ____` `[ ] nie planujemy` → strona zostanie jako archiwum edycji 2025
- Partnerzy aktualni (MB Park, Street Life Rzeszów)? `Odp.:` ____

## B6. Tricking i tumbling (F07)

Na stronie teraz: `/tricking-akademia/` (`lib/content/akrobatyka.ts:155–193`) ma „Grupy naborowe od 9 lat oraz grupa zaawansowana. Rzeszów i Podkarpacie” i statystyki „9+”, „2 grupy”, ale **bez sali, dni, godzin i ceny**. `/tumbling/` (`akrobatyka.ts:195–230`): „od 7 lat”, „7 miast”, też bez sali i godzin. Przyciski miast na tych stronach otwierają kalendarz akrobatyki. Na starej stronie było: AIR SPACE, Boya-Żeleńskiego 15, wt/czw 18:30.

AIPAX: **Tricking NABÓR Rzeszów 9+** wt·czw 18:00–19:00, 240 zł/mies., **pełny**; **Tricking PRO Rzeszów** wt·czw 18:00–19:00 (kontynuacja albo „po przejściu castingu”), 240 zł. Osobnych zajęć tumblingu w AIPAX nie ma (jest tylko „Sala TUMBLING” w AIR SPACE Rzeszów).

| | Tricking | Tumbling |
|---|---|---|
| Czy działa w 2026/27? | `[ ] tak` `[ ] nie` | `[ ] tak` `[ ] nie` `[ ] tylko jako część akrobatyki` |
| Miasta / sala | (AIR SPACE Rzeszów?) | |
| Dni i godziny | (wt, czw 18:00–19:00?) | |
| Wiek od | (9?) | |
| Cena / mies. | (240?) | |
| Jak zapisać (który formularz AIPAX)? | | |
| Na czym polega casting do PRO? | | — |
| 2–3 zdania od Ciebie: co wyróżnia te zajęcia | | |

## B7. Longboard (F27)

Na stronie teraz (`akrobatyka.ts:232–265`): „Deski do wypożyczenia na miejscu”, „od 8 lat”, „2 trenerów na grupie”, „Zajęcia i wyjazdy longboardowe”, ale **bez miejsca, terminów i ceny**. Strona ma ok. 155 słów (na WordPressie ok. 360, z poradnikiem o rodzajach desek). W AIPAX nie ma zajęć longboardowych.

- Gdzie odbywają się lekcje (miasto, plac/park)? `Odp.:` ____
- Kiedy (sezon, dni, godziny)? Tylko latem / na obozie? `Odp.:` ____
- Forma: `[ ] grupowe` `[ ] indywidualne` `[ ] tylko na Air Camp` `[ ] wyjazdy` · cena: ____
- Wiek od: ____ · sprzęt: deska/kask/ochraniacze do wypożyczenia? `Odp.:` ____
- Jak się zapisać (telefon / AIPAX / mail)? `Odp.:` ____
- Czy przywrócić poradnik „Jaki longboard wybrać?” ze starej strony (pintail, twin tip, drop through, camber/rocker, ponad 15 blatów, trucki Paris i Bear)? `[ ] tak` `[ ] nie` · Czy nadal macie wypożyczalnię lub sprzedaż desek? `Odp.:` ____

## B8. Obóz zimowy (F26)

Na stronie teraz: `/obozy/` opisuje „Obozy sportowe Air Squad — **letnie i zimowe**” (`app/obozy/page.tsx:13`). Karta „Snowboard — wyjazdy zimowe, technika, pierwsze tricki w snowparku” prowadzi do `/obozy-sportowe/` (`components/home/disciplines-section.tsx:65–72`). `/obozy-sportowe/` ma ok. 70 słów i tylko Air Camp. Stary adres `/zimowy/` (obóz zimowy, Lubenia) przekierowuje na `/obozy-sportowe/`.

- Czy obóz zimowy wraca w 2027? `[ ] tak` `[ ] nie` `[ ] nie wiem jeszcze`
- Jeśli tak: termin (ferie podkarpackie?) ____ · miejsce ____ · program (narty / snowboard / akrobatyka) ____ · wiek ____ · cena ____ · zapisy od ____
- Historia do tekstu na `/obozy-sportowe/`: od kiedy obozy (2016?), kiedy „Diamond Camp” zmienił nazwę na „Air Camp”, ile było obozów zimowych i gdzie? `Odp.:` ____
- 2–3 pytania, które rodzice najczęściej zadają o obozy (do FAQ): `Odp.:` ____

## B9. Air Camp 2027 (F08)

Na stronie teraz Air Camp 2026 wygląda, jakby trwał: „11. edycja · **zapisy otwarte**” (`letni.ts:25`), „25 lipca – 2 sierpnia 2026, Janów Lubelski… **Zarezerwuj turnus!**” (`letni.ts:17–19, 29`), „Turnusy 2026” (`camp-view.tsx:324`), ceny 2 600 zł dla klubowiczów i 2 800 zł Acro Open (`letni.ts:57–79`), plakietka „**LATO 2026**” w menu (`components/layout/header.tsx:42`), „Air Camp 2026” w wyborze zapisów (`components/enrol-picker.tsx:9`), „Zarezerwuj turnus” na stronie głównej (`components/home/camps-section.tsx:146`). Formularz AIPAX „OBÓZ SPORTOWY” jest pusty.

**Relacja 2026** (na stronę w trybie „po edycji”):
- Ilu uczestników, ilu trenerów, 2–3 najlepsze momenty: `Odp.:` ____
- Film lub zdjęcia z 2026 (link): `Odp.:` ____

**Air Camp 2027:**
- Termin: ____ · miejsce: `[ ] znów ZOOM Przygoda, Janów Lubelski` `[ ] inne: ____`
- Ceny: klubowicze ____ · spoza klubu ____ · wczesna rezerwacja / rodzeństwo ____ · zaliczka ____
- Wiek uczestników: ____ · transport (zbiórka z Rzeszowa?) ____
- Zapisy ruszają: ____ (data) · `[ ] przez formularz AIPAX „OBÓZ SPORTOWY”`
- Jeśli nic nie wiadomo: tekst na stronę „Air Camp 2027 — zapisy ruszą w ____ (miesiąc). Zostaw kontakt / obserwuj nas na Instagramie” `[ ] OK`
- Od kiedy w menu ma być „LATO 2027” zamiast „LATO 2026”? `Odp.:` ____

## B10. Jak ma wyglądać „zgłoszenie” (F40)

Na stronie teraz: na `/airmeeting/` i `/gravityjam/` jest „Chcesz wziąć udział? Kliknij poniżej, aby zarejestrować się na to wydarzenie” i przycisk „Skontaktuj się” prowadzący na `/kontakt/`, gdzie **nie ma formularza** (`components/seo/views.tsx:685–701`). Na `/franczyza/` jest przycisk „**Formularz kontaktowy →**” prowadzący na `/kontakt/`, też bez formularza (`app/franczyza/page.tsx:91–95`).

Uwaga: AkroNocki (16/17.10 Dębica, 17/18.10 Rzeszów) są już w AIPAX jako zajęcia z zapisem. Air Meeting można zrobić tak samo.

| | Air Meeting | Gravity Jam | Franczyza |
|---|---|---|---|
| `[ ]` formularz AIPAX (jak AkroNocki) | | | — |
| `[ ]` e-mail z gotowym tematem (np. „Air Meeting 2027 — zgłoszenie”) | | | |
| `[ ]` telefon 728 559 101 | | | |
| `[ ]` inny (Google Forms, Messenger…) | | | |
| Adres e-mail (`klub.airsquad@gmail.com`?) | | | |
| Kto odpowiada / w jakim czasie | | | |

- Franczyza: czy temat jest aktualny i czy podajemy jakieś warunki (np. „sala min. ___ m², wkład ___”)? `Odp.:` ____

---

## Co odesłać Claude’owi
- [ ] ten plik z odpowiedziami (część B, decyzje D1, D2, D3, D-A2, F49)
- [ ] eksport Search Console (A1.6) i za 2 tygodnie listę 404 (A1.7)
- [ ] kody pocztowe i współrzędne sal (A4)
- [ ] nazwy wizytówek (A4) i zrzut zakładki „Zgoda” z podglądu GTM, jeśli coś było „Nie ustawiono” (A3.8)
- [ ] odpowiedź AIPAX (A6.4)
