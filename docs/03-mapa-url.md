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
| `/tyczyn/` | zachowany | lokalizacja | Zachować jako lokalny landing. |
| `/pilzno/` | zachowany | lokalizacja | Zachować jako lokalny landing. |
| `/tricking-akademia/` | zachowany | oferta | Zachować istniejący slug. |
| `/tumbling/` | zachowany | oferta | Zachować istniejący slug. |
| `/longboardy/` | zachowany | oferta | Zachować istniejący slug. |
| `/zapisy/` | zachowany | zapisy | Zachować jako główną ścieżkę konwersji. |
| `/letni/` | zachowany | Air Camp | Zachować jako aktywny landing Air Camp. |
| `/obozy-sportowe/` | zachowany | hub obozów | Zachować i rozbudować jako hub. |
| `/airmeeting/` | zachowany | wydarzenie | Zachować jako landing wydarzenia. |
| `/gravityjam/` | zachowany | wydarzenie/archiwum | Zachować jako archiwum/landing wydarzenia. |
| `/aktualnosci/` | zachowany | aktualności | Zachować jako lista komunikatów. |

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
- `/sklep/`

Decyzja wymaga danych z Google Search Console: kliknięcia, wyświetlenia, linki zewnętrzne, stan indeksowania.

## Zasada wdrożeniowa

Jeżeli po publikacji pojawi się URL, który ma zostać usunięty:

1. Sprawdzić ruch i linki w Google Search Console.
2. Wybrać najbliższy tematycznie docelowy adres.
3. Dodać 301, nie 302.
4. Nie przekierowywać masowo na stronę główną.
5. Zaktualizować sitemap i ponownie przetestować crawl.
