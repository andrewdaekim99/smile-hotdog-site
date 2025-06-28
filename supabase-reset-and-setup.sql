-- Complete Supabase Reset and Setup
-- WARNING: This will DELETE ALL DATA in your tables!
-- Run this script to completely reset your database and start fresh

-- =====================================================
-- 1. DROP ALL EXISTING TABLES (DESTROYS ALL DATA!)
-- =====================================================

-- Disable RLS temporarily to allow dropping
ALTER TABLE IF EXISTS customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS products DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS categories DISABLE ROW LEVEL SECURITY;

-- Drop tables in correct order (respecting foreign key constraints)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- Drop any functions we created
DROP FUNCTION IF EXISTS increment_points(INTEGER);

-- =====================================================
-- 2. CREATE FRESH TABLES
-- =====================================================

-- Create customers table
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  points INTEGER DEFAULT 0,
  is_guest BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  image_url TEXT,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  pickup_time INTEGER NOT NULL, -- minutes from order time
  special_instructions TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. CREATE FUNCTIONS
-- =====================================================

-- Create points increment function
CREATE OR REPLACE FUNCTION increment_points(points_to_add INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN COALESCE(points, 0) + points_to_add;
END;
$$;

-- =====================================================
-- 4. ENABLE RLS AND CREATE POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. CUSTOMERS TABLE POLICIES
-- =====================================================

-- Allow users to read their own profile
CREATE POLICY "Users can view own profile" ON customers
  FOR SELECT USING (auth.uid() = auth_user_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON customers
  FOR UPDATE USING (auth.uid() = auth_user_id);

-- Allow insertion for new users (used during signup)
CREATE POLICY "Allow customer creation" ON customers
  FOR INSERT WITH CHECK (true);

-- Allow service role to read all customers
CREATE POLICY "Service role can read all customers" ON customers
  FOR SELECT USING (auth.role() = 'service_role');

-- Allow service role to update all customers
CREATE POLICY "Service role can update all customers" ON customers
  FOR UPDATE USING (auth.role() = 'service_role');

-- =====================================================
-- 6. ORDERS TABLE POLICIES
-- =====================================================

-- Allow customers to view their own orders
CREATE POLICY "Customers can view own orders" ON orders
  FOR SELECT USING (
    customer_id IN (
      SELECT id FROM customers WHERE auth_user_id = auth.uid()
    )
  );

-- Allow customers to create orders
CREATE POLICY "Customers can create orders" ON orders
  FOR INSERT WITH CHECK (
    customer_id IN (
      SELECT id FROM customers WHERE auth_user_id = auth.uid()
    )
  );

-- Allow service role full access
CREATE POLICY "Service role full access to orders" ON orders
  FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 7. ORDER ITEMS TABLE POLICIES
-- =====================================================

-- Allow customers to view their own order items
CREATE POLICY "Customers can view own order items" ON order_items
  FOR SELECT USING (
    order_id IN (
      SELECT o.id FROM orders o
      JOIN customers c ON o.customer_id = c.id
      WHERE c.auth_user_id = auth.uid()
    )
  );

-- Allow service role full access
CREATE POLICY "Service role full access to order items" ON order_items
  FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 8. PRODUCTS AND CATEGORIES POLICIES
-- =====================================================

-- Allow public read access to products and categories
CREATE POLICY "Public read access to products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Public read access to categories" ON categories
  FOR SELECT USING (true);

-- Allow service role full access
CREATE POLICY "Service role full access to products" ON products
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to categories" ON categories
  FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 9. CREATE INDEXES FOR BETTER PERFORMANCE
-- =====================================================

CREATE INDEX idx_customers_auth_user_id ON customers(auth_user_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_date ON orders(order_date);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_available ON products(available);

-- =====================================================
-- 10. INSERT SAMPLE DATA
-- =====================================================

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
  ('Ramen', 'Authentic Korean ramen with rich broths and fresh ingredients'),
  ('Rice Bowls', 'Hearty rice bowls featuring Korean BBQ and traditional flavors'),
  ('Sides & Appetizers', 'Perfect accompaniments and starters to complement your meal'),
  ('Beverages', 'Refreshing drinks to complement your Korean fusion experience');

-- Insert sample products
INSERT INTO products (name, description, price, category_id, available) VALUES
  ('Classic Ramen', 'Traditional Korean ramen with rich, savory broth made from pork bones and vegetables. Served with tender chashu pork, soft-boiled egg, green onions, and nori.', 12.99, 1, true),
  ('Spicy Kimchi Ramen', 'Spicy ramen featuring our house-made kimchi in a fiery broth. Topped with kimchi, pork belly, bean sprouts, and a perfectly soft-boiled egg.', 14.99, 1, true),
  ('Korean BBQ Bowl', 'Grilled marinated beef served over steamed rice with fresh vegetables, kimchi, and our signature BBQ sauce. A complete meal in a bowl.', 16.99, 2, true),
  ('Bibimbap', 'Traditional Korean mixed rice bowl with colorful vegetables, marinated beef, and a perfectly fried egg. Served with gochujang sauce.', 15.99, 2, true),
  ('Korean Fried Chicken', 'Crispy double-fried chicken glazed with our signature sweet and spicy sauce. Served with pickled radish.', 13.99, 3, true),
  ('Kimchi Fries', 'Loaded fries topped with melted cheese, kimchi, green onions, and our special sauce. A fusion favorite.', 8.99, 3, true),
  ('Korean Rice Tea', 'Traditional nurungji tea made from roasted rice. Warm and comforting with a nutty flavor.', 3.99, 4, true);

-- =====================================================
-- 11. VERIFICATION
-- =====================================================

-- Show all created tables
SELECT 'Tables Created:' as info;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('customers', 'orders', 'order_items', 'products', 'categories')
ORDER BY table_name;

-- Show all policies
SELECT 'Policies Created:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Show function
SELECT 'Function Created:' as info;
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'increment_points';

-- Show sample data
SELECT 'Sample Data:' as info;
SELECT 'Categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'Products' as table_name, COUNT(*) as count FROM products;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================

-- Your Supabase database has been completely reset and is now ready!
-- All previous data has been deleted and fresh tables have been created.
-- You can now test the cart and checkout functionality. 