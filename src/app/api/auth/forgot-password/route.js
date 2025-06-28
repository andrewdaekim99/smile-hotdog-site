import { NextResponse } from 'next/server'
import { supabase } from '@/lib/database'

export async function POST(request) {
  try {
    const { email } = await request.json()

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Send password reset email using Supabase Auth
    // Supabase will handle checking if the user exists internally
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password`
    })

    if (resetError) {
      console.error('Password reset error:', resetError)
      return NextResponse.json(
        { error: 'Failed to send password reset email. Please try again.' },
        { status: 500 }
      )
    }

    // Always return success message for security (don't reveal if email exists)
    return NextResponse.json({
      message: 'If an account with that email exists, a password reset link has been sent.'
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 