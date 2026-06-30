-- Tabele SEO dla AirSquad: strony miast, dyscypliny, wydarzenia i strony statyczne.
-- Z tych tabel czytaja trasy app/[slug], app/lokalizacje/[slug], app/dyscypliny/[slug],
-- app/wydarzenia/[slug] oraz app/sitemap.ts (lib/seo/queries.ts).
-- Slugi musza byc 1:1 z historycznymi URL-ami WordPressa (docs/03-mapa-url.md).

-- =====================================================
-- 1. CITY PAGES (Strony lokalnych landingow, np. /rzeszow/)
-- =====================================================
CREATE TABLE IF NOT EXISTS city_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  meta_title TEXT NOT NULL,
  meta_description TEXT,
  h1_title TEXT NOT NULL,
  hero_content TEXT,
  main_content TEXT,
  schedule_content TEXT,
  groups_info JSONB DEFAULT '[]',
  faq JSONB DEFAULT '[]',
  -- ID formularza AIPAX dla tego miasta — kalendarz zapisów filtrowany do jego grup.
  aipax_form_id TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. DISCIPLINES (Strony ofertowe, np. /akrobatyka/)
-- =====================================================
CREATE TABLE IF NOT EXISTS disciplines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  h1_title TEXT,
  hero_tagline TEXT,
  hero_image_url TEXT,
  hero_video_url TEXT,
  short_description TEXT,
  full_description TEXT,
  age_requirement TEXT,
  benefits JSONB DEFAULT '[]',
  -- Bogata treść landingu (renderowana warunkowo przez DisciplineView):
  stats JSONB DEFAULT '[]',         -- [{ value, label }]
  levels JSONB DEFAULT '[]',        -- [{ num, title, desc, tag }] — ścieżka rozwoju
  session_flow JSONB DEFAULT '[]',  -- [{ title, desc }] — jak wyglądają zajęcia
  age_groups JSONB DEFAULT '[]',    -- [{ age, name, desc }]
  gallery JSONB DEFAULT '[]',       -- [{ url, caption }]
  faq JSONB DEFAULT '[]',
  is_published BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. EVENTS (Wydarzenia i obozy, np. /airmeeting/, /letni/)
-- =====================================================
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('airmeeting', 'spotkanie', 'gravityjam', 'oboz')),
  event_date DATE,
  event_time TEXT,
  location TEXT,
  description TEXT,
  program JSONB DEFAULT '[]',
  pricing JSONB DEFAULT '[]',
  includes TEXT,
  image_url TEXT,
  form_url TEXT,
  -- Bogaty landing (obozy): podtytul, statystyki, atrakcje, galeria
  tagline TEXT,
  stats JSONB DEFAULT '[]',        -- [{ value, label }]
  attractions JSONB DEFAULT '[]',  -- [{ icon, title, desc }]
  gallery JSONB DEFAULT '[]',      -- [{ url, caption }]
  is_active BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. STATIC PAGES (Strony statyczne i archiwalne, np. /aktualnosci/, /stickit/)
-- =====================================================
CREATE TABLE IF NOT EXISTS static_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  meta_title TEXT NOT NULL,
  meta_description TEXT,
  h1_title TEXT,
  content TEXT,
  page_type TEXT NOT NULL CHECK (page_type IN ('zapisy', 'aktualnosci', 'airspace', 'akrobatyka', 'legal', 'archiwum')),
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Idempotentne kolumny (gdy tabele juz istnieja z wczesniejszej wersji)
-- =====================================================
ALTER TABLE city_pages  ADD COLUMN IF NOT EXISTS aipax_form_id TEXT;
ALTER TABLE disciplines ADD COLUMN IF NOT EXISTS hero_tagline TEXT;
ALTER TABLE disciplines ADD COLUMN IF NOT EXISTS stats JSONB DEFAULT '[]';
ALTER TABLE disciplines ADD COLUMN IF NOT EXISTS levels JSONB DEFAULT '[]';
ALTER TABLE disciplines ADD COLUMN IF NOT EXISTS session_flow JSONB DEFAULT '[]';
ALTER TABLE disciplines ADD COLUMN IF NOT EXISTS age_groups JSONB DEFAULT '[]';
ALTER TABLE disciplines ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]';
ALTER TABLE events ADD COLUMN IF NOT EXISTS tagline TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS stats JSONB DEFAULT '[]';
ALTER TABLE events ADD COLUMN IF NOT EXISTS attractions JSONB DEFAULT '[]';
ALTER TABLE events ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]';

-- =====================================================
-- RLS - publiczny odczyt, zapis tylko dla zalogowanych (jak w 002)
-- =====================================================
ALTER TABLE city_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE disciplines ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE static_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "city_pages_public_read" ON city_pages
  FOR SELECT USING (true);
CREATE POLICY "city_pages_admin_insert" ON city_pages
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "city_pages_admin_update" ON city_pages
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "city_pages_admin_delete" ON city_pages
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "disciplines_public_read" ON disciplines
  FOR SELECT USING (true);
CREATE POLICY "disciplines_admin_insert" ON disciplines
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "disciplines_admin_update" ON disciplines
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "disciplines_admin_delete" ON disciplines
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "events_public_read" ON events
  FOR SELECT USING (true);
CREATE POLICY "events_admin_insert" ON events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "events_admin_update" ON events
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "events_admin_delete" ON events
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "static_pages_public_read" ON static_pages
  FOR SELECT USING (true);
CREATE POLICY "static_pages_admin_insert" ON static_pages
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "static_pages_admin_update" ON static_pages
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "static_pages_admin_delete" ON static_pages
  FOR DELETE USING (auth.role() = 'authenticated');
