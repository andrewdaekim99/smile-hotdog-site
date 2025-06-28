import { NextResponse } from 'next/server'
import { authAPI, customerAPI } from '@/lib/database'

export async function POST(request) {
  try {
    const { email, password, firstName, lastName, phone } = await request.json()

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if customer already exists in our custom table
    const { data: existingCustomer } = await customerAPI.getCustomerByEmail(email)
    if (existingCustomer) {
      return NextResponse.json(
        { error: 'Customer with this email already exists' },
        { status: 409 }
      )
    }

    // Try to create Supabase Auth user
    const { data: authData, error: authError } = await authAPI.signUp(email, password, {
      first_name: firstName,
      last_name: lastName
    })

    if (authError) {
      console.error('Auth error:', authError)
      
      // Handle specific auth errors
      if (authError.message.includes('already registered') || authError.code === 'user_already_exists') {
        return NextResponse.json(
          { 
            error: 'An account with this email already exists. Please try signing in instead.',
            suggestion: 'signin'
          },
          { status: 409 }
        )
      }
      
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    // Create customer profile with the auth user's ID
    const customerData = {
      id: authData.user.id, // Use the auth user's ID
      email,
      password_hash: 'managed_by_supabase_auth',
      first_name: firstName,
      last_name: lastName,
      phone: phone || null
    }

    const { data: customer, error: customerError } = await customerAPI.createCustomer(customerData)
    
    if (customerError) {
      console.error('Customer creation error:', customerError)
      
      // If customer creation fails, we should clean up the auth user
      // For now, just return the error
      return NextResponse.json(
        { error: 'Failed to create customer profile. Please try again.' },
        { status: 500 }
      )
    }

    // Check if email confirmation is required
    if (authData.user && !authData.user.email_confirmed_at) {
      return NextResponse.json({
        message: 'Account created successfully! Please check your email and click the verification link before signing in.',
        requiresEmailVerification: true,
        customer: {
          id: customer.id,
          email: customer.email,
          first_name: customer.first_name,
          last_name: customer.last_name
        }
      })
    }

    return NextResponse.json({
      message: 'Account created successfully! You can now sign in.',
      customer: {
        id: customer.id,
        email: customer.email,
        first_name: customer.first_name,
        last_name: customer.last_name
      }
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 