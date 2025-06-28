'use client'
import { useState, useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'

const categoryIcons = {
  'All': '🍽️',
  'Ramen': '🍜',
  'Rice Bowls': '🍚',
  'Sides & Appetizers': '🥟',
  'Beverages': '🍵'
}

export default function OrderPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [menuCategories, setMenuCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart()
  const router = useRouter()

  // Fetch products from the database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/products')
        const data = await response.json()
        
        if (response.ok && data.products) {
          // Group products by category
          const categoriesMap = {}
          
          data.products.forEach(product => {
            const categoryName = product.categories?.name || 'Other'
            if (!categoriesMap[categoryName]) {
              categoriesMap[categoryName] = {
                name: categoryName,
                icon: categoryIcons[categoryName] || '🍽️',
                description: product.categories?.description || 'Delicious menu items',
                items: []
              }
            }
            
            categoriesMap[categoryName].items.push({
              id: product.id,
              name: product.name,
              description: product.description,
              price: parseFloat(product.price),
              image: product.image_url || '/images/placeholder.jpg',
              ingredients: [], // We'll need to add ingredients to the database schema later
              spiceLevel: product.spice_level || 'Mild',
              prepTime: product.prep_time || '10-15 minutes'
            })
          })
          
          // Convert to array and sort
          const categoriesArray = Object.values(categoriesMap).sort((a, b) => {
            const order = ['Ramen', 'Rice Bowls', 'Sides & Appetizers', 'Beverages']
            return order.indexOf(a.name) - order.indexOf(b.name)
          })
          
          setMenuCategories(categoriesArray)
        } else {
          setError('Failed to load menu items')
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        setError('Failed to load menu items')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const categories = ['All', ...menuCategories.map(category => category.name)]

  const filteredItems = activeCategory === 'All' 
    ? menuCategories.flatMap(category => category.items)
    : menuCategories.find(category => category.name === activeCategory)?.items || []

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5DC] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EA9841] mx-auto mb-4"></div>
          <p className="text-[#1D4E1A]">Loading menu...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F5DC] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1D4E1A] mb-4">Error Loading Menu</h1>
          <p className="text-[#1D4E1A] mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#EA9841] text-white px-6 py-3 rounded-md font-medium hover:bg-[#d88a3a] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F5DC]">
      {/* Header */}
      <div className="bg-white shadow-md border-b border-[#8B4513]/20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-[#2C1810] text-center">Order Online</h1>
          <p className="text-[#2C1810] mt-3 text-center text-lg">Add items to your cart and checkout</p>
        </div>
      </div>

      {/* Mobile Category Filter */}
      <div className="md:hidden bg-white border-b border-[#8B4513]/20 sticky top-16 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-all duration-200 text-sm flex items-center gap-2 whitespace-nowrap ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-[#8B4513] to-[#6B3410] text-white shadow-lg'
                    : 'bg-[#F5F5DC] text-[#2C1810] hover:bg-[#8B4513] hover:text-white hover:shadow-md'
                }`}
              >
                <span className="text-base">{categoryIcons[category]}</span>
                <span>{category}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Fixed Vertical Sidebar Navigation */}
        <div className="hidden md:block fixed left-0 top-0 h-full w-48 bg-white/95 backdrop-blur-sm shadow-xl border-r border-[#8B4513]/20 z-20 pt-32">
          <div className="p-3">
            <h3 className="text-sm font-bold text-[#2C1810] mb-4 text-center uppercase tracking-wide">Categories</h3>
            <nav className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm flex items-center gap-2 ${
                    activeCategory === category
                      ? 'bg-gradient-to-r from-[#8B4513] to-[#6B3410] text-white shadow-lg'
                      : 'bg-[#F5F5DC]/50 text-[#2C1810] hover:bg-[#8B4513] hover:text-white hover:shadow-md'
                  }`}
                >
                  <span className="text-base">{categoryIcons[category]}</span>
                  <span className="truncate">{category}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 md:ml-48">
          <div className="container mx-auto px-4 md:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
              {/* Menu Section */}
              <div className="lg:col-span-3">
                {/* Menu Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {filteredItems.map(item => (
                    <div key={item.id} className="bg-white rounded-lg shadow-md p-4 md:p-6 border border-[#8B4513]/20 hover:shadow-lg transition-shadow duration-300">
                      <div className="aspect-video bg-gradient-to-br from-[#F5F5DC] to-[#8B4513]/30 rounded-lg mb-4 flex items-center justify-center">
                        <span className="text-[#2C1810] font-medium">{item.name}</span>
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-[#2C1810] mb-2">{item.name}</h3>
                      <p className="text-[#2C1810] mb-4">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl md:text-2xl font-bold text-[#8B4513]">{formatPrice(item.price)}</span>
                        <button
                          onClick={() => addToCart({
                            ...item,
                            image_url: item.image,
                            category: { name: activeCategory === 'All' ? 'Menu' : activeCategory }
                          })}
                          className="bg-[#8B4513] text-white px-3 md:px-4 py-2 rounded-lg hover:bg-[#6B3410] transition-colors font-semibold text-sm md:text-base"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Section */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-4 md:p-6 sticky top-4 border border-[#8B4513]/20">
                  <h2 className="text-lg md:text-xl font-bold text-[#2C1810] mb-4 md:mb-6 flex items-center">
                    <span className="mr-2">🛒</span>
                    Your Cart
                  </h2>
                  
                  {cart.length === 0 ? (
                    <div className="text-center py-6 md:py-8">
                      <div className="text-3xl md:text-4xl mb-4">🍽️</div>
                      <p className="text-[#2C1810]">Your cart is empty</p>
                      <p className="text-sm text-[#2C1810] mt-2">Add some delicious items to get started!</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 md:space-y-4 mb-4 md:mb-6 max-h-64 md:max-h-96 overflow-y-auto">
                        {cart.map((item, index) => (
                          <div key={`${item.id}-${index}`} className="flex items-center justify-between p-3 bg-[#F5F5DC] rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-medium text-[#2C1810] text-sm md:text-base">{item.name}</h4>
                              <p className="text-[#8B4513] text-sm">{formatPrice(item.price)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(index, item.quantity - 1)}
                                className="w-6 h-6 bg-[#8B4513] text-white rounded-full flex items-center justify-center text-sm hover:bg-[#6B3410] transition-colors"
                              >
                                -
                              </button>
                              <span className="text-[#2C1810] font-medium text-sm md:text-base min-w-[20px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(index, item.quantity + 1)}
                                className="w-6 h-6 bg-[#8B4513] text-white rounded-full flex items-center justify-center text-sm hover:bg-[#6B3410] transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t border-[#8B4513]/20 pt-3 md:pt-4">
                        <div className="flex justify-between items-center mb-3 md:mb-4">
                          <span className="text-base md:text-lg font-semibold text-[#2C1810]">Total:</span>
                          <span className="text-xl md:text-2xl font-bold text-[#8B4513]">{formatPrice(total)}</span>
                        </div>
                        <button 
                          onClick={() => router.push('/checkout')}
                          disabled={cart.length === 0}
                          className={`w-full py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-colors ${
                            cart.length === 0 
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                              : 'bg-[#2C1810] text-white hover:bg-[#1A0F09]'
                          }`}
                        >
                          Proceed to Checkout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 