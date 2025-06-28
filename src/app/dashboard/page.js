'use client'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import Link from 'next/link'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-primary-cream py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-[#1D4E1A] mb-4">
                Welcome back, {user?.first_name}!
              </h1>
              <p className="text-lg text-[#2C1810]">
                Manage your account, view rewards, and track your orders
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-md border border-[#EA9841]/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#2C1810] font-medium">Reward Points</p>
                    <p className="text-3xl font-bold text-[#EA9841]">{user?.points || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#EA9841] rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">⭐</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-[#EA9841]/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#2C1810] font-medium">Total Spent</p>
                    <p className="text-3xl font-bold text-[#EA9841]">
                      ${(user?.total_spent || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-[#EA9841] rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">💰</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-[#EA9841]/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#2C1810] font-medium">Member Since</p>
                    <p className="text-3xl font-bold text-[#EA9841]">
                      {user?.created_at ? new Date(user.created_at).getFullYear() : '2024'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-[#EA9841] rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">🎉</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-md border border-[#EA9841]/20">
                <h3 className="text-xl font-semibold text-[#1D4E1A] mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    href="/order"
                    className="block w-full text-left p-3 bg-[#F5F5DC] hover:bg-[#EA9841] hover:text-white rounded-md transition-colors"
                  >
                    🍽️ Place New Order
                  </Link>
                  <Link
                    href="/book"
                    className="block w-full text-left p-3 bg-[#F5F5DC] hover:bg-[#EA9841] hover:text-white rounded-md transition-colors"
                  >
                    📅 Book Catering
                  </Link>
                  <Link
                    href="/menu"
                    className="block w-full text-left p-3 bg-[#F5F5DC] hover:bg-[#EA9841] hover:text-white rounded-md transition-colors"
                  >
                    📋 View Menu
                  </Link>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-[#EA9841]/20">
                <h3 className="text-xl font-semibold text-[#1D4E1A] mb-4">Account Info</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-[#2C1810] font-medium">Name</p>
                    <p className="text-[#1D4E1A]">{user?.first_name} {user?.last_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#2C1810] font-medium">Email</p>
                    <p className="text-[#1D4E1A]">{user?.email}</p>
                  </div>
                  {user?.phone && (
                    <div>
                      <p className="text-sm text-[#2C1810] font-medium">Phone</p>
                      <p className="text-[#1D4E1A]">{user.phone}</p>
                    </div>
                  )}
                  {user?.birthday && (
                    <div>
                      <p className="text-sm text-[#2C1810] font-medium">Birthday</p>
                      <p className="text-[#1D4E1A]">
                        {new Date(user.birthday).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Rewards Info */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-[#EA9841]/20">
              <h3 className="text-xl font-semibold text-[#1D4E1A] mb-4">Rewards Program</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-[#2C1810] mb-2">How to Earn Points</h4>
                  <ul className="space-y-2 text-sm text-[#2C1810]">
                    <li>• $1 spent = 1 point</li>
                    <li>• Birthday month bonus: 2x points</li>
                    <li>• Refer a friend: 50 points</li>
                    <li>• Leave a review: 10 points</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-[#2C1810] mb-2">How to Redeem</h4>
                  <ul className="space-y-2 text-sm text-[#2C1810]">
                    <li>• 100 points = $5 off</li>
                    <li>• 200 points = $12 off</li>
                    <li>• 500 points = $30 off</li>
                    <li>• 1000 points = $75 off</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 