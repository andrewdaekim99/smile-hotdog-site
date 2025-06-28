-- Food Truck Database Schema for Supabase

-- Create custom types
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- Customers table
CREATE TABLE customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    birthday DATE,
    points INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product categories
CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(8,2) NOT NULL,
    image_url VARCHAR(500),
    spice_level VARCHAR(20),
    prep_time VARCHAR(50),
    is_available BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status order_status DEFAULT 'pending',
    payment_status payment_status DEFAULT 'pending',
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    points_earned INTEGER DEFAULT 0,
    points_used INTEGER DEFAULT 0,
    special_instructions TEXT,
    pickup_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(200) NOT NULL,
    product_price DECIMAL(8,2) NOT NULL,
    quantity INTEGER NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(200) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    event_type VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    location TEXT NOT NULL,
    expected_guests INTEGER NOT NULL,
    status booking_status DEFAULT 'pending',
    special_requirements TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rewards transactions table
CREATE TABLE rewards_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    points_change INTEGER NOT NULL,
    transaction_type VARCHAR(50) NOT NULL, -- 'earned', 'redeemed', 'bonus', 'expired'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_available ON products(is_available);
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_date ON bookings(event_date);
CREATE INDEX idx_rewards_customer_id ON rewards_transactions(customer_id);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customers
CREATE POLICY "Customers can view own profile" ON customers
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Customers can update own profile" ON customers
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Allow customer creation during signup (no auth required)
CREATE POLICY "Allow customer creation" ON customers
    FOR INSERT WITH CHECK (true);

-- RLS Policies for orders
CREATE POLICY "Customers can view own orders" ON orders
    FOR SELECT USING (auth.uid()::text = customer_id::text);

CREATE POLICY "Customers can create orders" ON orders
    FOR INSERT WITH CHECK (auth.uid()::text = customer_id::text);

-- RLS Policies for order_items
CREATE POLICY "Customers can view own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.customer_id::text = auth.uid()::text
        )
    );

-- RLS Policies for bookings
CREATE POLICY "Customers can view own bookings" ON bookings
    FOR SELECT USING (auth.uid()::text = customer_id::text);

CREATE POLICY "Customers can create bookings" ON bookings
    FOR INSERT WITH CHECK (auth.uid()::text = customer_id::text);

-- RLS Policies for rewards_transactions
CREATE POLICY "Customers can view own rewards" ON rewards_transactions
    FOR SELECT USING (auth.uid()::text = customer_id::text);

-- Public read access for products and categories
CREATE POLICY "Anyone can view products" ON products
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view categories" ON categories
    FOR SELECT USING (true);

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number := 'KF-' || EXTRACT(YEAR FROM NOW()) || '-' || 
                       LPAD(EXTRACT(DOY FROM NOW())::text, 3, '0') || '-' ||
                       LPAD((SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM '[0-9]+$') AS INTEGER)), 0) + 1 
                             FROM orders 
                             WHERE order_number LIKE 'KF-' || EXTRACT(YEAR FROM NOW()) || '-' || 
                                   LPAD(EXTRACT(DOY FROM NOW())::text, 3, '0') || '-%')::text, 4, '0');
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for order number generation
CREATE TRIGGER generate_order_number_trigger BEFORE INSERT ON orders
    FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Function to update customer points
CREATE OR REPLACE FUNCTION update_customer_points()
RETURNS TRIGGER AS $$
BEGIN
    -- Update customer points when rewards transaction is inserted
    UPDATE customers 
    SET points = points + NEW.points_change,
        total_spent = CASE 
            WHEN NEW.transaction_type = 'earned' THEN total_spent + (NEW.points_change * 1.0)
            ELSE total_spent
        END
    WHERE id = NEW.customer_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for customer points update
CREATE TRIGGER update_customer_points_trigger AFTER INSERT ON rewards_transactions
    FOR EACH ROW EXECUTE FUNCTION update_customer_points();

-- Insert sample data
INSERT INTO categories (name, description, icon, sort_order) VALUES
('Corndogs', 'Our signature Korean fusion corndogs', '🌭', 1),
('Sides', 'Delicious sides and appetizers', '🍟', 2),
('Drinks', 'Refreshing beverages', '🥤', 3),
('Desserts', 'Sweet treats to end your meal', '🍰', 4);

INSERT INTO products (category_id, name, description, price, spice_level, prep_time) VALUES
((SELECT id FROM categories WHERE name = 'Corndogs'), 'Classic Corndog', 'Traditional corndog with our special batter', 8.99, 'Mild', '5-7 min'),
((SELECT id FROM categories WHERE name = 'Corndogs'), 'Spicy Kimchi Corndog', 'Corndog with spicy kimchi filling', 10.99, 'Hot', '5-7 min'),
((SELECT id FROM categories WHERE name = 'Corndogs'), 'Bulgogi Corndog', 'Corndog filled with marinated beef bulgogi', 12.99, 'Mild', '5-7 min'),
((SELECT id FROM categories WHERE name = 'Sides'), 'Kimchi Fries', 'Crispy fries topped with kimchi and special sauce', 6.99, 'Medium', '3-5 min'),
((SELECT id FROM categories WHERE name = 'Sides'), 'Korean Slaw', 'Fresh cabbage slaw with Korean dressing', 4.99, 'Mild', '2-3 min'),
((SELECT id FROM categories WHERE name = 'Drinks'), 'Korean Lemonade', 'Refreshing lemonade with Korean citrus', 3.99, 'Mild', '1-2 min'),
((SELECT id FROM categories WHERE name = 'Drinks'), 'Green Tea', 'Traditional Korean green tea', 2.99, 'Mild', '1-2 min'),
((SELECT id FROM categories WHERE name = 'Desserts'), 'Mochi Ice Cream', 'Sweet rice dough with ice cream filling', 5.99, 'Mild', '1-2 min'); 