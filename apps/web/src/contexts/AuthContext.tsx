'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  role: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string, rememberMe: boolean) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for existing auth data on mount
    const storedUserData = localStorage.getItem('userData');
    const storedToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    if (storedUserData && storedToken) {
      try {
        setUser(JSON.parse(storedUserData));
        setToken(storedToken);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        logout();
      }
    }
  }, []);

  const login = (userData: User, authToken: string, rememberMe: boolean) => {
    setUser(userData);
    setToken(authToken);
    
    // Store in localStorage or sessionStorage based on rememberMe
    if (rememberMe) {
      localStorage.setItem('authToken', authToken);
    } else {
      sessionStorage.setItem('authToken', authToken);
    }
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    router.push('/login/club');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      isAuthenticated: !!user && !!token
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 