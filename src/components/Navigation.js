'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import CartIcon from './CartIcon'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAuthenticated, signOut, loading } = useAuth()
  const router = useRouter()

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'Order', href: '/order' },
    { name: 'Book', href: '/book' },
    { name: 'About', href: '/about' }
  ]

  // Add Dashboard to nav items if user is authenticated
  const authenticatedNavItems = isAuthenticated 
    ? [...navItems, { name: 'Dashboard', href: '/dashboard' }]
    : navItems

  const handleSignOut = async () => {
    const result = await signOut()
    if (result.success) {
      // Use Next.js router instead of window.location.href
      router.push('/')
    }
  }

  if (loading) {
    return (
      <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-[#EA9841]/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#EA9841] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="text-xl font-bold text-[#1D4E1A]">Korean Fusion</span>
            </div>
            <div className="text-[#1D4E1A]">Loading...</div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-[#EA9841]/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#EA9841] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-xl font-bold text-[#1D4E1A]">Korean Fusion</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {authenticatedNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-[#1D4E1A] hover:text-[#EA9841] font-medium transition-colors duration-200 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#EA9841] transition-all duration-200 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons and Cart */}
          <div className="hidden md:flex items-center space-x-4">
            <CartIcon />
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-[#1D4E1A]">
                    Welcome, {user?.first_name}!
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-[#EA9841] font-medium">
                      {user?.points || 0} pts
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-[#1D4E1A] hover:text-[#EA9841] font-medium transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/signin">
                  <button className="text-[#1D4E1A] hover:text-[#EA9841] font-medium transition-colors">
                    Sign In
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="bg-[#EA9841] text-white px-4 py-2 rounded-md font-medium hover:bg-[#d88a3a] transition-colors">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button and cart */}
          <div className="md:hidden flex items-center space-x-2">
            <CartIcon />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-[#1D4E1A] hover:text-[#EA9841] hover:bg-[#F5F5DC] transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-[#EA9841]/20">
              {authenticatedNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-[#1D4E1A] hover:text-[#EA9841] hover:bg-[#F5F5DC] rounded-md font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-[#EA9841]/20 pt-2 mt-2">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2 text-sm text-[#1D4E1A]">
                      Welcome, {user?.first_name}!
                    </div>
                    <div className="px-3 py-2 text-xs text-[#EA9841] font-medium">
                      {user?.points || 0} points
                    </div>
                    <button
                      onClick={() => {
                        handleSignOut()
                        setIsMenuOpen(false)
                      }}
                      className="block w-full text-left px-3 py-2 text-[#1D4E1A] hover:text-[#EA9841] hover:bg-[#F5F5DC] rounded-md font-medium transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/signin"
                      className="block px-3 py-2 text-[#1D4E1A] hover:text-[#EA9841] hover:bg-[#F5F5DC] rounded-md font-medium transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-3 py-2 text-[#EA9841] hover:bg-[#EA9841] hover:text-white rounded-md font-medium transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 