import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function GET(request, { params }) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        customer:customers(first_name, last_name, email, phone),
        order_items(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching order:', error)
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }
      return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
    }

    return NextResponse.json({ order })

  } catch (error) {
    console.error('Error in order GET API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 