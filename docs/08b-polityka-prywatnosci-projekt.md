# PROJEKT — Polityka prywatności airsquad.pl (wersja do akceptacji)

<!--
NOTATKI DLA WDRAŻAJĄCEGO (nie publikować)

Źródło: app/polityka-prywatnosci/page.tsx (stan z 26.08.2026). Projekt przygotowano 2026-10-06 po audycie (F01).

Mapowanie sekcji: stare → nowe
  1. Administrator danych           → 1 (uzupełniony o NIP i informację o IOD)
  2. Jakie dane przetwarzamy i po co → 2 (dopisane: logi, statystyka, marketing, zapis zgody, social media, roszczenia, zdrowie)
  3. Komu przekazujemy dane         → 3 (przepisane: AIPAX, RQ, Supabase, Cookiebot, Google, Meta, Mouseflow; usunięte zdanie „nie udostępniamy w celach marketingowych”, bo po zgodzie udostępniamy)
  (nowe)                             → 4 Przekazywanie danych poza EOG
  4. Jak długo przechowujemy dane   → 5 (dopisane okresy dla narzędzi)
  5. Twoje prawa                    → 6 (rozszerzone)
  6. Pliki cookies i usługi zewn.   → 7 Pliki cookies i zgody + 8 Narzędzia i usługi zewnętrzne + 9 Lista plików cookies
  (nowe)                             → 10 Czy musisz podać dane? Profilowanie (wymóg art. 13 ust. 2 lit. e i f RODO)
  7. Zmiany polityki                → 11

Format: każdy akapit poniżej = jeden string w `body` tablicy SECTIONS (wzorzec „Etykieta: treść” jak w obecnym pliku).
Komponent dziś renderuje tylko czysty tekst. Trzy miejsca potrzebują rozszerzenia:
  a) linki w treści (zapis markdown [tekst](url)) — body może przyjmować ReactNode albo prosty obiekt { text, href };
  b) przycisk „Ustawienia cookies” w sekcji 7 — <button onClick={() => window.Cookiebot?.renew()}>; ten sam link w stopce (components/layout/footer);
  c) tabela Cookiebot w sekcji 9 — komponent kliencki, który w useEffect tworzy
     <script id="CookieDeclaration" src="https://consent.cookiebot.com/fc61955c-aa38-4593-aecc-45d2739b74ff/cd.js" type="text/javascript" data-culture="pl" async>
     i dokleja go DO KONTENERA <div> w sekcji 9 (cd.js wstawia tabelę obok swojego <script>; next/script wstawiłby go na koniec <body>).

Znaczniki:
  [DO POTWIERDZENIA Pn] — do sprawdzenia i usunięcia przed publikacją (lista na końcu pliku).
  <!-- MOUSEFLOW ... --> — miejsca do usunięcia, jeśli Mouseflow nie zostaje (lista na końcu pliku).

Nowa data w nagłówku: zamienić „Ostatnia aktualizacja: 26 sierpnia 2026”.
Proponowany nowy meta description (≈150 znaków, URL i title bez zmian):
  „Polityka prywatności i cookies airsquad.pl — kto przetwarza dane z zapisów, jakie narzędzia analityczne i reklamowe działają po zgodzie i jakie masz prawa.”
Identyfikatory narzędzi (do komentarza w kodzie, nie do treści): GTM-W44NNPZ, GA4 G-F41FNPX3XV, Google Ads AW-10873381756, Meta Pixel 521740188954821, Mouseflow b903677c-…, Cookiebot cbid fc61955c-aa38-4593-aecc-45d2739b74ff.
Narzędzia AIPAX (nie klubu): GA4 G-2FTCYKWQHZ, Meta Pixel 739691538446769, Microsoft Clarity xf04czpjx1, Sentry (sentry.cetuspro.com).
-->

**Dokumenty klubu**

# Polityka prywatności

Ostatnia aktualizacja: 6 października 2026 [DO POTWIERDZENIA P17]

---

## 1. Administrator danych

Administratorem danych osobowych jest Stowarzyszenie Air Squad z siedzibą przy ul. Kard. Karola Wojtyły 227b/6, 35-304 Rzeszów, NIP 8133921950 („Klub”, „my”). W sprawach dotyczących danych osobowych możesz się z nami skontaktować e-mailem na adres klub.airsquad@gmail.com lub telefonicznie pod numerem 728 559 101.

Nie powołaliśmy inspektora ochrony danych. Ze wszystkimi pytaniami i prośbami dotyczącymi danych pisz bezpośrednio na adres podany wyżej.

## 2. Jakie dane przetwarzamy i po co

Zapisy na zajęcia, obozy i wydarzenia: imię i nazwisko uczestnika oraz rodzica lub opiekuna, wiek lub data urodzenia uczestnika, numer telefonu i adres e-mail, wybrana lokalizacja, grupa i sposób rozliczenia, a później informacje o płatnościach i obecnościach [DO POTWIERDZENIA P1]. Dane podajesz w formularzu zapisów zewnętrznego systemu AIPAX (aipax.pro, aipax.eu). W tym systemie zakładasz też konto rodzica. Dane są nam potrzebne, żeby zapisać uczestnika, prowadzić zajęcia, kontaktować się w sprawach organizacyjnych (np. SMS o odwołanym treningu) i rozliczać opłaty. Podstawa prawna: zawarcie i wykonanie umowy o udział w zajęciach (art. 6 ust. 1 lit. b RODO).

<!-- AKAPIT WARUNKOWY: zostawić tylko, jeśli Klub lub formularz AIPAX zbiera informacje o zdrowiu (P2). Jeśli nie — usunąć także odpowiedni akapit w sekcji 5. -->
Informacje o zdrowiu uczestnika: regulamin zajęć prosi o informację o przeciwwskazaniach, kontuzjach i chorobach. Te dane zapisujemy tylko wtedy, gdy sam je przekażesz, i używamy ich wyłącznie po to, żeby bezpiecznie dostosować trening. Podstawa prawna: Twoja wyraźna zgoda (art. 9 ust. 2 lit. a RODO) [DO POTWIERDZENIA P2].

