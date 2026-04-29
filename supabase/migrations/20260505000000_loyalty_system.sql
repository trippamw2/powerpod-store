-- Loyalty/Rewards System for PowerPod
-- Run this in Supabase SQL Editor

-- Table: loyalty_programs (reward rules)
CREATE TABLE IF NOT EXISTS loyalty_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    points_per_mwk NUMERIC NOT NULL DEFAULT 1, -- 1 point per X MWK spent
    points_to_redeem INTEGER NOT NULL DEFAULT 100, -- points needed for reward
    reward_value_mwk NUMERIC NOT NULL DEFAULT 1000, -- MWK discount per reward
    min_order_mwk INTEGER DEFAULT 0,
    max_redeem_percent INTEGER DEFAULT 50,
    is_active BOOLEAN DEFAULT true,
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: customer_loyalty (points balance per customer)
CREATE TABLE IF NOT EXISTS customer_loyalty (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    available_points INTEGER DEFAULT 0,
    redeemed_points INTEGER DEFAULT 0,
    lifetime_spent_mwk NUMERIC DEFAULT 0,
    tier TEXT DEFAULT 'bronze', -- bronze, silver, gold, platinum
    last_activity_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(customer_id)
);

-- Table: loyalty_transactions (points history)
CREATE TABLE IF NOT EXISTS loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id),
    points INTEGER NOT NULL,
    type TEXT NOT NULL, -- earned, redeemed, expired, bonus, adjusted
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: loyalty_tiers (tier benefits)
CREATE TABLE IF NOT EXISTS loyalty_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE, -- bronze, silver, gold, platinum
    min_lifetime_points INTEGER NOT NULL,
    points_multiplier NUMERIC DEFAULT 1, -- earn 1x, 1.5x, 2x, etc.
    discount_percent NUMERIC DEFAULT 0,
    free_delivery BOOLEAN DEFAULT false,
    priority_support BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE loyalty_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_loyalty ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_tiers ENABLE ROW LEVEL SECURITY;

-- RLS Policies (anon users can read, authenticated can manage own)
CREATE POLICY "Anyone can view loyalty_programs" ON loyalty_programs FOR SELECT USING (true);
CREATE POLICY "Anyone can view loyalty_tiers" ON loyalty_tiers FOR SELECT USING (true);

-- Functions
CREATE OR REPLACE FUNCTION calculate_loyalty_points(order_total_mwk NUMERIC)
RETURNS INTEGER AS $$
DECLARE
    points_per_mwk NUMERIC := 1;
BEGIN
    -- Default: 1 point per MWK spent
    RETURN FLOOR(order_total_mwk / 1000) * points_per_mwk;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION get_customer_loyalty(customer_uuid UUID)
RETURNS TABLE(
    total_points INTEGER,
    available_points INTEGER,
    tier TEXT,
    lifetime_spent_mwk NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cl.total_points,
        cl.available_points,
        cl.tier,
        cl.lifetime_spent_mwk
    FROM customer_loyalty cl
    WHERE cl.customer_id = customer_uuid;
END;
$$ LANGUAGE plpgsql;

-- Seed default loyalty program
INSERT INTO loyalty_programs (name, description, points_per_mwk, points_to_redeem, reward_value_mwk, is_active)
VALUES ('Default', 'Earn 1 point per MK 1,000 spent. Redeem 100 points for MK 1,000 off!', 1000, 100, 1000, true)
ON CONFLICT DO NOTHING;

-- Seed default tiers
INSERT INTO loyalty_tiers (name, min_lifetime_points, points_multiplier, discount_percent, free_delivery)
VALUES 
    ('bronze', 0, 1, 0, false),
    ('silver', 5000, 1.25, 2, false),
    ('gold', 15000, 1.5, 5, true),
    ('platinum', 50000, 2, 10, true)
ON CONFLICT DO NOTHING;