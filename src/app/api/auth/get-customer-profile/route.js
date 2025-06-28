import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get customer profile using admin client to bypass RLS
    const { data: customer, error } = await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Customer fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch customer profile' },
        { status: 500 }
      )
    }

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        email: customer.email,
        first_name: customer.first_name,
        last_name: customer.last_name,
        phone: customer.phone,
        points: customer.points || 0,
        total_spent: customer.total_spent || 0
      }
    })

  } catch (error) {
    console.error('Get customer profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 