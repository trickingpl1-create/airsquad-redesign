-- Seed data for AirSquad
-- Sample data to populate the application

-- =====================================================
-- TRAINING TYPES
-- =====================================================
INSERT INTO training_types (name, slug, description, min_age, max_age, icon, color, display_order) VALUES
('Akrobatyka', 'akrobatyka', 'Zajecia akrobatyczne dla dzieci i mlodziezy. Nauka salt, przerzutow i innych elementow gimnastycznych.', 4, 16, 'tumbling', '#3B82F6', 1),
('Tricking', 'tricking', 'Polaczenie sztuk walki, gimnastyki i breakdance. Spektakularne tricki i kombinacje.', 8, 25, 'martial-arts', '#EF4444', 2),
('Skoki na sciezce', 'skoki-sciezka', 'Trening na profesjonalnej sciezce akrobatycznej. Doskonalenie techniki skokow.', 6, 18, 'jump', '#10B981', 3),
('ShowDance', 'showdance', 'Taniec pokazowy laczacy elementy akrobatyki z choreografia.', 6, 18, 'dance', '#F59E0B', 4),
('Longboard', 'longboard', 'Nauka jazdy na longboardzie - od podstaw do zaawansowanych trikow.', 8, 30, 'skateboard', '#8B5CF6', 5)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- LOCATIONS
-- =====================================================
INSERT INTO locations (name, address, city, maps_url, description, display_order) VALUES
('Air Squad Rzeszow', 'ul. Sportowa 15', 'Rzeszow', 'https://maps.google.com/?q=Rzeszow+Sportowa+15', 'Glowna siedziba klubu z pelnym wyposazeniem treningowym.', 1),
('Air Squad Tyczyn', 'ul. Mickiewicza 8', 'Tyczyn', 'https://maps.google.com/?q=Tyczyn+Mickiewicza+8', 'Filia klubu w Tyczynie.', 2),
('Air Squad Debica', 'ul. Pilsudskiego 22', 'Debica', 'https://maps.google.com/?q=Debica+Pilsudskiego+22', 'Sala treningowa w Debicy.', 3),
('Air Squad Pilzno', 'ul. Legionow 5', 'Pilzno', 'https://maps.google.com/?q=Pilzno+Legionow+5', 'Punkt treningowy w Pilznie.', 4),
('Air Squad Jaslo', 'ul. 3 Maja 12', 'Jaslo', 'https://maps.google.com/?q=Jaslo+3+Maja+12', 'Sala w Jasle.', 5),
('Air Squad Biecz', 'ul. Rynek 3', 'Biecz', 'https://maps.google.com/?q=Biecz+Rynek+3', 'Punkt treningowy w Bieczu.', 6),
('Air Squad Brzostek', 'ul. Rynkowa 7', 'Brzostek', 'https://maps.google.com/?q=Brzostek+Rynkowa+7', 'Sala w Brzostku.', 7)
ON CONFLICT DO NOTHING;

-- =====================================================
-- TRAINERS
-- =====================================================
INSERT INTO trainers (name, role, bio, specializations, display_order) VALUES
('Kamil Nowak', 'Glowny trener', 'Zalozyciel Air Squad. Wieloletnie doswiadczenie w akrobatyce i trickingu. Certyfikowany instruktor gimnastyki.', ARRAY['Akrobatyka', 'Tricking'], 1),
('Anna Kowalska', 'Trener', 'Specjalistka od pracy z dziecmi. Absolwentka AWF, instruktorka gimnastyki sportowej.', ARRAY['Akrobatyka', 'ShowDance'], 2),
('Piotr Wisniewski', 'Trener', 'Mistrz Polski w trickingu. Prowadzi zaawansowane grupy treningowe.', ARRAY['Tricking', 'Skoki na sciezce'], 3),
('Marta Zawadzka', 'Asystent trenera', 'Wielokrotna medalistka zawodow akrobatycznych. Wspiera treningi grup poczatkujacych.', ARRAY['Akrobatyka'], 4)
ON CONFLICT DO NOTHING;

-- =====================================================
-- TRAINING SESSIONS (sample schedule)
-- =====================================================
INSERT INTO training_sessions (training_type_id, location_id, trainer_id, day_of_week, start_time, end_time, age_group, spots_total, price_monthly)
SELECT 
  tt.id,
  l.id,
  t.id,
  0, -- Poniedzialek
  '16:00'::TIME,
  '17:30'::TIME,
  '6-9 lat',
  15,
  180.00
FROM training_types tt, locations l, trainers t
WHERE tt.slug = 'akrobatyka' AND l.city = 'Rzeszow' AND t.name = 'Anna Kowalska'
ON CONFLICT DO NOTHING;

INSERT INTO training_sessions (training_type_id, location_id, trainer_id, day_of_week, start_time, end_time, age_group, spots_total, price_monthly)
SELECT 
  tt.id,
  l.id,
  t.id,
  0, -- Poniedzialek
  '17:30'::TIME,
  '19:00'::TIME,
  '10-14 lat',
  15,
  200.00
