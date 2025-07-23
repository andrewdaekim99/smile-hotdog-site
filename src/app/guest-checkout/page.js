'use client'
import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'

export default function GuestCheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    pickupTime: '',
    specialInstructions: ''
  })

  const [errors, setErrors] = useState({})

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.pickupTime) newErrors.pickupTime = 'Pickup time is required'

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
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      const orderData = {
        customer: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone
        },
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

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })

      if (response.ok) {
        const result = await response.json()
        clearCart()
        router.push(`/order-confirmation/${result.order.id}`)
      } else {
        const error = await response.json()
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
      <div className="min-h-screen bg-[#FFF8E1] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1D4E1A] mb-4">Your cart is empty</h1>
          <p className="text-[#1D4E1A] mb-6">Add some delicious items to your cart first!</p>
          <button
            onClick={() => router.push('/menu')}
            className="bg-[#EA9841] text-white px-6 py-3 rounded-md font-medium hover:bg-[#d88a3a] transition-colors"
          >
            Browse Menu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF8E1] py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-[#1D4E1A] text-center mb-8">Guest Checkout</h1>
        
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
          </div>

          {/* Checkout Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-[#1D4E1A] mb-4">Contact Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

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

              <div>
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#EA9841] text-white py-3 px-6 rounded-md font-medium hover:bg-[#d88a3a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing Order...' : 'Place Order'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => router.push('/signin')}
                  className="text-[#EA9841] hover:text-[#d88a3a] font-medium"
                >
                  Sign in to checkout
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 