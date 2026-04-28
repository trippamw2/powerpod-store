-- Inventory Management Functions for Supabase
-- Run these in Supabase SQL Editor

-- Function to reserve inventory (when order placed)
CREATE OR REPLACE FUNCTION reserve_inventory(p_product_id TEXT, p_quantity INTEGER)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE inventory
  SET reserved_quantity = COALESCE(reserved_quantity, 0) + p_quantity
  WHERE product_id = p_product_id;
END;
$$;

-- Function to confirm inventory sale (when payment received)
CREATE OR REPLACE FUNCTION confirm_inventory_sale(p_product_id TEXT, p_quantity INTEGER)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE inventory
  SET quantity = quantity - p_quantity,
      reserved_quantity = GREATEST(0, COALESCE(reserved_quantity, 0) - p_quantity)
  WHERE product_id = p_product_id AND quantity >= p_quantity;
END;
$$;

-- Function to release reserved inventory (when order cancelled)
CREATE OR REPLACE FUNCTION release_inventory(p_product_id TEXT, p_quantity INTEGER)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE inventory
  SET reserved_quantity = GREATEST(0, COALESCE(reserved_quantity, 0) - p_quantity)
  WHERE product_id = p_product_id;
END;
$$;

-- Function to restock inventory
CREATE OR REPLACE FUNCTION restock_inventory(p_product_id TEXT, p_quantity INTEGER)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE inventory
  SET quantity = quantity + p_quantity,
      last_restocked = NOW()
  WHERE product_id = p_product_id;
END;