FROM training_types tt, locations l, trainers t
WHERE tt.slug = 'akrobatyka' AND l.city = 'Rzeszow' AND t.name = 'Kamil Nowak'
ON CONFLICT DO NOTHING;

INSERT INTO training_sessions (training_type_id, location_id, trainer_id, day_of_week, start_time, end_time, age_group, spots_total, price_monthly)
SELECT 
  tt.id,
  l.id,
  t.id,
  2, -- Sroda
  '18:00'::TIME,
  '19:30'::TIME,
  '8+ lat',
  12,
  220.00
FROM training_types tt, locations l, trainers t
WHERE tt.slug = 'tricking' AND l.city = 'Rzeszow' AND t.name = 'Piotr Wisniewski'
ON CONFLICT DO NOTHING;

INSERT INTO training_sessions (training_type_id, location_id, trainer_id, day_of_week, start_time, end_time, age_group, spots_total, price_monthly)
SELECT 
  tt.id,
  l.id,
  t.id,
  1, -- Wtorek
  '16:00'::TIME,
  '17:30'::TIME,
  '6-10 lat',
  15,
  180.00
FROM training_types tt, locations l, trainers t
WHERE tt.slug = 'akrobatyka' AND l.city = 'Tyczyn' AND t.name = 'Marta Zawadzka'
ON CONFLICT DO NOTHING;

-- =====================================================
-- CAMPS
-- =====================================================
INSERT INTO camps (name, slug, type, start_date, end_date, location, description, price, spots_total, is_featured, registration_open) VALUES
('Oboz Letni 2026', 'oboz-letni-2026', 'letni', '2026-07-01', '2026-07-14', 'Bieszczady', 'Dwutygodniowy oboz letni z intensywnym programem treningowym. Zakwaterowanie, wyzywienie i transport w cenie.', 2800.00, 40, true, true),
('Air Meeting 2026', 'air-meeting-2026', 'weekendowy', '2026-05-15', '2026-05-17', 'Rzeszow', 'Coroczne spotkanie wszystkich grup treningowych. Pokazy, warsztaty i zawody.', 150.00, 100, true, true),
('Oboz Zimowy 2027', 'oboz-zimowy-2027', 'zimowy', '2027-01-20', '2027-01-27', 'Zakopane', 'Tydzieniowy oboz zimowy z treningami i atrakcjami zimowymi.', 1900.00, 30, false, false)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- PRODUCTS
-- =====================================================
INSERT INTO products (name, slug, description, price, category, sizes, colors, stock_status, display_order) VALUES
('Koszulka Air Squad', 'koszulka-air-squad', 'Oficjalna koszulka klubowa z logo Air Squad. 100% bawelna.', 79.00, 'odziez', ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['czarny', 'bialy', 'granatowy'], 'available', 1),
('Bluza Air Squad', 'bluza-air-squad', 'Ciepla bluza z kapturem i logo klubu. Idealna na treningi.', 149.00, 'odziez', ARRAY['S', 'M', 'L', 'XL'], ARRAY['czarny', 'szary'], 'available', 2),
('Spodenki treningowe', 'spodenki-treningowe', 'Wygodne spodenki do cwiczen. Szybkoschnacy material.', 89.00, 'odziez', ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['czarny', 'granatowy'], 'available', 3),
('Torba sportowa', 'torba-sportowa', 'Pojemna torba sportowa z logo Air Squad.', 119.00, 'akcesoria', NULL, ARRAY['czarny'], 'low', 4),
('Bidon Air Squad', 'bidon-air-squad', 'Bidon 750ml z logo klubu. BPA free.', 39.00, 'akcesoria', NULL, ARRAY['czarny', 'bialy', 'niebieski'], 'available', 5),
('Opaska na nadgarstek', 'opaska-nadgarstek', 'Elastyczna opaska frotowa z haftem Air Squad.', 25.00, 'akcesoria', NULL, ARRAY['czarny', 'bialy', 'czerwony'], 'available', 6)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- CONTENT BLOCKS
-- =====================================================
INSERT INTO content_blocks (page, section, content) VALUES
('home', 'hero', '{
  "title": "Air Squad",
  "subtitle": "Klub Akrobatyki i Trickingu",
  "description": "Dolacz do nas i odkryj swoj potencjal! Treningi dla dzieci i doroslych w 7 lokalizacjach.",
  "cta_text": "Sprawdz grafik",
  "cta_link": "/zajecia"
}'::JSONB),
('home', 'stats', '{
  "items": [
    {"value": "7", "label": "Lokalizacji"},
    {"value": "500+", "label": "Uczestnikow"},
    {"value": "15+", "label": "Grup treningowych"},
    {"value": "10", "label": "Lat doswiadczenia"}
  ]
}'::JSONB),
('home', 'youtube', '{
  "video_id": "",
  "title": "Zobacz nas w akcji"
}'::JSONB),
('contact', 'info', '{
  "phone": ["728 559 101", "722 248 546"],
  "email": "kontakt@airsquad.pl",
  "social": {
    "instagram": "https://instagram.com/airsquad.pl",
    "facebook": "https://facebook.com/airsquadpl",
    "youtube": "https://youtube.com/@airsquad"
  }
}'::JSONB)
ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content;
