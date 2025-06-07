// Authentication utility functions for the client

// Get the stored auth token
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Check sessionStorage first, then localStorage
  return sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
};

// Get the current user data
export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  
  const userDataString = localStorage.getItem('userData');
  if (!userDataString) return null;
  
  try {
    return JSON.parse(userDataString);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Logout user
export const logout = () => {
  if (typeof window === 'undefined') return;
  
  sessionStorage.removeItem('authToken');
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
};

// Make authenticated API requests
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
  
  return fetch(url, {
    ...options,
    headers
  });
};