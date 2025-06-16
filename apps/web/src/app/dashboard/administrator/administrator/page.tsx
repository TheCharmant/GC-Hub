import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'

export default async function AdminDashboard() {
  const { user, token } = useAuth();

  const response = await fetch('http://localhost:3000/api/admin/dashboard', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Browse all events from clubs and organizations</p>
      </div>
      
      <div className="mb-4 flex justify-between items-center">
        <div className="flex space-x-2">
          <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
            All Events
          </button>
          <button className="bg-white text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors">
            My Clubs
          </button>
          <button className="bg-white text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors">
            Recommended
          </button>
        </div>
        <div className="w-64">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="absolute right-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Removed event cards for a cleaner dashboard */}
      </div>
    </div>
  )
}
