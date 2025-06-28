import { NextResponse } from 'next/server'
import { authAPI } from '@/lib/database'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await authAPI.signIn(email, password)

    if (authError) {
      console.error('Auth error:', authError)
      
      // Check for specific error types
      if (authError.message.includes('Email not confirmed')) {
        return NextResponse.json(
          { error: 'Please check your email and click the verification link before signing in.' },
          { status: 401 }
        )
      } else if (authError.message.includes('Invalid login credentials')) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        )
      } else {
        return NextResponse.json(
          { error: authError.message },
          { status: 401 }
        )
      }
    }

    // Get customer profile using admin client to bypass RLS
    // Use the user ID from the authenticated session
    const { data: customer, error: customerError } = await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (customerError) {
      console.error('Customer fetch error:', customerError)
      
      // If customer profile doesn't exist, return a specific error
      if (customerError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Customer profile not found. Please contact support.' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch customer profile' },
        { status: 500 }
      )
    }

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer profile not found. Please contact support.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Signed in successfully',
      customer: {
        id: customer.id,
        email: customer.email,
        first_name: customer.first_name,
        last_name: customer.last_name,
        phone: customer.phone,
        points: customer.points || 0,
        total_spent: customer.total_spent || 0
      },
      session: authData.session
    })

  } catch (error) {
    console.error('Signin error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 