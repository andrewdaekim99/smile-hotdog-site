'use client'
import { useState, useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [checkoutType, setCheckoutType] = useState('guest') // 'guest' or 'account'
  
  const [formData, setFormData] = useState({
    // Guest checkout fields
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Order details
    pickupTime: '',
    specialInstructions: ''
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    // Pre-fill form with user data if authenticated
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phone: user.phone || ''
      }))
      setCheckoutType('account')
    }
  }, [isAuthenticated, user])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const validateForm = () => {
    const newErrors = {}
    
    console.log('Validating form with data:', formData)
    
    if (!formData.pickupTime) {
      newErrors.pickupTime = 'Pickup time is required'
      console.log('Missing pickup time')
    }
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required'
      console.log('Missing first name')
    }
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required'
      console.log('Missing last name')
    }
    if (!formData.email) {
      newErrors.email = 'Email is required'
      console.log('Missing email')
    }
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required'
      console.log('Missing phone')
    }

    console.log('Validation errors:', newErrors)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    console.log('Place order button clicked')
    console.log('Form data:', formData)
    console.log('Cart:', cart)
    console.log('Is authenticated:', isAuthenticated)
    console.log('User:', user)
    
    if (!validateForm()) {
      console.log('Form validation failed')
      console.log('Errors:', errors)
      return
    }
    
    console.log('Form validation passed')
    setIsSubmitting(true)
    
    try {
      const orderData = {
        // Use user ID if authenticated, otherwise null for guest
        customer_id: isAuthenticated ? user.id : null,
        
        // Guest customer info
        guest_info: !isAuthenticated ? {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone
        } : null,
        
        items: cart.map(item => ({
          product_id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          special_instructions: item.specialInstructions
        })),
        pickup_time: formData.pickupTime,
        special_instructions: formData.specialInstructions,
        total_amount: getCartTotal(),
        status: 'pending'
      }

      console.log('Sending order data:', orderData)

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })

      console.log('Response status:', response.status)

      if (response.ok) {
        const result = await response.json()
        console.log('Order created successfully:', result)
        clearCart()
        router.push(`/order-confirmation/${result.order.id}`)
      } else {
        const error = await response.json()
        console.error('Order creation failed:', error)
        alert(`Error creating order: ${error.message}`)
      }
    } catch (error) {
      console.error('Error submitting order:', error)
      alert('An error occurred while submitting your order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F5DC] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1D4E1A] mb-4">Your cart is empty</h1>
          <p className="text-[#1D4E1A] mb-6">Add some delicious items to your cart first!</p>
          <button
            onClick={() => router.push('/order')}
            className="bg-[#EA9841] text-white px-6 py-3 rounded-md font-medium hover:bg-[#d88a3a] transition-colors"
          >
            Browse Menu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F5DC] py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-[#1D4E1A] text-center mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-[#1D4E1A] mb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between items-start border-b border-gray-200 pb-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-[#1D4E1A]">{item.name}</h3>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    {item.specialInstructions && (
                      <p className="text-xs text-gray-500 mt-1">
                        Note: {item.specialInstructions}
                      </p>
                    )}
                  </div>
                  <span className="font-medium text-[#EA9841]">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-lg font-bold text-[#1D4E1A]">
                <span>Total</span>
                <span>{formatPrice(getCartTotal())}</span>
              </div>
            </div>

            {/* Customer Info */}
            {isAuthenticated && (
              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium text-[#1D4E1A] mb-3">Customer Information</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-[#1D4E1A] mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#EA9841] ${
                          errors.firstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="First name"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[#1D4E1A] mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#EA9841] ${
                          errors.lastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Last name"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#1D4E1A] mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#EA9841] ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#1D4E1A] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#EA9841] ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="(555) 123-4567"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-600 mt-2">
                    <p><strong>Points:</strong> {user.points || 0} pts</p>
                    <p className="text-xs text-gray-500">You can modify the contact information above if ordering for someone else.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Rewards Program Info */}
            <div className="mt-6 p-4 bg-[#F5F5DC] rounded-md">
              <h3 className="font-medium text-[#1D4E1A] mb-2">Rewards Program</h3>
              <p className="text-sm text-[#1D4E1A]">
                You'll earn {Math.floor(getCartTotal())} points for this order!
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {isAuthenticated 
                  ? 'Points will be added to your account automatically.'
                  : 'Sign up for an account to earn and redeem points!'
                }
              </p>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-[#1D4E1A] mb-4">Order Details</h2>
            
            {/* Checkout Type Selection */}
            {!isAuthenticated && (
              <div className="mb-6">
                <h3 className="font-medium text-[#1D4E1A] mb-3">Checkout Options</h3>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCheckoutType('guest')}
                    className={`flex-1 py-2 px-4 rounded-md border-2 transition-colors ${
                      checkoutType === 'guest'
                        ? 'border-[#EA9841] bg-[#EA9841] text-white'
                        : 'border-gray-300 text-gray-700 hover:border-[#EA9841]'
                    }`}
                  >
                    Guest Checkout
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/signin')}
                    className="flex-1 py-2 px-4 rounded-md border-2 border-gray-300 text-gray-700 hover:border-[#EA9841] transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Customer Information Fields - Only for Guest Checkout */}
              {!isAuthenticated && checkoutType === 'guest' && (
                <div className="space-y-4 border-t border-gray-200 pt-4">
                  <h3 className="font-medium text-[#1D4E1A]">Contact Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1D4E1A] mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#EA9841] ${
                          errors.firstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="First name"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[#1D4E1A] mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#EA9841] ${
                          errors.lastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Last name"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#1D4E1A] mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#EA9841] ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#1D4E1A] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#EA9841] ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="(555) 123-4567"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Order Details */}
              <div className={`${!isAuthenticated && checkoutType === 'guest' ? 'border-t border-gray-200 pt-4' : ''}`}>
                <h3 className="font-medium text-[#1D4E1A] mb-3">Order Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-[#1D4E1A] mb-1">
                    Pickup Time *
                  </label>
                  <select
                    name="pickupTime"
                    value={formData.pickupTime}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#EA9841] ${
                      errors.pickupTime ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select pickup time</option>
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                  </select>
                  {errors.pickupTime && (
                    <p className="text-red-500 text-xs mt-1">{errors.pickupTime}</p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-[#1D4E1A] mb-1">
                    Special Instructions (optional)
                  </label>
                  <textarea
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EA9841]"
                    placeholder="Any special requests for your order..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#EA9841] text-white py-3 px-6 rounded-md font-medium hover:bg-[#d88a3a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing Order...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 