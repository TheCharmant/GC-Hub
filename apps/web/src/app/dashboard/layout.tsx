'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [role, setRole] = useState<string>('')
  const [currentDate, setCurrentDate] = useState<string>('')
  
  useEffect(() => {
    // Extract role from URL path
    const pathSegments = pathname.split('/')
    if (pathSegments.length > 2) {
      setRole(pathSegments[2])
    }
    
    // Set current date
    const date = new Date()
    setCurrentDate(date.toLocaleDateString('en-US', { 
      month: 'long',
      day: 'numeric', 
      year: 'numeric' 
    }))
  }, [pathname])
  
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
  
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'rss':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        )
      case 'calendar':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      case 'chart-bar':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        )
      case 'user':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )
      case 'cog':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      case 'document-text':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      case 'template':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        )
      case 'users':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )
      default:
        return null
    }
  }
  
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-[#7a8c9e] text-white">
        <div className="p-4 border-b border-gray-200/20">
          <Link href="/">
            <div className="flex items-center">
              <Image src="/gc-hub-logo.svg" alt="GC Hub" width={100} height={40} className="invert" />
            </div>
          </Link>
        </div>
        
        <nav className="mt-8">
          <ul>
            {getNavItems().map((item, index) => (
              <li key={index}>
                <Link 
                  href={item.path}
                  className={`flex items-center px-6 py-3 text-lg hover:bg-[#6a7c8e] transition-colors ${
                    pathname === item.path ? 'bg-[#6a7c8e]' : ''
                  }`}
                >
                  <span className="mr-3">{renderIcon(item.icon)}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200/20">
          <Link 
            href="/"
            className="flex items-center text-white hover:text-gray-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </Link>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 bg-[#faf7ef]">
        <header className="bg-[#faf7ef] border-b border-gray-200 p-4 flex justify-end">
          <div className="text-gray-600">
            <span className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
            {currentDate}
          </div>
        </header>
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}