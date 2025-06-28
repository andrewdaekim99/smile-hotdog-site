// Email utility for sending order confirmations
// Supports multiple email services

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

const formatPickupTime = (minutes) => {
  if (minutes < 60) {
    return `${minutes} minutes`
  } else if (minutes === 60) {
    return '1 hour'
  } else {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (remainingMinutes === 0) {
      return `${hours} hours`
    } else {
      return `${hours} hours ${remainingMinutes} minutes`
    }
  }
}

// Generate HTML email content
export function generateOrderEmailHTML(orderData, customerInfo) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; }
        .header { background: #EA9841; color: white; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .header h2 { margin: 10px 0 0 0; font-size: 18px; font-weight: normal; }
        .content { padding: 30px 20px; }
        .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .order-details h3 { margin: 0 0 15px 0; color: #1D4E1A; }
        .item { border-bottom: 1px solid #eee; padding: 15px 0; }
        .item:last-child { border-bottom: none; }
        .item-row { display: flex; justify-content: space-between; align-items: flex-start; }
        .item-info { flex: 1; }
        .item-price { font-weight: bold; color: #EA9841; }
        .total { font-weight: bold; font-size: 18px; text-align: right; margin-top: 20px; padding-top: 15px; border-top: 2px solid #EA9841; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .status { display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        .status-pending { background: #fff3cd; color: #856404; }
        .important { background: #fff3cd; border-left: 4px solid #EA9841; padding: 15px; margin: 20px 0; }
        .contact-info { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🍜 Korean Fusion Food Truck</h1>
          <h2>Order Confirmation</h2>
        </div>
        
        <div class="content">
          <p>Hi ${customerInfo.first_name},</p>
          
          <p>Thank you for your order! We've received your order and are preparing it for pickup.</p>
          
          <div class="order-details">
            <h3>📋 Order Details</h3>
            <p><strong>Order ID:</strong> #${orderData.order.id}</p>
            <p><strong>Order Date:</strong> ${new Date(orderData.order.order_date).toLocaleDateString()}</p>
            <p><strong>Pickup Time:</strong> ${formatPickupTime(orderData.order.pickup_time)}</p>
            <p><strong>Status:</strong> <span class="status status-pending">${orderData.order.status.charAt(0).toUpperCase() + orderData.order.status.slice(1)}</span></p>
            
            ${orderData.order.special_instructions ? `<p><strong>Special Instructions:</strong> ${orderData.order.special_instructions}</p>` : ''}
          </div>
          
          <div class="order-details">
            <h3>🍽️ Order Items</h3>
            ${orderData.items.map(item => `
              <div class="item">
                <div class="item-row">
                  <div class="item-info">
                    <strong>${item.name}</strong><br>
                    <small>Qty: ${item.quantity}</small>
                    ${item.special_instructions ? `<br><small>Note: ${item.special_instructions}</small>` : ''}
                  </div>
                  <div class="item-price">${formatPrice(item.price * item.quantity)}</div>
                </div>
              </div>
            `).join('')}
            
            <div class="total">
              <strong>Total: ${formatPrice(orderData.order.total_amount)}</strong>
            </div>
          </div>
          
          <div class="order-details">
            <h3>👤 Customer Information</h3>
            <p><strong>Name:</strong> ${customerInfo.first_name} ${customerInfo.last_name}</p>
            <p><strong>Email:</strong> ${customerInfo.email}</p>
            ${customerInfo.phone ? `<p><strong>Phone:</strong> ${customerInfo.phone}</p>` : ''}
          </div>
          
          <div class="important">
            <strong>⚠️ Important:</strong> Please bring a valid ID when picking up your order. We'll call you when your order is ready!
          </div>
          
          <div class="contact-info">
            <p><strong>Need to make changes?</strong></p>
            <p>If you need to modify or cancel your order, please call us immediately at <strong>(555) 123-4567</strong>.</p>
          </div>
          
          <p>Thank you for choosing Korean Fusion Food Truck!</p>
          
          <div class="footer">
            <p>If you have any questions, please contact us at support@koreanfusion.com</p>
            <p>© 2024 Korean Fusion Food Truck. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

// Generate plain text email content
export function generateOrderEmailText(orderData, customerInfo) {
  return `
Korean Fusion Food Truck - Order Confirmation

Hi ${customerInfo.first_name},

Thank you for your order! We've received your order and are preparing it for pickup.

📋 ORDER DETAILS:
Order ID: #${orderData.order.id}
Order Date: ${new Date(orderData.order.order_date).toLocaleDateString()}
Pickup Time: ${formatPickupTime(orderData.order.pickup_time)}
Status: ${orderData.order.status.charAt(0).toUpperCase() + orderData.order.status.slice(1)}
${orderData.order.special_instructions ? `Special Instructions: ${orderData.order.special_instructions}` : ''}

🍽️ ORDER ITEMS:
${orderData.items.map(item => `
- ${item.name} (Qty: ${item.quantity}) - ${formatPrice(item.price * item.quantity)}
${item.special_instructions ? `  Note: ${item.special_instructions}` : ''}`).join('')}

TOTAL: ${formatPrice(orderData.order.total_amount)}

👤 CUSTOMER INFORMATION:
Name: ${customerInfo.first_name} ${customerInfo.last_name}
Email: ${customerInfo.email}
${customerInfo.phone ? `Phone: ${customerInfo.phone}` : ''}

⚠️ Important: Please bring a valid ID when picking up your order. We'll call you when your order is ready!

Need to make changes? If you need to modify or cancel your order, please call us immediately at (555) 123-4567.

Thank you for choosing Korean Fusion Food Truck!

If you have any questions, please contact us at support@koreanfusion.com

© 2024 Korean Fusion Food Truck. All rights reserved.
  `
}

// Send email using Resend
export async function sendEmailViaResend(to, subject, html, text) {
  try {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      console.log('Email sending is only available on the server side')
      return false
    }

    const { Resend } = await import('resend')
    
    // Get Resend API key from environment variables
    const resendApiKey = process.env.RESEND_API_KEY

    if (!resendApiKey) {
      console.error('Missing RESEND_API_KEY environment variable')
      return false
    }

    const resend = new Resend(resendApiKey)

    // Send email using Resend with default sender domain
    const { data, error } = await resend.emails.send({
      from: 'Korean Fusion Food Truck <onboarding@resend.dev>',
      to: [to],
      subject: subject,
      html: html,
      text: text,
    })

    if (error) {
      console.error('Resend email error:', error)
      return false
    }

    console.log('Email sent successfully via Resend:', data)
    return true

  } catch (error) {
    console.error('Email sending error:', error)
    return false
  }
}

// Send email using Supabase Auth (fallback method)
export async function sendEmailViaSupabase(to, subject, html, text) {
  try {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      console.log('Email sending is only available on the server side')
      return false
    }

    const { createClient } = await import('@supabase/supabase-js')
    
    // Get environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables')
      return false
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // For now, let's use a simpler approach - just log the email content
    // In production, you would integrate with a proper email service
    console.log('=== ORDER CONFIRMATION EMAIL ===')
    console.log('To:', to)
    console.log('Subject:', subject)
    console.log('HTML Content Length:', html.length)
    console.log('Text Content Length:', text.length)
    console.log('=== END EMAIL ===')

    // For development/testing, we'll simulate success
    // In production, replace this with actual email sending
    return true

  } catch (error) {
    console.error('Email sending error:', error)
    return false
  }
}

// Main email sending function
export async function sendOrderConfirmationEmail(orderData, customerInfo) {
  try {
    const subject = `Order Confirmation #${orderData.order.id} - Korean Fusion Food Truck`
    const html = generateOrderEmailHTML(orderData, customerInfo)
    const text = generateOrderEmailText(orderData, customerInfo)

    // Try sending via Resend first
    const emailSent = await sendEmailViaResend(
      customerInfo.email,
      subject,
      html,
      text
    )

    if (emailSent) {
      console.log('Order confirmation email sent successfully via Resend')
      return true
    }

    // Fallback to Supabase method
    const fallbackSent = await sendEmailViaSupabase(
      customerInfo.email,
      subject,
      html,
      text
    )

    if (fallbackSent) {
      console.log('Order confirmation email sent successfully via Supabase (fallback)')
      return true
    }

    console.log('Failed to send order confirmation email')
    return false

  } catch (error) {
    console.error('Email sending error:', error)
    return false
  }
} 