-- Fix customers table schema
-- Run this in your Supabase SQL editor if you encounter column missing errors

-- Add missing columns to customers table if they don't exist
DO $$ 
BEGIN
    -- Add auth_user_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'customers' AND column_name = 'auth_user_id') THEN
        ALTER TABLE customers ADD COLUMN auth_user_id UUID;
    END IF;

    -- Add password_hash column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'customers' AND column_name = 'password_hash') THEN
        ALTER TABLE customers ADD COLUMN password_hash TEXT;
    END IF;

    -- Add is_guest column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'customers' AND column_name = 'is_guest') THEN
        ALTER TABLE customers ADD COLUMN is_guest BOOLEAN DEFAULT FALSE;
    END IF;

    -- Add points column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'customers' AND column_name = 'points') THEN
        ALTER TABLE customers ADD COLUMN points INTEGER DEFAULT 0;
    END IF;

    -- Add total_spent column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'customers' AND column_name = 'total_spent') THEN
        ALTER TABLE customers ADD COLUMN total_spent DECIMAL(10,2) DEFAULT 0.00;
    END IF;

    -- Add created_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'customers' AND column_name = 'created_at') THEN
        ALTER TABLE customers ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;

    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'customers' AND column_name = 'updated_at') THEN
        ALTER TABLE customers ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;

END $$;

-- Update RLS policies to work with the updated schema
DROP POLICY IF EXISTS "Customers can view own profile" ON customers;
DROP POLICY IF EXISTS "Customers can update own profile" ON customers;
DROP POLICY IF EXISTS "Allow customer creation" ON customers;

-- Recreate policies
CREATE POLICY "Customers can view own profile" ON customers
    FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "Customers can update own profile" ON customers
    FOR UPDATE USING (auth.uid() = auth_user_id);

CREATE POLICY "Allow customer creation" ON customers
    FOR INSERT WITH CHECK (true);

-- Create function to increment points if it doesn't exist
CREATE OR REPLACE FUNCTION increment_points(points_to_add INTEGER)
RETURNS INTEGER AS $$
BEGIN
    RETURN COALESCE(points, 0) + points_to_add;
END;
$$ LANGUAGE plpgsql;

-- Show current table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'customers' 
ORDER BY ordinal_position; 