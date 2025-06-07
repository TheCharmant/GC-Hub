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
  const user = getCurrentUser();
  
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(user ? { 'user-id': user.id, 'user-role': user.role } : {})
  };
  
  return fetch(url, {
    ...options,
    headers
  });
};

// API base URL
export const API_BASE_URL = 'http://localhost:3001';

// Create a wrapper for API calls
export const api = {
  get: (endpoint: string) => 
    fetchWithAuth(`${API_BASE_URL}${endpoint}`),
  
  post: (endpoint: string, data: any) => 
    fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  put: (endpoint: string, data: any) => 
    fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  
  delete: (endpoint: string) => 
    fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE'
    })
};
