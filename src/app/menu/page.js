'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

const categoryIcons = {
  'Ramen': '🍜',
  'Rice Bowls': '🍚',
  'Sides & Appetizers': '🥟',
  'Beverages': '🍵'
}

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('')
  const [menuCategories, setMenuCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  const scrollToCategory = (categoryName) => {
    const element = document.getElementById(`category-${categoryName.replace(/\s+/g, '-').toLowerCase()}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = menuCategories.map(category => 
        document.getElementById(`category-${category.name.replace(/\s+/g, '-').toLowerCase()}`)
      ).filter(Boolean)

      const scrollPosition = window.scrollY + 100 // Offset for fixed sidebar

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section.offsetTop <= scrollPosition) {
          setActiveCategory(menuCategories[i].name)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8E1] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EA9841] mx-auto mb-4"></div>
          <p className="text-[#1D4E1A] font-body">Loading menu...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FFF8E1] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1D4E1A] mb-4 font-display">Error Loading Menu</h1>
          <p className="text-[#1D4E1A] mb-6 font-body">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#EA9841] text-white px-6 py-3 rounded-md font-medium hover:bg-[#d88a3a] transition-colors font-body"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF8E1]">
      {/* Header */}
              <div className="bg-[#FFECB8] shadow-md border-b border-[#EA9841]/20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-[#2C1810] text-center font-display">Our Menu</h1>
          <p className="text-[#2C1810] mt-3 text-center text-lg font-body">Explore our authentic Korean fusion dishes</p>
          <div className="mt-6 text-center">
            <button 
              onClick={() => window.location.href = '/order'}
              className="bg-[#EA9841] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#d88a3a] transition-colors duration-200 text-lg font-body"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Category Filter */}
      <div className="md:hidden bg-[#FFECB8] border-b border-[#EA9841]/20 sticky top-16 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {menuCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => scrollToCategory(category.name)}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-all duration-200 text-sm flex items-center gap-2 whitespace-nowrap ${
                  activeCategory === category.name
                    ? 'bg-gradient-to-r from-[#1D4E1A] to-[#163d15] text-white shadow-lg'
                    : 'bg-[#FFF8E1] text-[#1D4E1A] hover:bg-[#1D4E1A] hover:text-white hover:shadow-md'
                }`}
              >
                <span className="text-base">{category.icon}</span>
                <span className="font-body">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Fixed Vertical Sidebar Navigation */}
        <div className="hidden md:block fixed left-0 top-0 h-full w-48 bg-[#FFECB8]/95 backdrop-blur-sm shadow-xl border-r border-[#EA9841]/20 z-20 pt-32">
          <div className="p-3">
            <h3 className="text-sm font-bold text-[#1D4E1A] mb-4 text-center uppercase tracking-wide font-display">Categories</h3>
            <nav className="space-y-1">
              {menuCategories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => scrollToCategory(category.name)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm flex items-center gap-2 ${
                    activeCategory === category.name
                      ? 'bg-gradient-to-r from-[#1D4E1A] to-[#163d15] text-white shadow-lg'
                      : 'bg-[#FFF8E1]/50 text-[#1D4E1A] hover:bg-[#1D4E1A] hover:text-white hover:shadow-md'
                  }`}
                >
                  <span className="text-base">{category.icon}</span>
                  <span className="truncate font-body">{category.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 md:ml-48">
          <div className="container mx-auto px-4 md:px-8 py-8 md:py-12">
            {menuCategories.map((category, categoryIndex) => (
              <section 
                key={category.name} 
                id={`category-${category.name.replace(/\s+/g, '-').toLowerCase()}`}
                className="mb-16 md:mb-20 scroll-mt-20 md:scroll-mt-20"
              >
                <div className="text-center mb-8 md:mb-12">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-3xl md:text-4xl">{category.icon}</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#2C1810] font-display">{category.name}</h2>
                  </div>
                  <p className="text-lg md:text-xl text-[#2C1810] max-w-2xl mx-auto px-4 font-body">{category.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {category.items.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-[#EA9841]/20 hover:shadow-lg transition-shadow duration-300">
                      <div className="aspect-video bg-gradient-to-br from-[#FFF8E1] to-[#EA9841]/30 relative">
                        {/* Placeholder for image */}
                        <div className="absolute inset-0 flex items-center justify-center text-[#1D4E1A] font-medium">
                          {item.name} Image
                        </div>
                      </div>
                      
                      <div className="p-4 md:p-6">
                        <div className="flex justify-between items-start mb-3 md:mb-4">
                          <h3 className="text-lg md:text-xl font-bold text-[#1D4E1A] font-display">{item.name}</h3>
                          <span className="text-lg md:text-xl font-bold text-[#EA9841] font-body">{formatPrice(item.price)}</span>
                        </div>
                        
                        <p className="text-[#1D4E1A] mb-4 md:mb-6 leading-relaxed text-sm font-body">{item.description}</p>
                        
                        <div className="grid grid-cols-1 gap-3 md:gap-4 mb-4">
                          <div>
                            <h4 className="font-semibold text-[#1D4E1A] mb-2 text-sm font-display">Ingredients</h4>
                            <ul className="text-xs text-primary-green space-y-1">
                              {item.ingredients.map((ingredient, index) => (
                                <li key={index} className="flex items-center font-body">
                                  <span className="w-1.5 h-1.5 bg-[#EA9841] rounded-full mr-2"></span>
                                  {ingredient}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-[#1D4E1A] mb-2 text-sm font-display">Details</h4>
                                                          <div className="space-y-2 text-xs text-primary-green">
                                <div className="flex justify-between items-center p-2 bg-[#FFF8E1] rounded">
                                  <span className="font-medium font-body">Spice Level:</span>
                                  <span className="px-2 py-1 bg-[#EA9841] text-white rounded text-xs font-body">
                                    {item.spiceLevel}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-[#FFF8E1] rounded">
                                  <span className="font-medium font-body">Prep Time:</span>
                                  <span className="font-body">{item.prepTime}</span>
                                </div>
                              </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 