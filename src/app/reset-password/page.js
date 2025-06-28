'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/database'

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isValidToken, setIsValidToken] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [tokens, setTokens] = useState({ accessToken: '', refreshToken: '' })

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleResetPassword = async () => {
      try {
        // Debug: Check environment variables
        console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing')
        console.log('Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing')
        
        // Debug: Log the current URL and pathname
        console.log('Current URL:', window.location.href)
        console.log('Pathname:', window.location.pathname)
        console.log('Search:', window.location.search)
        console.log('Hash:', window.location.hash)
        
        // Parse tokens from URL fragment (after #)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        console.log('Hash parameters:', Object.fromEntries(hashParams.entries()))
        
        // Get tokens from hash fragment
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const type = hashParams.get('type')
        const expiresAt = hashParams.get('expires_at')
        const tokenType = hashParams.get('token_type')
        
        // Also check query parameters as fallback
        const queryAccessToken = searchParams.get('access_token')
        const queryRefreshToken = searchParams.get('refresh_token')
        const queryType = searchParams.get('type')
        
        // Use hash parameters if available, otherwise fall back to query parameters
        const finalAccessToken = accessToken || queryAccessToken
        const finalRefreshToken = refreshToken || queryRefreshToken
        const finalType = type || queryType
        
        console.log('Final access token:', finalAccessToken ? 'Present' : 'Missing')
        console.log('Final refresh token:', finalRefreshToken ? 'Present' : 'Missing')
        console.log('Final type:', finalType)
        console.log('Expires at:', expiresAt)
        console.log('Token type:', tokenType)
        console.log('Raw access token (first 50 chars):', finalAccessToken ? finalAccessToken.substring(0, 50) + '...' : 'None')
        console.log('Raw refresh token:', finalRefreshToken ? finalRefreshToken.substring(0, 20) + '...' : 'None')

        // Check if tokens are expired
        if (expiresAt) {
          const expirationTime = parseInt(expiresAt) * 1000 // Convert to milliseconds
          const currentTime = Date.now()
          if (currentTime > expirationTime) {
            console.error('Tokens have expired')
            setSubmitMessage('Reset link has expired. Please request a new password reset.')
            setIsLoading(false)
            return
          }
        }

        // Try different approaches for token validation
        if (finalAccessToken && finalRefreshToken && finalType === 'recovery') {
          console.log('Using standard Supabase tokens')
          
          // Skip session establishment for now and proceed directly
          console.log('Skipping session establishment, proceeding to password form')
          setIsValidToken(true)
          setIsLoading(false)
          setTokens({ accessToken: finalAccessToken, refreshToken: finalRefreshToken })
        } else {
          console.log('No valid tokens found in URL')
          setSubmitMessage('Invalid or expired reset link. Please request a new password reset.')
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Reset password setup error:', error)
        setSubmitMessage('Invalid or expired reset link. Please request a new password reset.')
        setIsLoading(false)
      }
    }

    handleResetPassword()
  }, [searchParams])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      console.log('Attempting password update with tokens')
      console.log('Access token present:', !!tokens.accessToken)
      console.log('Refresh token present:', !!tokens.refreshToken)
      console.log('Password length:', formData.password.length)
      console.log('Access token length:', tokens.accessToken ? tokens.accessToken.length : 0)
      console.log('Refresh token length:', tokens.refreshToken ? tokens.refreshToken.length : 0)

      // Use server-side API to update password
      const requestBody = {
        password: formData.password,
        accessToken: tokens.accessToken || '',
        refreshToken: tokens.refreshToken || ''
      }
      
      console.log('Request body:', {
        password: formData.password ? 'Present' : 'Missing',
        accessToken: tokens.accessToken ? 'Present' : 'Missing',
        refreshToken: tokens.refreshToken ? 'Present' : 'Missing'
      })

      const response = await fetch('/api/auth/reset-password-server', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const result = await response.json()
      console.log('Server response:', result)

      if (!response.ok) {
        console.error('Password update failed:', result.error)
        setSubmitMessage(`Failed to update password: ${result.error}. Please try again.`)
        return
      }

      console.log('Password updated successfully')
      
      // Sign out the user to ensure they need to sign in again with the new password
      await supabase.auth.signOut()

      setSubmitMessage('Password updated successfully! Redirecting to sign in...')
      
      // Set submitting to false before redirect
      setIsSubmitting(false)
      
      setTimeout(() => {
        router.push('/signin')
      }, 2000)
    } catch (error) {
      console.error('Reset password error:', error)
      setSubmitMessage(`An error occurred: ${error.message}. Please try again.`)
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EA9841] mx-auto"></div>
          <p className="mt-4 text-[#1D4E1A]">Verifying reset link...</p>
        </div>
      </div>
    )
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-primary-cream flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white py-8 px-6 shadow-lg rounded-lg text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Reset Link</h2>
            <p className="text-gray-600 mb-6">{submitMessage}</p>
            <Link
              href="/forgot-password"
              className="bg-[#EA9841] text-white px-6 py-3 rounded-md font-medium hover:bg-[#d88a3a] transition-colors"
            >
              Request New Reset Link
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-cream flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-primary-green">
            Set New Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below.
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`mt-1 block w-full pr-10 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-primary-orange ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  style={{ top: '0.25rem' }}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-400 hover:text-primary-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400 hover:text-primary-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`mt-1 block w-full pr-10 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-primary-orange ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  style={{ top: '0.25rem' }}
                >
                  {showConfirmPassword ? (
                    <svg className="h-5 w-5 text-gray-400 hover:text-primary-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400 hover:text-primary-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            {submitMessage && (
              <div className={`p-3 rounded-md text-sm ${
                submitMessage.includes('successfully') 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {submitMessage}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  backgroundColor: '#EA9841',
                  color: 'white',
                  width: '100%',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.5 : 1,
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.target.style.backgroundColor = '#2C1810'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.target.style.backgroundColor = '#EA9841'
                  }
                }}
              >
                {isSubmitting ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 