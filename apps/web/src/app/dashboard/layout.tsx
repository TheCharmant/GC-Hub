'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { isAuthenticated, getCurrentUser, logout } from '@/lib/auth'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [role, setRole] = useState<string>('')
  const [currentDate, setCurrentDate] = useState<string>('')
  const [user, setUser] = useState<any>(null)
  
  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push('/')
      return
    }
    
    // Get user data
    const userData = getCurrentUser()
    if (userData) {
      setUser(userData)
      setRole(userData.role.toLowerCase())
    } else {
      router.push('/')
    }
    
    // Set current date
    const date = new Date()
    setCurrentDate(date.toLocaleDateString('en-US', { 
      month: 'long',
      day: 'numeric', 
      year: 'numeric' 
    }))
  }, [router])
  
  const getNavItems = () => {
    switch (role) {
      case 'student':
        return [
          { name: 'Feed', path: '/dashboard/student/feed', icon: 'rss' },
          { name: 'Events', path: '/dashboard/student/events', icon: 'calendar' },
          { name: 'Stats', path: '/dashboard/student/stats', icon: 'chart-bar' },
          { name: 'Profile', path: '/dashboard/student/profile', icon: 'user' }
        ]
      case 'club':
        return [
          { name: 'Feed', path: '/dashboard/club/feed', icon: 'rss' },
          { name: 'Manage', path: '/dashboard/club/manage', icon: 'cog' },
          { name: 'Stats', path: '/dashboard/club/stats', icon: 'chart-bar' },
          { name: 'Profile', path: '/dashboard/club/profile', icon: 'user' }
        ]
      case 'organizer':
        return [
          { name: 'Feed', path: '/dashboard/organizer/feed', icon: 'rss' },
          { name: 'Manage', path: '/dashboard/organizer/manage', icon: 'cog' },
          { name: 'Reports', path: '/dashboard/organizer/reports', icon: 'document-text' },
          { name: 'Profile', path: '/dashboard/organizer/profile', icon: 'user' }
        ]
      case 'administrator':
        return [
          { name: 'Dashboard', path: '/dashboard/administrator/administrator', icon: 'rss' },
          { name: 'Users', path: '/dashboard/administrator/users', icon: 'users' },
          { name: 'Events', path: '/dashboard/administrator/events', icon: 'calendar' },
          { name: 'Reports', path: '/dashboard/administrator/reports', icon: 'document-text' }
        ]
      default:
        return []
    }
  }
  
  const handleLogout = () => {
    logout()
    router.push('/')
  }
  
  // If no user data yet, show loading
  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <Image 
            src="/gc-hub-logo.svg" 
            alt="GC Hub Logo" 
            width={120} 
            height={48} 
            className="mx-auto"
          />
        </div>
        
        <div className="p-4 border-b">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="ml-3">
              <p className="font-medium">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 capitalize">{role}</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4">
          <ul>
            {getNavItems().map((item, index) => (
              <li key={index} className="mb-2">
                <Link 
                  href={item.path}
                  className={`flex items-center p-2 rounded-md ${
                    pathname === item.path 
                      ? 'bg-purple-100 text-purple-600' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">
                    {/* Icon would go here */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="mt-8 pt-4 border-t">
            <button 
              onClick={handleLogout}
              className="flex items-center p-2 w-full text-left text-gray-600 hover:bg-gray-100 rounded-md"
            >
              <span className="mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </span>
              Logout
            </button>
          </div>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 bg-[#faf7ef]">
        <header className="bg-[#faf7ef] border-b border-gray-200 p-4 flex justify-between">
          <div className="text-gray-600">
            <span className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
            {currentDate}
          </div>
          <div className="text-gray-600">
            {user?.email}
          </div>
        </header>
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

