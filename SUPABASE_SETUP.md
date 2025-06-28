# Supabase Setup Guide for Food Truck Website

This guide will help you set up Supabase to handle online customer orders, food truck booking requests, products for sale, customer account info, and rewards program.

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `food-truck-website`
   - Database Password: Create a strong password
   - Region: Choose closest to your customers
5. Click "Create new project"

## 2. Get Project Credentials

1. In your Supabase dashboard, go to Settings → API
2. Copy the following values:
   - Project URL
   - Anon (public) key
   - **Service Role Key** (important for customer creation)

## 3. Set Environment Variables

Create a `.env.local` file in your project root and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Important:** The service role key is required for customer creation during signup as it bypasses Row Level Security (RLS) policies.

## 4. Set Up Database Schema

1. In your Supabase dashboard, go to SQL Editor
2. Copy the entire contents of `supabase-schema.sql`
3. Paste it into the SQL Editor and click "Run"
4. This will create all necessary tables, indexes, and sample data

**Note:** If you see any permission errors related to `app.jwt_secret`, you can safely ignore them - this parameter is automatically managed by Supabase and doesn't need to be set manually.

## 5. Fix RLS Policies (if needed)

If you're still getting RLS errors after setup, run the `fix-rls-policies.sql` script in your Supabase SQL Editor:

1. Go to SQL Editor in your Supabase dashboard
2. Copy the contents of `fix-rls-policies.sql`
3. Paste and run it

## 6. Configure Authentication

1. Go to Authentication → Settings
2. Configure your site URL (e.g., `http://localhost:3000` for development)
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/dashboard`
   - `http://localhost:3000/orders`
   - `http://localhost:3000/reset-password` (for password reset)

## 7. Configure Email Templates (Optional)

1. Go to Authentication → Email Templates
2. Customize the "Password Reset" email template:
   - Subject: "Reset your Korean Fusion password"
   - Content: You can customize the email content to match your brand
3. Test the email template by sending a test email

## 8. Set Up Row Level Security (RLS)

The schema already includes RLS policies, but verify they're working:

1. Go to Authentication → Policies
2. Ensure all tables have the correct policies applied
3. Test with a sample user account

## 9. Test the Setup

1. Start your development server: `npm run dev`
2. Test the signup/signin functionality
3. Test the forgot password functionality
4. Verify database connections work

## Database Schema Overview

### Tables Created:

1. **customers** - Customer account information and rewards
2. **categories** - Product categories (Corndogs, Sides, etc.)
3. **products** - Menu items with pricing and details
4. **orders** - Customer orders with status tracking
5. **order_items** - Individual items in each order
6. **bookings** - Food truck booking requests
7. **rewards_transactions** - Points earned/spent tracking

### Key Features:

- **Automatic Order Numbers**: Orders get unique numbers like "KF-2024-001-0001"
- **Points System**: 1 point per $1 spent, automatic calculation
- **Status Tracking**: Orders and bookings have status workflows
- **Security**: Row Level Security ensures customers only see their own data
- **Audit Trail**: All transactions are timestamped and tracked
- **Password Reset**: Secure password reset via email

## API Endpoints Available

### Authentication

- `POST /api/auth/signup` - Create new customer account
- `POST /api/auth/signin` - Customer login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Update password with reset token

### Orders

- `POST /api/orders` - Create new order
- `GET /api/orders?customerId=xxx` - Get customer orders

### Bookings

- `POST /api/bookings` - Submit booking request
- `GET /api/bookings?customerId=xxx` - Get customer bookings

### Products

- `GET /api/products` - Get all products
- `GET /api/products?categoryId=xxx` - Get products by category
- `GET /api/categories` - Get all categories

## Sample Data Included

The schema includes sample menu items:

- Classic Corndog ($8.99)
- Spicy Kimchi Corndog ($10.99)
- Bulgogi Corndog ($12.99)
- Kimchi Fries ($6.99)
- Korean Slaw ($4.99)
- Korean Lemonade ($3.99)
- Green Tea ($2.99)
- Mochi Ice Cream ($5.99)

## Next Steps

1. **Customize Products**: Update the sample products with your actual menu
2. **Add Images**: Upload product images and update image_url fields
3. **Configure Payment**: Integrate with Stripe or other payment processor
4. **Set Up Notifications**: Configure email/SMS notifications for orders
5. **Add Admin Panel**: Create admin interface for managing orders and bookings
6. **Test Password Reset**: Ensure the forgot password flow works correctly

## Troubleshooting

### Common Issues:

1. **Environment Variables**: Ensure `.env.local` is in project root and variables are correct
2. **CORS Errors**: Check Supabase project settings for allowed origins
3. **RLS Policies**: Verify policies are applied correctly in Supabase dashboard
4. **Database Connection**: Test connection in Supabase SQL Editor
5. **Permission Errors**: If you see `app.jwt_secret` errors, ignore them - this is managed automatically by Supabase
6. **Customer Creation Errors**: Make sure you have the service role key in your environment variables
7. **Password Reset Issues**: Check that redirect URLs are configured correctly in Supabase Auth settings

### Support:

- Supabase Documentation: [docs.supabase.com](https://docs.supabase.com)
- Supabase Discord: [discord.gg/supabase](https://discord.gg/supabase)
- GitHub Issues: Create issue in your project repository
