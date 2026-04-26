-- Site Settings table for promo banner and configuration
-- Run via Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Default settings
INSERT INTO public.site_settings (key, value, description) 
VALUES
  ('promo_banner_text', '🔥 Free delivery on orders over MWK 50,000 • New deals added daily!', 'Text shown in promotion banner'),
  ('free_delivery_threshold', '50000', 'Minimum order amount for free delivery'),
  ('delivery_fee', '2000', 'Standard delivery fee'),
  ('whatsapp_number', '+265XXXXXXXXX', 'WhatsApp contact number'),
  ('whatsapp_default_message', 'Hi! I would like to place an order.', 'Default WhatsApp message')
ON CONFLICT (key) DO NOTHING;

-- Allow public read
CREATE POLICY IF NOT EXISTS "Public read site settings" ON public.site_settings
  FOR SELECT TO public USING (true);

SELECT 'Site settings table created!' as status;