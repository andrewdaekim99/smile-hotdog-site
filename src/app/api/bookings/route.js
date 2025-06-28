import { NextResponse } from 'next/server'
import { bookingAPI } from '@/lib/database'

export async function POST(request) {
  try {
    const {
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      eventType,
      eventDate,
      eventTime,
      location,
      expectedGuests,
      specialRequirements
    } = await request.json()

    // Validate required fields
    if (!customerName || !customerEmail || !eventType || !eventDate || !eventTime || !location || !expectedGuests) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      )
    }

    // Validate event date (must be in the future)
    const eventDateTime = new Date(`${eventDate}T${eventTime}`)
    const now = new Date()
    
    if (eventDateTime <= now) {
      return NextResponse.json(
        { error: 'Event date and time must be in the future' },
        { status: 400 }
      )
    }

    // Validate expected guests
    if (expectedGuests < 1) {
      return NextResponse.json(
        { error: 'Expected guests must be at least 1' },
        { status: 400 }
      )
    }

    // Create booking
    const bookingData = {
      customer_id: customerId || null,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone || null,
      event_type: eventType,
      event_date: eventDate,
      event_time: eventTime,
      location,
      expected_guests: expectedGuests,
      special_requirements: specialRequirements || null
    }

    const { data: booking, error } = await bookingAPI.createBooking(bookingData)

    if (error) {
      console.error('Booking creation error:', error)
      return NextResponse.json(
        { error: 'Failed to create booking request' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Booking request submitted successfully',
      booking: {
        id: booking.id,
        event_type: booking.event_type,
        event_date: booking.event_date,
        event_time: booking.event_time,
        status: booking.status
      }
    })

  } catch (error) {
    console.error('Booking creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      )
    }

    const { data: bookings, error } = await bookingAPI.getCustomerBookings(customerId)

    if (error) {
      console.error('Bookings fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch bookings' },
        { status: 500 }
      )
    }

    return NextResponse.json({ bookings })

  } catch (error) {
    console.error('Bookings fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 