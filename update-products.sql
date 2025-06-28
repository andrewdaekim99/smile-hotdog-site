-- Update products table to include all menu items
-- Run this in your Supabase SQL Editor

-- First, clear existing products and order items to avoid conflicts
DELETE FROM order_items;
DELETE FROM products;

-- Reset the sequence to start from 1
ALTER SEQUENCE products_id_seq RESTART WITH 1;

-- Insert all 12 products that match the frontend menu
INSERT INTO products (name, description, price, category_id, available, spice_level, prep_time) VALUES
  ('Classic Ramen', 'Traditional Korean ramen with rich, savory broth made from pork bones and vegetables. Served with tender chashu pork, soft-boiled egg, green onions, and nori.', 12.99, 1, true, 'Mild', '15 minutes'),
  ('Spicy Kimchi Ramen', 'Spicy ramen featuring our house-made kimchi in a fiery broth. Topped with kimchi, pork belly, bean sprouts, and a perfectly soft-boiled egg.', 14.99, 1, true, 'Hot', '18 minutes'),
  ('Seafood Ramen', 'Light and refreshing seafood ramen with shrimp, mussels, and fish in a delicate seafood broth. Perfect for seafood lovers.', 16.99, 1, true, 'Mild', '20 minutes'),
  ('Korean BBQ Bowl', 'Grilled marinated beef served over steamed rice with fresh vegetables, kimchi, and our signature BBQ sauce. A complete meal in a bowl.', 16.99, 2, true, 'Mild', '12 minutes'),
  ('Bibimbap', 'Traditional Korean mixed rice bowl with colorful vegetables, marinated beef, and a perfectly fried egg. Served with gochujang sauce.', 15.99, 2, true, 'Medium', '15 minutes'),
  ('Bulgogi Bowl', 'Sweet and savory marinated beef bulgogi served over rice with caramelized onions and fresh vegetables.', 17.99, 2, true, 'Mild', '14 minutes'),
  ('Korean Fried Chicken', 'Crispy double-fried chicken glazed with our signature sweet and spicy sauce. Served with pickled radish.', 13.99, 3, true, 'Medium', '20 minutes'),
  ('Kimchi Fries', 'Loaded fries topped with melted cheese, kimchi, green onions, and our special sauce. A fusion favorite.', 8.99, 3, true, 'Medium', '10 minutes'),
  ('Mandu (Dumplings)', 'Steamed or fried dumplings filled with pork, vegetables, and aromatic spices. Served with dipping sauce.', 9.99, 3, true, 'Mild', '8 minutes'),
  ('Korean Rice Tea', 'Traditional nurungji tea made from roasted rice. Warm and comforting with a nutty flavor.', 3.99, 4, true, 'None', '5 minutes'),
  ('Citron Tea', 'Refreshing Korean citron tea with honey. Perfect for digestion and a boost of vitamin C.', 4.99, 4, true, 'None', '5 minutes'),
  ('Korean Milk Tea', 'Creamy milk tea with a hint of Korean flavors. Served hot or iced.', 5.99, 4, true, 'None', '7 minutes');

-- Verify the products were created
SELECT 'Products updated successfully!' as status;
SELECT id, name, price, category_id FROM products ORDER BY id; 