-- Referral RLS fix - Run this in Supabase SQL Editor

-- user_referral_codes policies
DROP POLICY IF EXISTS "Users can view own referral code" ON user_referral_codes;
CREATE POLICY "Users can view own referral code" ON user_referral_codes 
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own referral code" ON user_referral_codes;
CREATE POLICY "Users can insert own referral code" ON user_referral_codes 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own referral code" ON user_referral_codes;
CREATE POLICY "Users can update own referral code" ON user_referral_codes 
  FOR UPDATE USING (auth.uid() = user_id);

-- referral_transactions policies
DROP POLICY IF EXISTS "Users can view own referrals" ON referral_transactions;
CREATE POLICY "Users can view own referrals" ON referral_transactions 
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referee_id);

-- public read (for applying codes)
DROP POLICY IF EXISTS "Public can read referral_codes" ON user_referral_codes;
CREATE POLICY "Public can read referral_codes" ON user_referral_codes 
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can apply referral" ON referral_transactions;
CREATE POLICY "Public can apply referral" ON referral_transactions 
  FOR INSERT WITH CHECK (true);