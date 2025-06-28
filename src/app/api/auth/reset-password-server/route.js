import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function POST(request) {
  try {
    const body = await request.json()
    console.log('Server received body:', {
      password: body.password ? 'Present' : 'Missing',
      accessToken: body.accessToken ? 'Present' : 'Missing',
      refreshToken: body.refreshToken ? 'Present' : 'Missing'
    })
    
    const { password, accessToken, refreshToken } = body

    if (!password || !accessToken || !refreshToken) {
      console.log('Missing parameters:', {
        password: !password,
        accessToken: !accessToken,
        refreshToken: !refreshToken
      })
      return Response.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    console.log('All parameters present, proceeding with password update')

    // Create admin client with service role key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // First, verify the tokens by setting a session
    const { data: { session }, error: sessionError } = await supabaseAdmin.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    })

    if (sessionError || !session) {
      console.error('Session verification failed:', sessionError)
      return Response.json(
        { error: 'Invalid or expired reset link' },
        { status: 400 }
      )
    }

    console.log('Session verified, updating password for user:', session.user.email)

    // Update the user's password using the admin client
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      session.user.id,
      { password: password }
    )

    if (updateError) {
      console.error('Password update failed:', updateError)
      return Response.json(
        { error: updateError.message },
        { status: 400 }
      )
    }

    console.log('Password updated successfully')

    return Response.json({ 
      success: true, 
      message: 'Password updated successfully' 
    })

  } catch (error) {
    console.error('Server error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 