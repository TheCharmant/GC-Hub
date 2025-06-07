'use client'

import { useState } from 'react'
import LoginForm from "@/app/components/LoginForm"
import SignupForm from "@/app/components/SignupForm"

export default function AdminLoginPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#7a8c9e] to-[#a8a4c5] flex items-center justify-center p-4">
      {isLogin ? (
        <div>
          <LoginForm role="admin" fieldLabel="Admin ID" redirectPath="/dashboard/administrator" />
          <div className="mt-4 text-center text-white">
            <p>Don&apos;t have an account?{' '}
              <button 
                onClick={() => setIsLogin(false)}
                className="font-medium underline hover:text-purple-200"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      ) : (
        <div>
          <SignupForm role="admin" fieldLabel="Admin ID" redirectPath="/dashboard/administrator" />
          <div className="mt-4 text-center text-white">
            <p>Already have an account?{' '}
              <button 
                onClick={() => setIsLogin(true)}
                className="font-medium underline hover:text-purple-200"
              >
                Log in
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}