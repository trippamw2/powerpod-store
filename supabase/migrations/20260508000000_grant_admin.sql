-- Grant admin access to user
-- Run this in Supabase SQL Editor

-- First, check current users
SELECT id, email FROM auth.users;

-- Then insert admin role for your user (replace 'YOUR-USER-ID' with your actual user ID from the query above)
INSERT INTO user_roles (user_id, role) 
VALUES ('YOUR-USER-ID-HERE', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Or if user_roles table doesn't exist, create it first
-- CREATE TABLE IF NOT EXISTS user_roles (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
--   role TEXT NOT NULL DEFAULT 'user',
--   created_at TIMESTAMPTZ DEFAULT NOW()
-- );

-- Then run the insert again