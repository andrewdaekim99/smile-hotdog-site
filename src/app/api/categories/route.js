import { NextResponse } from 'next/server'
import { productAPI } from '@/lib/database'

export async function GET() {
  try {
    const { data: categories, error } = await productAPI.getCategories()

    if (error) {
      console.error('Categories fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      )
    }

    return NextResponse.json({ categories })

  } catch (error) {
    console.error('Categories fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 