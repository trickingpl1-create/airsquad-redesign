-- Seed stron SEO — slugi 1:1 z historycznymi URL-ami WordPressa na airsquad.pl
-- (docs/01-audyt-strony.md + docs/03-mapa-url.md + lista z audytu zywej strony).
-- Tresci to placeholdery do uzupelnienia w panelu /admin; KLUCZOWE sa same slugi,
-- bo kazdy z tych URL-i musi po migracji zwracac 200 (docs/02-plan-seo.md).

-- =====================================================
-- CITY PAGES — lokalne landingi (/rzeszow/, /debica/, ...)
-- =====================================================
INSERT INTO city_pages (location_id, slug, meta_title, meta_description, h1_title, hero_content, main_content) VALUES
(
  (SELECT id FROM locations WHERE city = 'Rzeszow' LIMIT 1),
  'rzeszow',
  'Akrobatyka Rzeszów — zajęcia dla dzieci i dorosłych | Air Squad',
  'Zajęcia akrobatyki w Rzeszowie dla dzieci od 4 lat, młodzieży i dorosłych. Małe grupy, doświadczeni trenerzy, profesjonalne maty AirTrack. Zapisz się na zajęcia próbne.',
  'Akrobatyka Rzeszów',
  '<p>Trenuj akrobatykę w Rzeszowie z Air Squad — profesjonalna sala, małe grupy i trenerzy z pasją.</p>',
  '<p>Treść strony w przygotowaniu — uzupełnij w panelu administracyjnym.</p>'
),
(
  (SELECT id FROM locations WHERE city = 'Debica' LIMIT 1),
  'debica',
  'Akrobatyka Dębica — zajęcia dla dzieci i dorosłych | Air Squad',
  'Zajęcia akrobatyki w Dębicy dla dzieci od 4 lat, młodzieży i dorosłych. Małe grupy i doświadczeni trenerzy. Zapisz się na zajęcia próbne.',
  'Akrobatyka Dębica',
  '<p>Trenuj akrobatykę w Dębicy z Air Squad.</p>',
  '<p>Treść strony w przygotowaniu — uzupełnij w panelu administracyjnym.</p>'
),
(
  (SELECT id FROM locations WHERE city = 'Jaslo' LIMIT 1),
  'jaslo',
  'Akrobatyka Jasło — zajęcia dla dzieci i dorosłych | Air Squad',
  'Zajęcia akrobatyki w Jaśle dla dzieci od 4 lat, młodzieży i dorosłych. Małe grupy i doświadczeni trenerzy. Zapisz się na zajęcia próbne.',
  'Akrobatyka Jasło',
  '<p>Trenuj akrobatykę w Jaśle z Air Squad.</p>',
  '<p>Treść strony w przygotowaniu — uzupełnij w panelu administracyjnym.</p>'
),
(
  (SELECT id FROM locations WHERE city = 'Biecz' LIMIT 1),
  'biecz',
  'Akrobatyka Biecz — zajęcia dla dzieci i dorosłych | Air Squad',
  'Zajęcia akrobatyki w Bieczu dla dzieci od 4 lat, młodzieży i dorosłych. Małe grupy i doświadczeni trenerzy. Zapisz się na zajęcia próbne.',
  'Akrobatyka Biecz',
  '<p>Trenuj akrobatykę w Bieczu z Air Squad.</p>',
  '<p>Treść strony w przygotowaniu — uzupełnij w panelu administracyjnym.</p>'
),
(
  (SELECT id FROM locations WHERE city = 'Brzostek' LIMIT 1),
  'brzostek',
  'Akrobatyka Brzostek — zajęcia dla dzieci i dorosłych | Air Squad',
  'Zajęcia akrobatyki w Brzostku dla dzieci od 4 lat, młodzieży i dorosłych. Małe grupy i doświadczeni trenerzy. Zapisz się na zajęcia próbne.',
  'Akrobatyka Brzostek',
  '<p>Trenuj akrobatykę w Brzostku z Air Squad.</p>',
  '<p>Treść strony w przygotowaniu — uzupełnij w panelu administracyjnym.</p>'
),
(
  (SELECT id FROM locations WHERE city = 'Tyczyn' LIMIT 1),
  'tyczyn',
  'Akrobatyka Tyczyn — zajęcia dla dzieci i dorosłych | Air Squad',
  'Zajęcia akrobatyki w Tyczynie dla dzieci od 4 lat, młodzieży i dorosłych. Małe grupy i doświadczeni trenerzy. Zapisz się na zajęcia próbne.',
  'Akrobatyka Tyczyn',
  '<p>Trenuj akrobatykę w Tyczynie z Air Squad.</p>',
  '<p>Treść strony w przygotowaniu — uzupełnij w panelu administracyjnym.</p>'
),
(
  (SELECT id FROM locations WHERE city = 'Pilzno' LIMIT 1),
  'pilzno',
  'Akrobatyka Pilzno — zajęcia dla dzieci i dorosłych | Air Squad',
  'Zajęcia akrobatyki w Pilźnie dla dzieci od 4 lat, młodzieży i dorosłych. Małe grupy i doświadczeni trenerzy. Zapisz się na zajęcia próbne.',
  'Akrobatyka Pilzno',
  '<p>Trenuj akrobatykę w Pilźnie z Air Squad.</p>',
  '<p>Treść strony w przygotowaniu — uzupełnij w panelu administracyjnym.</p>'
)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- AIPAX — identyfikatory formularzy per miasto (kalendarz zapisów na stronach dyscyplin)
-- TODO: podmien placeholder na REALNE form-id z panelu AIPAX (osobny formularz / lokalizacja).
-- Do czasu podmiany wszystkie miasta pokazuja wspolny formularz 5f7b99af...
-- =====================================================
UPDATE city_pages SET aipax_form_id = '5f7b99af-6154-4e74-92f7-2be9066a38f6' WHERE slug = 'rzeszow';
UPDATE city_pages SET aipax_form_id = '5f7b99af-6154-4e74-92f7-2be9066a38f6' WHERE slug = 'debica';
UPDATE city_pages SET aipax_form_id = '5f7b99af-6154-4e74-92f7-2be9066a38f6' WHERE slug = 'jaslo';
UPDATE city_pages SET aipax_form_id = '5f7b99af-6154-4e74-92f7-2be9066a38f6' WHERE slug = 'biecz';
UPDATE city_pages SET aipax_form_id = '5f7b99af-6154-4e74-92f7-2be9066a38f6' WHERE slug = 'brzostek';
UPDATE city_pages SET aipax_form_id = '5f7b99af-6154-4e74-92f7-2be9066a38f6' WHERE slug = 'tyczyn';
UPDATE city_pages SET aipax_form_id = '5f7b99af-6154-4e74-92f7-2be9066a38f6' WHERE slug = 'pilzno';

