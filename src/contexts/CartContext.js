'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext({})

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('foodTruckCart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
        setCart([])
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('foodTruckCart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product, quantity = 1, specialInstructions = '') => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.id === product.id && item.specialInstructions === specialInstructions
      )

      if (existingItemIndex > -1) {
        // Update existing item
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex].quantity += quantity
        return updatedCart
      } else {
        // Add new item
        const newItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          quantity,
          specialInstructions,
          category: product.category?.name || 'Unknown'
        }
        return [...prevCart, newItem]
      }
    })
  }

  const removeFromCart = (index) => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index))
  }

  const updateQuantity = (index, quantity) => {
    if (quantity <= 0) {
      removeFromCart(index)
      return
    }
    
    setCart(prevCart => 
      prevCart.map((item, i) => 
        i === index ? { ...item, quantity } : item
      )
    )
  }

  const updateSpecialInstructions = (index, specialInstructions) => {
    setCart(prevCart => 
      prevCart.map((item, i) => 
        i === index ? { ...item, specialInstructions } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
    localStorage.removeItem('foodTruckCart')
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  const getCartItems = () => {
    return cart
  }

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)

  const value = {
    cart,
    isOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateSpecialInstructions,
    clearCart,
    getCartTotal,
    getCartCount,
    getCartItems,
    openCart,
    closeCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
} 