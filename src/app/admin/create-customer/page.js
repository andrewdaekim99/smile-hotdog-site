'use client'
import { useState } from 'react'

export default function CreateCustomerPage() {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/admin/create-customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          type: 'success',
          message: data.message
        })
        setFormData({ email: '', firstName: '', lastName: '', phone: '' })
      } else {
        setResult({
          type: 'error',
          message: data.error
        })
      }
    } catch (error) {
      console.error('Create customer error:', error)
      setResult({
        type: 'error',
        message: `Error: ${error.message}`
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-[#FFF8E1] py-8">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-[#1D4E1A] mb-6 text-center">
            Create Customer Profile
          </h1>
          
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Purpose:</strong> This tool creates a customer profile for an existing Supabase Auth user who can sign in but gets "customer profile not found" error.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1D4E1A] mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EA9841]"
                placeholder="user@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1D4E1A] mb-1">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EA9841]"
                placeholder="John"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1D4E1A] mb-1">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EA9841]"
                placeholder="Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1D4E1A] mb-1">
                Phone (Optional)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EA9841]"
                placeholder="(555) 123-4567"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#EA9841] text-white py-2 px-4 rounded-md font-medium hover:bg-[#d88a3a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Customer Profile'}
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
              <li>Enter the email of the existing Supabase Auth user</li>
              <li>Fill in the first and last name</li>
              <li>Optionally add a phone number</li>
              <li>Click "Create Customer Profile"</li>
              <li>Try signing in again with the same credentials</li>
            </ol>
          </div>

          <div className="mt-4 flex space-x-4">
            <a 
              href="/debug/table-structure" 
              className="text-[#EA9841] hover:text-[#d88a3a] font-medium"
            >
              Check Table Structure
            </a>
            <a 
              href="/signin" 
              className="text-[#EA9841] hover:text-[#d88a3a] font-medium"
            >
              Test Sign In
            </a>
          </div>

          <p className="text-xs text-gray-500">Password must be at least 8 characters and contain at least one number, one uppercase letter, and one special character (e.g. &quot;!@#$%&quot;).</p>
          <p className="text-sm text-gray-500">Type &quot;CREATE&quot; to confirm customer creation. This action cannot be undone.</p>
        </div>
      </div>
    </div>
  )
} 