-- =====================================================
-- DISCIPLINES — strony ofertowe (/akrobatyka/, /tricking-akademia/, ...)
-- Uwaga: slugi celowo rozne od training_types (tu obowiazuja historyczne URL-e)
-- =====================================================
-- AKROBATYKA — pełny landing (bogata tresc renderowana przez DisciplineView)
INSERT INTO disciplines (
  slug, name, meta_title, meta_description, h1_title, hero_tagline, hero_image_url,
  short_description, age_requirement, stats, levels, session_flow, age_groups, gallery, faq, display_order
) VALUES (
  'akrobatyka',
  'Akrobatyka',
  'Akrobatyka dla dzieci i dorosłych — Rzeszów i Podkarpacie | Air Squad',
  'Zajęcia akrobatyki od 4 lat w 7 miastach na Podkarpaciu. Małe grupy, dwóch trenerów, ścieżki AirTrack i bezpłatne zajęcia próbne. Zapisz się!',
  'Akrobatyka',
  'od pierwszego przewrotu do salta.',
  '/images/akrobatyka/hero-salto.jpg',
  'Uczymy akrobatyki od podstaw — bezpiecznie, metodycznie i z frajdą. Małe grupy do 12 osób, dwóch trenerów na sali i profesjonalne ścieżki AirTrack, na których pierwsze salto przychodzi szybciej, niż myślisz.',
  'od 4 lat',
  '[
    {"value":"7","label":"miast na Podkarpaciu"},
    {"value":"4+","label":"zaczynamy od 4. roku życia"},
    {"value":"12","label":"maks. osób w grupie"},
    {"value":"2","label":"trenerów na każdej sali"}
  ]'::jsonb,
  '[
    {"num":"01","title":"Fundamenty","desc":"Przewroty, mostki, stania na rękach, gibkość i siła. Nawyki, które chronią przed kontuzjami.","tag":"POZIOM START"},
    {"num":"02","title":"Rundak i przerzuty","desc":"Pierwsze elementy dynamiczne: rundak, przerzut bokiem i w przód — na ścieżce i z asekuracją.","tag":"POZIOM 2"},
    {"num":"03","title":"Flik-flak","desc":"Klucz do akrobatyki sportowej. Metodyka krok po kroku: z wałka, z pasów, na AirTracku, na parkiet.","tag":"POZIOM 3"},
    {"num":"04","title":"Salta i łączenia","desc":"Salto w przód, w tył, śruby i łączenia. Dla najlepszych — starty w pokazach i zawodach.","tag":"POZIOM PRO"}
  ]'::jsonb,
  '[
    {"title":"Rozgrzewka i gibkość (15 min)","desc":"gry ruchowe u młodszych, mobilność u starszych."},
    {"title":"Technika na ścieżce","desc":"każdy ćwiczy element na swoim poziomie, trener asekuruje."},
    {"title":"AirTrack i zeskoki","desc":"bezpieczne powtórzenia, z których buduje się pewność."},
    {"title":"Akrobatyka parterowa","desc":"piramidy i elementy w parach, praca zespołowa."},
    {"title":"Wyciszenie i rozciąganie","desc":"szpagaty, mostki, podsumowanie postępów."}
  ]'::jsonb,
  '[
    {"age":"4–6","name":"AcroKids","desc":"Zabawa ruchowa z elementami akrobatyki. Przewroty, równowaga, pierwsze mostki. 60 min."},
    {"age":"7–10","name":"Acro I–II","desc":"Systematyczna technika: rundak, przerzuty, przygotowanie do flika. 60–90 min."},
    {"age":"11–17","name":"Acro Sport","desc":"Flik-flak, salta, łączenia na ścieżce. Grupy wg poziomu, nie wieku. 90 min."},
    {"age":"18+","name":"Dorośli","desc":"Wieczorne grupy od zera i dla wracających po latach. W swoim tempie, bez presji."}
  ]'::jsonb,
  '[
    {"url":"/images/akrobatyka/galeria-dzieci.jpg","caption":"// trening grupy 7–10 lat"},
    {"url":"/images/akrobatyka/galeria-szpagaty.jpg","caption":"// gibkość i szpagaty"},
    {"url":"/images/akrobatyka/galeria-plaza.jpg","caption":"// akro nie kończy się na sali"}
  ]'::jsonb,
  '[
    {"question":"Od ilu lat dziecko może zacząć?","answer":"Od 4. roku życia w grupach AcroKids. Górnej granicy nie ma — mamy też grupy dla dorosłych."},
    {"question":"Czy akrobatyka jest bezpieczna?","answer":"Trenujemy na ścieżkach AirTrack i miękkich zeskokach, zawsze z dwoma trenerami i asekuracją. Nowe elementy wprowadzamy dopiero, gdy poprzednie są opanowane."},
    {"question":"Czy pierwsze zajęcia są płatne?","answer":"Nie — pierwsze zajęcia próbne są bezpłatne. Przyjdź, zobacz salę i sprawdź, czy to coś dla Was."},
    {"question":"Moje dziecko już trenowało — do której grupy trafi?","answer":"Na zajęciach próbnych trener oceni poziom i dobierze grupę. Dzielimy wg umiejętności, nie tylko wieku."},
    {"question":"Co jeśli w mojej miejscowości grupa jest pełna?","answer":"Zapisz się na listę rezerwową w formularzu — otwieramy nowe grupy, gdy zbierze się komplet."}
  ]'::jsonb,
  1
)
ON CONFLICT (slug) DO NOTHING;

