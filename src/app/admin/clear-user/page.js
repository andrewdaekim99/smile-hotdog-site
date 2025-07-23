'use client'
import { useState } from 'react'

export default function ClearUserPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleClearUser = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/admin/clear-auth-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          type: 'success',
          message: data.message
        })
        setEmail('')
      } else {
        setResult({
          type: 'error',
          message: data.error
        })
      }
    } catch (error) {
      console.error('Clear user error:', error)
      setResult({
        type: 'error',
        message: `Error: ${error.message}`
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF8E1] py-8">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-[#1D4E1A] mb-6 text-center">
            Clear Supabase Auth User
          </h1>
          
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Development Only:</strong> This tool helps clear Supabase Auth users when testing signup functionality.
            </p>
          </div>
          
          <form onSubmit={handleClearUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1D4E1A] mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EA9841]"
                placeholder="user@example.com"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Deleting...' : 'Delete User from Auth'}
            </button>
          </form>

          {result && (
            <div className={`mt-4 p-4 rounded-md ${
              result.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {result.message}
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium text-[#1D4E1A] mb-2">Instructions:</h3>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>Enter the email of the user you want to delete from Supabase Auth</li>
              <li>Click "Delete User from Auth"</li>
              <li>After deletion, you can sign up again with the same email</li>
            </ol>
          </div>

          <div className="mt-4 text-center">
            <a 
              href="/signup" 
              className="text-[#EA9841] hover:text-[#d88a3a] font-medium"
            >
              ← Back to Signup
            </a>
          </div>

          <p className="text-sm text-gray-500">Type &quot;CLEAR&quot; to confirm user deletion. This action cannot be undone.</p>
        </div>
      </div>
    </div>
  )
} 