-- Row Level Security Policies for AirSquad
-- Public read access for most tables, admin write access

-- =====================================================
-- ENABLE RLS ON ALL TABLES
-- =====================================================
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE camps ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_posts ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- LOCATIONS - Public read, admin write
-- =====================================================
CREATE POLICY "locations_public_read" ON locations
  FOR SELECT USING (true);

CREATE POLICY "locations_admin_insert" ON locations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "locations_admin_update" ON locations
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "locations_admin_delete" ON locations
  FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================
-- TRAINERS - Public read, admin write
-- =====================================================
CREATE POLICY "trainers_public_read" ON trainers
  FOR SELECT USING (true);

CREATE POLICY "trainers_admin_insert" ON trainers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "trainers_admin_update" ON trainers
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "trainers_admin_delete" ON trainers
  FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================
-- TRAINING TYPES - Public read, admin write
-- =====================================================
CREATE POLICY "training_types_public_read" ON training_types
  FOR SELECT USING (true);

CREATE POLICY "training_types_admin_insert" ON training_types
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "training_types_admin_update" ON training_types
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "training_types_admin_delete" ON training_types
  FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================
-- TRAINING SESSIONS - Public read, admin write
-- =====================================================
CREATE POLICY "training_sessions_public_read" ON training_sessions
  FOR SELECT USING (true);

CREATE POLICY "training_sessions_admin_insert" ON training_sessions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "training_sessions_admin_update" ON training_sessions
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "training_sessions_admin_delete" ON training_sessions
  FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================
-- CAMPS - Public read, admin write
-- =====================================================
CREATE POLICY "camps_public_read" ON camps
  FOR SELECT USING (true);

CREATE POLICY "camps_admin_insert" ON camps
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "camps_admin_update" ON camps
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "camps_admin_delete" ON camps
  FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================
-- PRODUCTS - Public read, admin write
-- =====================================================
CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (true);

CREATE POLICY "products_admin_insert" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "products_admin_update" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "products_admin_delete" ON products
  FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================
-- ORDERS - Public can create, admin can read/update
-- =====================================================
CREATE POLICY "orders_public_insert" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "orders_admin_read" ON orders
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "orders_admin_update" ON orders
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "orders_admin_delete" ON orders
  FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================
-- CONTENT BLOCKS - Public read, admin write
-- =====================================================
CREATE POLICY "content_blocks_public_read" ON content_blocks
  FOR SELECT USING (true);

CREATE POLICY "content_blocks_admin_insert" ON content_blocks
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "content_blocks_admin_update" ON content_blocks
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "content_blocks_admin_delete" ON content_blocks
  FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================
-- INSTAGRAM POSTS - Public read, admin write
-- =====================================================
CREATE POLICY "instagram_posts_public_read" ON instagram_posts
  FOR SELECT USING (true);

CREATE POLICY "instagram_posts_admin_insert" ON instagram_posts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "instagram_posts_admin_update" ON instagram_posts
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "instagram_posts_admin_delete" ON instagram_posts
  FOR DELETE USING (auth.role() = 'authenticated');
