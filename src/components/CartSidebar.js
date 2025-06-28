'use client'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CartSidebar() {
  const { 
    cart, 
    isOpen, 
    closeCart, 
    removeFromCart, 
    updateQuantity, 
    updateSpecialInstructions,
    getCartTotal, 
    clearCart 
  } = useCart()
  
  const { isAuthenticated, user } = useAuth()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const router = useRouter();

  const handleCheckout = () => {
    if (cart.length === 0) return
    
    if (isAuthenticated) {
      router.push('/checkout')
    } else {
      router.push('/guest-checkout')
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop - only visible on mobile */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40 md:hidden"
        onClick={closeCart}
      />
      
      {/* Sidebar */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full md:w-auto md:max-w-sm lg:max-w-md">
        <div className="relative w-full">
          <div className="h-full flex flex-col bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            {/* Header */}
            <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-[#1D4E1A]">Shopping Cart</h2>
                <button
                  onClick={closeCart}
                  className="ml-3 h-7 flex items-center p-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <svg className="h-6 w-6 text-[#1D4E1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
                  <p className="mt-1 text-sm text-gray-500">Start adding some delicious items!</p>
                  <div className="mt-6">
                    <Link
                      href="/order"
                      onClick={closeCart}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#EA9841] hover:bg-[#d88a3a] transition-colors"
                    >
                      Browse Menu
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="mt-8">
                  <div className="flow-root">
                    <ul className="-my-6 divide-y divide-gray-200">
                      {cart.map((item, index) => (
                        <li key={`${item.id}-${index}`} className="py-6 flex">
                          <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 border border-gray-200 rounded-md overflow-hidden">
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-full h-full object-center object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400 text-xs">No image</span>
                              </div>
                            )}
                          </div>

                          <div className="ml-3 sm:ml-4 flex-1 flex flex-col min-w-0">
                            <div>
                              <div className="flex justify-between text-base font-medium text-[#1D4E1A]">
                                <h3 className="text-sm sm:text-base truncate">{item.name}</h3>
                                <p className="ml-2 text-sm sm:text-base">{formatPrice(item.price * item.quantity)}</p>
                              </div>
                              <p className="mt-1 text-xs sm:text-sm text-gray-500">{item.category}</p>
                            </div>
                            <div className="flex-1 flex items-end justify-between text-sm mt-2">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => updateQuantity(index, item.quantity - 1)}
                                  className="text-[#EA9841] hover:text-[#d88a3a] font-medium p-1 rounded hover:bg-gray-100"
                                >
                                  -
                                </button>
                                <span className="text-gray-900 min-w-[20px] text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(index, item.quantity + 1)}
                                  className="text-[#EA9841] hover:text-[#d88a3a] font-medium p-1 rounded hover:bg-gray-100"
                                >
                                  +
                                </button>
                              </div>

                              <button
                                onClick={() => removeFromCart(index)}
                                className="text-[#EA9841] hover:text-[#d88a3a] font-medium text-xs sm:text-sm"
                              >
                                Remove
                              </button>
                            </div>
                            
                            {/* Special Instructions */}
                            <div className="mt-2">
                              <textarea
                                placeholder="Special instructions (optional)"
                                value={item.specialInstructions}
                                onChange={(e) => updateSpecialInstructions(index, e.target.value)}
                                className="w-full text-xs border border-gray-300 rounded px-2 py-1 resize-none focus:ring-1 focus:ring-[#EA9841] focus:border-[#EA9841]"
                                rows="2"
                              />
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                <div className="flex justify-between text-base font-medium text-[#1D4E1A]">
                  <p>Subtotal</p>
                  <p>{formatPrice(getCartTotal())}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">
                  Shipping and taxes calculated at checkout.
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full bg-[#EA9841] border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-[#d88a3a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isCheckingOut ? 'Processing...' : 'Checkout'}
                  </button>
                </div>
                <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                  <p>
                    or{' '}
                    <button
                      onClick={closeCart}
                      className="text-[#EA9841] font-medium hover:text-[#d88a3a] transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
} 