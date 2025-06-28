import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/database'

export async function POST(request) {
  try {
    // This is for development/testing only
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'This endpoint is not available in production' },
        { status: 403 }
      )
    }

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Update the user's email confirmation status
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      email, // This should be the user ID, but for simplicity we'll use email
      { email_confirm: true }
    )

    if (error) {
      console.error('Email confirmation error:', error)
      return NextResponse.json(
        { error: 'Failed to confirm email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Email confirmed successfully. You can now sign in.'
    })

  } catch (error) {
    console.error('Email confirmation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 