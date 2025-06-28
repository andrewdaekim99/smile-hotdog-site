import { NextResponse } from 'next/server'
import { sendOrderConfirmationEmail } from '@/lib/email'

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if Resend is configured
    const resendConfigured = !!process.env.RESEND_API_KEY
    const supabaseConfigured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)

    // Mock order data for testing
    const mockOrderData = {
      order: {
        id: 'test-order-123',
        order_date: new Date().toISOString(),
        pickup_time: 30,
        status: 'pending',
        total_amount: 25.99,
        special_instructions: 'Extra spicy please!'
      },
      items: [
        {
          name: 'Spicy Kimchi Ramen',
          quantity: 1,
          price: 14.99,
          special_instructions: 'Extra spicy'
        },
        {
          name: 'Korean Fried Chicken',
          quantity: 1,
          price: 11.00,
          special_instructions: null
        }
      ]
    }

    const mockCustomerInfo = {
      first_name: 'Test',
      last_name: 'Customer',
      email: email,
      phone: '(555) 123-4567'
    }

    console.log('Testing order confirmation email for:', email)
    console.log('Email services configured:')
    console.log('- Resend:', resendConfigured ? 'Yes' : 'No')
    console.log('- Supabase:', supabaseConfigured ? 'Yes' : 'No')
    
    const emailSent = await sendOrderConfirmationEmail(mockOrderData, mockCustomerInfo)

    if (emailSent) {
      let message = 'Test order confirmation email processed successfully!'
      
      if (resendConfigured) {
        message += ' Email sent via Resend - check your inbox (including spam folder).'
      } else if (supabaseConfigured) {
        message += ' Email content logged to console (Resend not configured).'
      } else {
        message += ' Email content logged to console (no email service configured).'
      }
      
      return NextResponse.json({
        success: true,
        message: message,
        services: {
          resend: resendConfigured,
          supabase: supabaseConfigured
        }
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to process test email. Check the server logs for details.',
        services: {
          resend: resendConfigured,
          supabase: supabaseConfigured
        }
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Test order email error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 