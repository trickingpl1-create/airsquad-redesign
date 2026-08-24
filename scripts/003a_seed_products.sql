-- 003a — TYLKO produkty ze sklepu.
--
-- Zastępuje uruchomienie całego 003_seed_data.sql. Pozostałe bloki tamtego
-- pliku (locations, trainers, training_types, training_sessions, camps)
-- celowo pomijamy: gettery działają wg `data ?? FALLBACK`, więc wiersz z bazy
-- nadpisuje treść z lib/content/. Blok `trainers` wstawia atrapy
-- („Kamil Nowak", „Anna Kowalska"), które zastąpiłyby prawdziwą kadrę
-- na /trenerzy/ i stronie głównej. Szczegóły: docs/04-architektura.md,
-- sekcja „Skrypty SQL — których NIE uruchamiać".
--
-- Kolejność uruchamiania: 001 → 002 → 003a → 004. Plik 005 pomijamy w całości.

INSERT INTO products (name, slug, description, price, category, sizes, colors, stock_status, display_order) VALUES
('Koszulka Air Squad', 'koszulka-air-squad', 'Oficjalna koszulka klubowa z logo Air Squad. 100% bawelna.', 79.00, 'odziez', ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['czarny', 'bialy', 'granatowy'], 'available', 1),
('Bluza Air Squad', 'bluza-air-squad', 'Ciepla bluza z kapturem i logo klubu. Idealna na treningi.', 149.00, 'odziez', ARRAY['S', 'M', 'L', 'XL'], ARRAY['czarny', 'szary'], 'available', 2),
('Spodenki treningowe', 'spodenki-treningowe', 'Wygodne spodenki do cwiczen. Szybkoschnacy material.', 89.00, 'odziez', ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['czarny', 'granatowy'], 'available', 3),
('Torba sportowa', 'torba-sportowa', 'Pojemna torba sportowa z logo Air Squad.', 119.00, 'akcesoria', NULL, ARRAY['czarny'], 'low', 4),
('Bidon Air Squad', 'bidon-air-squad', 'Bidon 750ml z logo klubu. BPA free.', 39.00, 'akcesoria', NULL, ARRAY['czarny', 'bialy', 'niebieski'], 'available', 5),
('Opaska na nadgarstek', 'opaska-nadgarstek', 'Elastyczna opaska frotowa z haftem Air Squad.', 25.00, 'akcesoria', NULL, ARRAY['czarny', 'bialy', 'czerwony'], 'available', 6)
ON CONFLICT (slug) DO NOTHING;
