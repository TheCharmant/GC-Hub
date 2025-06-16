'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import {
  Megaphone,
  CalendarDays,
  BarChart,
  User2,
  ArrowRight,
  Users,
  FileText,
  Settings
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout: authLogout } = useAuth()
  const [currentDate, setCurrentDate] = useState<string>('')
  
  useEffect(() => {
    // Set current date
    const date = new Date()
    setCurrentDate(date.toLocaleDateString('en-US', { 
      month: 'long',
      day: 'numeric', 
      year: 'numeric' 
    }))
  }, [])

  useEffect(() => {
    console.log('Current user:', user)
    console.log('User role:', user?.role)
  }, [user])
  
  const getNavItems = () => {
    if (!user) {
      console.log('No user found')
      return []
    }
    
    console.log('Getting nav items for role:', user.role.toLowerCase())
    const items = (() => {
      switch (user.role.toLowerCase()) {
        case 'student':
          return [
            { name: 'Feed', path: '/dashboard/student/feed', icon: Megaphone },
            { name: 'Events', path: '/dashboard/student/events', icon: CalendarDays },
            { name: 'Stats', path: '/dashboard/student/stats', icon: BarChart },
            { name: 'Profile', path: '/dashboard/student/profile', icon: User2 }
          ]
        case 'club':
          return [
            { name: 'Feed', path: '/dashboard/club/feed', icon: Megaphone },
            { name: 'Manage', path: '/dashboard/club/manage', icon: Settings },
            { name: 'Stats', path: '/dashboard/club/stats', icon: BarChart },
            { name: 'Profile', path: '/dashboard/club/profile', icon: User2 }
          ]
        case 'organizer':
          return [
            { name: 'Feed', path: '/dashboard/organizer/feed', icon: Megaphone },
            { name: 'Manage', path: '/dashboard/organizer/manage', icon: Settings },
            { name: 'Reports', path: '/dashboard/organizer/reports', icon: FileText },
            { name: 'Profile', path: '/dashboard/organizer/profile', icon: User2 }
          ]
        case 'admin':
          return [
            { name: 'Dashboard', path: '/dashboard/administrator', icon: Megaphone },
            { name: 'Users', path: '/dashboard/administrator/users', icon: Users },
            { name: 'Clubs', path: '/dashboard/administrator/clubs', icon: Users },
            { name: 'Events', path: '/dashboard/administrator/events', icon: CalendarDays },
            { name: 'Reports', path: '/dashboard/administrator/reports', icon: FileText }
          ]
        default:
          console.log('No matching role found')
          return []
      }
    })()
    console.log('Navigation items:', items)
    return items
  }
  
  const handleLogout = () => {
    authLogout()
  }
  
  // If no user data yet, show loading
  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const navItems = getNavItems()
  console.log('Final nav items:', navItems)

  return (
    <div className="flex min-h-screen bg-[#faf7ef]">
      {/* Sidebar */}
      <div className="w-64 bg-[#2c3e50] text-white shadow-md flex flex-col">
        <div className="p-4 mb-8 flex items-center justify-center">
          <Image 
            src="/gc-hub-logo.svg" 
            alt="GC Hub Logo" 
            width={100} 
            height={40} 
            className="mt-4"
          />
        </div>
        
        <nav className="flex-1 px-4">
          <ul>
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={index} className="mb-2">
                  <Link 
                    href={item.path}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      pathname === item.path 
                        ? 'bg-gray-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {Icon && <Icon className="h-5 w-5 mr-3" />}
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
          
          <div className="mt-8 pt-4 border-t border-gray-600">
            <button 
              onClick={handleLogout}
              className="flex items-center p-3 w-full text-left text-gray-300 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <ArrowRight className="h-5 w-5 mr-3 rotate-180" />
              Logout
            </button>
          </div>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 p-4 flex justify-end items-center shadow-sm h-20">
          <div className="text-gray-600 flex items-center">
            <CalendarDays className="h-5 w-5 mr-2" />
            <span>{currentDate}</span>
          </div>
        </header>
        
        <main className="p-6 h-[calc(100vh-64px)] overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

