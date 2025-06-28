'use client'
import { useState } from 'react'

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

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Booking submitted:', formData)
    alert('Thank you for your booking request! We\'ll get back to you soon.')
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-[#F5F5DC]">
      {/* Header */}
      <div className="bg-white shadow-md border-b border-[#8B4513]/20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-[#2C1810] text-center">Book the Truck</h1>
          <p className="text-[#2C1810] mt-3 text-center text-lg">Bring Korean fusion to your next event</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Booking Form */}
            <div className="bg-white p-8 rounded-lg shadow-md border border-[#8B4513]/20">
              <h2 className="text-2xl font-bold text-[#2C1810] mb-6">Request a Booking</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#2C1810] mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-[#8B4513]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#2C1810] mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-[#8B4513]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C1810] mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-[#8B4513]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C1810] mb-2">
                    Event Type *
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-[#8B4513]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
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
                    <label className="block text-sm font-medium text-[#2C1810] mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-[#8B4513]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#2C1810] mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-[#8B4513]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C1810] mb-2">
                    Event Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="Full address or venue name"
                    className="w-full px-3 py-2 border border-[#8B4513]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C1810] mb-2">
                    Expected Number of Guests *
                  </label>
                  <input
                    type="number"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-[#8B4513]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C1810] mb-2">
                    Additional Details
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Tell us more about your event, special requirements, or any questions you have..."
                    className="w-full px-3 py-2 border border-[#8B4513]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#2C1810] text-white py-3 px-6 rounded-md font-semibold hover:bg-[#1d130b] transition-colors duration-200"
                >
                  Submit Booking Request
                </button>
              </form>
            </div>

            {/* Information Sidebar */}
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-md border border-[#8B4513]/20">
                <h3 className="text-xl font-bold text-[#2C1810] mb-4">Why Choose Our Food Truck?</h3>
                <ul className="space-y-3 text-[#2C1810]">
                  <li className="flex items-start">
                    <span className="text-[#8B4513] mr-2">•</span>
                    Authentic Korean fusion cuisine
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#8B4513] mr-2">•</span>
                    Professional service and setup
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#8B4513] mr-2">•</span>
                    Flexible menu options
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#8B4513] mr-2">•</span>
                    Competitive pricing
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#8B4513] mr-2">•</span>
                    All necessary permits and insurance
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-[#8B4513]/20">
                <h3 className="text-xl font-bold text-[#2C1810] mb-4">Popular Event Types</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-[#F5F5DC] rounded-md">
                    <h4 className="font-semibold text-[#2C1810]">Corporate Events</h4>
                    <p className="text-sm text-[#2C1810]">Perfect for company lunches and team building</p>
                  </div>
                  <div className="p-3 bg-[#F5F5DC] rounded-md">
                    <h4 className="font-semibold text-[#2C1810]">Weddings</h4>
                    <p className="text-sm text-[#2C1810]">Unique catering option for your special day</p>
                  </div>
                  <div className="p-3 bg-[#F5F5DC] rounded-md">
                    <h4 className="font-semibold text-[#2C1810]">Private Parties</h4>
                    <p className="text-sm text-[#2C1810]">Birthdays, graduations, and celebrations</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-[#8B4513]/20">
                <h3 className="text-xl font-bold text-[#2C1810] mb-4">Contact Information</h3>
                <div className="space-y-2 text-[#2C1810]">
                  <p><strong>Phone:</strong> (555) 123-4567</p>
                  <p><strong>Email:</strong> bookings@koreanfusion.com</p>
                  <p><strong>Response Time:</strong> Within 24 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 