Kontakt e-mailowy i telefoniczny: przetwarzamy dane, które sam podasz w wiadomości lub rozmowie. Na stronie nie ma formularza kontaktowego, więc piszesz do nas bezpośrednio e-mailem albo dzwonisz. Podstawa prawna: nasz prawnie uzasadniony interes, czyli odpowiadanie na wiadomości (art. 6 ust. 1 lit. f RODO).

Rozliczenia składek i opłat: dane niezbędne do zaksięgowania wpłat i wystawienia dokumentów księgowych. Podstawa prawna: obowiązek prawny wynikający z przepisów podatkowych i o rachunkowości (art. 6 ust. 1 lit. c RODO).

Wizerunek uczestników: zdjęcia i nagrania z zajęć, obozów i wydarzeń publikujemy na stronie i w mediach społecznościowych wyłącznie na podstawie odrębnej zgody rodzica lub opiekuna (art. 6 ust. 1 lit. a RODO). Zgodę możesz wycofać w każdej chwili.

Korzystanie ze strony (logi serwera): gdy otwierasz stronę, serwer automatycznie zapisuje m.in. adres IP, datę i godzinę wizyty, adres podstrony oraz typ przeglądarki i systemu. Używamy tych danych wyłącznie do zapewnienia działania i bezpieczeństwa strony, np. do wykrywania błędów i ataków. Podstawa prawna: nasz prawnie uzasadniony interes (art. 6 ust. 1 lit. f RODO).

<!-- MOUSEFLOW: jeśli Mouseflow nie zostaje, w akapicie niżej usuń fragment „ i Mouseflow”. -->
Statystyka (tylko po Twojej zgodzie): sprawdzamy, jak odwiedzający korzystają ze strony, np. które podstrony są czytane, skąd przychodzą odwiedzający i gdzie rezygnują. Dzięki temu poprawiamy stronę. Używamy do tego Google Analytics 4 i Mouseflow (szczegóły w sekcji 8). Podstawa prawna: Twoja zgoda (art. 6 ust. 1 lit. a RODO oraz art. 399 ustawy z dnia 12 lipca 2024 r. – Prawo komunikacji elektronicznej).

Marketing (tylko po Twojej zgodzie): mierzymy skuteczność naszych reklam w Google, na Facebooku i Instagramie, np. ile osób po kliknięciu reklamy przeszło do zapisów. Wyświetlamy też reklamy Klubu osobom, które wcześniej odwiedziły stronę (remarketing). Używamy do tego Google Ads i Meta Pixel. Podstawa prawna: Twoja zgoda (art. 6 ust. 1 lit. a RODO oraz art. 399 Prawa komunikacji elektronicznej).

Zapis Twojej decyzji o cookies: narzędzie Cookiebot zapamiętuje, na co się zgodziłeś. Zapisuje identyfikator zgody, datę i godzinę, wybrane kategorie, skrócony adres IP, adres strony i dane o przeglądarce. Dzięki temu nie pytamy o zgodę przy każdej wizycie i możemy wykazać, że zgodę wyrażono. Podstawa prawna: obowiązek wykazania zgody (art. 6 ust. 1 lit. c w związku z art. 7 ust. 1 RODO).

Nasze profile w mediach społecznościowych: prowadzimy profile na Instagramie (@airsquad_akrobatyka) i Facebooku. Gdy je obserwujesz, komentujesz albo piszesz do nas wiadomość, widzimy nazwę Twojego profilu i to, co nam udostępnisz. Używamy tych danych, żeby odpowiadać na wiadomości i promować Klub. Podstawa prawna: nasz prawnie uzasadniony interes (art. 6 ust. 1 lit. f RODO). Za statystyki profilu (tzw. Page Insights) odpowiadamy wspólnie z Meta Platforms Ireland Limited (art. 26 RODO). Za pozostałe przetwarzanie w tych serwisach odpowiada Meta.

Dochodzenie i obrona roszczeń: jeśli dojdzie do sporu, możemy użyć danych potrzebnych do ustalenia, dochodzenia lub obrony roszczeń. Podstawa prawna: nasz prawnie uzasadniony interes (art. 6 ust. 1 lit. f RODO).

## 3. Komu przekazujemy dane

Dane przekazujemy tylko podmiotom, które pomagają nam prowadzić Klub i stronę, i tylko w potrzebnym zakresie. Działają one na nasze zlecenie albo jako odrębni administratorzy, na podstawie umów z nami.

System zapisów: Aipax Sp. z o.o. — dostawca systemu zapisów (AIPAX), w którym działają formularze zapisów, konta rodziców, grafik i powiadomienia [DO POTWIERDZENIA P6].

Rozliczenia: RQ Sp. z o.o. z siedzibą w Rzeszowie, prowadząca rachunek, na który wpłacasz opłaty za zajęcia. Spółka widzi więc dane z przelewu (imię i nazwisko uczestnika, sekcja, kwota) [DO POTWIERDZENIA P3]. Dane trafiają też do banku i biura księgowego [DO POTWIERDZENIA P4].

Hosting i infrastruktura strony: cyber_Folks S.A. z siedzibą w Poznaniu (serwer strony), Supabase, Inc. (baza danych, z której strona pobiera m.in. posty w zakładce Media) oraz Usercentrics A/S z siedzibą w Danii (dawniej Cybot A/S; dostawca narzędzia Cookiebot do zbierania zgód).

Poczta e-mail: Google (konto Gmail, na które przychodzi korespondencja do Klubu) [DO POTWIERDZENIA P18].

