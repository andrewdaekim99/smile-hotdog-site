'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/database'

export default function TestConnection() {
  const [status, setStatus] = useState('Testing...')
  const [details, setDetails] = useState('')

  useEffect(() => {
    const testConnection = async () => {
      try {
        setStatus('Testing Supabase connection...')
        
        // Check client-side environment variables
        const clientEnvVars = {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL,
          anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY
        }
        
        // Check server-side environment variables
        const serverResponse = await fetch('/api/test-env')
        const serverEnvVars = await serverResponse.json()
        
        let detailsText = `Client-Side Environment Variables:\n`
        detailsText += `URL: ${clientEnvVars.url ? 'Set' : 'Missing'}\n`
        detailsText += `Anon Key: ${clientEnvVars.anonKey ? 'Set' : 'Missing'}\n`
        detailsText += `Service Key: ${clientEnvVars.serviceKey ? 'Set' : 'Missing'}\n\n`
        
        detailsText += `Server-Side Environment Variables:\n`
        detailsText += `URL: ${serverEnvVars.url}\n`
        detailsText += `Anon Key: ${serverEnvVars.anonKey}\n`
        detailsText += `Service Key: ${serverEnvVars.serviceKey}\n\n`
        
        // Show partial values for debugging
        if (clientEnvVars.url) {
          detailsText += `Client URL Value: ${clientEnvVars.url.substring(0, 30)}...\n`
        }
        if (clientEnvVars.anonKey) {
          detailsText += `Client Anon Key Length: ${clientEnvVars.anonKey.length} characters\n`
        }
        if (serverEnvVars.urlValue) {
          detailsText += `Server URL Value: ${serverEnvVars.urlValue}\n`
        }
        if (serverEnvVars.anonKeyLength > 0) {
          detailsText += `Server Anon Key Length: ${serverEnvVars.anonKeyLength} characters\n`
        }
        if (serverEnvVars.serviceKeyLength > 0) {
          detailsText += `Server Service Key Length: ${serverEnvVars.serviceKeyLength} characters\n`
        }
        
        setDetails(detailsText)
        
        if (!clientEnvVars.url || !clientEnvVars.anonKey) {
          setStatus('❌ Missing client-side environment variables')
          return
        }
        
        // Test basic connection
        const { data, error } = await supabase.from('categories').select('count').limit(1)
        
        if (error) {
          setStatus(`❌ Connection failed: ${error.message}`)
          setDetails(prev => prev + `\n\nError: ${error.message}`)
        } else {
          setStatus('✅ Connection successful')
          setDetails(prev => prev + '\n\nDatabase connection working')
          
          // Test auth connection via API
          try {
            const authResponse = await fetch('/api/test-auth')
            const authResult = await authResponse.json()
            
            if (authResult.status === 'Auth test successful') {
              setDetails(prev => prev + '\n\nAuth connection working')
            } else {
              setDetails(prev => prev + `\n\nAuth Error: ${authResult.error}`)
            }
          } catch (authException) {
            setDetails(prev => prev + `\n\nAuth Exception: ${authException.message}`)
          }
        }
        
      } catch (error) {
        setStatus(`❌ Test failed: ${error.message}`)
        setDetails(prev => prev + `\n\nException: ${error.message}`)
      }
    }
    
    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-primary-cream flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-primary-green mb-4">Supabase Connection Test</h1>
        <div className="mb-4">
          <strong>Status:</strong> {status}
        </div>
        <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap">
          {details}
        </pre>
      </div>
    </div>
  )
} 