'use client'
import { useState, useEffect, useRef } from 'react'

export default function BookPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    date: '',
    time: '',
    location: '',
    guests: '',
    message: ''
  })
  const [autocomplete, setAutocomplete] = useState(null)
  const locationInputRef = useRef(null)

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMapsAPI = () => {
      if (window.google && window.google.maps) {
        initializeAutocomplete()
        return
      }

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = initializeAutocomplete
      document.head.appendChild(script)
    }

    loadGoogleMapsAPI()
  }, [])

  const initializeAutocomplete = () => {
    if (!locationInputRef.current || !window.google) return

    const autocompleteInstance = new window.google.maps.places.Autocomplete(locationInputRef.current, {
      types: ['address'],
      componentRestrictions: { country: 'us' },
      fields: ['formatted_address', 'geometry', 'place_id']
    })

    autocompleteInstance.addListener('place_changed', () => {
      const place = autocompleteInstance.getPlace()
      if (place.formatted_address) {
        setFormData(prev => ({
          ...prev,
          location: place.formatted_address
        }))
      }
    })

    setAutocomplete(autocompleteInstance)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Booking request submitted:', formData)
    alert('Thank you for your booking request! We will contact you within 24 hours.')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Phone number formatting function
  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const phoneNumber = value.replace(/\D/g, '')
    
    // Format based on length
    if (phoneNumber.length === 0) return ''
    if (phoneNumber.length <= 3) return `(${phoneNumber}`
    if (phoneNumber.length <= 6) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
  }

  const handlePhoneChange = (e) => {
    const formattedValue = formatPhoneNumber(e.target.value)
    setFormData(prev => ({
      ...prev,
      phone: formattedValue
    }))
  }

  return (
    <div className="min-h-screen bg-[#FFF8E1]">
      {/* Header */}
      <div className="bg-[#FFECB8] shadow-md border-b border-[#EA9841]/20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-[#1D4E1A] text-center font-display">Book the Truck</h1>
          <p className="text-[#1D4E1A] mt-3 text-center text-lg font-body">
            Bring our Korean fusion cuisine to your next event
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Booking Form */}
            <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md border border-[#EA9841]/20">
              <h2 className="text-2xl font-bold text-[#1D4E1A] mb-6 font-display">Request a Booking</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#1D4E1A] mb-2 font-body">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-[#EA9841]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EA9841] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#1D4E1A] mb-2 font-body">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-[#EA9841]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EA9841] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1D4E1A] mb-2 font-body">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="(555) 123-4567"
                    maxLength="14"
                    className="w-full px-3 py-2 border border-[#EA9841]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EA9841] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1D4E1A] mb-2 font-body">
                    Event Type *
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-[#EA9841]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EA9841] focus:border-transparent"
                  >
                    <option value="">Select an event type</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="wedding">Wedding</option>
                    <option value="birthday">Birthday Party</option>
                    <option value="graduation">Graduation Party</option>
                    <option value="festival">Festival/Fair</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#1D4E1A] mb-2 font-body">
                      Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-[#EA9841]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EA9841] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#1D4E1A] mb-2 font-body">
                      Time *
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-[#EA9841]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EA9841] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1D4E1A] mb-2 font-body">
                    Event Location *
                  </label>
                  <input
                    ref={locationInputRef}
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="Start typing to search for an address..."
                    className="w-full px-3 py-2 border border-[#EA9841]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EA9841] focus:border-transparent"
                  />
                  <p className="text-xs text-[#EA9841] mt-1 font-body">
                    💡 Start typing to see address suggestions from Google Maps
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1D4E1A] mb-2 font-body">
                    Expected Number of Guests *
                  </label>
                  <input
                    type="number"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-[#EA9841]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EA9841] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1D4E1A] mb-2 font-body">
                    Additional Details
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Tell us more about your event, special requirements, or any questions you have..."
                    className="w-full px-3 py-2 border border-[#EA9841]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EA9841] focus:border-transparent"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1D4E1A] text-white py-3 px-6 rounded-md font-semibold hover:bg-[#163d15] transition-colors duration-200 font-body"
                >
                  Submit Booking Request
                </button>
              </form>
            </div>

            {/* Information Sidebar */}
            <div className="space-y-6">
              {/* Information Sidebar */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-[#EA9841]/20">
                <h3 className="text-xl font-bold text-[#1D4E1A] mb-4 font-display">Why Choose Our Food Truck?</h3>
                <ul className="space-y-3 text-[#1D4E1A]">
                  <li className="flex items-start font-body">
                    <span className="text-[#EA9841] mr-2">•</span>
                    Authentic Korean fusion cuisine
                  </li>
                  <li className="flex items-start font-body">
                    <span className="text-[#EA9841] mr-2">•</span>
                    Professional service and setup
                  </li>
                  <li className="flex items-start font-body">
                    <span className="text-[#EA9841] mr-2">•</span>
                    Flexible menu options
                  </li>
                  <li className="flex items-start font-body">
                    <span className="text-[#EA9841] mr-2">•</span>
                    Competitive pricing
                  </li>
                  <li className="flex items-start font-body">
                    <span className="text-[#EA9841] mr-2">•</span>
                    All necessary permits and insurance
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-[#EA9841]/20">
                <h3 className="text-xl font-bold text-[#1D4E1A] mb-4 font-display">Popular Event Types</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-[#FFECB8] rounded-md">
                    <h4 className="font-semibold text-[#1D4E1A] font-display">Corporate Events</h4>
                    <p className="text-sm text-[#1D4E1A] font-body">Perfect for company lunches and team building</p>
                  </div>
                  <div className="p-3 bg-[#FFECB8] rounded-md">
                    <h4 className="font-semibold text-[#1D4E1A] font-display">Weddings</h4>
                    <p className="text-sm text-[#1D4E1A] font-body">Unique catering option for your special day</p>
                  </div>
                  <div className="p-3 bg-[#FFECB8] rounded-md">
                    <h4 className="font-semibold text-[#1D4E1A] font-display">Private Parties</h4>
                    <p className="text-sm text-[#1D4E1A] font-body">Birthdays, graduations, and celebrations</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-[#EA9841]/20">
                <h3 className="text-xl font-bold text-[#1D4E1A] mb-4 font-display">Contact Information</h3>
                <div className="space-y-2 text-[#1D4E1A]">
                  <p className="font-body"><strong>Phone:</strong> (555) 123-4567</p>
                  <p className="font-body"><strong>Email:</strong> bookings@koreanfusion.com</p>
                  <p className="font-body"><strong>Response Time:</strong> Within 24 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 