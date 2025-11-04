import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'client' | 'contractor';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: any) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Check if user is already logged in on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check localStorage for token
        const token = localStorage.getItem('token');
        
        if (token) {
          // Validate token with your API
          // const response = await fetch('api/validate-token', ...);
          // const data = await response.json();
          
          // For demo purposes, we'll simulate a valid token
          const mockUser = {
            id: 1,
            name: 'Jake Johnson',
            email: 'jake.johnson@example.com',
            role: 'client' as const
          };
          
          setUser(mockUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth validation error:', error);
        // Clear invalid token
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Make API request to login
      // const response = await fetch('api/login', ...);
      // const data = await response.json();
      
      // For demo purposes, we'll simulate successful login
      if (email === 'jake@example.com' && password === 'password') {
        const mockUser = {
          id: 1,
          name: 'Jake Johnson',
          email: 'jake@example.com',
          role: 'client' as const
        };
        
        // Store token in localStorage
        localStorage.setItem('token', 'mock-jwt-token');
        
        setUser(mockUser);
        setIsAuthenticated(true);
        return true;
      } else if (email === 'rick@example.com' && password === 'password') {
        const mockUser = {
          id: 2,
          name: 'Rick Smith',
          email: 'rick@example.com',
          role: 'contractor' as const
        };
        
        localStorage.setItem('token', 'mock-jwt-token');
        
        setUser(mockUser);
        setIsAuthenticated(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };
  
  const signup = async (userData: any): Promise<boolean> => {
    try {
      // Make API request to signup
      // const response = await fetch('api/signup', ...);
      // const data = await response.json();
      
      // For demo purposes, we'll simulate successful signup
      const mockUser = {
        id: userData.role === 'contractor' ? 3 : 4,
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        role: userData.role as 'client' | 'contractor'
      };
      
      // Store token in localStorage
      localStorage.setItem('token', 'mock-jwt-token');
      
      setUser(mockUser);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };
  
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    setUser(null);
    setIsAuthenticated(false);
  };
  
  if (loading) {
    // You could show a loading spinner here
    return <div>Loading authentication...</div>;
  }
  
  const value = {
    isAuthenticated,
    user,
    login,
    signup,
    logout
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};