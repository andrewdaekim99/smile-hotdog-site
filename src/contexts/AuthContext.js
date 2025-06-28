'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/database'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Function to fetch customer profile via API
  const fetchCustomerProfile = async (userId) => {
    try {
      const response = await fetch('/api/auth/get-customer-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        return result.customer
      } else {
        console.error('Failed to fetch customer profile:', result.error)
        return null
      }
    } catch (error) {
      console.error('Error fetching customer profile:', error)
      return null
    }
  }

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        // Skip session check on reset password page
        if (typeof window !== 'undefined' && window.location.pathname === '/reset-password') {
          setLoading(false)
          return
        }

        // Add timeout to prevent hanging
        const sessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Session check timeout')), 5000)
        })

        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ])

        if (session?.user) {
          // Get customer profile via API
          const customer = await fetchCustomerProfile(session.user.id)
          if (customer) {
            setUser(customer)
          }
        }
      } catch (error) {
        console.error('Error checking session:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Skip auth state changes on reset password page
        if (typeof window !== 'undefined' && window.location.pathname === '/reset-password') {
          return
        }

        if (session?.user) {
          // Get customer profile via API
          const customer = await fetchCustomerProfile(session.user.id)
          if (customer) {
            setUser(customer)
          }
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    try {
      // Use our API route instead of calling Supabase directly
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        // Set the user from the API response
        setUser(result.customer)
        return { success: true, customer: result.customer }
      } else {
        return { success: false, error: result.error || 'Sign in failed' }
      }
    } catch (error) {
      console.error('Sign in error:', error)
      return { success: false, error: 'An error occurred during sign in' }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 