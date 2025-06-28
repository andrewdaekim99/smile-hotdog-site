-- Fix Customers Table Structure
-- Run this script to update your existing customers table

-- First, let's check what columns currently exist
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'customers' 
ORDER BY ordinal_position;

-- Add auth_user_id column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'auth_user_id') THEN
    ALTER TABLE customers ADD COLUMN auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    RAISE NOTICE 'Added auth_user_id column to customers table';
  ELSE
    RAISE NOTICE 'auth_user_id column already exists';
  END IF;
END $$;

-- Add is_guest column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'is_guest') THEN
    ALTER TABLE customers ADD COLUMN is_guest BOOLEAN DEFAULT FALSE;
    RAISE NOTICE 'Added is_guest column to customers table';
  ELSE
    RAISE NOTICE 'is_guest column already exists';
  END IF;
END $$;

-- Add points column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'points') THEN
    ALTER TABLE customers ADD COLUMN points INTEGER DEFAULT 0;
    RAISE NOTICE 'Added points column to customers table';
  ELSE
    RAISE NOTICE 'points column already exists';
  END IF;
END $$;

-- Add created_at column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'created_at') THEN
    ALTER TABLE customers ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    RAISE NOTICE 'Added created_at column to customers table';
  ELSE
    RAISE NOTICE 'created_at column already exists';
  END IF;
END $$;

-- Add updated_at column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'updated_at') THEN
    ALTER TABLE customers ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    RAISE NOTICE 'Added updated_at column to customers table';
  ELSE
    RAISE NOTICE 'updated_at column already exists';
  END IF;
END $$;

-- Show the final table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'customers' 
ORDER BY ordinal_position;

-- Enable RLS if not already enabled
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON customers;
DROP POLICY IF EXISTS "Users can update own profile" ON customers;
DROP POLICY IF EXISTS "Allow customer creation" ON customers;
DROP POLICY IF EXISTS "Service role can read all customers" ON customers;
DROP POLICY IF EXISTS "Service role can update all customers" ON customers;

-- Create new policies
CREATE POLICY "Users can view own profile" ON customers
  FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile" ON customers
  FOR UPDATE USING (auth.uid() = auth_user_id);

CREATE POLICY "Allow customer creation" ON customers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can read all customers" ON customers
  FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "Service role can update all customers" ON customers
  FOR UPDATE USING (auth.role() = 'service_role');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_auth_user_id ON customers(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- Show current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'customers'
ORDER BY policyname; 