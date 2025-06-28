# Email System Setup Guide

This guide will help you set up actual email sending for your food truck website.

## Quick Setup (Recommended)

### 1. Sign up for Resend (Free)

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address
4. Go to the API Keys section in your dashboard
5. Create a new API key

### 2. Configure Environment Variables

Add your Resend API key to your `.env.local` file:

```bash
# Email Configuration (Resend)
RESEND_API_KEY=re_your_actual_api_key_here
```

### 3. Restart Your Development Server

```bash
npm run dev
```

### 4. Test the Email System

1. Go to `/test-order-email` in your browser
2. Enter your email address
3. Click "Send Test Email"
4. Check your inbox (including spam folder)

## Sender Domain Configuration

### Development (Default)

The system uses Resend's default sender domain `onboarding@resend.dev` for development. This works immediately without any domain verification.

### Production (Custom Domain)

For production, you can use your own domain:

1. **Add your domain** in Resend dashboard at https://resend.com/domains
2. **Verify your domain** by adding the required DNS records
3. **Update the sender email** in `src/lib/email.js`:
   ```javascript
   from: "Korean Fusion Food Truck <orders@yourdomain.com>";
   ```

### Current Configuration

- **Development**: `onboarding@resend.dev` (works immediately)
- **Production**: Update to your verified domain

## Email Service Options

### Resend (Recommended)

- **Free tier**: 3,000 emails/month
- **Pros**: Easy setup, great deliverability, modern API
- **Cons**: None for small projects

### Alternative Options

#### SendGrid

- Free tier: 100 emails/day
- More complex setup but very reliable

#### AWS SES

- Very cheap ($0.10 per 1,000 emails)
- More complex setup, requires AWS account

#### Supabase Email (Limited)

- Built into Supabase
- Limited customization
- Requires SMTP configuration

## Email Templates

The system includes professional HTML and plain text email templates with:

- Korean Fusion Food Truck branding
- Order details and items
- Customer information
- Pickup instructions
- Contact information
- Responsive design

## Testing

### Test Page

Visit `/test-order-email` to test the email system with mock data.

### Real Orders

When customers place orders, confirmation emails are automatically sent to:

- Logged-in customers (using their account email)
- Guest customers (using the email provided during checkout)

## Troubleshooting

### "Domain not verified" Error

- **Development**: Use `onboarding@resend.dev` (already configured)
- **Production**: Verify your domain in Resend dashboard
- **Alternative**: Use your verified email address as sender

### "Missing RESEND_API_KEY" Error

- Make sure you've added the API key to `.env.local`
- Restart your development server
- Check that the key is correct (starts with `re_`)

### Emails Not Received

1. Check your spam folder
2. Verify the email address is correct
3. Check the server console for error messages
4. Ensure your Resend account is verified

### Development vs Production

- **Development**: Uses Resend's default domain for immediate testing
- **Production**: Use your verified custom domain for branding

## Email Content

The system sends order confirmation emails with:

- Order ID and date
- Pickup time estimate
- Complete item list with prices
- Customer details
- Special instructions
- Contact information for changes

## Customization

To customize email templates, edit:

- `src/lib/email.js` - Email generation functions
- HTML and text templates in the same file
- Styling and branding

### Customizing Sender Information

Update the `from` field in `src/lib/email.js`:

```javascript
// For development (default)
from: "Korean Fusion Food Truck <onboarding@resend.dev>";

// For production (your domain)
from: "Korean Fusion Food Truck <orders@yourdomain.com>";
```

## Security Notes

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Resend API keys start with `re_` and should be kept secret
- The email system only runs on the server side for security

## Production Deployment

When deploying to production:

1. Add `RESEND_API_KEY` to your hosting platform's environment variables
2. Verify your domain in Resend dashboard
3. Update the `from` email address in `src/lib/email.js` to use your verified domain
4. Test the email system in production
5. Monitor email delivery rates

## Support

If you encounter issues:

1. Check the server console for error messages
2. Verify your Resend account and API key
3. Test with the `/test-order-email` page
4. Check Resend's documentation for troubleshooting