-- Pozostałe dyscypliny (treść do uzupełnienia w panelu — szablon degraduje się gracefully)
INSERT INTO disciplines (slug, name, meta_title, meta_description, h1_title, short_description, age_requirement, display_order) VALUES
(
  'tricking-akademia',
  'Tricking',
  'Tricking Akademia — nauka tricków | Air Squad',
  'Tricking — połączenie sztuk walki, gimnastyki i breakdance. Spektakularne triki i kombinacje. Zajęcia dla młodzieży i dorosłych na Podkarpaciu.',
  'Tricking Akademia',
  'Połączenie sztuk walki, gimnastyki i breakdance. Spektakularne triki i kombinacje.',
  'od 8 lat',
  2
),
(
  'tumbling',
  'Tumbling',
  'Tumbling — skoki na ścieżce akrobatycznej | Air Squad',
  'Trening na profesjonalnej ścieżce akrobatycznej. Doskonalenie techniki skoków, salt i śrub. Zajęcia dla dzieci i młodzieży na Podkarpaciu.',
  'Tumbling',
  'Trening na profesjonalnej ścieżce akrobatycznej — doskonalenie techniki skoków.',
  'od 6 lat',
  3
),
(
  'longboardy',
  'Longboard',
  'Longboardy — nauka jazdy i triki | Air Squad',
  'Nauka jazdy na longboardzie od podstaw do zaawansowanych trików. Zajęcia i wyjazdy longboardowe z Air Squad.',
  'Longboardy',
  'Nauka jazdy na longboardzie — od podstaw do zaawansowanych trików.',
  'od 8 lat',
  4
)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- EVENTS — wydarzenia i obozy (/airmeeting/, /gravityjam/, /letni/, /zimowy/, /aircamp24/)
-- =====================================================
INSERT INTO events (slug, title, meta_title, meta_description, event_type, location, description, is_active) VALUES
(
  'airmeeting',
  'Air Meeting',
  'Air Meeting — zlot akrobatyczny | Air Squad',
  'Air Meeting — cykliczny zlot akrobatyczny Air Squad. Warsztaty, pokazy i wspólne treningi dla zawodników i pasjonatów.',
  'airmeeting',
  'Podkarpacie',
  '<p>Szczegóły kolejnej edycji wkrótce — uzupełnij w panelu administracyjnym.</p>',
  true
),
(
  'gravityjam',
  'Gravity Jam',
  'Gravity Jam — zawody i jam akrobatyczny | Air Squad',
  'Gravity Jam — jam akrobatyczny Air Squad. Tricking, tumbling i akrobatyka w formule otwartych zawodów.',
  'gravityjam',
  'Podkarpacie',
  '<p>Szczegóły kolejnej edycji wkrótce — uzupełnij w panelu administracyjnym.</p>',
  true
),
(
  'zimowy',
  'Air Camp — obóz zimowy',
  'Air Camp — zimowy obóz akrobatyczny | Air Squad',
  'Zimowy obóz sportowy Air Squad — akrobatyka i sporty zimowe. Zapisy dla dzieci i młodzieży.',
  'oboz',
  'Podkarpacie',
  '<p>Szczegóły najbliższego obozu zimowego — uzupełnij w panelu administracyjnym.</p>',
  true
),
(
  'aircamp24',
  'Air Camp 2024',
  'Air Camp 2024 — relacja z obozu | Air Squad',
  'Air Camp 2024 — relacja i archiwum letniego obozu Air Squad.',
  'oboz',
  'Podkarpacie',
  '<p>Strona archiwalna obozu Air Camp 2024.</p>',
  false
)
ON CONFLICT (slug) DO NOTHING;

