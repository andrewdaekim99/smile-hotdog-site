import { NextResponse } from 'next/server'
import { productAPI } from '@/lib/database'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')

    let data, error

    if (categoryId) {
      // Get products by category
      const result = await productAPI.getProductsByCategory(categoryId)
      data = result.data
      error = result.error
    } else {
      // Get all products
      const result = await productAPI.getProducts()
      data = result.data
      error = result.error
    }

    if (error) {
      console.error('Products fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      )
    }

    return NextResponse.json({ products: data })

  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 