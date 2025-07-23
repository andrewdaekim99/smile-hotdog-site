'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function DebugTableStructurePage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/debug/table-structure')
        const result = await response.json()
        
        if (response.ok) {
          setData(result)
        } else {
          setError(result.error)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8E1] py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-[#1D4E1A] mb-6">Loading...</h1>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FFF8E1] py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-[#1D4E1A] mb-6">Error</h1>
            <div className="bg-red-100 text-red-800 p-4 rounded-md">
              {error}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF8E1] py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-[#1D4E1A] mb-6">Customers Table Structure</h1>
          
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-[#1D4E1A] mb-4">Table Columns:</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Column Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Data Type</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Nullable</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Default</th>
                  </tr>
                </thead>
                <tbody>
                  {data.tableStructure?.map((column, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-300 px-4 py-2 font-mono text-sm">{column.column_name}</td>
                      <td className="border border-gray-300 px-4 py-2">{column.data_type}</td>
                      <td className="border border-gray-300 px-4 py-2">{column.is_nullable}</td>
                      <td className="border border-gray-300 px-4 py-2 font-mono text-sm">{column.column_default || 'NULL'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-[#1D4E1A] mb-4">Sample Data:</h2>
            {data.sampleData && data.sampleData.length > 0 ? (
              <div className="bg-gray-50 p-4 rounded-md">
                <pre className="text-sm overflow-x-auto">
                  {JSON.stringify(data.sampleData[0], null, 2)}
                </pre>
              </div>
            ) : (
              <div className="bg-yellow-50 p-4 rounded-md text-yellow-800">
                No sample data found. The table might be empty.
              </div>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-[#1D4E1A] mb-4">Required Columns for Signup:</h2>
            <div className="bg-blue-50 p-4 rounded-md">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>id</strong> - UUID (primary key)</li>
                <li><strong>email</strong> - TEXT (unique)</li>
                <li><strong>password_hash</strong> - TEXT</li>
                <li><strong>first_name</strong> - TEXT</li>
                <li><strong>last_name</strong> - TEXT</li>
                <li><strong>phone</strong> - TEXT (nullable)</li>
                <li><strong>auth_user_id</strong> - UUID (nullable)</li>
                <li><strong>is_guest</strong> - BOOLEAN (default false)</li>
                <li><strong>points</strong> - INTEGER (default 0)</li>
                <li><strong>total_spent</strong> - DECIMAL (default 0.00)</li>
                <li><strong>created_at</strong> - TIMESTAMP</li>
                <li><strong>updated_at</strong> - TIMESTAMP</li>
              </ul>
            </div>
          </div>

          <div className="flex space-x-4">
            <a 
              href="/signup" 
              className="bg-[#EA9841] text-white px-4 py-2 rounded-md hover:bg-[#d88a3a] transition-colors"
            >
              Test Signup
            </a>
            <a 
              href="/admin/clear-user" 
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Clear Auth User
            </a>
            <Link href="/">Home</Link>
          </div>
        </div>
      </div>
    </div>
  )
} 