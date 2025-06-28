'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function OrderConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setOrder(data.order)
        } else {
          setError('Order not found')
        }
      } catch (error) {
        console.error('Error fetching order:', error)
        setError('Failed to load order details')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchOrder()
    }
  }, [params.id])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const formatPickupTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes} minutes`
    } else if (minutes === 60) {
      return '1 hour'
    } else {
      const hours = Math.floor(minutes / 60)
      const remainingMinutes = minutes % 60
      if (remainingMinutes === 0) {
        return `${hours} hours`
      } else {
        return `${hours} hours ${remainingMinutes} minutes`
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5DC] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EA9841] mx-auto mb-4"></div>
          <p className="text-[#1D4E1A]">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F5DC] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1D4E1A] mb-4">Order Not Found</h1>
          <p className="text-[#1D4E1A] mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-[#EA9841] text-white px-6 py-3 rounded-md font-medium hover:bg-[#d88a3a] transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    )
  }

  if (!order) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#F5F5DC] py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#1D4E1A] mb-2">Order Confirmed!</h1>
          <p className="text-lg text-[#1D4E1A]">Thank you for your order</p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-[#1D4E1A] mb-4">Order Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-medium text-[#1D4E1A]">#{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                order.status === 'ready' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="font-medium text-[#1D4E1A]">
                {new Date(order.order_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Pickup Time</p>
              <p className="font-medium text-[#1D4E1A]">
                {formatPickupTime(order.pickup_time)}
              </p>
            </div>
          </div>

          {order.special_instructions && (
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600 mb-1">Special Instructions</p>
              <p className="text-[#1D4E1A]">{order.special_instructions}</p>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-[#1D4E1A] mb-4">Order Items</h2>
          
          <div className="space-y-4">
            {order.order_items?.map((item, index) => (
              <div key={index} className="flex justify-between items-start border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex-1">
                  <h3 className="font-medium text-[#1D4E1A]">{item.name}</h3>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  {item.special_instructions && (
                    <p className="text-xs text-gray-500 mt-1">
                      Note: {item.special_instructions}
                    </p>
                  )}
                </div>
                <span className="font-medium text-[#EA9841]">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between text-lg font-bold text-[#1D4E1A]">
              <span>Total</span>
              <span>{formatPrice(order.total_amount)}</span>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        {order.customer && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-[#1D4E1A] mb-4">Customer Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium text-[#1D4E1A]">
                  {order.customer.first_name} {order.customer.last_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-[#1D4E1A]">{order.customer.email}</p>
              </div>
              {order.customer.phone && (
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-[#1D4E1A]">{order.customer.phone}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-[#F5F5DC] rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-[#1D4E1A] mb-4">What's Next?</h2>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-[#EA9841] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                1
              </div>
              <div>
                <p className="font-medium text-[#1D4E1A]">Order Confirmation</p>
                <p className="text-sm text-gray-600">We've received your order and will start preparing it soon.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-6 h-6 bg-[#EA9841] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                2
              </div>
              <div>
                <p className="font-medium text-[#1D4E1A]">Preparation</p>
                <p className="text-sm text-gray-600">Our team will prepare your order with care and attention.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-6 h-6 bg-[#EA9841] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                3
              </div>
              <div>
                <p className="font-medium text-[#1D4E1A]">Pickup</p>
                <p className="text-sm text-gray-600">Your order will be ready for pickup in approximately {formatPickupTime(order.pickup_time)}.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push('/')}
            className="flex-1 bg-[#EA9841] text-white py-3 px-6 rounded-md font-medium hover:bg-[#d88a3a] transition-colors"
          >
            Return Home
          </button>
          <button
            onClick={() => router.push('/menu')}
            className="flex-1 bg-white text-[#EA9841] border border-[#EA9841] py-3 px-6 rounded-md font-medium hover:bg-[#EA9841] hover:text-white transition-colors"
          >
            Order Again
          </button>
        </div>
      </div>
    </div>
  )
} 