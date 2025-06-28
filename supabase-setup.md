# Supabase Setup for Food Truck Website

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Database Schema

### 1. Customers Table

```sql
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
```

### 2. Orders Table

```sql
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
```

### 3. Order Items Table

```sql
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Products Table (for future use)

```sql
CREATE TABLE products (
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
```

### 5. Categories Table (for future use)

```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Row Level Security (RLS) Policies

### Customers Table Policies

```sql
-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

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
```

### Orders Table Policies

```sql
-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

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
```

### Order Items Table Policies

```sql
-- Enable RLS
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

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
```

## Database Functions

### Points Increment Function

```sql
CREATE OR REPLACE FUNCTION increment_points(points_to_add INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN COALESCE(points, 0) + points_to_add;
END;
$$;
```

## Authentication Setup

### 1. Email Confirmation

For development, you may want to disable email confirmation:

- Go to Authentication > Settings in your Supabase dashboard
- Set "Enable email confirmations" to OFF

### 2. Password Reset

Configure password reset settings:

- Go to Authentication > Settings in your Supabase dashboard
- Set "Enable password reset" to ON
- Configure redirect URLs if needed

## Email Templates (Optional)

Customize email templates in Authentication > Email Templates:

- Confirm signup
- Reset password
- Magic link

## Testing the Setup

### 1. Test Database Connection

Visit `/test-connection` to verify the database connection.

### 2. Test Environment Variables

Visit `/api/test-env` to verify all environment variables are properly set.

### 3. Test Authentication

- Try signing up a new user
- Try signing in with the created user
- Test password reset functionality

## Troubleshooting

### Common Issues:

1. **RLS Policy Errors**: Make sure all policies are properly configured
2. **Service Role Key**: Ensure the service role key has the correct permissions
3. **Email Delivery**: Check spam folders and email settings
4. **CORS Issues**: Configure allowed origins in Supabase dashboard

### Useful Queries:

```sql
-- Check all customers
SELECT * FROM customers;

-- Check all orders
SELECT * FROM orders;

-- Check order items
SELECT * FROM order_items;

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public';
```
