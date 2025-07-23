'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/database'

function ResetPasswordContent() {
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
      <div className="min-h-screen bg-[#FFF8E1] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EA9841] mx-auto mb-4"></div>
          <p className="text-[#1D4E1A]">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-[#FFF8E1] flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-[#1D4E1A] mb-2">Invalid Reset Link</h1>
              <p className="text-gray-600">{submitMessage}</p>
            </div>
            
            <div className="space-y-4">
              <Link
                href="/forgot-password"
                className="w-full bg-[#EA9841] text-white py-2 px-4 rounded-md font-medium hover:bg-[#d88a3a] transition-colors block text-center"
              >
                Request New Reset Link
              </Link>
              
              <Link
                href="/signin"
                className="w-full bg-white text-[#EA9841] border border-[#EA9841] py-2 px-4 rounded-md font-medium hover:bg-[#EA9841] hover:text-white transition-colors block text-center"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF8E1] flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#1D4E1A] mb-2">Reset Your Password</h1>
            <p className="text-gray-600">Enter your new password below</p>
          </div>
          
          {submitMessage && (
            <div className={`mb-4 p-3 rounded-md ${
              submitMessage.includes('successfully') 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {submitMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1D4E1A] mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#EA9841] ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#1D4E1A] mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#EA9841] ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#EA9841] text-white py-2 px-4 rounded-md font-medium hover:bg-[#d88a3a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link
              href="/signin"
              className="text-[#EA9841] hover:text-[#d88a3a] font-medium"
            >
              ← Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResetPassword() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FFF8E1] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EA9841] mx-auto mb-4"></div>
          <p className="text-[#1D4E1A]">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
} 