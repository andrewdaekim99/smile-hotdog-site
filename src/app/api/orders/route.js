import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { sendOrderConfirmationEmail } from '@/lib/email'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  try {
    const body = await request.json()
    const { customer_id, guest_info, items, pickup_time, special_instructions, total_amount, status } = body

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Order must contain at least one item' }, { status: 400 })
    }

    if (!pickup_time) {
      return NextResponse.json({ error: 'Pickup time is required' }, { status: 400 })
    }

    if (!total_amount || total_amount <= 0) {
      return NextResponse.json({ error: 'Invalid total amount' }, { status: 400 })
    }

    // Handle customer creation for guest orders
    let finalCustomerId = customer_id
    let customerInfo = null
    
    if (!customer_id && guest_info) {
      // Create guest customer record
      const { data: guestCustomer, error: guestError } = await supabase
        .from('customers')
        .insert({
          first_name: guest_info.first_name,
          last_name: guest_info.last_name,
          email: guest_info.email,
          phone: guest_info.phone,
          is_guest: true
        })
        .select()
        .single()

      if (guestError) {
        console.error('Error creating guest customer:', guestError)
        return NextResponse.json({ error: 'Failed to create customer record' }, { status: 500 })
      }

      finalCustomerId = guestCustomer.id
      customerInfo = {
        first_name: guest_info.first_name,
        last_name: guest_info.last_name,
        email: guest_info.email,
        phone: guest_info.phone
      }
    } else if (customer_id) {
      // Get customer info for logged-in users
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('first_name, last_name, email, phone')
        .eq('id', customer_id)
        .single()

      if (customerError) {
        console.error('Error fetching customer:', customerError)
        return NextResponse.json({ error: 'Failed to fetch customer information' }, { status: 500 })
      }

      customerInfo = customer
    }

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: finalCustomerId,
        pickup_time: pickup_time,
        special_instructions: special_instructions || null,
        total_amount: total_amount,
        status: status || 'pending',
        order_date: new Date().toISOString()
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      special_instructions: item.special_instructions || null
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Error creating order items:', itemsError)
      // Clean up the order if items creation fails
      await supabase.from('orders').delete().eq('id', order.id)
      return NextResponse.json({ error: 'Failed to create order items' }, { status: 500 })
    }

    // Update customer points if they're logged in (not a guest)
    if (customer_id && !guest_info) {
      const pointsToAdd = Math.floor(total_amount)
      const { error: pointsError } = await supabase
        .from('customers')
        .update({ 
          points: supabase.rpc('increment_points', { points_to_add: pointsToAdd })
        })
        .eq('id', customer_id)

      if (pointsError) {
        console.error('Error updating customer points:', pointsError)
        // Don't fail the order for points update failure
      }
    }

    // Send order confirmation email
    if (customerInfo && customerInfo.email) {
      const emailData = {
        order: order,
        items: items
      }
      
      const emailSent = await sendOrderConfirmationEmail(emailData, customerInfo)
      if (emailSent) {
        console.log('Order confirmation email sent successfully')
      } else {
        console.log('Failed to send order confirmation email')
      }
    }

    return NextResponse.json({ 
      success: true, 
      order: {
        id: order.id,
        customer_id: order.customer_id,
        total_amount: order.total_amount,
        status: order.status,
        pickup_time: order.pickup_time
      }
    })

  } catch (error) {
    console.error('Error in orders API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customer_id')
    const status = searchParams.get('status')

    let query = supabase
      .from('orders')
      .select(`
        *,
        customer:customers(first_name, last_name, email, phone),
        order_items(*)
      `)
      .order('order_date', { ascending: false })

    if (customerId) {
      query = query.eq('customer_id', customerId)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data: orders, error } = await query

    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }

    return NextResponse.json({ orders })

  } catch (error) {
    console.error('Error in orders GET API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 