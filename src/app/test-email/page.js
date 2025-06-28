'use client'
import { useState } from 'react'

export default function TestEmail() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) {
      setMessage('Please enter an email address')
      return
    }

    setIsSubmitting(true)
    setMessage('')

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Test email sent! Check your email (including spam folder).')
      } else {
        setMessage(data.error || 'Failed to send test email')
      }
    } catch (error) {
      console.error('Test email error:', error)
      setMessage('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary-cream flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-primary-green">
            Test Email Functionality
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            This will test if Supabase can send emails to your address.
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-primary-orange"
                placeholder="Enter your email"
              />
            </div>

            {message && (
              <div className={`p-3 rounded-md text-sm ${
                message.includes('sent!') 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#EA9841] text-white px-4 py-2 rounded-md font-medium hover:bg-[#d88a3a] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Test Email'}
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Troubleshooting Tips:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Check your spam/junk folder</li>
              <li>• Check promotions tab in Gmail</li>
              <li>• Use a real email address (not disposable)</li>
              <li>• Wait a few minutes for delivery</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 