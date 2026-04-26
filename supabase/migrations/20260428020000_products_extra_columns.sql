-- Add extra columns to products table that admin expects
-- Run via Supabase SQL Editor

-- Add images array column
DO  
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'images') THEN
    ALTER TABLE public.products ADD COLUMN images TEXT[] DEFAULT '{}';
  END IF;
END ;

-- Add is_featured column  
DO  
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'is_featured') THEN
    ALTER TABLE public.products ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT false;
  END IF;
END ;

-- Add is_best_seller column
DO  
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'is_best_seller') THEN
    ALTER TABLE public.products ADD COLUMN is_best_seller BOOLEAN NOT NULL DEFAULT false;
  END IF;
END ;

-- Add description column
DO  
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'description') THEN
    ALTER TABLE public.products ADD COLUMN description TEXT;
  END IF;
END ;

SELECT 'Products extra columns added!' as status;