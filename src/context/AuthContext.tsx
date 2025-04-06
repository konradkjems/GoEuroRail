'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
interface User {
  id: string;
  email: string;
  homeCity?: any;
  savedRoutes?: any[];
  travelPreferences?: {
    preferNightTrains: boolean;
    scenicRoutes: boolean;
    lowBudget: boolean;
  };
  interrailPassType?: string;
  language?: string;
  notificationsEnabled?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
}

interface RegisterData {
  email: string;
  password: string;
  homeCity?: string;
  preferences?: {
    preferNightTrains?: boolean;
    scenicRoutes?: boolean;
    lowBudget?: boolean;
    interrailPassType?: string;
    language?: string;
    notificationsEnabled?: boolean;
  };
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/user/profile');
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else if (response.status === 401) {
          // This is expected when not logged in, so don't show an error
          setUser(null);
        } else {
          // Only log actual errors, not expected auth failures
          console.error(`Failed to load user: ${response.status} ${response.statusText}`);
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUser();
  }, []);
  
  // Register function
  const register = async (userData: RegisterData): Promise<boolean> => {
    let retryCount = 0;
    const maxRetries = 2;
    
    const attemptRegister = async (): Promise<boolean> => {
      try {
        setIsLoading(true);
        
        // Set timeout for fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout
        
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
          signal: controller.signal
        });
        
        // Clear timeout
        clearTimeout(timeoutId);
        
        let errorMessage = '';
        
        // Check if response is ok (status in the range 200-299)
        if (response.ok) {
          const data = await response.json();
          return true;
        }
        
        // Handle non-ok response
        try {
          // Try to parse error as JSON
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || 'Registration failed';
          
          // Special handling for timeout that requires retry
          if (response.status === 504 || errorData.error === 'Database connection timeout') {
            if (retryCount < maxRetries) {
              retryCount++;
              console.log(`Retrying registration (${retryCount}/${maxRetries})...`);
              return await attemptRegister();
            }
          }
          
          console.error('Registration failed:', errorData.error, errorData.message || '');
          throw new Error(errorMessage);
        } catch (parseError) {
          // Handle case where response is not valid JSON
          console.error('Registration failed with status:', response.status, response.statusText);
          throw new Error(`Server error (${response.status}): ${response.statusText}`);
        }
      } catch (error) {
        // Handle network errors or AbortController timeout
        if (error instanceof DOMException && error.name === 'AbortError') {
          console.error('Registration request timed out');
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Retrying registration after timeout (${retryCount}/${maxRetries})...`);
            return await attemptRegister();
          }
          throw new Error('Request timed out. Please try again later.');
        } else {
          console.error('Registration error:', error);
          throw error;
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    try {
      return await attemptRegister();
    } catch (error) {
      return false;
    }
  };
  
  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    let retryCount = 0;
    const maxRetries = 2;
    
    const attemptLogin = async (): Promise<boolean> => {
      try {
        setIsLoading(true);
        
        // Set timeout for fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout
        
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          signal: controller.signal
        });
        
        // Clear timeout
        clearTimeout(timeoutId);
        
        // Parse response
        const data = await response.json();
        
        if (response.ok) {
          setUser(data.user);
          return true;
        } else {
          // Special handling for timeout that requires retry
          if (response.status === 504 || data.error === 'Database connection timeout') {
            if (retryCount < maxRetries) {
              retryCount++;
              console.log(`Retrying login (${retryCount}/${maxRetries})...`);
              return await attemptLogin();
            }
          }
          
          console.error('Login failed:', data.error, data.message || '');
          throw new Error(data.message || data.error || 'Login failed');
        }
      } catch (error) {
        // Handle network errors or AbortController timeout
        if (error instanceof DOMException && error.name === 'AbortError') {
          console.error('Login request timed out');
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Retrying login after timeout (${retryCount}/${maxRetries})...`);
            return await attemptLogin();
          }
          throw new Error('Request timed out. Please try again later.');
        } else {
          console.error('Login error:', error);
          throw error;
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    try {
      return await attemptLogin();
    } catch (error) {
      return false;
    }
  };
  
  // Logout function
  const logout = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        setUser(null);
        return true;
      } else {
        console.error('Logout failed');
        return false;
      }
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update profile function
  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
        return true;
      } else {
        console.error('Profile update failed:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Context value
  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
} 