-- LETNI (Air Camp) — pełny landing obozu (bogata tresc renderowana przez EventView)
INSERT INTO events (
  slug, title, meta_title, meta_description, event_type, location, tagline,
  image_url, description, stats, attractions, program, includes, gallery, is_active
) VALUES (
  'letni',
  'Air Camp — obóz letni',
  'Air Camp — letni obóz sportowy dla dzieci i młodzieży | Air Squad',
  'Letni obóz Air Squad: akrobatyka, longboard, kajaki, SUP, paintball i gry terenowe. Turnusy od czerwca do sierpnia, małe grupy, dwóch trenerów. Zarezerwuj turnus!',
  'oboz',
  'Podkarpacie',
  'lato, którego nie zapomnisz.',
  '/images/letni/hero.jpg',
  '<p>Air Camp to letni obóz sportowo-rekreacyjny Air Squad — cały dzień pełen ruchu, przygody i nowych umiejętności. Łączymy treningi akrobatyki i trickingu na profesjonalnych matach AirTrack z atrakcjami na wodzie i w terenie. Małe grupy, dwóch trenerów na grupę i program ułożony tak, żeby każdy — od początkującego po zaawansowanego — wrócił z obozu z nową umiejętnością i wakacyjnymi wspomnieniami.</p>',
  '[
    {"value":"VI–VIII","label":"turnusy w wakacje"},
    {"value":"20","label":"maks. osób w grupie"},
    {"value":"2","label":"trenerów na grupę"},
    {"value":"8+","label":"dyscyplin i atrakcji"}
  ]'::jsonb,
  '[
    {"icon":"🤸","title":"Akrobatyka","desc":"Codzienne treningi na ścieżce AirTrack — od podstaw do salt."},
    {"icon":"🌀","title":"Tricking","desc":"Kopnięcia, obroty i kombinacje pod okiem trenerów."},
    {"icon":"🛹","title":"Longboardy","desc":"Nauka jazdy i pierwsze triki. Sprzęt zapewniamy."},
    {"icon":"🛶","title":"Kajaki","desc":"Spływy i zabawy na wodzie pod opieką instruktorów."},
    {"icon":"🏄","title":"SUP","desc":"Deski z wiosłem na jeziorze — równowaga i frajda."},
    {"icon":"🎯","title":"Paintball","desc":"Taktyczne gry zespołowe w leśnym terenie."},
    {"icon":"💃","title":"Taniec / show","desc":"Choreografie i pokaz na zakończenie turnusu."},
    {"icon":"🧭","title":"Gry terenowe","desc":"Podchody, survival i wieczorne ogniska."}
  ]'::jsonb,
  '[
    {"time":"08:00","title":"Pobudka i śniadanie","description":"Rozruch i energia na cały dzień."},
    {"time":"09:30","title":"Trening akrobatyki","description":"Sesja na matach AirTrack w grupach wg poziomu."},
    {"time":"12:00","title":"Obiad i odpoczynek","description":"Regeneracja przed popołudniowymi atrakcjami."},
    {"time":"14:00","title":"Atrakcje wodne","description":"Kajaki, SUP lub plażowanie — zależnie od dnia."},
    {"time":"17:00","title":"Gry terenowe","description":"Paintball, podchody, zabawy zespołowe."},
    {"time":"20:00","title":"Wieczór integracyjny","description":"Ognisko, pokazy, gry — codziennie inny motyw."}
  ]'::jsonb,
  '<ul><li>Nocleg i pełne wyżywienie (4 posiłki dziennie)</li><li>Cały sprzęt sportowy — maty AirTrack, longboardy, kajaki, SUP, paintball</li><li>Opieka doświadczonych trenerów i wychowawców 24/7</li><li>Ubezpieczenie NNW i transport na atrakcje</li><li>Pamiątkowa koszulka Air Squad i dyplom na zakończenie</li></ul>',
  '[
    {"url":"/images/letni/galeria-kajaki.jpg","caption":"// kajaki i SUP na jeziorze"},
    {"url":"/images/letni/galeria-paintball.jpg","caption":"// paintball w lesie"},
    {"url":"/images/letni/galeria-akro.jpg","caption":"// akrobatyka na plaży"}
  ]'::jsonb,
  true
)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- STATIC PAGES — strony statyczne i archiwalne
-- =====================================================
INSERT INTO static_pages (slug, meta_title, meta_description, h1_title, content, page_type) VALUES
(
  'aktualnosci',
  'Aktualności | Air Squad',
  'Najnowsze informacje, komunikaty i ogłoszenia klubu Air Squad.',
  'Aktualności',
  '<p>Najnowsze komunikaty klubu — uzupełnij w panelu administracyjnym.</p>',
  'aktualnosci'
),
(
  'zapisy',
  'Zapisy na zajęcia | Air Squad',
  'Zapisz dziecko na zajęcia Air Squad — akrobatyka, tricking, tumbling i longboard w 7 miastach na Podkarpaciu.',
  'Zapisy na zajęcia',
  '<p>Wybierz zajęcia i lokalizację w formularzu poniżej.</p>',
  'zapisy'
),
(
  'zapisyairspace',
  'Zapisy AirSpace | Air Squad',
  'Zapisy na zajęcia w hali AirSpace — akrobatyka, tricking i tumbling z Air Squad.',
  'Zapisy AirSpace',
  '<p>Wybierz zajęcia w formularzu poniżej.</p>',
  'zapisy'
),
(
  'airspace',
  'AirSpace — hala akrobatyczna | Air Squad',
  'AirSpace — hala treningowa Air Squad. Profesjonalne maty AirTrack, ścieżka akrobatyczna i strefa trickingu.',
  'AirSpace',
  '<p>Informacje o hali AirSpace — uzupełnij w panelu administracyjnym.</p>',
  'airspace'
),
(
  'polityka-prywatnosci',
  'Polityka prywatności | Air Squad',
  'Polityka prywatności serwisu airsquad.pl.',
  'Polityka prywatności',
  '<p>Treść polityki prywatności — uzupełnij w panelu administracyjnym.</p>',
  'legal'
),
(
  'stickit',
  'Stick It | Air Squad',
  'Stick It — archiwalna strona wydarzenia Air Squad.',
  'Stick It',
  '<p>Strona archiwalna.</p>',
  'archiwum'
),
(
  'szarfy',
  'Szarfy | Air Squad',
  'Szarfy — zajęcia i pokazy z szarfami w Air Squad.',
  'Szarfy',
  '<p>Strona w przygotowaniu — uzupełnij w panelu administracyjnym.</p>',
  'archiwum'
),
(
  'diamond-camp-2021',
  'Diamond Camp 2021 | Air Squad',
  'Diamond Camp 2021 — relacja i archiwum obozu Air Squad.',
  'Diamond Camp 2021',
  '<p>Strona archiwalna obozu Diamond Camp 2021.</p>',
  'archiwum'
),
(
  'diamond-camp-2022',
  'Diamond Camp 2022 | Air Squad',
  'Diamond Camp 2022 — relacja i archiwum obozu Air Squad.',
  'Diamond Camp 2022',
  '<p>Strona archiwalna obozu Diamond Camp 2022.</p>',
  'archiwum'
)
ON CONFLICT (slug) DO NOTHING;
