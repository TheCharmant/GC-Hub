'use client'

import { useRouter } from 'next/navigation'

export default function RoleSelectionCards() {
  const router = useRouter()
  
  const handleRoleSelect = (role: string) => {
    router.push(`/login/${role.toLowerCase()}`)
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Student Role */}
      <div 
        className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => handleRoleSelect('Student')}
      >
        <h3 className="text-xl font-bold mb-4">Student</h3>
        <div className="w-24 h-24 mx-auto mb-4 border-2 border-gray-300 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>
      
      {/* Club Role */}
      <div 
        className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => handleRoleSelect('Club')}
      >
        <h3 className="text-xl font-bold mb-4">Club</h3>
        <div className="w-24 h-24 mx-auto mb-4 border-2 border-gray-300 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      </div>
      
      {/* Organizer Role */}
      <div 
        className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => handleRoleSelect('Organizer')}
      >
        <h3 className="text-xl font-bold mb-4">Organizer</h3>
        <div className="w-24 h-24 mx-auto mb-4 border-2 border-gray-300 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
      
      {/* Administrator Role */}
      <div 
        className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => handleRoleSelect('Administrator')}
      >
        <h3 className="text-xl font-bold mb-4">Administrator</h3>
        <div className="w-24 h-24 mx-auto mb-4 border-2 border-gray-300 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
      </div>
    </div>
  )
}