'use client'
import { useState } from 'react'

export default function TestPage() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-primary-cream flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#1D4E1A] mb-8">React Test Page</h1>
        <p className="text-lg text-[#2C1810] mb-4">If you can see this, React is working!</p>
        <div className="mb-4">
          <p className="text-[#EA9841] font-bold">Count: {count}</p>
        </div>
        <button 
          onClick={() => setCount(count + 1)}
          className="bg-[#EA9841] text-white px-6 py-3 rounded-md hover:bg-[#d88a3a] transition-colors"
        >
          Increment Count
        </button>
      </div>
    </div>
  )
} 