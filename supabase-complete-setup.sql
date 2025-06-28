-- Complete Supabase Setup for Food Truck Website
-- Run this entire script in your Supabase SQL Editor

-- =====================================================
-- 1. CUSTOMERS TABLE
-- =====================================================

-- Create customers table if it doesn't exist
CREATE TABLE IF NOT EXISTS customers (
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

-- Add is_guest column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'is_guest') THEN
    ALTER TABLE customers ADD COLUMN is_guest BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- =====================================================
-- 2. ORDERS TABLE
-- =====================================================

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
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

-- =====================================================
-- 3. ORDER ITEMS TABLE
-- =====================================================

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. PRODUCTS TABLE (for future use)
-- =====================================================

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category_id INTEGER,
  image_url TEXT,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. CATEGORIES TABLE (for future use)
-- =====================================================

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. DATABASE FUNCTIONS
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
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own profile" ON customers;
DROP POLICY IF EXISTS "Users can update own profile" ON customers;
DROP POLICY IF EXISTS "Allow customer creation" ON customers;
DROP POLICY IF EXISTS "Service role can read all customers" ON customers;
DROP POLICY IF EXISTS "Service role can update all customers" ON customers;

DROP POLICY IF EXISTS "Customers can view own orders" ON orders;
DROP POLICY IF EXISTS "Customers can create orders" ON orders;
DROP POLICY IF EXISTS "Service role full access to orders" ON orders;

DROP POLICY IF EXISTS "Customers can view own order items" ON order_items;
DROP POLICY IF EXISTS "Service role full access to order items" ON order_items;

-- =====================================================
-- 8. CUSTOMERS TABLE POLICIES
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
-- 9. ORDERS TABLE POLICIES
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
-- 10. ORDER ITEMS TABLE POLICIES
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
-- 11. PRODUCTS AND CATEGORIES POLICIES
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
-- 12. INDEXES FOR BETTER PERFORMANCE
-- =====================================================

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_customers_auth_user_id ON customers(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(available);

-- =====================================================
-- 13. SAMPLE DATA (OPTIONAL)
-- =====================================================

-- Insert some sample categories
INSERT INTO categories (name, description) VALUES
  ('Ramen', 'Authentic Korean ramen with rich broths and fresh ingredients'),
  ('Rice Bowls', 'Hearty rice bowls featuring Korean BBQ and traditional flavors'),
  ('Sides & Appetizers', 'Perfect accompaniments and starters to complement your meal'),
  ('Beverages', 'Refreshing drinks to complement your Korean fusion experience')
ON CONFLICT (name) DO NOTHING;

-- Insert some sample products
INSERT INTO products (id, name, description, price, category_id, available) VALUES
  (1, 'Classic Ramen', 'Traditional Korean ramen with rich, savory broth made from pork bones and vegetables. Served with tender chashu pork, soft-boiled egg, green onions, and nori.', 12.99, 1, true),
  (2, 'Spicy Kimchi Ramen', 'Spicy ramen featuring our house-made kimchi in a fiery broth. Topped with kimchi, pork belly, bean sprouts, and a perfectly soft-boiled egg.', 14.99, 1, true),
  (3, 'Seafood Ramen', 'Light and refreshing seafood ramen with shrimp, mussels, and fish in a delicate seafood broth. Perfect for seafood lovers.', 16.99, 1, true),
  (4, 'Korean BBQ Bowl', 'Grilled marinated beef served over steamed rice with fresh vegetables, kimchi, and our signature BBQ sauce. A complete meal in a bowl.', 16.99, 2, true),
  (5, 'Bibimbap', 'Traditional Korean mixed rice bowl with colorful vegetables, marinated beef, and a perfectly fried egg. Served with gochujang sauce.', 15.99, 2, true),
  (6, 'Bulgogi Bowl', 'Sweet and savory marinated beef bulgogi served over rice with caramelized onions and fresh vegetables.', 17.99, 2, true),
  (7, 'Korean Fried Chicken', 'Crispy double-fried chicken glazed with our signature sweet and spicy sauce. Served with pickled radish.', 13.99, 3, true),
  (8, 'Kimchi Fries', 'Loaded fries topped with melted cheese, kimchi, green onions, and our special sauce. A fusion favorite.', 8.99, 3, true),
  (9, 'Mandu (Dumplings)', 'Steamed or fried dumplings filled with pork, vegetables, and aromatic spices. Served with dipping sauce.', 9.99, 3, true),
  (10, 'Korean Rice Tea', 'Traditional nurungji tea made from roasted rice. Warm and comforting with a nutty flavor.', 3.99, 4, true),
  (11, 'Citron Tea', 'Refreshing Korean citron tea with honey. Perfect for digestion and a boost of vitamin C.', 4.99, 4, true),
  (12, 'Korean Milk Tea', 'Creamy milk tea with a hint of Korean flavors. Served hot or iced.', 5.99, 4, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  category_id = EXCLUDED.category_id,
  available = EXCLUDED.available;

-- =====================================================
-- 14. VERIFICATION QUERIES
-- =====================================================

-- You can run these queries to verify the setup:

-- Check if tables were created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('customers', 'orders', 'order_items', 'products', 'categories')
ORDER BY table_name;

-- Check if policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check if function was created
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'increment_points';

-- Check sample data
SELECT 'Categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'Products' as table_name, COUNT(*) as count FROM products;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================

-- Your Supabase database is now ready for the food truck website!
-- You can now:
-- 1. Test the cart and checkout functionality
-- 2. Create orders as both guest and logged-in users
-- 3. View orders in your Supabase dashboard
-- 4. Track customer points and rewards 