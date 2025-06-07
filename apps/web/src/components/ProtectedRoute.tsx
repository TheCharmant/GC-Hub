'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

type ProtectedRouteProps = {
  children: React.ReactNode
  allowedRoles?: string[]
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = [] 
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login if not authenticated
      router.push('/')
      return
    }

    if (!isLoading && isAuthenticated && allowedRoles.length > 0) {
      // Check if user has required role
      if (user && !allowedRoles.includes(user.role)) {
        // Redirect to dashboard if user doesn't have required role
        router.push(`/dashboard/${user.role.toLowerCase()}`)
      }
    }
  }, [isLoading, isAuthenticated, user, router, allowedRoles])

  // Show loading state
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  // If not authenticated, don't render children
  if (!isAuthenticated) {
    return null
  }

  // If role check is required and user doesn't have required role, don't render children
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return null
  }

  // Render children if authenticated and has required role
  return <>{children}</>
}