<!-- MOUSEFLOW: jeśli Mouseflow nie zostaje, w akapicie niżej usuń fragment „ oraz Mouseflow ApS z siedzibą w Danii”. -->
Narzędzia statystyczne i reklamowe (tylko po Twojej zgodzie): Google Ireland Limited (Google Analytics 4, Google Ads, Google Tag Manager), Meta Platforms Ireland Limited (Meta Pixel) oraz Mouseflow ApS z siedzibą w Danii. [DO POTWIERDZENIA P5: jeśli dostęp do tych narzędzi ma zewnętrzna agencja lub osoba spoza Klubu, dopisać tu: „oraz agencja marketingowa, która na nasze zlecenie obsługuje kampanie reklamowe”.]

Treści osadzone na stronie: Google (filmy YouTube i Mapy Google).

Organy publiczne: tylko wtedy, gdy wymagają tego przepisy (np. urząd skarbowy).

Nie sprzedajemy Twoich danych. Informacje o tym, jak korzystasz ze strony, przekazujemy Google i Meta w celach reklamowych wyłącznie wtedy, gdy zgodzisz się na kategorię „Marketing”.

## 4. Przekazywanie danych poza Europejski Obszar Gospodarczy

Część naszych dostawców należy do grup firm z siedzibą główną w USA (Google, Meta, Supabase), dlatego dane mogą trafić poza Europejski Obszar Gospodarczy (EOG).

Google LLC i Meta Platforms, Inc. uczestniczą w programie EU-US Data Privacy Framework. Komisja Europejska uznała, że zapewnia on odpowiedni poziom ochrony danych (decyzja wykonawcza Komisji (UE) 2023/1795 z dnia 10 lipca 2023 r.). Gdy ta decyzja nie ma zastosowania, dostawcy stosują standardowe klauzule umowne zatwierdzone przez Komisję Europejską (art. 46 ust. 2 lit. c RODO).

Supabase: dane są przechowywane w regionie [DO POTWIERDZENIA P7: np. „Unii Europejskiej (Frankfurt)”], a ewentualny dostęp z USA odbywa się na podstawie standardowych klauzul umownych [DO POTWIERDZENIA P7].

<!-- MOUSEFLOW: jeśli Mouseflow nie zostaje, w akapicie niżej usuń zdanie „Mouseflow ApS (Dania) deklaruje, że przechowuje i przetwarza dane w Unii Europejskiej.” -->
cyber_Folks (Polska) i Usercentrics/Cookiebot (Dania) przetwarzają dane w EOG. Mouseflow ApS (Dania) deklaruje, że przechowuje i przetwarza dane w Unii Europejskiej.

Microsoft Corporation (narzędzie Microsoft Clarity działające w ramce systemu AIPAX, patrz sekcja 8) również uczestniczy w programie Data Privacy Framework. Za to narzędzie odpowiada AIPAX.

Jeśli chcesz dowiedzieć się więcej o zabezpieczeniach transferu albo otrzymać ich kopię, napisz do nas.

## 5. Jak długo przechowujemy dane

Dane z zapisów: przez czas udziału w zajęciach, a następnie do upływu terminu przedawnienia ewentualnych roszczeń wynikającego z Kodeksu cywilnego.

Dane rozliczeniowe: przez okres wymagany przepisami podatkowymi i o rachunkowości, czyli 5 lat od końca roku kalendarzowego, w którym upłynął termin płatności podatku.

Korespondencja: do zakończenia sprawy, nie dłużej niż 2 lata.

Wizerunek: do wycofania zgody. Po wycofaniu przestajemy publikować materiały i usuwamy je z naszych kanałów, o ile to technicznie możliwe (nie mamy wpływu np. na udostępnienia innych osób).

<!-- AKAPIT WARUNKOWY: usunąć razem z akapitem o zdrowiu w sekcji 2 (P2). -->
Informacje o zdrowiu: do zakończenia udziału w zajęciach albo wcześniejszego wycofania zgody.

Logi serwera: nie dłużej niż [DO POTWIERDZENIA P8: liczba] dni.

Zapis Twojej zgody na cookies: 12 miesięcy. Po tym czasie zapytamy ponownie [DO POTWIERDZENIA P19].

Dane w Google Analytics 4: 14 miesięcy, potem Google usuwa je automatycznie. Zbiorcze raporty bez identyfikatorów mogą zostać dłużej [DO POTWIERDZENIA P9].

Listy odbiorców reklam: w Google Ads do [DO POTWIERDZENIA P10: domyślnie 30, maksymalnie 540] dni, w Meta do [DO POTWIERDZENIA P10: maksymalnie 180] dni od ostatniej wizyty na stronie. Google i Meta mogą przechowywać dane dłużej jako odrębni administratorzy, zgodnie z własnymi zasadami.

<!-- MOUSEFLOW: jeśli Mouseflow nie zostaje, usuń cały akapit niżej. -->
Nagrania sesji i mapy cieplne w Mouseflow: [DO POTWIERDZENIA P11: okres z planu Mouseflow, np. „3 miesiące”], potem są usuwane automatycznie.

Okres ważności poszczególnych plików cookies podajemy w sekcji 9.

## 6. Twoje prawa

Masz prawo dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania i przenoszenia. Masz też prawo sprzeciwu wobec przetwarzania opartego na naszym prawnie uzasadnionym interesie (np. logi serwera, profile w mediach społecznościowych).

Każdą zgodę możesz wycofać w każdej chwili. Zgodę na wizerunek wycofasz e-mailem, a zgodę na cookies przyciskiem „Ustawienia cookies” (sekcja 7). Wycofanie zgody nie wpływa na zgodność z prawem przetwarzania sprzed wycofania.

