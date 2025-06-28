import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  try {
    // Check if this is a development environment
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'This endpoint is not available in production' },
        { status: 403 }
      )
    }

    // Clear existing products and order items
    await supabase.from('order_items').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('products').delete().neq('id', 0)

    // Reset the sequence
    await supabase.rpc('reset_products_sequence')

    // Insert all 12 products that match the frontend menu
    const products = [
      {
        name: 'Classic Ramen',
        description: 'Traditional Korean ramen with rich, savory broth made from pork bones and vegetables. Served with tender chashu pork, soft-boiled egg, green onions, and nori.',
        price: 12.99,
        category_id: 1,
        available: true
      },
      {
        name: 'Spicy Kimchi Ramen',
        description: 'Spicy ramen featuring our house-made kimchi in a fiery broth. Topped with kimchi, pork belly, bean sprouts, and a perfectly soft-boiled egg.',
        price: 14.99,
        category_id: 1,
        available: true
      },
      {
        name: 'Seafood Ramen',
        description: 'Light and refreshing seafood ramen with shrimp, mussels, and fish in a delicate seafood broth. Perfect for seafood lovers.',
        price: 16.99,
        category_id: 1,
        available: true
      },
      {
        name: 'Korean BBQ Bowl',
        description: 'Grilled marinated beef served over steamed rice with fresh vegetables, kimchi, and our signature BBQ sauce. A complete meal in a bowl.',
        price: 16.99,
        category_id: 2,
        available: true
      },
      {
        name: 'Bibimbap',
        description: 'Traditional Korean mixed rice bowl with colorful vegetables, marinated beef, and a perfectly fried egg. Served with gochujang sauce.',
        price: 15.99,
        category_id: 2,
        available: true
      },
      {
        name: 'Bulgogi Bowl',
        description: 'Sweet and savory marinated beef bulgogi served over rice with caramelized onions and fresh vegetables.',
        price: 17.99,
        category_id: 2,
        available: true
      },
      {
        name: 'Korean Fried Chicken',
        description: 'Crispy double-fried chicken glazed with our signature sweet and spicy sauce. Served with pickled radish.',
        price: 13.99,
        category_id: 3,
        available: true
      },
      {
        name: 'Kimchi Fries',
        description: 'Loaded fries topped with melted cheese, kimchi, green onions, and our special sauce. A fusion favorite.',
        price: 8.99,
        category_id: 3,
        available: true
      },
      {
        name: 'Mandu (Dumplings)',
        description: 'Steamed or fried dumplings filled with pork, vegetables, and aromatic spices. Served with dipping sauce.',
        price: 9.99,
        category_id: 3,
        available: true
      },
      {
        name: 'Korean Rice Tea',
        description: 'Traditional nurungji tea made from roasted rice. Warm and comforting with a nutty flavor.',
        price: 3.99,
        category_id: 4,
        available: true
      },
      {
        name: 'Citron Tea',
        description: 'Refreshing Korean citron tea with honey. Perfect for digestion and a boost of vitamin C.',
        price: 4.99,
        category_id: 4,
        available: true
      },
      {
        name: 'Korean Milk Tea',
        description: 'Creamy milk tea with a hint of Korean flavors. Served hot or iced.',
        price: 5.99,
        category_id: 4,
        available: true
      }
    ]

    const { data, error } = await supabase
      .from('products')
      .insert(products)
      .select()

    if (error) {
      console.error('Error inserting products:', error)
      return NextResponse.json(
        { error: 'Failed to insert products' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Products fixed successfully',
      products: data
    })

  } catch (error) {
    console.error('Fix products error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 