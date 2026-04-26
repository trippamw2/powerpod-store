-- Site Settings table for promo banner and configuration
-- Run via Supabase SQL Editor

DO  
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'site_settings' AND schemaname = 'public') THEN
    CREATE TABLE public.site_settings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      key TEXT NOT NULL UNIQUE,
      value TEXT,
      description TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
    
    -- Default settings
    INSERT INTO public.site_settings (key, value, description) VALUES
      ('promo_banner_text', 'Free delivery on orders over MWK 50,000 | New deals added daily!', 'Text shown in promotion banner'),
      ('free_delivery_threshold', '50000', 'Minimum order amount for free delivery'),
      ('delivery_fee', '2000', 'Standard delivery fee'),
      ('whatsapp_number', '+265XXXXXXXXX', 'WhatsApp contact number'),
      ('whatsapp_default_message', 'Hi! I would like to place an order.', 'Default WhatsApp message');
  END IF;
END ;

-- Updated_at trigger
DO  
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'site_settings_updated_at') THEN
    CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON public.site_settings
      FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END ;

-- Allow public read
DO  
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read site settings' AND tablename = 'site_settings') THEN
    CREATE POLICY " Public read site settings\ ON public.site_settings
 FOR SELECT TO authenticated USING (true);
 END IF;
END ;

-- Allow admin write
DO 
BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin manage site settings' AND tablename = 'site_settings') THEN
 CREATE POLICY \Admin manage site settings\ ON public.site_settings
 FOR ALL TO authenticated
 USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'))
 WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
 END IF;
END ;

SELECT 'Site settings table created!' as status;