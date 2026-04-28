-- Subscriber table
CREATE TABLE IF NOT EXISTS customer_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  whatsapp_consent BOOLEAN DEFAULT false,
  source TEXT DEFAULT 'newsletter',
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

-- Add columns if table exists
ALTER TABLE customer_subscribers ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE customer_subscribers ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE customer_subscribers ADD COLUMN IF NOT EXISTS whatsapp_consent BOOLEAN DEFAULT false;

-- RLS
ALTER TABLE customer_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow public insert
CREATE POLICY "Allow public insert" ON customer_subscribers
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated read
CREATE POLICY "Allow authenticated read" ON customer_subscribers
  FOR SELECT TO authenticated
  USING (true);

-- Allow service role full access
CREATE POLICY "Allow service role all" ON customer_subscribers
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);