Żeby skorzystać ze swoich praw, napisz na klub.airsquad@gmail.com. Odpowiemy bez zbędnej zwłoki, najpóźniej w ciągu miesiąca. Sprawy dotyczące danych w systemie zapisów AIPAX też możesz zgłaszać do nas, a w razie potrzeby przekażemy je dostawcy systemu.

Ustawienia reklam, które widzisz w Google, na Facebooku i Instagramie, możesz zmienić także bezpośrednio w swoim koncie Google i Meta.

Przysługuje Ci też prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa, [uodo.gov.pl](https://uodo.gov.pl)).

## 7. Pliki cookies i zgody

Pliki cookies (ciasteczka) to małe pliki zapisywane przez stronę w Twojej przeglądarce. Podobnie działają inne technologie, np. pamięć przeglądarki (localStorage) i piksele śledzące. W tej polityce nazywamy je wszystkie „cookies”.

Przy pierwszej wizycie pokazujemy okno zgód (Cookiebot). Możesz zaakceptować wszystkie kategorie, wybrać tylko niektóre albo odrzucić wszystkie poza niezbędnymi. Odmowa nie blokuje korzystania ze strony ani zapisów na zajęcia. Dopóki nie wyrazisz zgody, nie uruchamiamy narzędzi statystycznych ani marketingowych.

Niezbędne: zapamiętują Twoją decyzję w oknie zgód i Twoje wybory na stronie (np. motyw jasny lub ciemny). Działają bez zgody, bo bez nich strona nie zrobi tego, o co prosisz (art. 399 Prawa komunikacji elektronicznej).

<!-- MOUSEFLOW: jeśli Mouseflow nie zostaje, w akapicie niżej usuń fragment „ i Mouseflow (nagrania przebiegu wizyty i mapy cieplne)”. -->
Statystyka: Google Analytics 4 i Mouseflow (nagrania przebiegu wizyty i mapy cieplne). Uruchamiamy je tylko po Twojej zgodzie na tę kategorię [DO POTWIERDZENIA P11].

Marketing: Google Ads i Meta Pixel (pomiar skuteczności reklam i remarketing). Uruchamiamy je tylko po Twojej zgodzie na tę kategorię [DO POTWIERDZENIA P12].

Zmiana lub wycofanie zgody: w każdej chwili kliknij „Ustawienia cookies” w stopce strony albo przycisk poniżej. Okno zgód otworzy się ponownie i możesz zmienić wybór. Po wycofaniu zgody narzędzia nie będą uruchamiane przy kolejnych odsłonach. Pliki cookies zapisane wcześniej możesz usunąć w ustawieniach przeglądarki.

<!-- IMPL: w tym miejscu przycisk „Ustawienia cookies” → window.Cookiebot?.renew(). Ten sam przycisk/link w stopce. -->
[Ustawienia cookies]

Ustawienia przeglądarki: w każdej przeglądarce możesz też usunąć zapisane pliki cookies albo zablokować ich zapisywanie. Instrukcję znajdziesz w pomocy przeglądarki. Jeśli zablokujesz wszystkie cookies, część funkcji strony (np. zapamiętanie Twojej decyzji o zgodach) może nie działać.

Jeśli masz mniej niż 16 lat, poproś rodzica lub opiekuna, żeby to on zdecydował w oknie zgód.

## 8. Narzędzia i usługi zewnętrzne na stronie

Cookiebot (zgody): pokazuje okno zgód i zapamiętuje Twoją decyzję w pliku cookie „CookieConsent”. Skrypt ładuje się przy każdej wizycie z serwerów dostawcy, który otrzymuje przy tym adres IP. Dostawca: Usercentrics A/S (Dania). Zasady: [cookiebot.com/pl/privacy-policy](https://www.cookiebot.com/pl/privacy-policy/).

Google Tag Manager: narzędzie, przez które uruchamiamy Google Analytics, Google Ads i Meta Pixel. Ładuje się dopiero po Twojej zgodzie. Sam nie zapisuje plików cookies, ale przy ładowaniu przeglądarka łączy się z serwerami Google. Dostawca: Google Ireland Limited.

Google Analytics 4 (statystyka, po zgodzie): zbiera informacje o odwiedzanych podstronach, czasie wizyty, źródle wejścia (np. wyszukiwarka, reklama), typie urządzenia i przeglądarki oraz przybliżonej lokalizacji (miasto). Rozpoznaje powracające przeglądarki po plikach cookies „_ga” i „_ga_*”. Według Google, GA4 nie zapisuje adresów IP użytkowników. Dostawca: Google Ireland Limited, który przetwarza te dane na nasze zlecenie. Zasady: [policies.google.com/privacy](https://policies.google.com/privacy).

Google Ads (marketing, po zgodzie): mierzy, czy wizyta z reklamy Google skończyła się ważną akcją (np. przejściem do zapisów), i pozwala pokazywać reklamy Klubu osobom, które odwiedziły stronę. Używa m.in. pliku cookie „_gcl_au”. Dane wykorzystywane do reklam Google przetwarza jako odrębny administrator. Dostawca: Google Ireland Limited. Zasady: [policies.google.com/technologies/ads](https://policies.google.com/technologies/ads).

Meta Pixel (marketing, po zgodzie): przekazuje Meta informację o odwiedzonych podstronach, żeby mierzyć skuteczność naszych reklam na Facebooku i Instagramie i pokazywać je osobom, które odwiedziły stronę. Używa m.in. pliku cookie „_fbp”. Za zebranie i przekazanie tych danych odpowiadamy wspólnie z Meta Platforms Ireland Limited (art. 26 RODO). Dalej Meta przetwarza je jako odrębny administrator. Dostawca: Meta Platforms Ireland Limited. Zasady: [facebook.com/privacy/policy](https://www.facebook.com/privacy/policy).

<!-- MOUSEFLOW START — jeśli Mouseflow nie zostaje, usuń cały akapit niżej (oraz pozostałe miejsca oznaczone „MOUSEFLOW”). Ten akapit opisuje działanie PO uzgodnieniu konfiguracji z P11 (kategoria „Statystyka”, maskowanie pól). -->
Mouseflow (statystyka, po zgodzie): nagrywa przebieg wizyty, czyli ruchy myszy, kliknięcia i przewijanie, i tworzy z tego mapy cieplne. Widzimy dzięki temu, które elementy strony są niezrozumiałe. Treści wpisywane w pola są maskowane, a narzędzie nie nagrywa zawartości ramki systemu zapisów AIPAX [DO POTWIERDZENIA P11]. Używa plików cookies „mf_user” i „mf_*” (identyfikator strony). Dostawca: Mouseflow ApS (Kopenhaga, Dania), który przetwarza dane na nasze zlecenie i deklaruje ich przechowywanie w Unii Europejskiej. Zasady: [mouseflow.com/legal/company/privacy-policy](https://mouseflow.com/legal/company/privacy-policy/).
<!-- MOUSEFLOW END -->

<!-- WARIANT do wymiany po decyzji D7 (P15). Gdy filmy w tle zostaną zastąpione plikami MP4 z własnego serwera albo ładowane dopiero po kliknięciu, zamień drugie i trzecie zdanie na: „Film ładuje się dopiero, gdy klikniesz »Odtwórz« — wtedy przeglądarka łączy się z serwerami Google…”. -->
Filmy YouTube: filmy osadzamy w trybie rozszerzonej prywatności (youtube-nocookie.com). Część z nich odtwarza się automatycznie jako tło sekcji (np. na stronie głównej i stronach lokalizacji), pozostałe po kliknięciu [DO POTWIERDZENIA P15]. Gdy film lub jego podgląd się wyświetla, Twoja przeglądarka łączy się z serwerami Google i przekazuje im m.in. adres IP oraz informacje o urządzeniu i przeglądarce. W tym trybie YouTube nie używa plików cookies do śledzenia oglądania na potrzeby personalizacji, ale po odtworzeniu filmu odtwarzacz może zapisać dane techniczne w pamięci przeglądarki. Jeśli przejdziesz do serwisu YouTube, obowiązują jego zasady. Podstawa prawna: nasz prawnie uzasadniony interes, czyli pokazanie, jak wyglądają zajęcia (art. 6 ust. 1 lit. f RODO). Dostawca: Google Ireland Limited.

<!-- WARIANT po decyzji D7 (P16): jeśli mapa będzie ładowana dopiero po kliknięciu, zamień drugie zdanie na „Mapa ładuje się dopiero po kliknięciu »Pokaż mapę«”. -->
Mapy Google: na stronach niektórych lokalizacji pokazujemy mapę z adresem sali [DO POTWIERDZENIA P16]. Mapa ładuje się, gdy przewiniesz stronę do tej sekcji. Wtedy przeglądarka łączy się z serwerami Google (adres IP, dane o urządzeniu), a Google może zapisać własne pliki cookies. Na pozostałych stronach przycisk „Wyznacz trasę” to zwykły link do Map Google. Podstawa prawna: nasz prawnie uzasadniony interes, czyli pokazanie dojazdu (art. 6 ust. 1 lit. f RODO). Dostawca: Google Ireland Limited.

<!-- WARIANT po decyzji D7 (P14): jeśli wszystkie ramki AIPAX będą ładowane dopiero po kliknięciu, dopisz po pierwszym zdaniu: „Ramka wczytuje się dopiero, gdy klikniesz przycisk zapisu.” -->
System zapisów AIPAX: kalendarz i formularz zapisów na stronach lokalizacji, w grafiku i na stronach obozów i wydarzeń wyświetlamy w ramce systemu AIPAX [DO POTWIERDZENIA P14]. Ramka jest częścią serwisu AIPAX, a nie naszej strony. Dostawca używa w niej własnych narzędzi analitycznych, marketingowych i do wykrywania błędów: Google Analytics, Meta Pixel i Microsoft Clarity. Za te narzędzia, ich ustawienia i zbieranie zgód odpowiada Aipax Sp. z o.o. jako odrębny administrator. Nasze okno zgód nie steruje narzędziami w ramce AIPAX, a my nie otrzymujemy danych z tych narzędzi [DO POTWIERDZENIA P6]. Szczegóły: [polityka prywatności AIPAX](https://aipax.pro/pl/policy) i [polityka cookies AIPAX](https://aipax.pro/pl/cookies).

Instagram i Facebook: na stronie są linki do naszych profili. Nie osadzamy wtyczek ani skryptów Instagrama i Facebooka. Dane trafiają do Meta dopiero wtedy, gdy klikniesz link i przejdziesz do serwisu. Kafelki ze zdjęciami prowadzące do Instagrama (np. na stronie obozu letniego i w zakładce Media) to zwykłe linki ze zdjęciami z naszego serwera [DO POTWIERDZENIA P13].

Baza danych Supabase: zakładka Media pobiera treści z naszej bazy danych bezpośrednio w przeglądarce. Serwer dostawcy otrzymuje przy tym adres IP i dane techniczne przeglądarki. Dostawca: Supabase, Inc., który przetwarza dane na nasze zlecenie.

Pamięć przeglądarki używana przez naszą stronę: „theme” zapamiętuje wybrany motyw (jasny lub ciemny), jeśli go zmienisz, a „airsquad:selected-city” zapamiętuje miasto wybrane w kalendarzu zapisów. Te wpisy nie zawierają danych osobowych, nikomu ich nie wysyłamy i powstają tylko po Twoim kliknięciu.

## 9. Lista plików cookies

Poniższą tabelę tworzy automatycznie Cookiebot na podstawie regularnego skanowania strony. Zawiera nazwę, dostawcę, cel, okres ważności i kategorię każdego pliku cookie. Tabela pokazuje też Twoją aktualną zgodę i pozwala ją zmienić.

<!-- IMPL: tutaj kontener z <script id="CookieDeclaration" …/cd.js data-culture="pl" async> (patrz notatki na górze). Akapit niżej to tekst zastępczy — widoczny zawsze albo tylko w <noscript>/gdy skrypt się nie załaduje. -->
[TABELA COOKIEBOT]

<!-- MOUSEFLOW: jeśli Mouseflow nie zostaje, w akapicie niżej usuń fragment „ Mouseflow: mf_user (do 90 dni) i mf_* (do końca sesji).” -->
Jeśli tabela się nie wyświetla (np. blokujesz skrypty), oto najważniejsze pliki: CookieConsent (Cookiebot, niezbędny, 12 miesięcy). Google Analytics: _ga i _ga_* (statystyka, 2 lata). Google Ads: _gcl_au (marketing, 90 dni). Meta Pixel: _fbp (marketing, 90 dni). Mouseflow: mf_user (do 90 dni) i mf_* (do końca sesji) [DO POTWIERDZENIA P11]. Filmy YouTube i Mapy Google mogą zapisywać pliki cookies i dane w pamięci przeglądarki według zasad Google.

## 10. Czy musisz podać dane? Profilowanie

Podanie danych przy zapisie jest dobrowolne, ale bez nich nie możemy zapisać uczestnika ani zawrzeć umowy o udział w zajęciach. Dane do rozliczeń są wymagane przepisami podatkowymi. Zgody na wizerunek i na cookies statystyczne i marketingowe są w pełni dobrowolne. Odmowa nie wpływa na udział w zajęciach.

Nie podejmujemy wobec Ciebie decyzji opartych wyłącznie na zautomatyzowanym przetwarzaniu, które wywoływałyby skutki prawne lub w podobny sposób istotnie na Ciebie wpływały (art. 22 RODO). Jeśli zgodzisz się na kategorię „Marketing”, Google i Meta mogą na podstawie Twojej wizyty dopasowywać wyświetlane Ci reklamy, np. pokazać reklamę Klubu na Instagramie. To profilowanie marketingowe, które nie wpływa na Twoje prawa ani na warunki udziału w zajęciach.

## 11. Zmiany polityki

Politykę aktualizujemy, gdy zmienia się zakres przetwarzania danych (np. nowe narzędzia analityczne albo nowy system zapisów). Obowiązująca wersja jest zawsze publikowana pod tym adresem, z datą ostatniej aktualizacji na górze strony.

Sklep internetowy jest obecnie nieaktywny. Jeśli go uruchomimy, przed startem uzupełnimy tę politykę o zasady przetwarzania danych z zamówień.

---

Pytania o dane osobowe? Napisz: klub.airsquad@gmail.com albo odwiedź stronę [kontaktu](/kontakt/).

---
---

# Załącznik A — miejsca oznaczone [DO POTWIERDZENIA] (usunąć znaczniki przed publikacją)

| Nr | Gdzie | Co sprawdzić | Kto / skąd |
|---|---|---|---|
| P1 | 2 — Zapisy | Lista pól z formularza AIPAX (wiek czy data urodzenia; czy jest PESEL, adres, dane do faktury). Wpisać to, co faktycznie zbiera formularz. | Panel AIPAX, krok „Uczestnik” i „Konto” |
| P2 | 2 i 5 — Zdrowie | Czy formularz AIPAX albo Klub zbiera informacje o zdrowiu lub przeciwwskazaniach. Jeśli tak, potrzebny osobny checkbox wyraźnej zgody (art. 9 ust. 2 lit. a). Jeśli nie, usunąć oba akapity warunkowe. Regulamin zajęć (§ „przeciwwskazania”, zgłaszanie kontuzji e-mailem) sugeruje, że takie dane spływają. | Gabriel + konfiguracja „Zgody” w AIPAX |
| P3 | 3 — Rozliczenia | Rola RQ Sp. z o.o. (ul. Kolbego 1/31, Rzeszów). Regulamin i formularz AIPAX każą wpłacać na jej rachunek, a regulamin nazywa go „kontem bankowym Klubu”. Czy RQ działa na zlecenie Stowarzyszenia (wtedy umowa powierzenia), czy jest odrębnym administratorem albo stroną umowy w którejś lokalizacji? W tym drugim przypadku zmienia się sekcja 1. | Zarząd / księgowość |
| P4 | 3 — Rozliczenia | Czy księgowość prowadzi zewnętrzne biuro (wtedy umowa powierzenia), czy ktoś w Klubie. | Zarząd |
| P5 | 3 — Narzędzia | Kto poza Klubem ma dostęp do GTM, GA4, Google Ads i Meta Business. Kontener GTM zawiera wyzwalacze z innych stron (numery telefonów i e-maile innych firm, „DiamondTeamRzeszow”), co sugeruje agencję. Jeśli to agencja: dopisać ją jako odbiorcę i podpisać umowę powierzenia. | Uprawnienia w GTM, GA4, Ads i Meta BM |
| P6 | 3 i 8 — AIPAX | Pełne dane Aipax Sp. z o.o. (adres, KRS) i jej rola: przetwarzający dla danych zapisów (umowa powierzenia lub DPA w regulaminie AIPAX?) i odrębny administrator dla własnej analityki. Potwierdzić, że Klub nie dostaje danych z GA, Pixela ani Clarity AIPAX. Linki https://aipax.pro/pl/policy i https://aipax.pro/pl/cookies odpowiadają kodem 200 (polityka jest w PDF). | Umowa z AIPAX |
| P7 | 4 — Supabase | Region projektu Supabase (Dashboard → Project Settings → General) i podstawa transferu (DPA Supabase, standardowe klauzule umowne). | Panel Supabase |
| P8 | 5 — Logi | Jak długo cyber_Folks trzyma logi dostępu do serwera. | Panel cyber_Folks / support |
| P9 | 5 — GA4 | Ustawienie retencji w GA4 (Administracja → Zbieranie i modyfikowanie danych → Przechowywanie danych: 2 albo 14 miesięcy). Przy okazji sprawdzić, czy włączone są Google Signals i udostępnianie danych Google. Jeśli tak, dopisać zdanie w sekcji 8. | Panel GA4 |
| P10 | 5 — Reklamy | Czas członkostwa na listach remarketingowych Google Ads (domyślnie 30 dni, maks. 540) i retencja niestandardowych grup odbiorców z witryny w Meta (maks. 180 dni). | Google Ads, Meta Ads Manager |
| P11 | 2, 5, 7, 8, 9 — Mouseflow | Plan i okres przechowywania nagrań. Maskowanie pól i wykluczenie ramek (Privacy settings). Nazwy i ważność ciasteczek. Kategoria zgody: w GTM tag Mouseflow ma wymóg zgody ad_storage, a polityka zalicza go do „Statystyki”. Trzeba ujednolicić (zalecane analytics_storage / Cookiebot „statistics”). Cookiebot nie wykrył Mouseflow w skanie (cc.js: 0 trafień „mouseflow”). | Panel Mouseflow, GTM, Cookiebot |
| P12 | 7 — Marketing | **Blokuje publikację.** Dziś GTM ładuje się przy samej zgodzie „Statystyka” i wtedy startują też Meta Pixel (custom HTML bez sprawdzenia zgody) oraz tagi Google Ads. Zanim zdanie „tylko po Twojej zgodzie na tę kategorię” będzie prawdziwe, trzeba w GTM dodać warunek zgody marketingowej (patrz D3). | GTM (Preview) |
| P13 | 8 — Instagram | Skąd ładują się obrazki postów w zakładce /media/ (pole image_url w tabeli postów): z własnego serwera lub Supabase Storage, czy z CDN Instagrama (cdninstagram.com / fbcdn.net). W drugim przypadku przy każdym wyświetleniu IP trafia do Meta i zdanie trzeba zmienić. Na /letni/ zdjęcia są lokalne (sprawdzone w kodzie). | Panel admina / Supabase |
| P14 | 8 — AIPAX | Na których stronach i kiedy wczytuje się ramka AIPAX. Audyt: na stronach miast, /grafik/ i /letni/ widget montuje się od razu, bez kliknięcia, a trackery AIPAX startują przed odpowiedzią na baner. Część komponentów (city-enrolment) ładuje ramkę dopiero po wyborze miasta. Dopasować zdanie do wdrożenia po decyzji D7. | Kod: components/aipax-widget.tsx, components/seo/city-aipax-calendar.tsx |
| P15 | 8 — YouTube | Lista miejsc z autoodtwarzanym tłem (background-video.tsx, city-video.tsx) i z filmami po kliknięciu (youtube-facade.tsx). Dopasować po decyzji D7. | Kod |
| P16 | 8 — Mapy | Iframe z mapą jest dziś na /biecz/, /brzostek/, /jaslo/, /pilzno/ i ich odpowiednikach /lokalizacje/…/ (loading="lazy", bez zgody). /rzeszow/, /debica/ i hub /lokalizacje/ mają tylko linki. Można wpisać listę miast albo zostawić „niektórych lokalizacji”. | Kod: components/seo/city-view.tsx |
| P17 | Nagłówek | Data publikacji (6 października 2026 lub dzień wdrożenia). | Wdrażający |
| P18 | 3 — Poczta | Czy oprócz Gmaila Klub używa skrzynek @airsquad.pl na cyber_Folks. Stara polityka pisała „hosting strony i poczty (cyber_Folks)”. Jeśli tak, dopisać pocztę przy cyber_Folks. | Gabriel |
| P19 | 5 — Cookiebot | Okres ważności zgody i przechowywania logu zgód w panelu Cookiebot (domyślnie 12 miesięcy). | Panel Cookiebot |

# Załącznik B — miejsca do usunięcia, jeśli Mouseflow NIE zostaje

1. Sekcja 2, akapit „Statystyka”: fragment „ i Mouseflow”.
2. Sekcja 3, akapit „Narzędzia statystyczne i reklamowe”: fragment „ oraz Mouseflow ApS z siedzibą w Danii”.
3. Sekcja 4: zdanie „Mouseflow ApS (Dania) deklaruje…”.
4. Sekcja 5: cały akapit „Nagrania sesji i mapy cieplne w Mouseflow”.
5. Sekcja 7, akapit „Statystyka”: fragment „ i Mouseflow (nagrania przebiegu wizyty i mapy cieplne)”.
6. Sekcja 8: cały akapit między znacznikami MOUSEFLOW START i MOUSEFLOW END.
7. Sekcja 9, tekst zastępczy: fragment o mf_user i mf_*.
8. Poza tekstem: usunąć tag Mouseflow (__mf) z kontenera GTM-W44NNPZ i opublikować nową wersję kontenera.

# Załącznik C — decyzje dla właściciela

**D1. Mouseflow: zostaje czy nie?**
- Zostaje: (a) w GTM zmienić wymóg zgody z ad_storage na analytics_storage, żeby pasował do kategorii „Statystyka” z polityki; (b) w panelu Mouseflow włączyć maskowanie wszystkich pól i sprawdzić, że nie nagrywa ramek AIPAX; (c) dodać ciasteczka Mouseflow w Cookiebot (skaner ich nie wykrył); (d) zaakceptować DPA Mouseflow; (e) ustalić retencję (P11).
- Nie zostaje: usunąć tag z GTM i fragmenty z Załącznika B. Uwaga: nagrywanie sesji na stronie dla rodziców dzieci to narzędzie, o które UODO pyta najchętniej. Jeśli nikt nie ogląda nagrań regularnie, rezygnacja jest najtańszą opcją.

**D2. Włączyć Google Consent Mode v2?**
- Od marca 2024 Google wymaga sygnałów Consent Mode v2 od użytkowników z EOG, żeby Google Ads mógł budować listy remarketingowe i mierzyć konwersje. Szablon Cookiebot w GTM ma już consentModeEnabled: true, ale strona nie ustawia domyślnych stanów zgody przed załadowaniem GTM.
- Tryb podstawowy (zalecany): GTM jak dziś ładuje się dopiero po zgodzie, Cookiebot przekazuje stany ad_storage, analytics_storage, ad_user_data i ad_personalization. Treść polityki zostaje bez zmian.
- Tryb zaawansowany: GTM ładuje się przed zgodą, a tagi Google wysyłają bez zgody „pingi bez cookies”. Daje więcej danych modelowanych, ale wymaga zmiany layout.tsx i dopisania do sekcji 7 i 8 zdania o pingach wysyłanych przed zgodą. Przy stronie dla rodziców dzieci odradzam.

**D3. Rozdzielić „Statystykę” od „Marketingu” w GTM (warunek publikacji, P12).**
Meta Pixel i tagi Google Ads mają startować tylko po zgodzie „Marketing”. Do tego potrzebne są dodatkowe warunki zgody (ad_storage, ad_user_data, ad_personalization) albo wyzwalacz Cookiebot „cookie_consent_marketing”. Bez tego polityka znów opisuje stan, którego nie ma. Wariant prostszy: ładować GTM przy zgodzie na „statistics” LUB „marketing” i każdy tag pilnować w GTM osobnym warunkiem.

**D4. Retencja w GA4: 2 czy 14 miesięcy?**
14 miesięcy pozwala porównywać sezony rok do roku (nabory wrzesień–październik). 2 miesiące to mniej danych osobowych, ale bez porównań rocznych w raportach eksploracji. Projekt zakłada 14 miesięcy. Przy okazji: wyłączyć Google Signals, jeśli nie są potrzebne (P9).

**D5. Okresy list reklamowych** w Google Ads i Meta (P10). Zalecenie: 180 dni w obu, co obejmuje cykl „obóz letni → zapisy we wrześniu”.

**D6. Sprzątanie kontenera GTM-W44NNPZ.**
Usunąć tag Universal Analytics UA-92219779-2 (Google przestał przetwarzać dane UA w lipcu 2024). Usunąć wyzwalacze ze starego WordPressa i z obcych stron (wpforms, telefon 722 248 546, ks.street.sport@gmail.com, DiamondTeamRzeszow). Wszystkie 4 konwersje Google Ads i 5 zdarzeń GA4 wiszą dziś na tych warunkach, więc na nowej stronie nic nie mierzą. Ustalić, kto ma dostęp do kontenera (P5).

**D7. Treści ładowane bez zgody (tryb „manual” Cookiebot).** Dotyczy art. 399 PKE i pośrednio odpowiedzialności Klubu za osadzone treści.
- Ramki AIPAX montują się od razu na stronach miast, /grafik/ i /letni/, a w środku startują GA, Meta Pixel, Clarity i Sentry dostawcy, zanim użytkownik odpowie na baner. Zalecenie: wszystkie osadzenia AIPAX ładować po kliknięciu (wzorzec city-enrolment.tsx) i poprosić AIPAX o wyłączenie trackerów w trybie embedMode=inline albo o respektowanie zgody strony nadrzędnej.
- Filmy YouTube w tle autoodtwarzają się bez zgody. Zalecenie: tło jako plik MP4 z własnego serwera (zero zapytań do Google), a filmy z dźwiękiem przez youtube-facade.
- Mapy Google (iframe) na 4 stronach miast ładują się bez zgody. Zalecenie: statyczny obrazek lub przycisk „Pokaż mapę”. Link „Wyznacz trasę” już jest.
- Po zmianach podmienić warianty oznaczone w sekcji 8 (P14–P16).

**D8. Status RQ Sp. z o.o. (P3).** Przed publikacją trzeba ustalić, czy to podmiot przetwarzający, czy osobny administrator. Od tego zależą sekcje 1 i 3 oraz potrzebna umowa.

**D9. Informacje o zdrowiu (P2).** Zostawić akapit i dodać w AIPAX osobną zgodę albo przestać zbierać takie dane poza rozmową z trenerem i usunąć akapit.

**D10. Umowy powierzenia (DPA) do zebrania.** AIPAX, cyber_Folks, Supabase, Cookiebot/Usercentrics, Google (warunki przetwarzania danych akceptowane w panelu GA4 i Ads), Meta (warunki Business Tools), Mouseflow (jeśli zostaje), biuro księgowe, ewentualnie agencja.

**D11. Cookiebot: konfiguracja techniczna.**
- Przeskanować nową stronę (skan pochodzi ze starej, z 2024 r.).
- Sprawdzić kategorie: Meta i Google Ads w „Marketing”, GA4 i Mouseflow w „Statystyka”. Ustawić język PL.
- Dodać link „Ustawienia cookies” w stopce (Cookiebot.renew()).
- Na zdarzeniu CookiebotOnDecline przeładować stronę. Dziś raz załadowany GTM działa do końca bieżącej odsłony, nawet po wycofaniu zgody.

**D12. (opcjonalnie) Poczta.** Darmowy Gmail nie daje umowy powierzenia. Jeśli Klub chce mieć porządek formalny, Google Workspace dla organizacji non-profit ma DPA i jest bezpłatny dla stowarzyszeń po weryfikacji.
