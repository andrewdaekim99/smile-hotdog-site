import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request) {
  try {
    // Check if this is a development environment
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'This endpoint is not available in production' },
        { status: 403 }
      )
    }

    const { email, firstName, lastName, phone } = await request.json()

    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Email, firstName, and lastName are required' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Get user by email from Supabase Auth
    const { data: users, error: fetchError } = await supabase.auth.admin.listUsers()
    
    if (fetchError) {
      console.error('Error fetching users:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      )
    }

    // Find user with matching email
    const user = users.users.find(u => u.email === email)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Auth user not found' },
        { status: 404 }
      )
    }

    // Check if customer already exists
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('*')
      .eq('email', email)
      .single()

    if (existingCustomer) {
      return NextResponse.json(
        { error: 'Customer profile already exists' },
        { status: 409 }
      )
    }

    // Create customer profile
    const customerData = {
      id: user.id, // Use the auth user's ID
      email: user.email,
      password_hash: 'managed_by_supabase_auth',
      first_name: firstName,
      last_name: lastName,
      phone: phone || null,
      auth_user_id: user.id,
      is_guest: false,
      points: 0,
      total_spent: 0.00
    }

    const { data: customer, error: createError } = await supabase
      .from('customers')
      .insert([customerData])
      .select()
      .single()

    if (createError) {
      console.error('Error creating customer:', createError)
      return NextResponse.json(
        { error: `Failed to create customer profile: ${createError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: `Customer profile created successfully for ${email}`,
      customer: {
        id: customer.id,
        email: customer.email,
        first_name: customer.first_name,
        last_name: customer.last_name
      }
    })

  } catch (error) {
    console.error('Create customer error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 