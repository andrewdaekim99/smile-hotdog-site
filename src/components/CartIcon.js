'use client'
import { useCart } from '@/contexts/CartContext'

export default function CartIcon() {
  const { getCartCount, openCart } = useCart()
  const cartCount = getCartCount()

  return (
    <button
      onClick={openCart}
      className="relative inline-flex items-center justify-center p-2 text-[#1D4E1A] hover:text-[#EA9841] transition-colors duration-200 rounded-md hover:bg-gray-50"
      aria-label="Shopping cart"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#EA9841] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-sm">
          {cartCount > 99 ? '99+' : cartCount}
        </span>
      )}
    </button>
  )
} 