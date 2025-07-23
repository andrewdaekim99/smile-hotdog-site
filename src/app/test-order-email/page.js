'use client'
import { useState } from 'react'

export default function TestOrderEmailPage() {
  const [email, setEmail] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [result, setResult] = useState(null)

  const handleTestEmail = async (e) => {
    e.preventDefault()
    setIsSending(true)
    setResult(null)

    try {
      const response = await fetch('/api/test-order-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setResult({
          type: 'success',
          message: data.message,
          services: data.services
        })
      } else {
        setResult({
          type: 'error',
          message: data.message || data.error || 'Failed to send test email',
          services: data.services
        })
      }
    } catch (error) {
      console.error('Test email error:', error)
      setResult({
        type: 'error',
        message: `Error: ${error.message}`
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF8E1] py-8">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-[#1D4E1A] mb-6 text-center">
            Test Order Confirmation Email
          </h1>
          
          <form onSubmit={handleTestEmail} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1D4E1A] mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EA9841]"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isSending}
              className="w-full bg-[#EA9841] text-white py-2 px-4 rounded-md font-medium hover:bg-[#d88a3a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? 'Sending...' : 'Send Test Email'}
            </button>
          </form>

          {result && (
            <div className={`mt-4 p-4 rounded-md ${
              result.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              <p className="font-medium">{result.message}</p>
              
              {result.services && (
                <div className="mt-3 text-sm">
                  <p className="font-medium mb-1">Email Services:</p>
                  <ul className="space-y-1">
                    <li className={`flex items-center ${result.services.resend ? 'text-green-700' : 'text-gray-600'}`}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${result.services.resend ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                      Resend: {result.services.resend ? 'Configured' : 'Not configured'}
                    </li>
                    <li className={`flex items-center ${result.services.supabase ? 'text-green-700' : 'text-gray-600'}`}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${result.services.supabase ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                      Supabase: {result.services.supabase ? 'Configured' : 'Not configured'}
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium text-[#1D4E1A] mb-2">Setup Instructions:</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>For actual email sending:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Sign up at <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-[#EA9841] hover:underline">resend.com</a></li>
                <li>Get your API key from the dashboard</li>
                <li>Add <code className="bg-gray-200 px-1 rounded">RESEND_API_KEY=your_key_here</code> to your <code className="bg-gray-200 px-1 rounded">.env.local</code></li>
                <li>Restart your development server</li>
              </ol>
              <p className="mt-2"><strong>Free tier:</strong> 3,000 emails/month</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium text-[#1D4E1A] mb-2">Test Email Includes:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Mock order with 2 items</li>
              <li>• Order details and pickup time</li>
              <li>• Customer information</li>
              <li>• Special instructions</li>
              <li>• Professional HTML formatting</li>
            </ul>
          </div>

          <div className="mt-4 text-center">
            <a 
              href="/order" 
              className="text-[#EA9841] hover:text-[#d88a3a] font-medium"
            >
              ← Back to Order Page
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 