-- Referral system RLS fixes
-- Run this in Supabase SQL Editor

-- Ensure tables exist with proper RLS
-- Users can view their own referral code
DO $$
BEGIN
  CREATE POLICY IF NOT EXISTS "Users can view own referral code" ON user_referral_codes 
    FOR SELECT USING (auth.uid() = user_id);
  CREATE POLICY IF NOT EXISTS "Users can insert own referral code" ON user_referral_codes 
    FOR INSERT WITH CHECK (auth.uid() = user_id);
  CREATE POLICY IF NOT EXISTS "Users can update own referral code" ON user_referral_codes 
    FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END
$$;

-- Users can view their own referral transactions
DO $$
BEGIN
  CREATE POLICY IF NOT EXISTS "Users can view own referrals" ON referral_transactions 
    FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referee_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END
$$;

-- Allow public to use referral codes (no auth needed to apply)
DO $$
BEGIN
  CREATE POLICY IF NOT EXISTS "Public can apply referral" ON referral_transactions 
    FOR INSERT WITH CHECK (true);
  CREATE POLICY IF NOT EXISTS "Public can read referral_codes" ON user_referral_codes 
    FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END
$$;