import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Test basic auth functionality
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      return Response.json({
        status: 'Auth test failed',
        error: error.message,
        code: error.status
      })
    }
    
    return Response.json({
      status: 'Auth test successful',
      hasSession: !!data.session,
      user: data.session?.user?.email || 'No user'
    })
  } catch (error) {
    return Response.json({
      status: 'Auth test exception',
      error: error.message
    })
  }
} 