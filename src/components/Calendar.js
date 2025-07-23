'use client'
import { useState, useEffect } from 'react'

export default function Calendar({ onDateSelect, selectedDate, blockedDates = [] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSchedule()
  }, [])

  const fetchSchedule = async () => {
    try {
      // In a real app, this would fetch from your API
      // For now, we'll simulate some blocked dates
      const mockBlockedDates = [
        '2024-12-25', // Christmas
        '2024-12-26', // Day after Christmas
        '2024-12-31', // New Year's Eve
        '2025-01-01', // New Year's Day
        '2025-01-15', // Example corporate event
        '2025-01-20', // Example wedding
        '2025-01-25', // Example festival
      ]
      
      setSchedule(mockBlockedDates)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching schedule:', error)
      setLoading(false)
    }
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }
    
    // Add all days in the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    
    return days
  }

  const formatDate = (date) => {
    return date.toISOString().split('T')[0]
  }

  const isDateBlocked = (date) => {
    const dateString = formatDate(date)
    return schedule.includes(dateString)
  }

  const isDateSelected = (date) => {
    if (!selectedDate) return false
    return formatDate(date) === formatDate(selectedDate)
  }

  const isDateInPast = (date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const handleDateClick = (date) => {
    if (isDateBlocked(date) || isDateInPast(date)) return
    onDateSelect(date)
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border border-[#EA9841]/20">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-7 gap-2">
            {[...Array(35)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const days = getDaysInMonth(currentMonth)

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-[#EA9841]/20">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className="p-2 text-[#1D4E1A] hover:bg-[#FFECB8] rounded-md transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h3 className="text-xl font-bold text-[#1D4E1A] font-display">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        
        <button
          onClick={goToNextMonth}
          className="p-2 text-[#1D4E1A] hover:bg-[#FFECB8] rounded-md transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm font-medium text-[#1D4E1A] py-2 font-body">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (!day) {
            return <div key={index} className="h-12"></div>
          }

          const isBlocked = isDateBlocked(day)
          const isSelected = isDateSelected(day)
          const isPast = isDateInPast(day)
          const isToday = formatDate(day) === formatDate(new Date())

          return (
            <button
              key={index}
              onClick={() => handleDateClick(day)}
              disabled={isBlocked || isPast}
              className={`
                h-12 rounded-md text-sm font-medium transition-colors relative
                ${isSelected 
                  ? 'bg-[#EA9841] text-white' 
                  : isBlocked 
                    ? 'bg-red-100 text-red-600 cursor-not-allowed' 
                    : isPast 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-[#FFF8E1] text-[#1D4E1A] hover:bg-[#FFECB8] cursor-pointer'
                }
                ${isToday && !isSelected ? 'ring-2 ring-[#EA9841]' : ''}
              `}
            >
              {day.getDate()}
              {isBlocked && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#FFF8E1] border border-[#EA9841] rounded"></div>
            <span className="text-[#1D4E1A] font-body">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
            <span className="text-red-600 font-body">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
            <span className="text-gray-400 font-body">Past</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#EA9841] rounded"></div>
            <span className="text-[#1D4E1A] font-body">Selected</span>
          </div>
        </div>
      </div>

      {/* Schedule info */}
      <div className="mt-4 p-3 bg-[#FFECB8] rounded-md">
        <h4 className="font-medium text-[#1D4E1A] mb-2 font-display">Upcoming Events</h4>
        <div className="text-sm text-[#1D4E1A] space-y-1 font-body">
          <p>• Dec 25-26: Holiday Break</p>
          <p>• Dec 31: New Year's Eve Event</p>
          <p>• Jan 15: Corporate Event</p>
          <p>• Jan 20: Wedding Catering</p>
          <p>• Jan 25: Food Festival</p>
        </div>
      </div>
    </div>
  )
} 