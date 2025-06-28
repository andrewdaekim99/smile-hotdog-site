-- Fix RLS Policies for Customer Creation
-- Run this in your Supabase SQL Editor

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Customers can view own profile" ON customers;
DROP POLICY IF EXISTS "Customers can update own profile" ON customers;
DROP POLICY IF EXISTS "Allow customer creation" ON customers;

-- Recreate policies with proper permissions
CREATE POLICY "Customers can view own profile" ON customers
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Customers can update own profile" ON customers
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Allow customer creation during signup (no auth required)
CREATE POLICY "Allow customer creation" ON customers
    FOR INSERT WITH CHECK (true); 