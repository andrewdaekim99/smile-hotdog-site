export async function GET() {
  const envVars = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  }
  
  return Response.json({
    status: 'Environment Variables Check',
    url: envVars.url ? 'Set' : 'Missing',
    anonKey: envVars.anonKey ? 'Set' : 'Missing',
    serviceKey: envVars.serviceKey ? 'Set' : 'Missing',
    urlValue: envVars.url ? envVars.url.substring(0, 30) + '...' : null,
    anonKeyLength: envVars.anonKey ? envVars.anonKey.length : 0,
    serviceKeyLength: envVars.serviceKey ? envVars.serviceKey.length : 0
  })
} 